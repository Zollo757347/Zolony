import React from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import './css/Sidebar.css'

const Sidebar = ({collapsed, setPageNum}) => {
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const items = [
    getItem('A 首頁', '1'),
    getItem('B 一切的開端．訊號', '2'),
    getItem('C 明與暗的旅程．訊號傳遞', '3'),
    getItem('D 強棒接力．紅石中繼器', '4'),
    getItem('E 顛倒是非．紅石火把', '5'),
    getItem('邏輯電路', 'sub', <AppstoreOutlined />, [
      getItem('F 邏輯閘．非或與', '6'),
      getItem('G 計算機的第一步．加法器', '7')
    ])
  ];

  function handleSelect({ key }) {
    setPageNum(key);
  }
  
  return (
    <div className="sidebar">
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="vertical"
        theme="light"
        inlineCollapsed={collapsed}
        items={items}
        onSelect={handleSelect}
      />
    </div>
  );
}

export default Sidebar;