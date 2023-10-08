import {
  fetchNormalTransactions,
  filterNormalTransactions,
  fetchERC20Transactions,
  normalTxSchema,
  erc20TxSchema,
} from "@/utils/fetch";
import { process90dMetrics } from "@/utils/process";
import {
  addresses$,
  networks$,
  logs$,
  transactions$,
  isTxLoading$,
  tokens$,
  metrics$,
  isProcessLoading$,
} from "@/utils/store";
import { z } from "zod";

function Controls() {
  const isTxLoading = isTxLoading$.use();
  const isProcessLoading = isProcessLoading$.use();

  async function handleGetTransactions() {
    isTxLoading$.set(true);

    logs$.set((logs) => [
      ...logs,
      `[${new Date()}] Starting to fetch transactions`,
    ]);

    const addresses = addresses$.get();
    const networks = networks$.get();
    const tokens = tokens$.get();

    const transactions: {
      timeStamp: string;
      hash: string;
      from: string;
      to: string;
      value: string;
      contractAddress: string;
      tokenName: string;
      tokenSymbol: string;
      tokenDecimal: string;
      network: string;
      type: string;
    }[] = [];

    // Only proceed if there are valid addresses and apiKeys
    const validAddresses = addresses.filter(
      (address) => address.address !== ""
    );
    if (validAddresses.length === 0) {
      logs$.set((logs) => [
        ...logs,
        `[${new Date()}] No valid addresses found`,
      ]);
      isTxLoading$.set(false);
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
          console.log(
            `[${new Date()}] Error fetching normal transactions: `,
            e
          );
          logs$.set((logs) => [
            ...logs,
            `[${new Date()}] Error fetching normal transactions: ${e}`,
          ]);
        }
        const localFilteredNormalTx = filterNormalTransactions(localNormalTx);

        // then get ERC20 transactions
        let localERC20Tx: z.infer<typeof erc20TxSchema>[] = [];
        for (const token of tokens) {
          try {
            const tokensERC20Tx = await fetchERC20Transactions(
              `${network.api}?apikey=${network.key}`,
              address.address,
              500,
              token.address
            );
            localERC20Tx = [...localERC20Tx, ...tokensERC20Tx];
          } catch (e) {
            console.log(
              `[${new Date()}] Error fetching ERC20 transactions: `,
              e
            );
            logs$.set((logs) => [
              ...logs,
              `[${new Date()}] Error fetching ERC20 transactions: ${e}`,
            ]);
          }
        }

        // standardize & merge the two into the transactions array
        for (const tx of localFilteredNormalTx) {
          transactions.push({
            timeStamp: tx.timeStamp,
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: tx.value,
            contractAddress: tx.contractAddress,
            tokenName: network.tokenName,
            tokenSymbol: network.tokenSymbol,
            tokenDecimal: network.tokenDecimal,
            network: network.name,
            type: "normal",
          });
        }
        for (const tx of localERC20Tx) {
          transactions.push({
            timeStamp: tx.timeStamp,
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: tx.value,
            contractAddress: tx.contractAddress,
            tokenName: tx.tokenName,
            tokenSymbol: tx.tokenSymbol,
            tokenDecimal: tx.tokenDecimal,
            network: network.name,
            type: "erc20",
          });
        }
      }
    }

    // remove duplicates, preferring transactions with value > 0 first and erc20 transactions second
    const hashSet = new Set();
    const filteredTx = transactions
      .sort((a, b) => {
        // Prefer transactions with value > 0
        if (a.value > b.value) return -1;
        if (a.value < b.value) return 1;

        // If values are equal, prefer erc20 transactions
        if (a.type === "erc20" && b.type !== "erc20") return -1;
        if (a.type !== "erc20" && b.type === "erc20") return 1;

        return 0;
      })
      .filter((tx) => {
        if (!hashSet.has(tx.hash)) {
          hashSet.add(tx.hash);
          return true;
        }
        return false;
      });

    // sort the transactions by timestamp; newest first
    filteredTx.sort((a, b) => parseInt(b.timeStamp) - parseInt(a.timeStamp));

    // log a few things
    console.log("transactions", filteredTx);
    logs$.set((logs) => [
      ...logs,
      `[${new Date()}] Fetched ${filteredTx.length} transactions`,
    ]);

    // store the transactions
    transactions$.set(filteredTx);
    logs$.set((logs) => [
      ...logs,
      `[${new Date()}] Stored ${filteredTx.length} transactions`,
    ]);

    isTxLoading$.set(false);
  }

  async function handleProcessReports() {
    isProcessLoading$.set(true);
    const transactions = transactions$.get();
    const metrics = process90dMetrics(transactions);
    metrics$.set(metrics);
    isProcessLoading$.set(true);
  }

  return (
    <details open>
      <summary className="cursor-pointer rounded hover:bg-gray-900">
        <h2 className="inline-block text-2xl font-semibold">
          Step 4. Get data.
        </h2>
        <p className="text-gray-400 text-sm">
          You can use this panel to manage your data.
        </p>
      </summary>
      <div>
        <button
          onClick={handleGetTransactions}
          className={`w-full mt-2 bg-blue-500 ${
            isTxLoading || isProcessLoading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700"
          } text-white font-bold py-2 px-4 rounded`}
          disabled={isTxLoading || isProcessLoading}
        >
          3. a. Get transactions
        </button>
        <button
          onClick={handleProcessReports}
          className={`w-full mt-2 bg-blue-500 ${
            isTxLoading || isProcessLoading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700"
          } text-white font-bold py-2 px-4 rounded`}
          disabled={isTxLoading || isProcessLoading}
        >
          3. b. Process reports
        </button>
      </div>
    </details>
  );
}

export default Controls;
