"use client";

import { enableReactUse } from "@legendapp/state/config/enableReactUse";
import { endpoints$ } from "@/utils/store";

enableReactUse(); // This adds the use() function to observables

function EndpointList() {
  // only use for reading
  const endpoints = endpoints$.use();

  return (
    <div>
      <h2 className="text-2xl font-semibold">Step 2. Add endpoints.</h2>
      <p className="text-gray-400 text-sm">
        We will use these endpoints to fetch data about your addresses. Leave
        the `YourApiKeyToken` empty if you will, but you may run into rate
        limits.
      </p>
      <button
        className="my-2 p-2 bg-blue-500 hover:bg-blue-600 rounded font-medium"
        onClick={() =>
          endpoints$.set((endpoints) => [
            ...endpoints,
            { id: endpoints.length + 1, url: "" },
          ])
        }
      >
        Add Endpoint
      </button>
      {endpoints.map((endpoint) => (
        <div key={endpoint.id}>
          <input
            type="text"
            value={endpoint.url}
            className="mt-2 border border-gray-300 rounded-md w-full px-3 py-2 bg-gray-800 text-white"
            placeholder="https://api.etherscan.io/api?apikey=YourApiKeyToken"
            onChange={(e) =>
              endpoints$.set((endpoints) =>
                endpoints.map((ep) =>
                  ep.id === endpoint.id ? { ...ep, url: e.target.value } : ep
                )
              )
            }
            onBlur={(e) => {
              if (e.target.value === "" && endpoints.length > 1) {
                endpoints$.set((endpoints) =>
                  endpoints.filter((ep) => ep.id !== endpoint.id)
                );
                return;
              }

              const urlPattern = /^https:\/\/.*\/api\?apikey=.*$/;
              if (!urlPattern.test(e.target.value)) {
                alert("Invalid endpoint format");
                endpoints$.set((endpoints) =>
                  endpoints.map((ep) =>
                    ep.id === endpoint.id ? { ...ep, url: "" } : ep
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

export default EndpointList;
