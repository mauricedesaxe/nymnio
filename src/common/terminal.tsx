"use client";

import { logs$ } from "@/utils/store";
import { enableReactUse } from "@legendapp/state/config/enableReactUse";

enableReactUse(); // This adds the use() function to observables

function Terminal() {
  const logs = logs$.use();

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
