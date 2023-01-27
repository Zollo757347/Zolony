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
  background-color: #FFFDE3;
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
`;

export default App;