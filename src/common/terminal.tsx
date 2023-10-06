"use client";

import { useState } from "react";

function Terminal() {
  const [logs] = useState([
    "2021-10-01T00:00:00.000Z: Started fetching transactions.",
    "2021-10-02T00:00:00.000Z: Transactions fetched successfully.",
    "2021-10-03T00:00:00.000Z: Started generating reports.",
    "2021-10-04T00:00:00.000Z: Reports generating successfully.",
    "2021-10-05T00:00:00.000Z: Started fetching addresses.",
    "2021-10-06T00:00:00.000Z: Addresses fetched successfully.",
    "2021-10-07T00:00:00.000Z: Started generating metrics.",
    "2021-10-08T00:00:00.000Z: Metrics generated successfully.",
  ]);

  return (
    <div>
      <h2 className="text-2xl font-semibold">4. See live logs of processing</h2>
      <p className="text-gray-400 text-sm">
        This is the terminal. You can use it to see the logs and errors.
      </p>

      <ul role="list" className="mt-2 divide-y divide-gray-800 bg-black">
        {logs.map((log, index) => (
          <li key={index} className="text-gray-400 text-sm">
            {log}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Terminal;
