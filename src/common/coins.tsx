"use client";

import { enableReactUse } from "@legendapp/state/config/enableReactUse";
import { networks$ } from "@/utils/store";
import { ethers } from "ethers";
import {
  PencilSquareIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

enableReactUse(); // This adds the use() function to observables

function CoinList() {
  const networks = networks$.use();

  return (
    <details>
      <summary className="cursor-pointer rounded hover:bg-gray-900">
        <h2 className="inline-block text-2xl font-semibold">
          Step 3. Add Coins.
        </h2>
        <p className="text-gray-400 text-sm">
          If you want this to fetch ERC20 transactions, you'll need to provide
          the coins you want to track for each network.
        </p>
      </summary>
      <button
        className="my-2 p-2 bg-red-500 hover:bg-red-600 rounded font-medium"
        onClick={() => {
          networks$.set((networks) =>
            networks.map((network) => ({ ...network, tokens: [] }))
          );
        }}
      >
        Clear coins
      </button>
      {networks.map((network) => (
        <div key={network.id}>
          <div className="w-full my-2 border-b border-gray-300 text-white">
            {network.name}
          </div>
          {network.tokens.map((token) => (
            <div className="w-full mt-4" key={token.address}>
              <div className="w-full flex border border-gray-300 rounded-md px-3 py-2 bg-gray-800 text-white">
                {token.symbol} ({token.address.slice(0, 4)}...
                {token.address.slice(-3)}){" "}
                <div className="ml-auto flex">
                  <button
                    className="px-2 py-1 mx-1 bg-gray-900 hover:bg-gray-950 rounded font-medium"
                    onClick={() => {
                      console.log("edit token", token);
                    }}
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button
                    className="px-2 py-1 mx-1 bg-gray-900 hover:bg-gray-950 rounded font-medium"
                    onClick={() => {
                      console.log("remove token", token);
                    }}
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button className="w-full px-2 py-1 my-1 bg-gray-950 hover:bg-gray-800 rounded font-medium flex justify-center items-center">
            <PlusCircleIcon className="w-5 h-5 mx-auto" />
          </button>
        </div>
      ))}
    </details>
  );
}

export default CoinList;
