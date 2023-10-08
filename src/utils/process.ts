import moment from "moment";
import { addresses$ } from "./store";

function process90dMetrics(
  transactions: {
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
  }[]
) {
  console.log("transactions", transactions);
  // filter out any transactions not in the past 90d
  const ninetyDaysAgo = moment().subtract(90, "days");
  transactions = transactions.filter((transaction) =>
    moment.unix(parseInt(transaction.timeStamp)).isAfter(ninetyDaysAgo)
  );
  console.log("transactions", transactions);

  // separate transactions by tokenSymbol
  const separatedTransactions = new Map<
    string,
    {
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
    }[]
  >();
  for (const transaction of transactions) {
    if (!separatedTransactions.has(transaction.tokenSymbol)) {
      separatedTransactions.set(transaction.tokenSymbol, []);
    }
    separatedTransactions.get(transaction.tokenSymbol)?.push(transaction);
  }
  console.log("separatedTransactions", separatedTransactions);

  // calculate revenue, expenses, profit, margin for each tokenName
  const addresses = addresses$.get(); // user owned addresses to help determine cash flow direction
  const userOwnedAddressStrings = addresses.map((a) => a.address.toLowerCase());
  const metrics = new Map<
    string,
    {
      revenue: number;
      expenses: number;
      profit: number;
      margin: number;
    }
  >();
  for (const [tokenSymbol, transactions] of separatedTransactions) {
    let revenue = 0;
    let expenses = 0;
    for (const transaction of transactions) {
      const formattedValue =
        parseFloat(transaction.value) /
        Math.pow(10, parseInt(transaction.tokenDecimal));
      const isFromUser = userOwnedAddressStrings.includes(
        transaction.from.toLowerCase()
      );
      const isToUser = userOwnedAddressStrings.includes(
        transaction.to.toLowerCase()
      );

      if (isFromUser && isToUser) {
        console.log("transaction is internal");
      } else if (isFromUser) {
        expenses += formattedValue;
      } else if (isToUser) {
        revenue += formattedValue;
      } else {
        console.log("transaction not associated with user");
      }
    }
    const profit = revenue - expenses;
    const margin = profit / revenue;
    metrics.set(tokenSymbol, { revenue, expenses, profit, margin });
  }

  // return record of revenue, expenses, profit, margin for each network/tokenName pair
  return metrics;
}

export { process90dMetrics };
