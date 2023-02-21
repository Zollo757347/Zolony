import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import Header from './components/Header';
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
      <Header />
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
  width: 100%;
  height: 100%;

  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:before {
    content: '';
    background-image: url("/background.png");
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

const Content = styled.div`
  background-color: #FBFAB7;
  padding: 0 15px 100px 15px;
  width: 900px;

  display: flex;
  flex-direction: column;
`;

const NextPage = styled.div`
  margin: 20px;
  align-self: flex-end;
`;

export default App;