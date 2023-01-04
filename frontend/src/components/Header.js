import React from 'react';
import {
  MenuFoldOutlined, MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import Dropdown from './Dropdown';
import './css/Header.css'

const Header = ({
    haveLoggedIn, 
    setHaveLoggedIn, 
    collapsed, 
    toggleCollapsed, 
    toHomepage, 
    setPageToInfo,
    setOpenModal}) => 
{
    return (
        <header>
            <div id='header-left'>
                <Button
                    onClick={toggleCollapsed}
                    id="sidebar-button"
                >
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </Button>
                <div id="wordmark" onClick={toHomepage}><img src={require("./data/img/header/wordmark.png")} alt="Wordmark"/></div>
            </div>
            <div id='header-right'>
                <Dropdown 
                    setPageToInfo={setPageToInfo}
                    haveLoggedIn={haveLoggedIn}
                    setHaveLoggedIn={setHaveLoggedIn}
                    setOpenModal={setOpenModal}
                />
            </div>
        </header>
    );
}

export default Header;

/*
import React from 'react';
import './index.css';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
const items = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
        1st menu item
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        2nd menu item (disabled)
      </a>
    ),
    icon: <SmileOutlined />,
    disabled: true,
  },
  {
    key: '3',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
        3rd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: '4',
    danger: true,
    label: 'a danger item',
  },
];
const App = () => (
  <Dropdown
    menu={{
      items,
    }}
  >
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        Hover me
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
);
export default App;
 */