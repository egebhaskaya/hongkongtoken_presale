import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Web3 from "web3";
import { Web3ReactProvider } from "@web3-react/core";
import GlobalStyle from "./styles/globalStyles";

function getLibrary(provider) {
  return new Web3(provider);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <GlobalStyle />
      <App />
    </Web3ReactProvider>
  </React.StrictMode>
);
