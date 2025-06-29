import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

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

  useEffect(() => {
    let intervalId;

    const fetchData = () => {
      setLoading(true);
      fetch(`/api/scan?interval=${interval}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setData({ overbought: data.overbought, oversold: data.oversold });
            setLastUpdated(new Date().toLocaleTimeString());
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching data:', err);
          setLoading(false);
        });
    };

    fetchData(); // fetch on load
    intervalId = setInterval(fetchData, 60000); // auto fetch every 60 sec

    return () => clearInterval(intervalId); // cleanup
  }, [interval]);

  return (
    <main className="p-6 font-sans">
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
                  <li key={symbol} className="mb-1">
                    <strong>{symbol}</strong> - RSI: {rsi.toFixed(2)}
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
                  <li key={symbol} className="mb-1">
                    <strong>{symbol}</strong> - RSI: {rsi.toFixed(2)}
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
