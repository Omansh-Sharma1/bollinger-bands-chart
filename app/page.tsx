"use client";

import React, { useEffect, useState } from "react";
import ChartComponent from "../components/Chart";
import BollingerSettings, { StyleOptions } from "../components/BollingerSettings";
import { OHLCV } from "../lib/types";
import { BollingerOptions } from "../lib/indicators/bollinger";

export default function Home() {
  const [data, setData] = useState<OHLCV[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const [bbOptions, setBbOptions] = useState<BollingerOptions & StyleOptions>({
    length: 20,
    stdDevMultiplier: 2,
    source: "close",
    offset: 0,
    // Style defaults
    showMiddle: true,
    middleColor: "#f1c40f",
    middleWidth: 1,
    middleStyle: "solid",
    showUpper: true,
    upperColor: "#2ecc71",
    upperWidth: 1,
    upperStyle: "solid",
    showLower: true,
    lowerColor: "#e74c3c",
    lowerWidth: 1,
    lowerStyle: "solid",
    showFill: true,
    fillOpacity: 0.2,
  });

  useEffect(() => {
    fetch("/data/ohlcv.json")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Failed to load OHLCV data:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4 space-y-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Bollinger Bands Chart
        </h1>

        <ChartComponent data={data} bbOptions={bbOptions} />

        <div className="flex justify-end">
          <button
            onClick={() => setShowSettings(true)}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2"
          >
            ⚙️ Settings
          </button>
        </div>
        {showSettings && (
          <BollingerSettings 
            bbOptions={bbOptions} 
            setBbOptions={setBbOptions}
            onClose={() => setShowSettings(false)}
          />
        )}
      </div>
    </div>
  );
}