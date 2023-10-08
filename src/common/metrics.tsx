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
                      {value.toFixed(2)}
                    </span>
                    <span className="text-sm font-gray-400">
                      {ui.selectedTokenName}
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
