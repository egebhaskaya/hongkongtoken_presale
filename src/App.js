import React from "react";
import ConnectionCard from "./components/ConnectionCard";
import styled from "styled-components";
import backgroundVideo from "./styles/slider.mp4";

const BackgroundContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const BackgroundVideo = styled.video`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

function App() {
  return (
    <>
      <BackgroundContainer>
        <BackgroundVideo
          source
          src={backgroundVideo}
          playsInline
          loop
          muted
          autoPlay
          preload
        ></BackgroundVideo>
      </BackgroundContainer>
      <ConnectionCard />
    </>
  );
}

export default App;
