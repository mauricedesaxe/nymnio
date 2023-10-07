"use client";

import { enableReactUse } from "@legendapp/state/config/enableReactUse";
import { networks$ } from "@/utils/store";

enableReactUse(); // This adds the use() function to observables

function ApiKeyList() {
  const networks = networks$.use();

  return (
    <details open>
      <summary className="cursor-pointer rounded hover:bg-gray-900">
        <h2 className="inline-block text-2xl font-semibold">
          Step 2. Add API Keys.
        </h2>
        <p className="text-gray-400 text-sm">
          We will use these API keys to fetch data about your addresses. Leave
          them empty if you will, but you may run into rate limits.
        </p>
      </summary>
      <button
        className="my-2 p-2 bg-red-500 hover:bg-red-600 rounded font-medium"
        onClick={() => {
          networks$.set((networks) =>
            networks.map((network) => ({ ...network, key: "" }))
          );
        }}
      >
        Clear API Keys
      </button>
      {networks.map((network) => (
        <div className="w-full mt-4" key={network.id}>
          <div className="w-24 inline-block border border-gray-300 rounded-l-md px-3 py-2 bg-gray-800 text-white">
            {network.name}
          </div>
          <input
            type="text"
            value={network.key}
            className="inline-block border border-l-0 border-gray-300 rounded-r-md px-3 py-2 bg-gray-800 text-white"
            placeholder="Your API Key"
            onChange={(e) => {
              networks$.set((networks) =>
                networks.map((n) =>
                  n.id === network.id ? { ...n, key: e.target.value } : n
                )
              );
            }}
            onBlur={(e) => {
              if (e.target.value === "" && networks.length > 1) {
                return;
              }

              const keyPattern = /^[A-Z0-9]*$/;
              if (!keyPattern.test(e.target.value)) {
                alert("Invalid API Key format");
                networks$.set((networks) =>
                  networks.map((network) =>
                    network.id === network.id
                      ? { ...network, key: "" }
                      : network
                  )
                );
                return;
              }
            }}
          />
        </div>
      ))}
    </details>
  );
}

export default ApiKeyList;
