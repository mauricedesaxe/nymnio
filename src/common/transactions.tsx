"use client";

import { transactions$ } from "@/utils/store";
import { enableReactUse } from "@legendapp/state/config/enableReactUse";

enableReactUse(); // This adds the use() function to observables

function TransactionList() {
  const transactions = transactions$.use();

  return (
    <div>
      <h2 className="text-2xl font-semibold">Step 5. See transactions.</h2>
      <p className="text-gray-400 text-sm">
        See your transactions in a single place. We will fetch these by using
        your API endpoints.
      </p>
      <div>
        <ul role="list" className="divide-y divide-gray-800">
          {transactions.map((transaction) => (
            <li
              key={transaction.hash}
              className="flex items-center justify-between gap-x-6 py-5"
            >
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-200">
                    {transaction.from} → {transaction.to}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {transaction.value} USD
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {new Date(
                      parseInt(transaction.timeStamp) * 1000
                    ).toUTCString()}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {transaction.tokenName} ({transaction.tokenSymbol})
                  </p>
                </div>
              </div>
              <a
                href={transaction.hash}
                className="rounded-full bg-gray-800 px-2.5 py-1 text-xs font-semibold text-gray-200 shadow-sm ring-1 ring-inset ring-gray-700 hover:bg-gray-700"
              >
                View
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#"
          className="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
        >
          View all
        </a>
      </div>
    </div>
  );
}

export default TransactionList;
