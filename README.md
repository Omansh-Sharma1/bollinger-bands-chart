# Bollinger Bands Implementation with KLineCharts

A comprehensive implementation of Bollinger Bands indicator using React, Next.js, TypeScript, TailwindCSS, and KLineCharts v2. This project provides a fully customizable Bollinger Bands indicator with real-time updates, dynamic styling, and offset support.

> **Assignment Context**: This project was developed as a technical implementation exercise focusing on advanced charting capabilities, indicator development, and real-time data visualization using modern web technologies.

## Features

- **Real-time Updates**: Dynamic parameter changes without chart reloading
- **Full Customization**: Configurable periods, standard deviation, colors, and line styles
- **Offset Support**: Shift bands forward or backward in time
- **Interactive Tooltips**: Display basis, upper, and lower band values
- **Fill Areas**: Optional background fill between upper and lower bands
- **TypeScript Safety**: Strict typing for reliable data handling
- **Responsive Design**: Built with TailwindCSS for modern UI

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Configuration Options](#configuration-options)
- [Troubleshooting](#troubleshooting)
- [Learning Curve & Fixes](#learning-curve--fixes)
- [Contributing](#contributing)

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd bollinger-bands-implementation

# Install dependencies
npm install

# Start development server
npm run dev
```

### Dependencies

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "next": "^14.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "klinecharts": "^2.0.0"
  }
}
```

## Quick Start

## Quick Start

```tsx
import { useEffect, useRef, useState } from 'react';
import { init, Chart } from 'klinecharts';
import { ohlcvData } from '@/lib/utils/dataGenerator';

export default function TradingChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = init(chartRef.current);
      chartInstance.applyNewData(ohlcvData);
      setChart(chartInstance);
    }
  }, []);

  return (
    <div className="flex">
      <div ref={chartRef} className="flex-1 h-96" />
      {/* Settings component integration */}
    </div>
  );
}
```

## Project Structure

```
├── components/
│   ├── Chart.tsx              # Main chart component
│   └── BollingerSettings.tsx  # Settings panel UI
├── lib/
│   ├── indicators/
│   │   └── bollinger.ts       # Bollinger Bands logic
│   └── utils/
│       └── dataGenerator.ts   # Random candle data generator
├── data/
│   └── sample-data.json       # Hardcoded sample candle data
├── types/
│   └── index.ts              # TypeScript interfaces
└── README.md
```

### Key Files

#### `/lib/indicators/bollinger.ts`
Contains the core Bollinger Bands calculation and KLineCharts integration:

```typescript
import { KLineData, Indicator } from 'klinecharts';

export interface BollingerBandsOptions {
  length: number;
  stdDevMultiplier: number;
  offset: number;
  source: 'close' | 'open' | 'high' | 'low';
  showUpper: boolean;
  showMiddle: boolean;
  showLower: boolean;
  showFill: boolean;
  upperColor: string;
  middleColor: string;
  lowerColor: string;
  fillOpacity: number;
}

export const bollingerBandsIndicator: Indicator = {
  name: 'custom_bollinger',
  shortName: 'BOLL',
  calcParams: [20, 2, 0, 'close'],
  figures: [
    { key: 'UPPER', title: 'Upper', type: 'line' },
    { key: 'BOLL', title: 'Basis', type: 'line' },
    { key: 'LOWER', title: 'Lower', type: 'line' },
    { key: 'BOLL_FILL', title: 'Fill', type: 'rect' }
  ],
  calc: (dataList: KLineData[], calcParams: any[]) => {
    // Implementation details...
  }
};
```

#### `/lib/utils/dataGenerator.ts`
Utility helper that generates 200 candles of sample OHLCV data:

```typescript
export const ohlcvData = Array.from({ length: 200 }, (_, i) => {
  const baseTime = 1625097600000; // July 1, 2021
  const timestamp = baseTime + i * 24 * 60 * 60 * 1000; // 1 day interval
  const open = 34000 + i * 10 + Math.floor(Math.random() * 50);
  const close = open + Math.floor(Math.random() * 50 - 25);
  const high = Math.max(open, close) + Math.floor(Math.random() * 25);
  const low = Math.min(open, close) - Math.floor(Math.random() * 25);
  const volume = Math.floor(Math.random() * 300 + 100);

  return { timestamp, open, high, low, close, volume };
});
```

This helper creates realistic cryptocurrency-like price data starting from $34,000 with:
- **Daily intervals**: Each candle represents one day
- **Progressive base price**: Slight upward trend with `i * 10`
- **Realistic volatility**: Random price movements within reasonable ranges
- **Proper OHLC relationships**: Ensures high/low bounds are mathematically correct
- **Volume simulation**: Random volume between 100-400 units
```

#### `/components/BollingerSettings.tsx`
Provides the UI for configuring Bollinger Bands parameters:

```typescript
interface BollingerSettingsProps {
  chart: Chart | null;
}

export default function BollingerSettings({ chart }: BollingerSettingsProps) {
  const [bbOptions, setBbOptions] = useState<BollingerBandsOptions>({
    length: 20,
    stdDevMultiplier: 2,
    offset: 0,
    source: 'close',
    // ... other defaults
  });

  // Update indicator when options change
  useEffect(() => {
    if (chart) {
      chart.overrideIndicator({
        name: "custom_bollinger",
        calcParams: [bbOptions.length, bbOptions.stdDevMultiplier, bbOptions.offset, bbOptions.source],
        styles: {
          // Style configuration...
        }
      });
    }
  }, [chart, bbOptions]);

  return (
    <div className="p-4 border-l">
      {/* Settings UI components */}
    </div>
  );
}
```

## Data Management

This implementation provides two approaches for loading candle data:

### 1. Hardcoded JSON Data
The project includes a pre-built JSON file with sample candle data:

```typescript
import candleData from '@/data/sample-data.json';

// Load static data
chart.applyNewData(candleData);
```

### 2. Generated Sample Data
For testing and development, the project includes a pre-generated dataset:

```typescript
import { ohlcvData } from '@/lib/utils/dataGenerator';

// Load the 200 pre-generated candles
chart.applyNewData(ohlcvData);
```

The sample dataset features:
- **200 daily candles** starting from July 1, 2021
- **Cryptocurrency-style pricing** starting around $34,000
- **Realistic market movements** with proper OHLC relationships
- **Volume data** for complete market simulation

### Connecting Real Data
To connect real market data, replace the data loading approach in your chart initialization based on your specific data source and API integration needs.

## API Reference

The specific implementation details for registering and updating Bollinger Bands indicators are contained in the project files.

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `length` | number | 20 | Period for moving average calculation |
| `stdDevMultiplier` | number | 2 | Standard deviation multiplier |
| `offset` | number | 0 | Shift bands forward (+) or backward (-) |
| `source` | string | 'close' | Price source (open, high, low, close) |
| `showUpper` | boolean | true | Display upper band |
| `showMiddle` | boolean | true | Display middle band (basis) |
| `showLower` | boolean | true | Display lower band |
| `showFill` | boolean | false | Fill area between bands |
| `upperColor` | string | 'rgba(255,0,0,1)' | Upper band color |
| `middleColor` | string | 'rgba(0,0,255,1)' | Middle band color |
| `lowerColor` | string | 'rgba(0,255,0,1)' | Lower band color |
| `fillOpacity` | number | 0.2 | Fill area opacity |

### Style Options

```typescript
interface BandStyle {
  color: string;           // rgba(r,g,b,a) format
  lineWidth: number;       // Line thickness
  lineStyle: 0 | 1;       // 0 = solid, 1 = dashed
  visible: boolean;        // Show/hide band
}
```

## Troubleshooting

### Common Issues

**1. `chart.getIndicatorById is not a function`**
```typescript
// ❌ Incorrect (v1 API)
chart.getIndicatorById('bollinger')

// ✅ Correct (v2 API)
chart.overrideIndicator({ name: 'custom_bollinger' })
```

**2. Bands not rendering**
```typescript
// ❌ Invalid color format
color: '#ff0000aa'

// ✅ Valid color format
color: 'rgba(255, 0, 0, 0.67)'
```

**3. Tooltip not showing values**
```typescript
// ❌ Returning arrays
return [upper, middle, lower];

// ✅ Returning objects
return { upper, basis: middle, lower };
```

**4. Offset misalignment**
```typescript
// ❌ Shifting arrays directly
return result.slice(offset);

// ✅ Preserving array length with NaN
if (offset > 0) {
  return [...Array(offset).fill(NaN), ...result];
}
```

### Debug Tips

1. **Check console errors**: Invalid styles often log warnings
2. **Verify data types**: Ensure calcParams match expected types
3. **Test with minimal config**: Start with basic settings, add complexity gradually
4. **Use TypeScript**: Strict typing prevents many runtime issues

## Learning Curve & Fixes

### Key Lessons Learned

1. **Indicator Lifecycle**: Use `registerIndicator` once, then `overrideIndicator` for updates
2. **Import Organization**: Keep single source files to avoid path confusion
3. **State Management**: Centralize settings in React state, let chart react to changes
4. **Style Configuration**: Use `rgba()` format for colors, ensure all properties are defined
5. **Offset Handling**: Preserve array lengths with NaN placeholders for alignment
6. **Tooltip Integration**: Return keyed objects, not arrays, for proper tooltip display
7. **Type Safety**: Strong TypeScript interfaces prevent subtle runtime bugs
8. **Code Organization**: Separate concerns (math, chart, UI) for maintainability

### Evolution of Implementation

The implementation evolved through several iterations:

1. **Initial Attempt**: Used deprecated `getIndicatorById` method
2. **Path Confusion**: Multiple indicator files caused import issues  
3. **Re-registration**: Tried re-registering indicator on each change
4. **Style Issues**: Hex colors with alpha didn't render properly
5. **Offset Problems**: Array shifting broke tooltip alignment
6. **Final Solution**: Clean separation with proper state management

## Performance Considerations

- **Debounce Updates**: Consider debouncing rapid setting changes
- **Memory Management**: Clean up chart instances on component unmount
- **Data Validation**: Validate input data before calculations
- **Efficient Rendering**: Minimize style updates to improve performance

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for type safety
- Follow the existing code style
- Add tests for new features
- Update documentation for API changes
- Ensure responsive design compatibility

**Happy Trading! 📈**