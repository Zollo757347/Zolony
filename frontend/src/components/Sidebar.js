import React from 'react';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
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
    getItem('Zolony', '1'),
    getItem('Signal', '2'),
    getItem('Transmit', '3'),
    getItem('Repeater', '4'),
    getItem('Navigation Two', 'sub', <AppstoreOutlined />, [
        getItem('Option 5', '5'),
        getItem('Option 6', '6'),
    ]),
  ];

  function handleSelect({ key }) {
    setPageNum(key);
  }
  
  return (
    <div className="sidebar">
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="light"
        inlineCollapsed={collapsed}
        items={items}
        onSelect={handleSelect}
      />
    </div>
  );
}

export default Sidebar;