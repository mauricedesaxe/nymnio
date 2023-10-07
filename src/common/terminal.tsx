"use client";

import { logs$ } from "@/utils/store";
import { enableReactUse } from "@legendapp/state/config/enableReactUse";

enableReactUse(); // This adds the use() function to observables

function Terminal() {
  const logs = logs$.use();

  return (
    <details open>
      <summary className="cursor-pointer rounded hover:bg-gray-900">
        <h2 className="inline-block text-2xl font-semibold">
          Step 4. See live logs.
        </h2>
        <p className="text-gray-400 text-sm">
          This is the terminal. You can use it to see the logs and errors.
        </p>
      </summary>
      <button
        className="my-2 p-2 bg-red-500 hover:bg-red-600 rounded font-medium"
        onClick={() => logs$.set([`[${new Date()}] Cleared logs`])}
      >
        Clear logs
      </button>

      <ul role="list" className="mt-2 divide-y divide-gray-800 bg-black">
        {logs.map((log, index) => (
          <li key={index} className="text-gray-400 text-sm">
            {log}
          </li>
        ))}
      </ul>
    </details>
  );
}

export default Terminal;
