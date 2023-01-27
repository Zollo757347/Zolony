import { useState } from 'react';
import Header from './components/Header';
import Page from './containers/Page';
import Modal from './components/Modal';
import './components/css/App.css';

const App = () => {
  const [openModal, setOpenModal] = useState(0);
  
  return (
    <div className="app">
      <Header setOpenModal={setOpenModal} />
      <div className='main-wrap'>
        <Page setOpenModal={setOpenModal} />
      </div>
      <Modal open={openModal} setOpen={setOpenModal} />
    </div>
  );
}

export default App;