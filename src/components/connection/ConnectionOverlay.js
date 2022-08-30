import React from "react";

import metamaskLogo from "./metamask.svg";
import walletconnectLogo from "./walletconnect.svg";
import styled from "styled-components";

const ConnectionOverlay = ({ closeOverlay, connectorInfo }) => {
  const connectMetamask = async () => {
    try {
      connectorInfo("metamask");
    } catch (e) {
      console.log(e);
    }
  };

  const connectWalletConnect = async () => {
    try {
      connectorInfo("walletconnect");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Background onClick={() => closeOverlay(false)} />
      <ConnectionCard>
        <CloseButtonGroup>
          <CloseButton onClick={() => closeOverlay(false)}>x</CloseButton>
        </CloseButtonGroup>
        <ConnectButtonGroup>
          <ConnectButton onClick={connectMetamask}>
            <ConnectImage src={metamaskLogo} alt="blablaa" />
            CONNECT METAMASK
          </ConnectButton>
          <ConnectButton onClick={connectWalletConnect}>
            <ConnectImage src={walletconnectLogo} alt="blablaa"></ConnectImage>
            CONNECT WALLETCONNECT
          </ConnectButton>
        </ConnectButtonGroup>
      </ConnectionCard>
    </>
  );
};

const Background = styled.div`
  position: absolute;
  top: 0px;
  width: 100%;
  height: 100%;
  background-color: gray;
  opacity: 0.6;
  z-index: 998;
`;

const ConnectionCard = styled.div`
  position: absolute;
  width: 35%;
  height: 30%;
  z-index: 999;
  top: 35%;
  left: 35%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: black;
  border: 8px solid;
  border-image: linear-gradient(
      90deg,
      rgba(230, 0, 252, 1) 0%,
      rgba(84, 4, 226, 1) 100%
    )
    1;
  @media (max-width: 830px) {
    width: 80%;
    left: 8%;
    height: 35%;
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
  color: white;
  background-color: #e101f5;
  font-weight: 600;
  font-size: 18px;
  transition: 0.25s;
  margin-right: 25px;
  margin-top: -20px;
  :hover {
    background-color: white;
    color: #e101f5;
    cursor: pointer;
    transition: 0.25s;
  }
  @media (max-width: 865px) {
    margin-right: 15px;
  }
`;

const ConnectButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
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
  width: 60%;
  background-color: #e101f5;
  border-radius: 10px;
  font-family: roboto;
  border: 0;
  color: white;
  font-weight: 600;
  font-size: 16px;
  transition: 0.25s;
  padding: 10px;
  margin-bottom: 10px;
  text-align: center;
  :hover {
    background-color: white;
    cursor: pointer;
    color: #e101f5;
    transition: 0.25s;
  }
  @media (max-width: 1150px) {
    width: 80%;
  }
`;
const ConnectImage = styled.img`
  display: flex;
  justfiy-content: center;
  align-items: center;
  width: 45px;
  margin-bottom: 0px;
  margin-right: 15px;
  margin-left: 5px;
`;

export default ConnectionOverlay;
