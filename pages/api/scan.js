import axios from 'axios';
import { calculateRSI } from '../../utils/rsi';

export default async function handler(req, res) {
  const timeframes = ['1', '3', '5', '15', '30', '60', '240', 'D']; // 1m, 3m, ..., 1d
  const activeTimeframe = req.query.timeframe || '5'; // default: 5m

  try {
    // Get all active USDT perpetual futures symbols
    const marketResp = await axios.get('https://api.bybit.com/v5/market/instruments-info?category=linear');
    const symbols = marketResp.data.result.list
      .filter(item => item.symbol.endsWith('USDT'))
      .map(item => item.symbol);

    const overbought = [];
    const oversold = [];
    const all = [];

    for (const symbol of symbols) {
      try {
        const klineURL = `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&interval=${activeTimeframe}&limit=100`;
        const klineResp = await axios.get(klineURL);
        const closes = klineResp.data.result.list.map(k => parseFloat(k[4])); // Close price is 5th item

        if (closes.length < 14) continue;

        const rsi = calculateRSI(closes);
        all.push({ symbol, rsi });

        if (rsi > 70) overbought.push({ symbol, rsi });
        else if (rsi < 30) oversold.push({ symbol, rsi });
      } catch (err) {
        console.log(`Error with ${symbol}:`, err.message);
        continue;
      }
    }

    return res.status(200).json({
      success: true,
      timeframe: activeTimeframe,
      overbought,
      oversold,
      all,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
