import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Routes from './components/Routes';

import CourseMap from './assets/json/utils/courseMap.json';


const App = () => {
  const divRef = useRef();
  const { pathname } = useLocation();

  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [pathname]);

  const Next = (pathname !== '/' && CourseMap[pathname]) ? 
    <NextPage>{
      CourseMap[pathname].next.map((path, i) => <Link to={path} key={i}>{CourseMap[path].name + ' ‧>'}</Link>)
    }</NextPage> : 
    <></>;

  return (
    <AppWrapper>
      <Sidebar />
      <MainWrapper>
        <Content>
          <div ref={divRef} style={{ transform: 'translateY(-100px)' }}></div>
          <Routes />
          {Next}
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
  background-color: #EEEEEE;

  left: 80px;
  width: calc(100% - 80px);
  height: 100%;

  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  background-color: white;
  padding: 0 15px 100px 15px;
  width: 60%;

  display: flex;
  flex-direction: column;
`;

const NextPage = styled.div`
  margin: 20px;
  align-self: flex-end;
`;

export default App;