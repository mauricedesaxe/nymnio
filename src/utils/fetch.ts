import axios from "axios";
import { z } from "zod";

/**
 * This section of the code is responsible for fetching normal transactions.
 * It uses the axios library to make HTTP requests to the specified endpoint.
 * The response is then validated using the zod library and the defined schema.
 * If the response is valid, it is added to the results array.
 * The process continues until there are no more transactions to fetch.
 */

export const normalTxSchema = z.object({
  timeStamp: z.string(),
  hash: z.string(),
  from: z.string(),
  to: z.string(),
  value: z.string(),
  contractAddress: z.string(),
  isError: z.string(),
  methodId: z.string(),
  functionName: z.string(),
});

const normalTxResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  result: z.array(normalTxSchema),
});

/**
 *
 * @param endpoint expected to look like https://api.etherscan.io/api?apiKey=YourApiKeyToken
 * @param address the address to fetch transactions for (must be an ERC20 contract)
 * @param timeout the timeout between requests in milliseconds (default 333) - free etherscan has a rate limit of 5 requests per second
 * @returns a list of normal transactions
 */
async function fetchNormalTransactions(
  endpoint: string,
  address: string,
  timeout = 333
) {
  let page = 1;
  const results = [];

  while (true) {
    const response = await axios.get(
      `${endpoint}&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=10&sort=asc`
    );
    const validatedResponse = normalTxResponseSchema.parse(response.data);

    if (validatedResponse.status !== "1") {
      throw new Error("API request failed");
    }

    results.push(...validatedResponse.result);

    if (validatedResponse.result.length < 10) {
      break;
    }

    page += 1;

    // free etherscan has a rate limit of 5 requests per second, so we need to wait
    // a certain amount of time between requests to avoid getting rate limited.
    await new Promise((resolve) => setTimeout(resolve, timeout));
  }

  return results;
}

/**
 * Filters out normal transactions that are error or have no value transfer
 * @param transactions the list of transactions to filter
 * @returns a list of filtered transactions
 */
function filterNormalTransactions(
  transactions: z.infer<typeof normalTxSchema>[]
) {
  return transactions.filter(
    (transaction) => transaction.isError === "0" && transaction.value !== "0"
  );
}

/**
 * This section of the code is responsible for fetching ERC20 transactions.
 * It uses the axios library to make HTTP requests to the specified endpoint.
 * The response is then validated using the zod library and the defined schema.
 * If the response is valid, it is added to the results array.
 * The process continues until there are no more transactions to fetch.
 */

export const erc20TxSchema = z.object({
  timeStamp: z.string(),
  hash: z.string(),
  from: z.string(),
  to: z.string(),
  value: z.string(),
  contractAddress: z.string(),
  tokenName: z.string(),
  tokenSymbol: z.string(),
  tokenDecimal: z.string(),
});

const erc20ResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  result: z.array(erc20TxSchema),
});

/**
 *
 * @param endpoint expected to look like https://api.etherscan.io/api?apiKey=YourApiKeyToken
 * @param address the address to fetch transactions for (must be an ERC20 contract)
 * @param timeout the timeout between requests in milliseconds (default 333) - free etherscan has a rate limit of 5 requests per second
 * @param contractAddress the address of the ERC20 contract (optional)
 * @returns a list of ERC20 transactions
 */
async function fetchERC20Transactions(
  endpoint: string,
  address: string,
  timeout = 333,
  contractAddress?: string
) {
  let page = 1;
  const results = [];

  while (true) {
    const response = await axios.get(
      `${endpoint}&module=account&action=tokentx&address=${address}&page=${page}&offset=1000&contractaddress=${contractAddress}`
    );
    const validatedResponse = erc20ResponseSchema.parse(response.data);

    if (validatedResponse.status !== "1") {
      throw new Error("API request failed");
    }

    results.push(...validatedResponse.result);

    if (validatedResponse.result.length < 1_000) {
      break;
    }

    page += 1;

    // free etherscan has a rate limit of 5 requests per second, so we need to wait
    // a certain amount of time between requests to avoid getting rate limited.
    await new Promise((resolve) => setTimeout(resolve, timeout));
  }

  return results;
}

export {
  fetchNormalTransactions,
  filterNormalTransactions,
  fetchERC20Transactions,
};
