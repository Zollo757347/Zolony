import React, { useState } from 'react';
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Page from './components/Page'
import SignModal from './components/SignModal'
import './components/css/App.css';

const App = () => {
  const [haveLoggedIn, setHaveLoggedIn] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [openModal, setOpenModal] = useState(0);
  
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const toHomepage = () => {
    setPageNum(1);
  }

  const setPageToInfo = () => {
    setPageNum(0);
  }

  return (
    <div className="app">
      <Header 
        haveLoggedIn={haveLoggedIn}
        setHaveLoggedIn={setHaveLoggedIn}
        setOpenModal={setOpenModal}
        collapsed={collapsed}
        toggleCollapsed={toggleCollapsed}
        toHomepage={toHomepage}
        setPageToInfo={setPageToInfo}
      />
      <div id='main-wrap'>
        <Sidebar collapsed={collapsed} setPageNum={setPageNum}/>
        <Page pageNum={pageNum} haveLoggedIn={haveLoggedIn}/>
      </div>
      <SignModal open={openModal} setOpen={setOpenModal} setHaveLoggedIn={setHaveLoggedIn}/>
    </div>
  );
}

export default App;