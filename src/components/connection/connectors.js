import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export const injected = new InjectedConnector({
  supportedChainIds: [1, 2, 3, 56, 97, 288, 250, 8217],
});

export const walletconnect = new WalletConnectConnector({
  rpcUrl: `https://bsc-dataseed.binance.org/`,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});
