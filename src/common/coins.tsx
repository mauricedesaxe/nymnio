"use client";

import { enableReactUse } from "@legendapp/state/config/enableReactUse";
import { networks$, tokens$, ui$ } from "@/utils/store";
import { ethers } from "ethers";
import {
  PencilSquareIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

enableReactUse(); // This adds the use() function to observables

function CoinList() {
  const networks = networks$.use();
  const tokens = tokens$.use();

  return (
    <details>
      <Modal />
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
          {tokens
            .filter((token) => token.network == network.name)
            .map((token) => (
              <div className="w-full mt-4" key={token.address}>
                <div className="w-full flex border border-gray-300 rounded-md px-3 py-2 bg-gray-800 text-white">
                  {token.symbol} ({token.address.slice(0, 4)}...
                  {token.address.slice(-3)}){" "}
                  <div className="ml-auto flex">
                    <button
                      className="px-2 py-1 mx-1 bg-gray-900 hover:bg-gray-950 rounded font-medium"
                      onClick={() => {
                        console.log(
                          `edit token ${token.symbol} on ${network.name}`
                        );
                        ui$.set((ui) => ({
                          ...ui,
                          openTokenModal: true,
                          selectedNetwork: network.name,
                          selectedToken: token.address,
                        }));
                      }}
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </button>
                    <button
                      className="px-2 py-1 mx-1 bg-gray-900 hover:bg-gray-950 rounded font-medium"
                      onClick={() => {
                        console.log(
                          `remove token ${token.symbol} on ${network.name}`
                        );
                        tokens$.set((tokens) =>
                          tokens.filter((t) => t.address !== token.address)
                        );
                      }}
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          <button
            className="w-full px-2 py-1 my-1 bg-gray-950 hover:bg-gray-800 rounded font-medium flex justify-center items-center"
            onClick={() => {
              console.log(`add token on ${network.name}`);
              ui$.set((ui) => ({
                ...ui,
                openTokenModal: true,
                selectedNetwork: network.name,
                selectedToken: "",
              }));
            }}
          >
            <PlusCircleIcon className="w-5 h-5 mx-auto" />
          </button>
        </div>
      ))}
    </details>
  );
}

export default CoinList;

import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

function Modal() {
  const cancelButtonRef = useRef(null);

  const ui = ui$.use();

  const defaultToken = {
    network: ui.selectedNetwork,
    address: ui.selectedToken,
    decimals: "",
    name: "",
    symbol: "",
  };

  const networks = networks$.use();
  const tokens = tokens$.use();
  const [token, setToken] = useState(defaultToken);

  useEffect(() => {
    const newToken = networks.map((network) => {
      if (network.name !== ui.selectedNetwork) return defaultToken;
      const localTokens = tokens?.filter(
        (token) => token.network === network.name
      );
      if (!localTokens) return defaultToken;
      const token = localTokens?.find(
        (token) => token.address === ui.selectedToken
      );
      if (!token) return defaultToken;
      return token;
    })[0];

    setToken(newToken);
  }, [networks, ui]);

  return (
    <Transition.Root show={ui.openTokenModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => ui$.set((ui) => ({ ...ui, openTokenModal: false }))}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-200 bg-opacity-25 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-950 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-white"
                    >
                      {token.name == "" ? "Add token" : "Edit token"} on{" "}
                      {token.network || "NaN"}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-400">
                        You can{" "}
                        {token.name == ""
                          ? "add a new token"
                          : "edit this token"}{" "}
                        on {token.network || "NaN"} to track here.
                      </p>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="name"
                          placeholder="Token Name"
                          className="mt-2 border border-gray-300 rounded-md w-full px-3 py-2 bg-gray-800 text-white"
                          value={token.name}
                          onChange={(e) =>
                            setToken({ ...token, name: e.target.value })
                          }
                        />
                        <input
                          type="text"
                          name="symbol"
                          placeholder="Token Symbol"
                          className="mt-2 border border-gray-300 rounded-md w-full px-3 py-2 bg-gray-800 text-white"
                          value={token.symbol}
                          onChange={(e) =>
                            setToken({ ...token, symbol: e.target.value })
                          }
                        />
                        <input
                          type="text"
                          name="address"
                          placeholder="Token Address"
                          className="mt-2 border border-gray-300 rounded-md w-full px-3 py-2 bg-gray-800 text-white"
                          value={token.address}
                          onChange={(e) =>
                            setToken({ ...token, address: e.target.value })
                          }
                        />
                        <input
                          type="text"
                          name="decimals"
                          placeholder="Token Decimals"
                          className="mt-2 border border-gray-300 rounded-md w-full px-3 py-2 bg-gray-800 text-white"
                          value={token.decimals}
                          onChange={(e) =>
                            setToken({ ...token, decimals: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2"
                    onClick={() => {
                      // validate token input
                      if (token.name == "") {
                        alert("Token name is required");
                        return;
                      }
                      if (token.symbol == "") {
                        alert("Token symbol is required");
                        return;
                      }
                      if (token.decimals == "") {
                        alert("Token decimals is required");
                        return;
                      }
                      if (token.address == "") {
                        alert("Token address is required");
                        return;
                      }
                      if (!ethers.isAddress(token.address)) {
                        // alert("Invalid EVM address");
                        // return;
                      }

                      // Find the index of the token based on address and network
                      const tokenIndex = tokens.findIndex(
                        (t) =>
                          t.address.toLowerCase() ===
                            token.address.toLowerCase() &&
                          t.network.toLowerCase() ===
                            ui.selectedNetwork.toLowerCase()
                      );

                      // Create a new array for tokens
                      const newTokens = [...tokens];

                      // If a token is found, edit it with the new data
                      if (tokenIndex !== -1) {
                        newTokens[tokenIndex] = token;
                      } else {
                        // If no token is found, add the new data as a new token
                        newTokens.push(token);
                      }

                      // set the new tokens
                      tokens$.set(newTokens);

                      // close the modal
                      ui$.set((ui) => ({ ...ui, openTokenModal: false }));
                    }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200 sm:col-start-1 sm:mt-0"
                    onClick={() =>
                      ui$.set((ui) => ({ ...ui, openTokenModal: false }))
                    }
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
