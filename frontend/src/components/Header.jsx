import { useState } from 'react';
import styled from 'styled-components';
import Button from './Button';
import Dropdown from './Dropdown';
import Sidebar from './Sidebar';
import { useHook } from '../hooks/useHook';

const Header = ({ setOpenModal }) => {
  const [collapsed, setCollapsed] = useState(true);
  const { setPageNum } = useHook();

  return (
    <>
      <HeaderWrapper>
        <LeftHeaderWrapper>
          <Button onClick={() => setCollapsed(!collapsed)} id="sidebar-button">
            {collapsed ? '^' : 'v'}
          </Button>
          <StyledWordmark src={require("./data/img/header/wordmark.png")} alt="Wordmark" onClick={() => setPageNum(1)} />
        </LeftHeaderWrapper>
        <RightHeaderWrapper>
          <Dropdown setPageToInfo={() => setPageNum(0)} setOpenModal={setOpenModal} />
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
  z-index: 2011;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftHeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
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

export default Header;