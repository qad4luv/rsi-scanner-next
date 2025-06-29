import { useState, useEffect, useRef } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import toast, { Toaster } from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { useLogSignal } from '@/hooks/useLogSignal'; // Make sure this is correctly implemented

const timeframes = [
  { label: '1m', value: '1' },
  { label: '3m', value: '3' },
  { label: '5m', value: '5' },
  { label: '30m', value: '30' },
  { label: '1h', value: '60' },
  { label: '4h', value: '240' },
  { label: '1d', value: 'D' },
];

export default function Home() {
  const [data, setData] = useState({ overbought: [], oversold: [] });
  const [interval, setIntervalValue] = useState('5');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const prevDataRef = useRef({ overbought: [], oversold: [] });
  const audioRef = useRef(null);

  const { address, isConnected } = useAccount();
  const { logSignal, isLoading: isLogging } = useLogSignal();

  const fetchData = () => {
    setLoading(true);
    fetch(`/api/scan?interval=${interval}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const prev = prevDataRef.current;

          const newOverbought = data.overbought.filter(o =>
            !prev.overbought.find(p => p.symbol === o.symbol)
          );
          const newOversold = data.oversold.filter(o =>
            !prev.oversold.find(p => p.symbol === o.symbol)
          );

          if (newOverbought.length > 0 || newOversold.length > 0) {
            toast.success('🔔 New RSI signals detected!');
            if (audioRef.current) {
              audioRef.current.play().catch(err => console.error('Audio play error:', err));
            }
          }

          prevDataRef.current = data;
          setData({ overbought: data.overbought, oversold: data.oversold });
          setLastUpdated(new Date().toLocaleTimeString());
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setLoading(false);
        toast.error('❌ Failed to fetch data');
      });
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 30 * 60 * 1000); // 30 min
    return () => clearInterval(intervalId);
  }, [interval]);

  const handleLog = async (symbol, rsi, overbought) => {
    if (!isConnected) {
      toast.error('⚠️ Please connect wallet first');
      return;
    }

    try {
      await logSignal(symbol, rsi, overbought);
      toast.success(`✅ Signal logged on-chain for ${symbol}`);
    } catch (err) {
      toast.error(`❌ Failed to log signal: ${err.message || err}`);
    }
  };

  return (
    <main className="p-6 font-sans">
      <Toaster />
      <audio ref={audioRef} src="/alert.mp3" preload="auto" />
      <h1 className="text-2xl font-bold mb-4">📈 Bybit RSI Scanner Dapp</h1>

      <div className="mb-4">
        <ConnectButton />
      </div>

      <label className="block mb-4">
        ⏱ Timeframe:
        <select
          value={interval}
          onChange={(e) => setIntervalValue(e.target.value)}
          className="ml-2 p-2 border rounded"
        >
          {timeframes.map(tf => (
            <option key={tf.value} value={tf.value}>{tf.label}</option>
          ))}
        </select>
      </label>

      <button
        onClick={fetchData}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700 transition"
      >
        🔁 Rescan
      </button>

      {lastUpdated && (
        <p className="mb-4 text-gray-500 text-sm">Last updated at: {lastUpdated}</p>
      )}

      {loading ? (
        <p>🔄 Scanning...</p>
      ) : (
        <>
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              🔥 Overbought (RSI {'>'} 70)
            </h2>
            {data.overbought.length === 0 ? (
              <p>No overbought tokens found.</p>
            ) : (
              <ul>
                {data.overbought.map(({ symbol, rsi }) => (
                  <li key={symbol} className="mb-2 flex items-center justify-between">
                    <span><strong>{symbol}</strong> - RSI: {rsi.toFixed(2)}</span>
                    <button
                      onClick={() => handleLog(symbol, rsi, true)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm disabled:opacity-50"
                      disabled={isLogging}
                    >
                      📤 Log Signal
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              💧 Oversold (RSI {'<'} 30)
            </h2>
            {data.oversold.length === 0 ? (
              <p>No oversold tokens found.</p>
            ) : (
              <ul>
                {data.oversold.map(({ symbol, rsi }) => (
                  <li key={symbol} className="mb-2 flex items-center justify-between">
                    <span><strong>{symbol}</strong> - RSI: {rsi.toFixed(2)}</span>
                    <button
                      onClick={() => handleLog(symbol, rsi, false)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm disabled:opacity-50"
                      disabled={isLogging}
                    >
                      📤 Log Signal
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}
