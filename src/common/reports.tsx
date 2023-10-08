"use client";

import { useState } from "react";

function ReportList() {
  const [reports] = useState([
    {
      month: "September 2023",
      cashChange: "+100",
      startOfMonthBalance: "1000",
      endOfMonthBalance: "1100",
    },
    {
      month: "August 2023",
      cashChange: "-200",
      startOfMonthBalance: "1200",
      endOfMonthBalance: "1000",
    },
    {
      month: "July 2023",
      cashChange: "+300",
      startOfMonthBalance: "900",
      endOfMonthBalance: "1200",
    },
    {
      month: "June 2023",
      cashChange: "-100",
      startOfMonthBalance: "1000",
      endOfMonthBalance: "900",
    },
    {
      month: "May 2023",
      cashChange: "+500",
      startOfMonthBalance: "500",
      endOfMonthBalance: "1000",
    },
  ]);

  return (
    <div>
      <h2 className="text-2xl font-semibold">Step 8. Read reports.</h2>
      <p className="text-gray-400 text-sm">
        See your reports in a single place. We will fetch these by using your
        API endpoints.
      </p>
      <div>
        <ul role="list" className="divide-y divide-gray-800">
          {reports.map((report) => (
            <li
              key={report.month}
              className="flex items-center justify-between gap-x-6 py-5"
            >
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-200">
                    {report.month}: {report.cashChange} USD
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    Balance changed from {report.startOfMonthBalance} USD →{" "}
                    {report.endOfMonthBalance} USD
                  </p>
                </div>
              </div>
              <div
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  Number(report.cashChange) > 0
                    ? "text-green-200"
                    : "text-red-200"
                } shadow-sm ${
                  Number(report.cashChange) > 0 ? "bg-green-700" : "bg-red-700"
                } w-20 text-center`}
              >
                {Number(report.cashChange) > 0 ? "Profit" : "Loss"}
              </div>
            </li>
          ))}
        </ul>
        {/* <a
          href="#"
          className="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
        >
          View all
        </a> */}
      </div>
    </div>
  );
}

export default ReportList;
