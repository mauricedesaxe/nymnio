import {
  fetchNormalTransactions,
  filterNormalTransactions,
  fetchERC20Transactions,
  normalTxSchema,
  erc20TxSchema,
} from "@/utils/fetch";
import { addresses$, networks$, logs$ } from "@/utils/store";
import { z } from "zod";

function Controls() {
  async function handleGetTransactions() {
    logs$.set((logs) => [
      ...logs,
      `[${new Date()}] Starting to fetch transactions`,
    ]);

    const addresses = addresses$.get();
    const networks = networks$.get();

    const normalTx: z.infer<typeof normalTxSchema>[] = [];
    const ERC20Tx: z.infer<typeof erc20TxSchema>[] = [];

    // Only proceed if there are valid addresses and apiKeys
    const validAddresses = addresses.filter(
      (address) => address.address !== ""
    );
    if (validAddresses.length === 0) {
      logs$.set((logs) => [
        ...logs,
        `[${new Date()}] No valid addresses found`,
      ]);
      return;
    }

    // Loop through all addresses and apiKeys
    for (const address of addresses) {
      if (address.address === "") {
        continue;
      }
      for (const network of networks) {
        // first get normal transactions
        let localNormalTx: z.infer<typeof normalTxSchema>[] = [];
        try {
          localNormalTx = await fetchNormalTransactions(
            `${network.api}?apikey=${network.key}`,
            address.address
          );
        } catch (e) {
          logs$.set((logs) => [
            ...logs,
            `[${new Date()}] Error fetching normal transactions: ${e}`,
          ]);
        }
        const localFilteredNormalTx = filterNormalTransactions(localNormalTx);

        // then get ERC20 transactions
        let localERC20Tx: z.infer<typeof erc20TxSchema>[] = [];
        try {
          localERC20Tx = await fetchERC20Transactions(
            `${network.api}?apikey=${network.key}`,
            address.address
          );
        } catch (e) {
          logs$.set((logs) => [
            ...logs,
            `[${new Date()}] Error fetching ERC20 transactions: ${e}`,
          ]);
        }

        normalTx.push(...localFilteredNormalTx);
        ERC20Tx.push(...localERC20Tx);
      }
    }

    // store the data
    const mergedTransactions = [...normalTx, ...ERC20Tx];
    logs$.set((logs) => [
      ...logs,
      `[${new Date()}] Fetched ${normalTx.length} normal transactions`,
    ]);
    logs$.set((logs) => [
      ...logs,
      `[${new Date()}] Fetched ${ERC20Tx.length} ERC20 transactions`,
    ]);
    // TODO store here
    console.log("mergedTransactions", mergedTransactions);
    logs$.set((logs) => [
      ...logs,
      `[${new Date()}] Stored ${mergedTransactions.length} transactions`,
    ]);
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold">3. Get & process data</h2>
      <p className="text-gray-400 text-sm">
        You can use this panel to manage your data.
      </p>
      <div>
        <button
          onClick={handleGetTransactions}
          className="w-full mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          3. a. Get transactions
        </button>
        <button className="w-full mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          3. b. Process reports
        </button>
        <button
          onClick={() => {
            // TODO make sure to always update this with any new observables
            logs$.set([""]);
            addresses$.set([{ id: 1, address: "" }]);
            networks$.set((networks) =>
              networks.map((network) => ({ ...network, key: "" }))
            );
          }}
          className="w-full mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Clear data
        </button>
      </div>
    </div>
  );
}

export default Controls;
