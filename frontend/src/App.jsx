import React, { useState } from 'react';
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Page from './components/Page'
import Modal from './components/Modal'
import './components/css/App.css';

const App = () => {
  const [haveLoggedIn, setHaveLoggedIn] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [openModal, setOpenModal] = useState(0);
  
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const homepageClick = () => {
    setPageNum(1);
  }

  return (
    <div className="app">
      <Header 
        haveLoggedIn={haveLoggedIn}
        setOpenModal={setOpenModal}
        collapsed={collapsed}
        toggleCollapsed={toggleCollapsed}
        homepageClick={homepageClick}
      />
      <div id='main-wrap'>
        <Sidebar collapsed={collapsed} setPageNum={setPageNum}/>
        <Page pageNum={pageNum}/>
      </div>
      <Modal open={openModal} setOpen={setOpenModal}/>
    </div>
  );
}

export default App;