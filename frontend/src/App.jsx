import Canvas from './components/Canvas';
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Page from './components/Page'
import './components/css/App.css';
import React, { useState } from 'react';

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const [pageNum, setPageNum] = useState(1);

  return (
    <div className="app">
      <Header collapsed={collapsed} toggleCollapsed={toggleCollapsed}/>
      <div id='main-wrap'>
        <Sidebar collapsed={collapsed} setPageNum={setPageNum}/>
        <Page pageNum={pageNum}/>
      </div>
    </div>
  );
}

export default App;