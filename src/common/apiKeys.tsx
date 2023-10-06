"use client";

import { enableReactUse } from "@legendapp/state/config/enableReactUse";
import { apiKeys$ } from "@/utils/store";

enableReactUse(); // This adds the use() function to observables

function ApiKeyList() {
  // only use for reading
  const apiKeys = apiKeys$.use();

  return (
    <div>
      <h2 className="text-2xl font-semibold">Step 2. Add API Keys.</h2>
      <p className="text-gray-400 text-sm">
        We will use these API keys to fetch data about your addresses. Leave
        them empty if you will, but you may run into rate limits.
      </p>
      {apiKeys.map((apiKey) => (
        <div className="w-full mt-4" key={apiKey.id}>
          <div className="inline-block border border-gray-300 rounded-l-md px-3 py-2 bg-gray-800 text-white">
            etherscan.io
          </div>
          <input
            type="text"
            value={apiKey.key}
            className="inline-block border border-l-0 border-gray-300 rounded-r-md px-3 py-2 bg-gray-800 text-white"
            placeholder="Your API Key"
            onChange={(e) =>
              apiKeys$.set((apiKeys) =>
                apiKeys.map((ak) =>
                  ak.id === apiKey.id ? { ...ak, key: e.target.value } : ak
                )
              )
            }
            onBlur={(e) => {
              if (e.target.value === "" && apiKeys.length > 1) {
                apiKeys$.set((apiKeys) =>
                  apiKeys.filter((ak) => ak.id !== apiKey.id)
                );
                return;
              }

              const keyPattern = /^[A-Z0-9]{40}$/;
              if (!keyPattern.test(e.target.value)) {
                alert("Invalid API Key format");
                apiKeys$.set((apiKeys) =>
                  apiKeys.map((ak) =>
                    ak.id === apiKey.id ? { ...ak, key: "" } : ak
                  )
                );
                return;
              }
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default ApiKeyList;
