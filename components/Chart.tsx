"use client";

import React, { useEffect, useRef, useState } from "react";
import { init, dispose, Chart, KLineData, registerIndicator } from "klinecharts";
import { OHLCV } from "../lib/types";
import { computeBollingerBands, BollingerOptions } from "../lib/indicators/bollinger";
import { StyleOptions } from "./BollingerSettings";

interface ChartProps {
  data: OHLCV[];
  bbOptions: BollingerOptions & StyleOptions;
}

const ChartComponent: React.FC<ChartProps> = ({ data, bbOptions }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const c = init(chartRef.current);
    setChart(c);

    return () => {
      if (chartRef.current) dispose(chartRef.current);
    };
  }, []);

  useEffect(() => {
    if (!chart || !data.length) return;

    const klineData: KLineData[] = data.map(d => ({
      timestamp: d.timestamp,
      open: d.open,
      close: d.close,
      high: d.high,
      low: d.low,
      volume: d.volume,
    }));

    chart.applyNewData(klineData);

    registerIndicator(
      {
        name: "bollinger",
        shortName: "BOLL",
        calcParams: [bbOptions.length, bbOptions.stdDevMultiplier, bbOptions.source, bbOptions.offset],
        figures: [
          { key: "BOLL", title: "Basis", type: "line" },
          { key: "UPPER", title: "Upper", type: "line" },
          { key: "LOWER", title: "Lower", type: "line" },
        ],
        calc: (klineData: KLineData[]) => {
          const { basis, upper, lower } = computeBollingerBands(data, bbOptions);
          return klineData.map((_, i) => ({
            BOLL: basis[i],
            UPPER: upper[i],
            LOWER: lower[i],
          }));
        },
      },
      true
    );

    chart.createIndicator("bollinger", false, { id: "candle_pane" });
  }, [chart, data, bbOptions]);

  useEffect(() => {
    if (!chart) return;

    const fillColor = bbOptions.showFill
      ? `rgba(${parseInt(bbOptions.upperColor.slice(1, 3), 16)}, ${parseInt(
          bbOptions.upperColor.slice(3, 5),
          16
        )}, ${parseInt(bbOptions.upperColor.slice(5, 7), 16)}, ${bbOptions.fillOpacity})`
      : undefined;

    chart.overrideIndicator({
      id: "bollinger",
      styles: {
        BOLL: {
          color: bbOptions.middleColor,
          lineWidth: bbOptions.middleWidth,
          lineStyle: bbOptions.middleStyle === "solid" ? 0 : 1,
          visible: bbOptions.showMiddle,
        },
        UPPER: {
          color: bbOptions.upperColor,
          lineWidth: bbOptions.upperWidth,
          lineStyle: bbOptions.upperStyle === "solid" ? 0 : 1,
          visible: bbOptions.showUpper,
        },
        LOWER: {
          color: bbOptions.lowerColor,
          lineWidth: bbOptions.lowerWidth,
          lineStyle: bbOptions.lowerStyle === "solid" ? 0 : 1,
          visible: bbOptions.showLower,
        },
      },
      fill: fillColor ? { color: fillColor, opacity: 1 } : undefined,
      calcParams: [bbOptions.length, bbOptions.stdDevMultiplier],
    });
  }, [chart, bbOptions, data]);

  return (
    <div
      ref={chartRef}
      className="w-full h-[500px] border border-gray-300 dark:border-gray-700 rounded-lg shadow-md"
    />
  );
};

export default ChartComponent;

