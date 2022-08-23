import React, { useState, useEffect } from "react";
import ConnectionOverlay from "./connection/ConnectionOverlay";
import { useWeb3React } from "@web3-react/core";
import styled from "styled-components";
import { ethers } from "ethers";
import contractabi from "./contract/contract_abi.json";
import bnblogo from "../media/images/bnb_logo.png";
import tokenlogo from "../media/images/token.png";
import hklogo from "../media/images/hk.png";
import forwardarrow from "../media/images/fwdarw.png";
import link_outwardarrow from "../media/images/link_outwardarrow.png";
import introvid from "../media/videos/introduction_video.mp4";

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
  const [errorMessage, setErrorMessage] = useState(
    "Please connect your wallet!"
  );
  const [tokenAmount, setTokenAmount] = useState(0);

  const { account, chainId } = useWeb3React();

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
      setErrorMessage("");
    } else if (connector === "walletconnect") {
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      let signer = provider.getSigner();
      setSigner(signer);

      let contract = new ethers.Contract(contractAddress, contractabi, signer);
      setContract(contract);
      setErrorMessage("");
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

  useEffect(() => {
    let tokenAmount = parseFloat(cost) / tokenPrice;

    if (isNaN(tokenAmount) === true) {
      setTokenAmount(0);
    } else if (tokenAmount < 0) {
      setTokenAmount(0);
    } else if (tokenAmount >= 500000) {
      setTokenAmount(500000);
    } else {
      setTokenAmount(tokenAmount.toFixed(0));
    }
  }, [cost]);

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
      } else if (cost > 40) {
        setErrorMessage("You can't more than 40 BNB!");
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
        <VideoContainer>
          <StyledVideo
            source
            src={introvid}
            playsInline
            loop
            muted
            autoPlay
            preload
          ></StyledVideo>
        </VideoContainer>
        <StyledConnectionCard>
          <WelcomeContainer>
            <StyledTokenImage
              src={tokenlogo}
              alt="token logo"
            ></StyledTokenImage>
            <StyledWelcomeTextContainer>
              <StyledWelcomeText>HONGKONG TOKEN PRESALE!</StyledWelcomeText>
              <StyledWelcomeText>1 HK Token = 0.00008 BNB!</StyledWelcomeText>
            </StyledWelcomeTextContainer>
          </WelcomeContainer>
          <ContractAddressContainer>
            <ContractAddress
              href="https://bscscan.com/token/0x57534804b9485209a2fc55698a0f2112ae389342"
              target="_blank"
            >
              Token Contract Address
              <ContractLinkIcon src={link_outwardarrow} alt="outlink" />
            </ContractAddress>
            <ContractAddress
              href="https://bscscan.com/address/0x9420203009BEDC686843248268A66D01208228EE"
              target="_blank"
            >
              Presale Contract Address
              <ContractLinkIcon src={link_outwardarrow} alt="outlink" />
            </ContractAddress>
          </ContractAddressContainer>
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
              <StyledSwapIcon src={forwardarrow} alt="bnb logo" />
              <StyledImage src={hklogo} alt="hk logo" />
            </ImageBox>
            <StyledTokenCounter>{tokenAmount} HK Token </StyledTokenCounter>
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
        <VideoContainer>
          <StyledVideo
            source
            src={introvid}
            playsInline
            loop
            muted
            autoPlay
            preload
          ></StyledVideo>
        </VideoContainer>
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
  flex-direction: row;
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
    background-color: #23beff;
    cursor: pointer;
    color: white;
  }
`;

const StyledText = styled.h3`
  color: white;
  font-size: 20px;
`;

const StyledConnectionCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
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
  box-shadow: gray 0px 50px 100px -20px, gray 0px 30px 60px -30px;
  @media (min-width: 1400px) {
    margin-top: -1000px;
  }
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
  margin-bottom: 20px;
  border: 8px solid #23beff;
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
  border: 5px solid #23beff;
  border-radius: 30px;
`;

const StyledSwapIcon = styled.img`
  width: 30px;
  border-radius: 30px;
  margin-right: 10px;
  margin-left: 10px;
`;

const StyledTokenImage = styled.img`
  width: 100px;
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

const StyledTokenCounter = styled.h3`
  display: flex;
  justify-content: flex-start;
  margin-left: 10px;
  color: white;
  font-size: 13px;
  width: 100%;
`;

const StyledWelcomeTextContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const StyledWelcomeText = styled.h3`
  color: white;
  margin-bottom: 5px;
  margin-top: 0px;
`;

const ContractAddressContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
`;

const ContractAddress = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  text-decoration: none;
  font-family: Roboto;
  font-weight: 600;
  font-size: 15px;
  color: white;
  padding: 5px;
  border: 1px solid gray;
  border-radius: 10px;
  margin-bottom: 10px;

  :hover {
    border: 1px solid black;
    border-radius: 10px;
    background-color: #23beff;
  }
`;

const ContractLinkIcon = styled.img`
  margin-left: 5px;
  width: 17px;
`;

const VideoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100px;
  margin-top: -770px;
  color: white;
  @media (min-width: 1400px) {
    margin-top: -970px;
  }

`;

const StyledVideo = styled.video`
  width: 95%;
  border: 8px solid #23beff;
  border-radius: 10px;
`;

export default ConnectionCard;
