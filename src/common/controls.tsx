import {
  fetchNormalTransactions,
  filterNormalTransactions,
  fetchERC20Transactions,
  normalTxSchema,
  erc20TxSchema,
} from "@/utils/fetch";
import {
  addresses$,
  networks$,
  logs$,
  transactions$,
  isTxLoading$,
  tokens$,
} from "@/utils/store";
import { z } from "zod";

function Controls() {
  const isTxLoading = isTxLoading$.use();

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
            localERC20Tx = await fetchERC20Transactions(
              `${network.api}?apikey=${network.key}`,
              address.address,
              333,
              token.address
            );
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
      isTxLoading$.set(false);
    }

    // sort the transactions by timestamp; newest first
    transactions.sort((a, b) => parseInt(b.timeStamp) - parseInt(a.timeStamp));

    // log a few things
    console.log("transactions", transactions);
    logs$.set((logs) => [
      ...logs,
      `[${new Date()}] Fetched ${transactions.length} transactions`,
    ]);

    // store the transactions
    transactions$.set(transactions);
    logs$.set((logs) => [
      ...logs,
      `[${new Date()}] Stored ${transactions.length} transactions`,
    ]);
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
            isTxLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          } text-white font-bold py-2 px-4 rounded`}
          disabled={isTxLoading}
        >
          3. a. Get transactions
        </button>
        <button
          className={`w-full mt-2 bg-blue-500 ${
            isTxLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          } text-white font-bold py-2 px-4 rounded`}
          disabled={isTxLoading}
        >
          3. b. Process reports
        </button>
      </div>
    </details>
  );
}

export default Controls;
