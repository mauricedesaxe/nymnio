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

export { addresses$, logs$, networks$ };
