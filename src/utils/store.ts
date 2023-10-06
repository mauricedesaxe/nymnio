import { observable } from "@legendapp/state";
import {
  configureObservablePersistence,
  persistObservable,
} from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";

const addresses$ = observable([{ id: 1, address: "" }]);
const apiKeys$ = observable([{ id: 1, key: "" }]);
const logs$ = observable([""]);

configureObservablePersistence({
  pluginLocal: ObservablePersistLocalStorage,
});
persistObservable(addresses$, {
  local: "addresses", // Unique name
});
persistObservable(apiKeys$, {
  local: "apiKeys", // Unique name
});
persistObservable(logs$, {
  local: "logs", // Unique name
});

export { addresses$, apiKeys$, logs$ };
