export function calculateRSI(closes, period = 14) {
  if (closes.length < period) return null;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  gains /= period;
  losses /= period;

  if (losses === 0) return 100;

  let rs = gains / losses;
  let rsi = 100 - 100 / (1 + rs);

  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) {
      gains = (gains * (period - 1) + diff) / period;
      losses = (losses * (period - 1)) / period;
    } else {
      gains = (gains * (period - 1)) / period;
      losses = (losses * (period - 1) - diff) / period;
    }

    rs = gains / (losses || 1);
    rsi = 100 - 100 / (1 + rs);
  }

  return Math.round(rsi * 100) / 100; // round to 2 decimal places
}
