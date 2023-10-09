function AppInfo() {
  return (
    <div>
      <h2 className="text-2xl font-semibold">What is this?</h2>
      <p className="text-gray-400 text-sm">
        This web app helps you manage your on-chain finances. It uses
        blockscanners to fetch your transactions and addresses, and then
        generates reports and metrics from them.
      </p>
    </div>
  );
}

function DataInfo() {
  return (
    <div>
      <h2 className="text-2xl font-semibold">Your data?</h2>
      <p className="text-gray-400 text-sm">
        All the data is stored in your browser and is not shared with anyone. We
        never see it. You can clear the data by clearing your browser cache.
      </p>
    </div>
  );
}

function CreatorInfo() {
  return (
    <div>
      <h2 className="text-2xl font-semibold">Who made this?</h2>
      <p className="text-gray-400 text-sm">
        Made by{" "}
        <a
          className="text-blue-500 hover:underline"
          href="https://lazarorganization.com"
        >
          Lazar Organization
        </a>
        . Source code at{" "}
        <a
          className="text-blue-500 hover:underline"
          href="https://github.com/mauricedesaxe/nymnio"
        >
          GitHub
        </a>
        . Bugs and feature requests welcome at{" "}
        <a
          className="text-blue-500 hover:underline"
          href="https://twitter.com/SaxeMauricede"
        >
          my twitter
        </a>
        .
      </p>
    </div>
  );
}

export { AppInfo, DataInfo, CreatorInfo };
