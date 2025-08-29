// /lib/types.ts
export interface OHLCV {
  timestamp: number; // milliseconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
