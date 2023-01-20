import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Dropdown from './Dropdown';
import './css/Header.css'
import { useHook } from '../hooks/useHook';

const Header = ({ collapsed, toggleCollapsed, setOpenModal }) => {
  const { setPageNum } = useHook();
  return (
    <header>
      <div id='header-left'>
        <Button
          onClick={toggleCollapsed}
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
    </header>
  );
}

export default Header;