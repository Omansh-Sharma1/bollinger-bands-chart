import { OHLCV } from '../types';

export interface BollingerOptions {
  length: number;
  stdDevMultiplier: number;
  source: keyof OHLCV;
  offset: number;
}

export interface BollingerBands {
  basis: number[];
  upper: number[];
  lower: number[];
}

export function computeBollingerBands(
  data: OHLCV[],
  options: BollingerOptions
): BollingerBands {
  const { length, stdDevMultiplier, source, offset } = options;
  const basis: number[] = [];
  const upper: number[] = [];
  const lower: number[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i < length - 1) {
      basis.push(NaN);
      upper.push(NaN);
      lower.push(NaN);
      continue;
    }

    const slice = data.slice(i - length + 1, i + 1);
    const values = slice.map(c => c[source]);

    const mean = values.reduce((a, b) => a + b, 0) / length;

    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / length;

    const stdDev = Math.sqrt(variance);

    basis.push(mean);
    upper.push(mean + stdDevMultiplier * stdDev);
    lower.push(mean - stdDevMultiplier * stdDev);
  }

  // Apply offset
  if (offset !== 0) {
    const shift = Math.abs(offset);
    if (offset > 0) {
      basis.unshift(...Array(shift).fill(NaN));
      basis.splice(-shift);
      upper.unshift(...Array(shift).fill(NaN));
      upper.splice(-shift);
      lower.unshift(...Array(shift).fill(NaN));
      lower.splice(-shift);
    } else {
      basis.push(...Array(shift).fill(NaN));
      basis.splice(0, shift);
      upper.push(...Array(shift).fill(NaN));
      upper.splice(0, shift);
      lower.push(...Array(shift).fill(NaN));
      lower.splice(0, shift);
    }
  }

  return { basis, upper, lower };
}
