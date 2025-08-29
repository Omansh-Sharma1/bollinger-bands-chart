export const ohlcvData = Array.from({ length: 200 }, (_, i) => {
  const baseTime = 1625097600000;
  const timestamp = baseTime + i * 24 * 60 * 60 * 1000; // 1 day interval
  const open = 34000 + i * 10 + Math.floor(Math.random() * 50);
  const close = open + Math.floor(Math.random() * 50 - 25);
  const high = Math.max(open, close) + Math.floor(Math.random() * 25);
  const low = Math.min(open, close) - Math.floor(Math.random() * 25);
  const volume = Math.floor(Math.random() * 300 + 100);

  return { timestamp, open, high, low, close, volume };
});
