import React, { useState, useEffect } from "react";
import ConnectionOverlay from "./connection/ConnectionOverlay";
import { useWeb3React } from "@web3-react/core";
import styled from "styled-components";
import { ethers } from "ethers";
import contractabi from "./contract/contract_abi.json";
import bgImage from "../media/images/background.jpg";
import bnblogo from "../media/images/bnb_logo.png";
import introvid from "../media/videos/introduction_video.mp4";
import hklogo from "../media/images/hk_logo.png";
import hklogo2 from "../media/images/hktoken_logo.png";
import outwardLinkIcon from "../media/images/link_outwardarrow.png";
import fwdarrw from "../media/images/fwdarw.png";
import hktoken from "../media/images/hktoken_logo2.png";
import twitterIcon from "../media/socialmedia/twitter-logo.png";
import instagramIcon from "../media/socialmedia/instagram-logo.png";
import discordIcon from "../media/socialmedia/discord-logo.png";
import telegramIcon from "../media/socialmedia/telegram-logo.png";

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
    "PLEASE CONNECT YOUR WALLET!"
  );
  const [tokenAmount, setTokenAmount] = useState(0);

  const { account, chainId } = useWeb3React();

  const contractAddress = "0x7b7C295adc4B27C58e0465AE0505CF33c1fD964C";
  const bscRpc = "https://bsc-dataseed1.binance.org/";
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
      let provider = new ethers.providers.JsonRpcProvider(bscRpc);
      setProvider(provider);

      let signer = provider.getSigner(account);
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
      setMessage("BSC MAINNET");
    } else if (chainId === undefined) {
      setMessage("PLEASE CONNECT WITH YOUR WALLET!");
    } else if (chainId !== 97) {
      setMessage("PLEASE CONNECT TO BSC MAINNET");
    } else {
      setMessage("CONNECTED!");
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
      "0x7b7C295adc4B27C58e0465AE0505CF33c1fD964C"
    );
    setContractBalance(ethers.utils.formatEther(contractBalance));
  };

  const getUserBalance = (address) => {
    if (connector === "metamask") {
      window.ethereum
        .request({ method: "eth_getBalance", params: [address, "latest"] })
        .then((balance) => {
          setUserBalance(ethers.utils.formatEther(balance));
        });
    } else if (connector === "walletconnect") {
      provider.getBalance(account).then((balance) => {
        setUserBalance(ethers.utils.formatEther(balance));
      });
    }
  };

  const buyTokens = async () => {
    try {
      // if (userBalance < cost) {
      //   setErrorMessage("BALANCE INSUFFICIENT");
      // } else if (cost < 0.2) {
      //   setErrorMessage("MIN BUY 0.2 BNB!");
      // } else if (cost > 40) {
      //   setErrorMessage("MAX BUY 40 BNB!");
      // } else {
      if (connector === "metamask") {
        setErrorMessage("");
        await contract.buyTokens({ value: (cost * 10 ** 18).toString() });
      } else if (connector === "walletconnect") {
        setErrorMessage("");
        await contract.buyTokens({ value: (cost * 10 ** 18).toString() });
      }
      // }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Container>
        <Background>
          <ConnectContainer>
            <HomeIcon>
              <a
                href="https://www.hongkongtoken.com/en"
                target="_blank"
                rel="noreferrer"
              >
                <HKLogo1 src={hklogo} alt="wfwef" />
              </a>
            </HomeIcon>
            <ConnectButtonsContainer>
              <StyledText>{message}</StyledText>
              <StyledConnectButton onClick={() => setShowModal(true)}>
                CONNECT
              </StyledConnectButton>
            </ConnectButtonsContainer>
          </ConnectContainer>
          <MainContainer>
            <ContentContainer>
              <VideoAndInfoContainer>
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
                <StyledInfo>
                  <StyledInfoTextContainer>
                    <InfoText>BUY TOKENS FROM PRESALE!</InfoText>
                    <InfoText2>MIN</InfoText2>
                    <InfoText>0.2 BNB (2500 HK TOKEN)</InfoText>
                    <InfoText2>MAX</InfoText2>
                    <InfoText>40 BNB (500000 HK TOKEN)</InfoText>
                  </StyledInfoTextContainer>
                </StyledInfo>
              </VideoAndInfoContainer>
              <StyledConnectionCard>
                <WelcomeContainer>
                  <StyledTokenImage
                    src={hklogo2}
                    alt="token logo"
                  ></StyledTokenImage>
                  <VerticalLine />
                  <StyledWelcomeTextContainer>
                    <StyledWelcomeText>PRESALE</StyledWelcomeText>
                  </StyledWelcomeTextContainer>
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
                    <StyledSwapIcon src={fwdarrw} alt="bnb logo" />
                    <StyledImage src={hktoken} alt="hk logo" />
                  </ImageBox>
                  <StyledTokenCounter>
                    {tokenAmount} HK Token{" "}
                  </StyledTokenCounter>
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
                    BUY TOKEN TEST
                  </StyledBuyButton>
                  <StyledText>{errorMessage}</StyledText>
                </TokenBuyBox>
              </StyledConnectionCard>
            </ContentContainer>
          </MainContainer>
          <Footer>
            <ContractInfo>
              <ContractAddressContainer>
                <StyledText>Contract Info</StyledText>
                <ContractAddress
                  href="https://bscscan.com/token/0x57534804b9485209a2fc55698a0f2112ae389342"
                  target="_blank"
                >
                  Token Contract Address
                  <ContractLinkIcon src={outwardLinkIcon} alt="outlink" />
                </ContractAddress>
                <ContractAddress
                  href="https://bscscan.com/address/0x7b7C295adc4B27C58e0465AE0505CF33c1fD964C"
                  target="_blank"
                >
                  Presale Contract Address
                  <ContractLinkIcon src={outwardLinkIcon} alt="outlink" />
                </ContractAddress>
              </ContractAddressContainer>
            </ContractInfo>
            <AboutInfo>
              <AboutLinkContainer>
                <FooterLink
                  href="https://twitter.com/HongkongToken?t=XmVdeUnRMKztX8odflZ2og&s=09"
                  target="_blank"
                >
                  <FooterIcon src={twitterIcon} />
                </FooterLink>
                <FooterLink
                  href="https://www.instagram.com/hongkongtoken/?igshid=YmMyMTA2M2Y%3D"
                  target="_blank"
                >
                  <FooterIcon src={instagramIcon} />
                </FooterLink>
                <FooterLink
                  href="https://discord.gg/b9GbjrVXVU"
                  target="_blank"
                >
                  <FooterIcon src={discordIcon} />
                </FooterLink>
                <FooterLink href="https://t.me/hongkongglobal" target="_blank">
                  <FooterIcon src={telegramIcon} />
                </FooterLink>
              </AboutLinkContainer>
              <AboutTextContainer></AboutTextContainer>
              <AboutText>© 2022 All Rights Reserved.</AboutText>
            </AboutInfo>
          </Footer>
        </Background>
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
  background-color: black;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  background-color: black;
  margin-top: 40px;
  padding-bottom: 20px;
  @media (max-width: 865px) {
    flex-direction: column;
  }
`;

const ContractInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AboutInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 10%;
  @media (max-width: 865px) {
    width: 40%;
    margin-top: 5%;
  }
`;

const AboutLinkContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const AboutTextContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const AboutText = styled.h3`
  color: white;
  font-size: 12px;
`;

const FooterLink = styled.a``;

const FooterIcon = styled.img`
  background-color: #e101f5;
  width: 20px;
  border-radius: 3px;
  :hover {
    background-color: lightgray;
  }
`;

const VerticalLine = styled.div`
  height: 50px;
  width: 1px;
  background-color: white;
  margin-right: 10px;
  margin-left: -20px;
`;

const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-image: url(${bgImage});
  width: 100%;
  height: 100%;
`;

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 85%;
  @media (max-width: 865px) {
    width: 100%;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: space-between;
  width: 100%;
  height: 100%;
  @media (max-width: 865px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const ConnectContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 85%;
  height: 150px;
  border-radius: 10px;
  @media (max-width: 865px) {
    flex-direction: column;
    margin-top: 10px;
    margin-bottom: 20px;
  }
`;

const HomeIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const StyledInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  border: 8px solid;
  border-image: linear-gradient(
      90deg,
      rgba(230, 0, 252, 1) 0%,
      rgba(84, 4, 226, 1) 100%
    )
    1;
  background-color: black;
`;

const StyledInfoTextContainer = styled.div`
  display: flex;
  justfiy-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
`;

const InfoText = styled.h3`
  color: white;
  font-size: 30px;
  margin: 0px;
  padding: 5px;
  @media (max-width: 1230px) {
    font-size: 20px;
  }
  @media (max-width: 865px) {
    font-size: 16px;
  }
`;

const InfoText2 = styled.h3`
  color: #e101f5;
  font-size: 30px;
  margin: 0px;
  padding: 10px;
  @media (max-width: 865px) {
    font-size: 20px;
  }
`;

const ConnectButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  align-items: center;
  gap: 20px;
  @media (max-width: 865px) {
    justify-content: center;
  }
`;

const HKLogo1 = styled.img`
  width: 90px;
  @media (max-width: 865px) {
    width: 75px;
  }
`;

const StyledConnectButton = styled.button`
  height: 50px;
  width: 120px;
  border-radius: 30px;
  font-family: roboto;
  border: 0;
  background-color: #e101f5;
  color: white;
  font-weight: 600;
  font-size: 18px;
  :hover {
    background-color: white;
    cursor: pointer;
    color: #e101f5;
  }
`;

const StyledText = styled.h3`
  color: white;
  font-size: 20px;
  margin-left: 3px;
  @media (max-width: 865px) {
    font-size: 16px;
  }
`;

const StyledConnectionCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 40%;
  height: 100%;
  background-color: black;
  padding: 20px;
  border: 8px solid;
  border-image: linear-gradient(
      90deg,
      rgba(230, 0, 252, 1) 0%,
      rgba(84, 4, 226, 1) 100%
    )
    1;

  @media (max-width: 865px) {
    width: 85%;
    margin-top: 20px;
    padding: 0px;
  }
`;

const WelcomeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -20px;
`;

const StyledConnectionTextContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 95%;
  background-color: #340c73;
  border-radius: 30px;
  padding: 10px;
  margin-bottom: 20px;
  @media (max-width: 865px) {
    width: 85%;
  }
`;

const ContractBalanceTextContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
`;

const TokenBuyBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 95%;
  background-color: #340c73;
  border-radius: 30px;
  padding: 10px;
  margin-bottom: 0px;
  @media (max-width: 865px) {
    margin-bottom: 20px;
    width: 85%;
  }
`;
const ImageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
`;

const StyledInput = styled.input`
  width: 70%;
  height: 50px;
  margin-bottom: 20px;
  border-radius: 25px;
  font-familiy: roboto;
  font-size: 23px;
  text-align: center;
  outline: none;
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const StyledImage = styled.img`
  width: 50px;
  border: 2px solid white;
  border-radius: 30px;
`;

const StyledSwapIcon = styled.img`
  width: 30px;
  border-radius: 30px;
  margin-right: 10px;
  margin-left: 10px;
`;

const StyledTokenImage = styled.img`
  width: 150px;
`;

const StyledBuyButton = styled.button`
  height: 50px;
  width: 30%;
  border-radius: 25px;
  background-color: #e101f5;
  font-weight: 600;
  font-family: roboto;
  border: 0;
  color: white;
  font-weight: 600;
  font-size: 18px;
  transition: 0.25s;
  :hover {
    background-color: white;
    cursor: pointer;
    color: #e101f5;
    height: 50px;
    transition: 0.25s;
  }
  :disabled {
    background-color: gray;
    color: white;
    cursor: auto;
  }
  @media (max-width: 865px) {
    width: 50%;
  }
`;

const StyledTokenCounter = styled.h3`
  display: flex;
  justify-content: center;
  align-items: center;
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
  color: #e101f5;
  font-size: 40px;
  font-family: Roboto;
  font-weight: 600;
  margin: 0px;
  @media (max-width: 865px) {
    font-size: 30px;
  }
`;

const ContractAddressContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
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
  border-radius: 10px;
  margin-bottom: 10px;
  background-color: #e101f5;

  :hover {
    border-radius: 10px;
    background-color: lightgray;
  }
`;

const ContractLinkIcon = styled.img`
  margin-left: 5px;
  width: 17px;
`;

const VideoAndInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 45%;
  @media (max-width: 1230px) {
    justify-content: space-around;
  }
  @media (max-width: 865px) {
    width: 85%;
    gap: 20px;
  }
`;

const VideoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border: 8px solid;
  border-image: linear-gradient(
      90deg,
      rgba(230, 0, 252, 1) 0%,
      rgba(84, 4, 226, 1) 100%
    )
    1;
`;

const StyledVideo = styled.video`
  width: 100%;
`;

export default ConnectionCard;
