import React from "react";

import { injected, walletconnect } from "./connectors";
import { useWeb3React } from "@web3-react/core";
import metamaskLogo from "./metamask.svg";
import walletconnectLogo from "./walletconnect.svg";
import styled from "styled-components";

const ConnectionOverlay = ({ closeOverlay, connectorInfo }) => {
  const { active, account, activate } = useWeb3React();

  const connectMetamask = async () => {
    try {
      await activate(injected);
      connectorInfo("metamask");
    } catch (e) {
      console.log(e);
    }
  };

  const connectWalletConnect = async () => {
    try {
      await activate(walletconnect);
      connectorInfo("walletconnect");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Background onClick={() => closeOverlay(false)}>
      <Card>
        <CloseButtonGroup>
          <CloseButton onClick={() => closeOverlay(false)}>x</CloseButton>
        </CloseButtonGroup>
        <ConnectButtonGroup>
          <ConnectButton onClick={connectMetamask}>
            <ConnectImage src={metamaskLogo} alt="blablaa"></ConnectImage>
            Connect Metamask
          </ConnectButton>
          <ConnectButton onClick={connectWalletConnect}>
            <ConnectImage src={walletconnectLogo} alt="blablaa"></ConnectImage>
            Connect Walletconnect
          </ConnectButton>
        </ConnectButtonGroup>
        {active ? (
          <Text>Connected with {account}</Text>
        ) : (
          <h3>Not connected</h3>
        )}
      </Card>
    </Background>
  );
};

const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 998;
  background-color: #f0f8ff;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  z-index: 999;
`;

const Card = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 50%;
  background-color: gray;
  border-radius: 10px;
  z-index: 998;
`;

const CloseButtonGroup = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`;

const CloseButton = styled.button`
  display: flex;
  margin-right: 10px;
  margin-top: 10px;
  margin-bottom: 30px;
`;

const ConnectButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
`;

const ConnectButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40%;
  height: 100px;
`;
const ConnectImage = styled.img`
  width: 45px;
  margin-bottom: 10px;
`;

const Text = styled.h3`
  font-family: Roboto;
`;

export default ConnectionOverlay;
