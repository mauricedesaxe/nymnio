"use client";

import { useState } from "react";

function Metrics() {
  const [metrics] = useState([
    { name: "Revenue", value: "0.4k", unit: "USD" },
    { name: "Profit", value: "0.2k", unit: "USD" },
    { name: "Expenses", value: "0.2k", unit: "USD" },
    { name: "Margin", value: "50", unit: "%" },
  ]);

  return (
    <div>
      <div className="bg-gray-950">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((stat) => (
              <div
                key={stat.name}
                className="bg-gray-950 px-4 py-6 sm:px-6 lg:px-8"
              >
                <p className="text-sm font-medium leading-6 text-gray-400">
                  {stat.name}
                </p>
                <p className="mt-2 flex items-baseline gap-x-2">
                  <span className="text-4xl font-semibold tracking-tight text-white">
                    {stat.value}
                  </span>
                  {stat.unit ? (
                    <span className="text-sm text-gray-400">{stat.unit}</span>
                  ) : null}
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
