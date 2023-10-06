"use client";

import { ethers } from "ethers";
import { enableReactUse } from "@legendapp/state/config/enableReactUse";
import { addresses$ } from "@/utils/store";

enableReactUse(); // This adds the use() function to observables

function AddressList() {
  // only use for reading
  const addresses = addresses$.use();

  return (
    <div>
      <h2 className="text-2xl font-semibold">Step 1. Add addresses.</h2>
      <p className="text-gray-400 text-sm">
        Add the addresses you want to track. You can add as many as you want.
      </p>
      <button
        className="mr-2 my-2 p-2 bg-blue-500 hover:bg-blue-600 rounded font-medium"
        onClick={() =>
          addresses$.set((addresses) => [
            ...addresses,
            { id: addresses.length + 1, address: "" },
          ])
        }
      >
        Add Address
      </button>
      <button
        className="my-2 p-2 bg-red-500 hover:bg-red-600 rounded font-medium"
        onClick={() => addresses$.set([{ id: 1, address: "" }])}
      >
        Clear Addresses
      </button>
      {addresses.map((address) => (
        <div key={address.id}>
          <input
            type="text"
            value={address.address}
            className="mt-2 border border-gray-300 rounded-md w-full px-3 py-2 bg-gray-800 text-white"
            placeholder="0x3D980E50508...927a11c03731"
            onChange={(e) => {
              addresses$.set((addresses) =>
                addresses.map((a) =>
                  a.id === address.id ? { ...a, address: e.target.value } : a
                )
              );
            }}
            onBlur={(e) => {
              if (e.target.value === "") {
                if (addresses.length > 1) {
                  addresses$.set((addresses) =>
                    addresses.filter((a) => a.id !== address.id)
                  );
                }
                return;
              }

              if (!ethers.isAddress(e.target.value)) {
                alert("Invalid EVM address");
                addresses$.set((addresses) =>
                  addresses.map((a) =>
                    a.id === address.id ? { ...a, address: "" } : a
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

export default AddressList;
