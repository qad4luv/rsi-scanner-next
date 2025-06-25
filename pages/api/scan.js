import { RSI } from 'technicalindicators';
import axios from 'axios';

export default async function handler(req, res) {
  const interval = req.query.interval || '5'; // Default to 5m
  const limit = 100;
  const overboughtThreshold = 70;
  const oversoldThreshold = 30;

  try {
    const { data: symbolsData } = await axios.get(
      'https://api.bybit.com/v5/market/instruments',
      { params: { category: 'linear' } }
    );

    const symbols = symbolsData.result.list.map(item => item.symbol);
    const overbought = [];
    const oversold = [];

    for (const symbol of symbols) {
      try {
        const { data } = await axios.get(
          'https://api.bybit.com/v5/market/kline',
          {
            params: {
              category: 'linear',
              symbol,
              interval,
              limit,
            },
          }
        );

        const closes = data.result.list.map(item => parseFloat(item[4]));
        const rsiValues = RSI.calculate({ values: closes, period: 14 });
        const latestRsi = rsiValues.at(-1);

        if (!latestRsi) continue;

        if (latestRsi > overboughtThreshold) {
          overbought.push({ symbol, rsi: latestRsi });
        } else if (latestRsi < oversoldThreshold) {
          oversold.push({ symbol, rsi: latestRsi });
        }
      } catch {
        continue;
      }
    }

    res.status(200).json({ success: true, overbought, oversold });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
