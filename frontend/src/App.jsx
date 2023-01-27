import { useState } from 'react';
import styled from 'styled-components';
import Header from './components/Header';
import Modal from './components/Modal';
import Page from './containers/Page';

const App = () => {
  const [openModal, setOpenModal] = useState(0);
  
  return (
    <AppWrapper>
      <Header setOpenModal={setOpenModal} />
      <MainWrapper>
        <Page setOpenModal={setOpenModal} />
      </MainWrapper>
      <Modal open={openModal} setOpen={setOpenModal} />
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
  justify-content: center;

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

export default App;