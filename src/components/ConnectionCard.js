import React, { useState, useEffect } from "react";
import ConnectionOverlay from "./connection/ConnectionOverlay";
import { useWeb3React } from "@web3-react/core";
import styled from "styled-components";
import { ethers } from "ethers";
import contractabi from "./contract/contract_abi.json";
import bnblogo from "../styles/bnb_logo.png";
import tokenlogo from "../styles/token.png";
import hklogo from "../styles/hk.png";
import fwdarrow from "../styles/forward_arrow.svg";

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

  const buyTokens = async () => {
    try {
      if (userBalance < cost) {
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
          <WelcomeContainer>
            <StyledTokenImage
              src={tokenlogo}
              alt="token logo"
            ></StyledTokenImage>
            <StyledText>HONGKONG TOKEN PRESALE!</StyledText>
          </WelcomeContainer>
          <StyledConnectionTextContainer>
            <ContractBalanceTextContainer>
              <StyledText>Contract Balance: </StyledText>
              <StyledText>{contractBalance} HK</StyledText>
            </ContractBalanceTextContainer>
            <ContractBalanceTextContainer>
              <StyledText>Wallet Address:</StyledText>
              <StyledText>
                {account !== undefined ? account.substring(0, 8) : ""}
                ...
              </StyledText>
            </ContractBalanceTextContainer>
            <ContractBalanceTextContainer>
              <StyledText>User Balance:</StyledText>
              <StyledText>{userBalance} BNB</StyledText>
            </ContractBalanceTextContainer>
          </StyledConnectionTextContainer>
          <TokenBuyBox>
            <ImageBox>
              <StyledImage src={bnblogo} alt="bnb logo" />
              <StyledImage src={fwdarrow} alt="bnb logo" />
              <StyledImage src={hklogo} alt="hk logo" />
            </ImageBox>
            <StyledInput
              placeholder="0.00 BNB"
              type="number"
              value={cost}
              onChange={(event) => setCost(event.target.value)}
            ></StyledInput>
            <StyledBuyButton
              onClick={buyTokens}
              disabled={account === undefined ? true : false}
            >
              Buy Token!
            </StyledBuyButton>
            <StyledText>{errorMessage}</StyledText>
          </TokenBuyBox>
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
  border-radius: 10px;
  background-color: black;
  border: 8px solid #23beff;
  @media (max-width: 600px) {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 300px;
    right: 0px;
    margin-bottom: 20px;
  }
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
  color: white;
  font-size: 20px;
`;

const StyledConnectionCard = styled.div`
  position: absolute;
  margin-top: -700px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 500px;
  border-radius: 10px;
  background-color: black;
  padding: 20px;
  border: 8px solid #23beff;
`;

const WelcomeContainer = styled.div`
  margin-top: -20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledConnectionTextContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: space-between;
  flex-direction: column;
  width: 95%;
  border: 8px solid #23beff;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 20px;
`;

const ContractBalanceTextContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const TokenBuyBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 95%;
  border: 8px solid #23beff;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 0px;
`;
const ImageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 95%;
  height: 40px;
  margin-top: 20px;
  margin-bottom: 20px;
  border: 2px solid skyblue;
  border-radius: 10px;
  font-familiy: roboto;
  font-size: 20px;
  text-align: center;
  outline: none;
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const StyledImage = styled.img`
  width: 30px;
`;

const StyledTokenImage = styled.img`
  width: 150px;
`;

const StyledBuyButton = styled.button`
  height: 50px;
  width: 97%;
  border-radius: 10px;
  font-family: roboto;
  border: 0;
  color: black;
  font-weight: 600;
  font-size: 18px;
  transition: 0.25s;
  :hover {
    background-color: #23beff;
    cursor: pointer;
    color: black;
    height: 50px;
    transition: 0.25s;
  }
  :disabled {
    background-color: gray;
    color: white;
    cursor: auto;
  }
`;

export default ConnectionCard;
