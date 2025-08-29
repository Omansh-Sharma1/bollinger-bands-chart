"use client";

import React, { useState } from "react";
import { BollingerOptions } from "../lib/indicators/bollinger";

interface Props {
  bbOptions: BollingerOptions & StyleOptions;
  setBbOptions: React.Dispatch<React.SetStateAction<BollingerOptions & StyleOptions>>;
  onClose: () => void;
}

export interface StyleOptions {
  showMiddle: boolean;
  middleColor: string;
  middleWidth: number;
  middleStyle: "solid" | "dashed";

  showUpper: boolean;
  upperColor: string;
  upperWidth: number;
  upperStyle: "solid" | "dashed";

  showLower: boolean;
  lowerColor: string;
  lowerWidth: number;
  lowerStyle: "solid" | "dashed";

  showFill: boolean;
  fillOpacity: number;
}

const BollingerSettings: React.FC<Props> = ({ bbOptions, setBbOptions, onClose }) => {
  const [activeTab, setActiveTab] = useState<"inputs" | "style">("inputs");

  return (
    <div className="fixed top-16 right-16 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 z-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Bollinger Bands Settings
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-4">
        {["inputs", "style"].map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
            onClick={() => setActiveTab(tab as "inputs" | "style")}
          >
            {tab === "inputs" ? "Inputs" : "Style"}
          </button>
        ))}
      </div>

      {/* Inputs Tab */}
      {activeTab === "inputs" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Length
            </label>
            <input
              type="number"
              value={bbOptions.length}
              onChange={e =>
                setBbOptions(prev => ({ ...prev, length: parseInt(e.target.value) || 20 }))
              }
              className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              StdDev Multiplier
            </label>
            <input
              type="number"
              step="0.1"
              value={bbOptions.stdDevMultiplier}
              onChange={e =>
                setBbOptions(prev => ({ ...prev, stdDevMultiplier: parseFloat(e.target.value) || 2 }))
              }
              className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Offset
            </label>
            <input
              type="number"
              value={bbOptions.offset}
              onChange={e =>
                setBbOptions(prev => ({ ...prev, offset: parseInt(e.target.value) || 0 }))
              }
              className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Source
            </label>
            <select
              value={bbOptions.source}
              onChange={e =>
                setBbOptions(prev => ({ ...prev, source: e.target.value as "close" | "open" | "high" | "low" }))
              }
              className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="close">Close</option>
              <option value="open">Open</option>
              <option value="high">High</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      )}

      {/* Style Tab */}
      {activeTab === "style" && (
        <div className="space-y-4">
          {(["Middle", "Upper", "Lower"] as const).map(band => {
            const showKey = `show${band}` as keyof StyleOptions;
            const colorKey = `${band.toLowerCase()}Color` as keyof StyleOptions;
            const widthKey = `${band.toLowerCase()}Width` as keyof StyleOptions;
            const styleKey = `${band.toLowerCase()}Style` as keyof StyleOptions;

            return (
              <div key={band} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 space-y-3 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">{band} Band</span>
                  <input
                    type="checkbox"
                    checked={bbOptions[showKey] as boolean}
                    onChange={e =>
                      setBbOptions(prev => ({ ...prev, [showKey]: e.target.checked }))
                    }
                    className="w-4 h-4"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Color</label>
                    <input
                      type="color"
                      value={bbOptions[colorKey] as string}
                      onChange={e =>
                        setBbOptions(prev => ({ ...prev, [colorKey]: e.target.value }))
                      }
                      className="w-full h-9 border border-gray-300 dark:border-gray-600 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Width</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={bbOptions[widthKey] as number}
                      onChange={e =>
                        setBbOptions(prev => ({ ...prev, [widthKey]: parseInt(e.target.value) }))
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Line Style</label>
                    <select
                      value={bbOptions[styleKey] as "solid" | "dashed"}
                      onChange={e =>
                        setBbOptions(prev => ({ ...prev, [styleKey]: e.target.value }))
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 space-y-3 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900 dark:text-white">Background Fill</span>
              <input
                type="checkbox"
                checked={bbOptions.showFill}
                onChange={e =>
                  setBbOptions(prev => ({ ...prev, showFill: e.target.checked }))
                }
                className="w-4 h-4"
              />
            </div>
            {bbOptions.showFill && (
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Opacity</label>
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.05}
                  value={bbOptions.fillOpacity}
                  onChange={e =>
                    setBbOptions(prev => ({
                      ...prev,
                      fillOpacity: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BollingerSettings;
