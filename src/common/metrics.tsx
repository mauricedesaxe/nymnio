"use client";

import { isProcessLoading$, metrics$, metricsUi$ } from "@/utils/store";
import { enableReactUse } from "@legendapp/state/config/enableReactUse";
import { useEffect, useState } from "react";

enableReactUse(); // This adds the use() function to observables

function Metrics() {
  const metrics = metrics$.use();
  const ui = metricsUi$.use();
  const isProcessLoading = isProcessLoading$.use();

  const [selectedMetric, setSelectedMetric] = useState<{
    revenue: number;
    expenses: number;
    profit: number;
    margin: number;
  }>();

  useEffect(() => {
    if (!metrics) {
      return;
    }
    setSelectedMetric(metrics.get(ui.selectedTokenName));
  }, [metrics, ui.selectedTokenName]);

  return (
    <div>
      <div className="overflow-y-auto p-2 pr-4 bg-gray-950 rounded">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold">
              Step 7. Read {ui.selectedPeriod}d metrics.
            </h2>
            <p className="text-gray-400 text-sm">
              See your metrics in a single place. These should provide you with
              a overall picture of your financials.
            </p>
          </div>
          <select
            className="mt-2 mr-2 w-24 border border-gray-300 rounded-md px-3 py-2 bg-gray-800 text-white"
            value={ui.selectedPeriod}
            onChange={(e) =>
              metricsUi$.set({ ...ui, selectedPeriod: Number(e.target.value) })
            }
          >
            <option value="30">30d</option>
            <option value="90">90d</option>
            <option value="180">180d</option>
            <option value="365">365d</option>
          </select>
          <select
            className="mt-2 w-24 border border-gray-300 rounded-md px-3 py-2 bg-gray-800 text-white"
            value={ui.selectedTokenName}
            onChange={(e) =>
              metricsUi$.set({ ...ui, selectedTokenName: e.target.value })
            }
          >
            {Array.from(metrics.keys()).map((tokenName) => (
              <option key={tokenName} value={tokenName}>
                {tokenName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-gray-950">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
            {isProcessLoading && (
              <p className="text-gray-400 text-sm">Loading...</p>
            )}
            {!isProcessLoading && !selectedMetric && (
              <p className="text-gray-400 text-sm">No metrics</p>
            )}
            {!isProcessLoading &&
              selectedMetric &&
              Object.entries(selectedMetric).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-gray-950 px-4 py-6 sm:px-6 lg:px-8"
                >
                  <p className="text-sm font-medium leading-6 text-gray-400">
                    {key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
                  </p>
                  <p className="mt-2 flex items-baseline gap-x-2">
                    <span className="text-4xl font-semibold tracking-tight text-white">
                      {formatValue(key, value)}
                    </span>
                    <span className="text-sm font-gray-400">
                      {formatUnit(key, ui.selectedTokenName)}
                    </span>
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Metrics;

function formatValue(key: string, value: number) {
  if (key == "margin") {
    return (value * 100).toFixed(1);
  }
  if (value > 10_000_000) {
    return (value / 1_000_000).toFixed(0) + "m";
  }
  if (value > 1_000_000) {
    return (value / 1_000_000).toFixed(1) + "m";
  }
  if (value > 10_000) {
    return (value / 1_000).toFixed(0) + "k";
  }
  if (value > 1_000) {
    return (value / 1_000).toFixed(1) + "k";
  }
  if (value > 10) {
    return value.toFixed(0);
  }
  return value.toFixed(1);
}

function formatUnit(key: string, tokenName: string) {
  return key == "margin" ? "%" : tokenName;
}
