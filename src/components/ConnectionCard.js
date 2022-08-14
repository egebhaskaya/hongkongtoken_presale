import React, { useState, useEffect } from "react";
import ConnectionOverlay from "./connection/ConnectionOverlay";
import { useWeb3React } from "@web3-react/core";
import styled from "styled-components";
import { ethers } from "ethers";
import contractabi from "./contract/contract_abi.json";

const ConnectionCard = () => {
  const [showModal, setShowModal] = useState(false);
  const [connector, setConnector] = useState("");
  const [networkID, setNetworkId] = useState();
  const [message, setMessage] = useState();
  const [contract, setContract] = useState(null);
  const [contractBalance, setContractBalance] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [cost, setCost] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const { account, deactivate, chainId } = useWeb3React();

  const contractAddress = "0x9420203009BEDC686843248268A66D01208228EE";
  const tokenPrice = 0.00008;

  useEffect(() => {
    if (connector === "metamask") {
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      let signer = provider.getSigner();
      setSigner(signer);

      let contract = new ethers.Contract(contractAddress, contractabi, signer);
      setContract(contract);
    } else if (connector === "walletconnect") {
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      let signer = provider.getSigner();
      setSigner(signer);

      let contract = new ethers.Contract(contractAddress, contractabi, signer);
      setContract(contract);
    }
  }, [account, connector]);

  useEffect(() => {
    let timer = setInterval(() => getChainId(), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  useEffect(() => {
    if (chainId === 56) {
      setMessage("BSC Mainnet");
    } else if (chainId === undefined) {
      setMessage("Please connect with your wallet!");
    } else if (chainId !== 97) {
      setMessage("Please connect to BSC Mainnet!");
    } else {
      setMessage("Connected");
    }
  }, [chainId]);

  useEffect(() => {
    let timer = setInterval(() => getContractBalance(), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  });
  useEffect(() => {
    let timer = setInterval(() => getUserBalance(account), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  const getChainId = () => {
    setNetworkId(chainId);
  };

  const getContractBalance = async () => {
    const contractBalance = await contract.balanceOf(
      "0x9420203009BEDC686843248268A66D01208228EE"
    );
    setContractBalance(ethers.utils.formatEther(contractBalance));
  };

  const getUserBalance = (address) => {
    window.ethereum
      .request({ method: "eth_getBalance", params: [address, "latest"] })
      .then((balance) => {
        setUserBalance(ethers.utils.formatEther(balance));
      });
  };

  console.log(cost);

  const buyTokens = async () => {
    try {
      if (userBalance > cost) {
        setErrorMessage("Balance Insufficient");
      } else if (cost < 0.2) {
        setErrorMessage("You must at least but 0.2 BNB!");
      } else if (cost > 4) {
        setErrorMessage("You can't more than 4 BNB!");
      } else {
        setErrorMessage("");
        await contract.buyTokens({ value: (cost * 10 ** 18).toString() });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Container>
        <ConnectContainer>
          <ConnectButtonsContainer>
            <StyledText>{message}</StyledText>
            <StyledConnectButton onClick={() => setShowModal(true)}>
              Connect!
            </StyledConnectButton>
          </ConnectButtonsContainer>
        </ConnectContainer>
        <StyledConnectionCard>
          <StyledConnectionTextContainer>
            <h3>Hongkong Token Presale!</h3>
            <h3>Contract Balance: {contractBalance}</h3>
            <h3>
              Wallet Address:
              {account !== undefined ? account.substring(0, 8) : ""}
              ...
            </h3>
            <h3>User Balance: {userBalance} BNB</h3>
            <TokenBuyBox>
              <StyledInput
                placeholder="BNB"
                type="number"
                value={cost}
                onChange={(event) => setCost(event.target.value)}
              ></StyledInput>
              <StyledBuyButton onClick={buyTokens}>Buy Token!</StyledBuyButton>
              <h3>{errorMessage}</h3>
            </TokenBuyBox>
          </StyledConnectionTextContainer>
        </StyledConnectionCard>
      </Container>
      {showModal && (
        <ConnectionOverlay
          closeOverlay={setShowModal}
          connectorInfo={setConnector}
        />
      )}
    </>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

const ConnectContainer = styled.div`
  position: absolute;
  right: 30px;
  top: 30px;
  padding: 20px;
  border-radius: 20px;
  background-color: white;
  border: 2px solid skyblue;
`;

const ConnectButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  align-items: center;
  gap: 20px;
`;

const StyledConnectButton = styled.button`
  height: 40px;
  width: 100px;
  border-radius: 10px;
  font-family: roboto;
  border: 0;
  color: black;
  font-weight: 600;
  font-size: 18px;
  :hover {
    background-color: skyblue;
    cursor: pointer;
    color: black;
    width: 120px;
    height: 50px;
    transition: 0.25s;
  }
`;

const StyledText = styled.h3`
  color: black;
`;

const StyledConnectionCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 300px;
  border-radius: 20px;
  background-color: white;
  padding: 20px;
  border: 2px solid skyblue;
  margin-top: 150px;
`;

const StyledConnectionTextContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: space-between;
  flex-direction: column;
  width: 100%;
`;

const TokenBuyBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const StyledInput = styled.input`
  width: 95%;
  height: 30px;
  outline: none;
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const StyledBuyButton = styled.button`
  height: 60px;
  width: 100px;
  border-radius: 10px;
  font-family: roboto;
  border: 0;
  color: black;
  font-weight: 600;
  font-size: 18px;
  transition: 0.25s;
  :hover {
    background-color: skyblue;
    cursor: pointer;
    color: black;
    width: 300px;
    height: 50px;
    transition: 0.25s;
  }
`;

export default ConnectionCard;
