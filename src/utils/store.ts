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
    tokenName: "Ether",
    tokenSymbol: "ETH",
    tokenDecimal: "18",
    id: 1,
    api: "https://api.etherscan.io/api",
    key: "",
    blockExplorer: "https://etherscan.io",
  },
  {
    name: "Polygon",
    tokenName: "Matic",
    tokenSymbol: "MATIC",
    tokenDecimal: "18",
    id: 137,
    api: "https://api.polygonscan.com/api",
    key: "",
    blockExplorer: "https://polygonscan.com",
  },
  {
    name: "BSC",
    tokenName: "BNB",
    tokenSymbol: "BNB",
    tokenDecimal: "18",
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
const tokens$ = observable([
  {
    id: 1,
    symbol: "USDC",
    name: "USD Coin",
    decimals: "6",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    network: "Ethereum",
  },
  {
    id: 2,
    symbol: "USDT",
    name: "Tether USD",
    decimals: "6",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    network: "Ethereum",
  },
  {
    id: 3,
    symbol: "DAI",
    name: "Dai Stablecoin",
    decimals: "18",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    network: "Ethereum",
  },
]);
const coinUi$ = observable({
  openTokenModal: false,
  selectedTokenId: 0,
  selectedNetworkId: 0,
});

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
persistObservable(tokens$, {
  local: "tokens", // Unique name
});
persistObservable(coinUi$, {
  local: "coinUi", // Unique name
});

const isTxLoading$ = observable(false);

export {
  addresses$,
  logs$,
  networks$,
  transactions$,
  tokens$,
  coinUi$,
  isTxLoading$,
};
