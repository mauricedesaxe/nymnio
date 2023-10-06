import AddressList from "@/common/addresses";
import ApiKeyList from "@/common/apiKeys";
import Controls from "@/common/controls";
import { AppInfo, CreatorInfo, DataInfo } from "@/common/info";
import Metrics from "@/common/metrics";
import ReportList from "@/common/reports";
import Terminal from "@/common/terminal";
import TransactionList from "@/common/transactions";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <div className="mx-auto max-w-8xl sm:px-6 lg:px-8 px-4 py-10">
        <div className="h-full w-full grid grid-cols-1 lg:grid-cols-4 gap-4">
          <aside className="col-span-1">
            {/* Left column area */}
            <div className="h-96 overflow-y-auto p-2 pr-4 bg-gray-950 rounded">
              <AddressList />
            </div>
            <div className="border-b border-gray-500 my-4" />

            <div className="h-96 overflow-y-auto p-2 pr-4 bg-gray-950 rounded">
              <ApiKeyList />
            </div>
            <div className="border-b border-gray-500 my-4" />
          </aside>

          <main className="col-span-2">
            {/* Main area */}
            <div className="h-72 overflow-y-auto p-2 pr-4 bg-gray-950 rounded">
              <TransactionList />
            </div>
            <div className="border-b border-gray-500 my-4" />

            <div className="overflow-y-auto p-2 pr-4 bg-gray-950 rounded">
              <h2 className="text-2xl font-semibold">
                Step 6. Read 90d metrics.
              </h2>
              <p className="text-gray-400 text-sm">
                See your metrics in a single place. These should provide you
                with a overall picture of your financials.
              </p>
            </div>
            <Metrics />
            <div className="border-b border-gray-500 my-4" />

            <div className="h-72 overflow-y-auto p-2 pr-4 bg-gray-950 rounded">
              <ReportList />
            </div>
            <div className="border-b border-gray-500 my-4" />
          </main>

          <aside className="col-span-1">
            {/* Right column area */}
            <div className="p-2 pr-4 bg-gray-950 rounded">
              <Controls />
            </div>
            <div className="border-b border-gray-500 my-4" />

            <div className="h-48 overflow-y-auto p-2 pr-4 bg-gray-950 rounded">
              <Terminal />
            </div>
            <div className="border-b border-gray-500 my-4" />

            <div className="p-2 pr-4 bg-gray-950 rounded">
              <AppInfo />
            </div>
            <div className="border-b border-gray-500 my-4" />

            <div className="p-2 pr-4 bg-gray-950 rounded">
              <DataInfo />
            </div>
            <div className="border-b border-gray-500 my-4" />

            <div className="p-2 pr-4 bg-gray-950 rounded">
              <CreatorInfo />
            </div>
            <div className="border-b border-gray-500 my-4" />
          </aside>
        </div>
      </div>
    </div>
  );
}
