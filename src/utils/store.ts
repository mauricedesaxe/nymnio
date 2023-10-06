import { observable } from "@legendapp/state";
import {
  configureObservablePersistence,
  persistObservable,
} from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";

const addresses$ = observable([{ id: 1, address: "" }]);
const endpoints$ = observable([{ id: 1, url: "" }]);
const logs$ = observable([""]);

configureObservablePersistence({
  pluginLocal: ObservablePersistLocalStorage,
});
persistObservable(addresses$, {
  local: "addresses", // Unique name
});
persistObservable(endpoints$, {
  local: "endpoints", // Unique name
});
persistObservable(logs$, {
  local: "logs", // Unique name
});

export { addresses$, endpoints$, logs$ };
