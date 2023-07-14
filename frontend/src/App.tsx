import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Routes from './components/Routes';

import CourseMap from './assets/json/utils/courseMap.json';

import "./styles/app.css";

const App = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [pathname]);

  const Next = (pathname !== '/' && CourseMap[pathname]) ? 
    <div className="next-page">{
      CourseMap[pathname].next.map((path, i) => <Link to={path} key={i}>{CourseMap[path].name + ' ‧>'}</Link>)
    }</div> : 
    <></>;

  return (
    <div className="app">
      <Sidebar />
      <div className="main-wrapper">
        <div className="content">
          <div ref={divRef} style={{ transform: 'translateY(-100px)' }}></div>
          <Routes />
          {Next}
        </div>
        <Footer />
      </div>
    </div>
  );
}
export default App;