import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Routes from './components/Routes';

import "./styles/app.css";

const App = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [pathname]);

  return (
    <div className="app">
      <Sidebar />
      <div className="main-wrapper">
        <div className="content">
          <div ref={divRef} style={{ transform: 'translateY(-100px)' }}></div>
          <Routes />
        </div>
        <Footer />
      </div>
    </div>
  );
}
export default App;