import React from "react";

import { injected, walletconnect } from "./connectors";
import { useWeb3React } from "@web3-react/core";
import metamaskLogo from "./metamask.svg";
import walletconnectLogo from "./walletconnect.svg";
import styled from "styled-components";

const ConnectionOverlay = ({ closeOverlay, connectorInfo }) => {
  const { activate } = useWeb3React();

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
      </Card>
    </Background>
  );
};

const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 998;
  background-color: white;
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
  width: 30%;
  background-color: white;
  border: 2px solid skyblue;

  border-radius: 10px;
  z-index: 998;
  @media (max-width: 600px) {
    justify-content: center;
    align-items: center;
    width: 300px;
    right: 0px;
    margin-bottom: 20px;
  }
`;

const CloseButtonGroup = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`;

const CloseButton = styled.button`
  display: flex;
  justfiy-content: center;
  align-items: center;
  border-radius: 10px;
  font-family: roboto;
  border: 0;
  color: black;
  font-weight: 600;
  font-size: 18px;
  transition: 0.25s;
  padding: 10px;
  :hover {
    background-color: skyblue;
    cursor: pointer;
    color: black;
    transition: 0.25s;
  }
  @media (max-width: 600px) {
    width: 10%;
  }
`;

const ConnectButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 95%;
  gap: 10px;
  margin-top: 10px;
  @media (max-width: 600px) {
    flex-direction: column;
    justify-content: space-between;
  }
`;

const ConnectButton = styled.button`
  display: flex;
  justfiy-content: center;
  align-items: center;
  border-radius: 10px;
  font-family: roboto;
  border: 0;
  color: black;
  font-weight: 600;
  font-size: 18px;
  transition: 0.25s;
  padding: 10px;
  margin-bottom: 10px;
  :hover {
    background-color: skyblue;
    cursor: pointer;
    color: black;
    transition: 0.25s;
  }
  @media (max-width: 600px) {
    width: 70%;
  }
`;
const ConnectImage = styled.img`
  width: 45px;
  margin-bottom: 0px;
`;

const Text = styled.h3`
  font-family: Roboto;
`;

export default ConnectionOverlay;
