import { useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';

import MainPage from "./pages/MainPage";
import Adder from "./pages/Adder";
import Notorand from "./pages/Notorand";
import Repeater from "./pages/Repeater";
import Signal from "./pages/Signal";
import Torch from "./pages/Torch";
import Transmit from "./pages/Transmit";

import Profile from "./pages/Profile";

import './App.css';
import Footer from './components/Footer';

const App = () => {
  const divRef = useRef();
  const { pathname } = useLocation();

  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [pathname]);
  
  return (
    <AppWrapper>
      <Header />
      <MainWrapper>
        <Content>
          <div ref={divRef} style={{ transform: 'translateY(-100px)' }}></div>
          <Routes>
            <Route path='/' element={<MainPage />} />
            <Route path='/adder' element={<Adder />} />
            <Route path='/notorand' element={<Notorand />} />
            <Route path='/repeater' element={<Repeater />} />
            <Route path='/signal' element={<Signal />} />
            <Route path='/torch' element={<Torch />} />
            <Route path='/transmit' element={<Transmit />} />
            <Route path='/profile' element={<Profile />} />
          </Routes>
        </Content>
        <Footer />
      </MainWrapper>
    </AppWrapper>
  );
}

const AppWrapper = styled.div`
  font-family: "微軟正黑體", sans-serif;
  width: 100%;
  height: 100%;
`;

const MainWrapper = styled.div`
  width: 100%;
  height: 100%;

  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:before {
    content: '';
    background-image: url("./background.png");
    background-size: 500px;
    filter: opacity(0.2);

    width: 100%;
    height: 100%;

    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
  }
`;

const Content = styled.div`
  background-color: #FBFAB7;
  padding: 0 15px 100px 15px;
  width: 900px;
`;

export default App;