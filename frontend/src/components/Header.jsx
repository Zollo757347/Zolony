import { useState } from 'react';
import styled from 'styled-components';
import Dropdown from './Dropdown';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';

const Header = ({ setOpenModal }) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <>
      <HeaderWrapper>
        <LeftHeaderWrapper>
          <SidbarImg collapsed={collapsed} onClick={() => setCollapsed(!collapsed)} src={require("../assets/header/sidebar.png")} alt="sidbar" />
          <Link to='/'>
            <StyledWordmark src={require("../assets/header/wordmark.png")} alt="Wordmark" />
          </Link>
        </LeftHeaderWrapper>
        <RightHeaderWrapper>
          <Dropdown setOpenModal={setOpenModal} />
        </RightHeaderWrapper>
      </HeaderWrapper>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
    </>
  );
}

const HeaderWrapper = styled.div`
  background-color: rgb(245, 213, 37);
  height: 80px;
  position: sticky;
  top: 0;
  z-index: 20110;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftHeaderWrapper = styled.div`
  margin-left: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const RightHeaderWrapper = styled.div`
  margin-right: 20px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const StyledWordmark = styled.img`
  height: 70px;
  margin-left: 15px;

  &:hover {
    cursor: pointer;
  }
`;

const SidbarImg = styled.img`
  width: 35px;
  height: 35px;

  ${props => !props.collapsed ? "transform: rotate(180deg);" : ""};
  transition: transform 0.3s;

  &:hover {
    cursor: pointer;
  }
`;

export default Header;