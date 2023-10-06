import { observable } from "@legendapp/state";
import {
  configureObservablePersistence,
  persistObservable,
} from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";

const addresses$ = observable([{ id: 1, address: "" }]);
const logs$ = observable([""]);
const networks$ = observable([
  {
    name: "Ethereum",
    id: 1,
    api: "https://api.etherscan.io/api",
    key: "",
    blockExplorer: "https://etherscan.io",
  },
  {
    name: "Polygon",
    id: 137,
    api: "https://api.polygonscan.com/api",
    key: "",
    blockExplorer: "https://polygonscan.com",
  },
  {
    name: "BSC",
    id: 56,
    api: "https://api.bscscan.com/api",
    key: "",
    blockExplorer: "https://bscscan.com",
  },
]);
const transactions$ = observable([
  {
    timeStamp: new Date().getTime().toString(),
    hash: "0xFakeHash",
    from: "0xFakeFrom",
    to: "0xFakeTo",
    value: "1",
    contractAddress: "0xFakeContractAddress",
    tokenName: "FakeTokenName",
    tokenSymbol: "FakeTokenSymbol",
    tokenDecimal: "18",
    network: "Ethereum",
  },
]);
configureObservablePersistence({
  pluginLocal: ObservablePersistLocalStorage,
});
persistObservable(addresses$, {
  local: "addresses", // Unique name
});
persistObservable(logs$, {
  local: "logs", // Unique name
});
persistObservable(networks$, {
  local: "networks", // Unique name
});
persistObservable(transactions$, {
  local: "transactions", // Unique name
});

export { addresses$, logs$, networks$, transactions$ };
