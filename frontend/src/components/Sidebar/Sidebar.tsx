import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SidebarContent from './SidebarContent.tsx';

import "../../styles/sidebar.css";

const Header = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);

  function handleEnter() {
    if (sidebarRef.current) {
      sidebarRef.current.className = 'z-sidebar z-sidebar-opened';
    }
    setOpened(true);
  }

  function handleLeave() {
    if (sidebarRef.current) {
      sidebarRef.current.className = 'z-sidebar';
    }
    setOpened(false);
  }

  const sidebarItems = [
    { name: '紅石篇', path: null, childs: [
      { name: '一切的開端．訊號', path: '/redstone/signal' },
      { name: '明與暗的旅程．訊號傳遞', path: '/redstone/transmit' },
      { name: '強棒接力．紅石中繼器', path: '/redstone/repeater' },
      { name: '顛倒是非．紅石火把', path: '/redstone/torch'}
    ] }, 
    { name: '計概篇', path: null, childs: [
      { name: '邏輯閘．非或與', path: '/concepts/notorand' },
      { name: '計算機的第一步．加法器', path: '/redstone/adder' }
    ] }
  ];

  return (
    <>
      <div ref={sidebarRef} className='z-sidebar' onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
        <div className='z-sidebar-wordmark-wrapper'>
          <Link to='/' style={{ marginBottom: -4 }}>
            <img className='z-sidebar-wordmark' src={require("../../assets/pictures/sidebar/wordmark.png")} alt='zolony' />
          </Link>
        </div>
        {opened ? <SidebarContent content={sidebarItems} /> : <></>}
      </div>
    </>
  );
}
export default Header;