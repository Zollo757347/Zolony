import React, { useState } from 'react';
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Page from './containers/Page'
import Modal from './components/Modal'
import './components/css/App.css';

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openModal, setOpenModal] = useState(0);
  
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="app">
      <Header 
        setOpenModal={setOpenModal}
        collapsed={collapsed}
        toggleCollapsed={toggleCollapsed}
      />
      <div id='main-wrap'>
        <Sidebar collapsed={collapsed}/>
        <Page setOpenModal={setOpenModal}/>
      </div>
      <Modal open={openModal} setOpen={setOpenModal}/>
    </div>
  );
}

export default App;