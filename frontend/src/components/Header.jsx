import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useState } from 'react';
import styled from 'styled-components';
import Button from './Button';
import Dropdown from './Dropdown';
import Sidebar from './Sidebar';
import './css/Header.css'
import { useHook } from '../hooks/useHook';

const HeaderWrapper = styled.div`
  background-color: rgb(245, 213, 37);
  height: 80px;
  position: relative;
  z-index: 2011;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const SidebarWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
`;

const Header = ({ setOpenModal }) => {
  const [collapsed, setCollapsed] = useState(true);
  const { setPageNum } = useHook();

  return (
    <>
      <HeaderWrapper>
        <div id='header-left'>
          <Button
            onClick={() => setCollapsed(!collapsed)}
            id="sidebar-button"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
          <div id="wordmark" onClick={() => setPageNum(1)}><img src={require("./data/img/header/wordmark.png")} alt="Wordmark"/></div>
        </div>
        <div id='header-right'>
          <Dropdown
            setPageToInfo={() => setPageNum(0)}
            setOpenModal={setOpenModal}
          />
        </div>
      </HeaderWrapper>
      <SidebarWrapper>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </SidebarWrapper>
    </>
  );
}

export default Header;