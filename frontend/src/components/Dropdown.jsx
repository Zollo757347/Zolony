import { DownOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Space } from 'antd';
import './css/Dropdown.css';
import { useHook } from '../hooks/useHook';

const Dropdown_Components = ({ setOpenModal }) => {
  const { loggedIn, logout, avatar, setPageNum } = useHook();
  
  const onClick = ({ key }) => {
    switch(key) {
      case '1': 
        setPageNum(0);
        break;
      case '2': 
        setOpenModal(1);
        break;
      case '3': 
        setOpenModal(2);
        break;
      case '4': 
        logout();
        break;
      default:
        break;
    }
  };
  
  const items = [{
    key: '1',
    label: '個人資料',
    disabled: (!loggedIn)
  }, {
    key: '2',
    label: '登入',
    disabled: (loggedIn)
  }, {
    key: '3',
    label: '註冊',
    disabled: (loggedIn)
  }, {
    key: '4',
    danger: true,
    label: '登出',
    disabled: (!loggedIn)
  }];

  return(
    <Dropdown
      menu={{ items, onClick }}
      trigger={['click']}
      id="dropdown"
    >
      <span onClick={e => e.preventDefault()}>
        <Space>
          {loggedIn ? <Avatar src={avatar}/> : <b>帳號</b>}
          <DownOutlined />
        </Space>
      </span>
    </Dropdown>
  )
}

export default Dropdown_Components;