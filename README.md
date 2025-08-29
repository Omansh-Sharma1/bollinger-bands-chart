# FindScan – Bollinger Bands Indicator (Frontend Intern Assignment)

## Overview
This project implements a **Bollinger Bands indicator** on a candlestick chart using **React + Next.js + TypeScript + TailwindCSS + KLineCharts**. The indicator replicates TradingView's behavior and exposes all required **Inputs** and **Style** settings. All settings dynamically update the chart without page refresh.  

---

## Features Implemented

### Inputs (with default values)
| Setting            | Default | Description |
|-------------------|---------|-------------|
| Length             | 20      | Number of candles used for SMA (Basis) |
| Basic MA Type      | SMA     | Only SMA supported in this assignment |
| Source             | Close   | Price source (open/high/low/close) |
| StdDev Multiplier  | 2       | Multiplier for standard deviation for Upper/Lower bands |
| Offset             | 0       | Shift bands forward/backward by N candles |

### Style
- Middle Band (Basis): visibility toggle, color, line width, line style (solid/dashed)
- Upper Band: visibility toggle, color, line width, line style
- Lower Band: visibility toggle, color, line width, line style
- Background Fill: visibility toggle, opacity

### UX / UI
- Modal panel with **Inputs** and **Style** tabs.
- Instant updates on changing any setting.
- Tooltip shows **Basis/Upper/Lower** values on hover.
- Supports dark/light themes with default colors.

---

## Formulas Used

Let **`source[i]`** be the value of the selected price (close/open/high/low) at candle `i`.

1. **Basis (Middle Band)**:  
\[
\text{Basis}[i] = \text{SMA}(\text{source}, \text{Length})
\]

2. **Standard Deviation (Population)**:  
\[
\text{StdDev}[i] = \sqrt{\frac{1}{\text{Length}} \sum_{k=0}^{\text{Length}-1} (source[i-k] - \text{Basis}[i])^2}
\]

3. **Upper Band**:  
\[
\text{Upper}[i] = \text{Basis}[i] + (\text{StdDev Multiplier} \times \text{StdDev}[i])
\]

4. **Lower Band**:  
\[
\text{Lower}[i] = \text{Basis}[i] - (\text{StdDev Multiplier} \times \text{StdDev}[i])
\]

5. **Offset**:  
- Positive → shift bands forward by `offset` candles  
- Negative → shift bands backward by `offset` candles  

---

## Fixes & Implementation Notes

1. **Dynamic Style Updates:**  
   - Original code copied from reference had issues (`chart.getIndicatorById is not a function`).  
   - Fixed by using `registerIndicator` + `chart.overrideIndicator` correctly to update style dynamically without re-registering.

2. **Bollinger Bands Calculation:**  
   - Implemented `computeBollingerBands(data, options)` in `/lib/indicators/bollinger.ts`.  
   - Supports offset shifting for forward/backward visualization.  
   - Used **population standard deviation** consistently.

3. **Settings Modal Integration:**  
   - `BollingerSettings.tsx` exposes **Inputs** and **Style** tabs.  
   - Settings propagate to chart in real-time via React state (`setBbOptions`).  

4. **KLineCharts Integration:**  
   - Chart initialized once using `init(chartRef.current)` and disposed on unmount.  
   - `applyNewData` updates candle data whenever data changes.  
   - `registerIndicator` registers Bollinger Bands indicator once; style overrides reactively update the chart.

5. **Common Issues Addressed:**  
   - Lines not rendering initially → fixed by ensuring proper RGBA fill color and visibility flags.  
   - Inputs not updating chart → fixed by syncing `bbOptions` state with chart override.  
   - Offset shifting correctly without breaking tooltip alignment.

---

## Project Structure

```text
/ (Next.js root)
├─ /app
│   └─ page.tsx                  # Main page rendering chart + settings modal
├─ /components
│   ├─ Chart.tsx                 # KLineCharts wrapper with Bollinger Bands integration
│   └─ BollingerSettings.tsx     # Inputs + Style panel UI
├─ /lib
│   └─ indicators
│       └─ bollinger.ts          # computeBollingerBands() utility
├─ /types
│   └─ index.ts                  # OHLCV and type definitions
├─ /public/data/ohlcv.json       # Demo OHLCV data (200+ candles)
├─ package.json
└─ README.md
```

## Setup & Run

### Clone the repository
```bash
git clone <repo-url>
cd <repo-folder>
```

### Install dependencies
```bash
npm install
```

### Run the development server
```bash
npm run dev
```

### Open the app in your browser
```
http://localhost:3000
```

## KLineCharts Version
Tested with KLineCharts v2.x

## Demo Data
- Stored in `/public/data/ohlcv.json`
- Contains at least 200 candles
- Format: OHLCV (timestamp, open, high, low, close, volume)

## Lessons Learned / Notes
- React state + KLineCharts integration requires careful handling; overriding indicators is safer than re-registering.
- Dynamic UI (Inputs + Style) must map directly to chart overrides for instant updates.
- RGBA colors are necessary for background fill opacity.
- Offset logic must handle both positive and negative shifts carefully to avoid tooltip misalignment.
- Tailwind + React provides a clean way to replicate TradingView-style panels without pixel-perfect matching.

## Screenshots / GIF
Include 2 screenshots or a short GIF showing:
- Candlestick chart with Bollinger Bands applied
- Settings modal open with Inputs/Style tabs