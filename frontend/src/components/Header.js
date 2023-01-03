import React from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';

const Header = ({collapsed, toggleCollapsed}) => {
    return (
        <header>
            <Button
                onClick={toggleCollapsed}
                id="sidebar-button"
            >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
            <div id="wordmark"><img src={require("./data/img/header/wordmark.png")} alt="Wordmark"/></div>
        </header>
    );
}

export default Header;