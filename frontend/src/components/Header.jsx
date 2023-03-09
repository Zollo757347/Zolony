import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Dropdown from './Dropdown';
import Sidebar from './Sidebar';
import { useHook } from '../hooks/useHook';
import Message from './Message';
import Modal from './Modal';

import deleteUserData from '../assets/json/modals/deleteUser.json';
import loginData from '../assets/json/modals/login.json';
import signinData from '../assets/json/modals/signin.json';

import createUserError from '../assets/json/errors/createUser.json';
import deleteUserError from '../assets/json/errors/deleteUser.json';
import loginError from '../assets/json/errors/login.json';

const Header = () => {
  const [sidebarCollapsed, _setSidebarCollapsed] = useState(true);
  const [dropdownCollapsed, _setDropdownCollapsed] = useState(true);
  const [modalCollapsed, _setModalCollapsed] = useState(true);
  const [modalData, setModalData] = useState({ action: '', title: '', items: [] });

  const { user, createUser, deleteUser, login, logout } = useHook();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  function setSidebarCollapsed(value) {
    _setSidebarCollapsed(value);
    _setDropdownCollapsed(true);
    _setModalCollapsed(true);
  }

  function setDropdownCollapsed(value) {
    _setSidebarCollapsed(true);
    _setDropdownCollapsed(value);
    _setModalCollapsed(true);
  }

  function setModalCollapsed(value) {
    _setSidebarCollapsed(true);
    _setDropdownCollapsed(true);
    _setModalCollapsed(value);
  }

  async function handleConfirm(data) {
    let error;

    switch (modalData.action) {
      case 'signin':
        if (data[1] !== data[2]) {
          Message.send({ content: createUserError.password, duration: 2000, type: 'error' });
        }
        else {
          ({ error } = await createUser(data[0], data[1]));
          if (!error) {
            Message.send({ content: "成功建立帳號！", duration: 2000, type: 'success' });
            navigate('/profile');
          }
          else if (error !== 'loading') {
            Message.send({ content: createUserError[error], duration: 2000, type: 'error' });
          }
        }
        break;

      case 'login':
        ({ error } = await login(data[0], data[1]));
        if (!error) {
          Message.send({ content: "登入成功！", duration: 2000, type: 'success' });
          navigate('/profile');
        }
        else if (error !== 'loading') {
          Message.send({ content: loginError[error], duration: 2000, type: 'error' });
        }
        break;

      case 'deleteUser':
        if (data[0] !== user.username) {
          Message.send({ content: deleteUserError.username, duration: 2000, type: 'error' });
        }
        else {
          ({ error } = await deleteUser(data[0], data[1]));
          if (!error) {
            Message.send({ content: "成功刪除帳號", duration: 2000, type: 'success' });
            if (pathname === '/profile') {
              navigate('/');
            }
          }
          else if (error !== 'loading') {
            Message.send({ content: loginError[error], duration: 2000, type: 'error' });
          }
        }
        break;

      default: break;
    }
  }

  const sidebarItems = [
    { name: '一切的開端．訊號', path: '/signal' },
    { name: '明與暗的旅程．訊號傳遞', path: '/transmit' },
    { name: '強棒接力．紅石中繼器', path: '/repeater' },
    { name: '顛倒是非．紅石火把', path: '/torch' },
    { name: '邏輯閘．非或與', path: 'notorand' },
    { name: '計算機的第一步．加法器', path: 'adder' }
  ];

  const dropdownItems = user.loggedIn ? [
    { name: '個人資料', path: '/profile', todo: () => {
      setSidebarCollapsed(true);
      navigate('/profile');
    } }, 
    { name: '登出', todo: () => {
      setSidebarCollapsed(true);
      logout();
      if (pathname === '/profile') {
        navigate('/');
      }
    } }, {
      name: '刪除帳號', todo: () => {
        setModalCollapsed(false);
        setModalData(deleteUserData);
      }
    }
  ] : [
    { name: '註冊帳號', todo: () => {
      setModalCollapsed(false);
      setModalData(signinData);
    } }, 
    { name: '登入', todo: () => {
      setModalCollapsed(false);
      setModalData(loginData);
    } }
  ];

  return (
    <>
      <HeaderWrapper>
        <LeftHeaderWrapper>
          <SidbarImg collapsed={sidebarCollapsed} onClick={() => setSidebarCollapsed(!sidebarCollapsed)} src={require("../assets/pictures/header/sidebar.png")} />
          <Link to='/'>
            <StyledWordmark src={require("../assets/pictures/header/wordmark.png")} />
          </Link>
        </LeftHeaderWrapper>
        <RightHeaderWrapper>
          <AvatarWrapper collapsed={dropdownCollapsed}>
            <AvatarMask>
              <Avatar src={user.loggedIn ? user.avatar : 'https://i03piccdn.sogoucdn.com/aa852d73c1dbae45'} onClick={() => setDropdownCollapsed(!dropdownCollapsed)} />
            </AvatarMask>
          </AvatarWrapper>
        </RightHeaderWrapper>
      </HeaderWrapper>
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} items={sidebarItems} />
      <Dropdown collapsed={dropdownCollapsed} setCollapsed={setDropdownCollapsed} items={dropdownItems} />
      <Modal collapsed={modalCollapsed} setCollapsed={setModalCollapsed} onConfirm={handleConfirm} items={modalData.items} title={modalData.title} />
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
  align-items: center;

  & > * {
    margin-left: 10px;
    margin-right: 10px;
  }
`;

const RightHeaderWrapper = styled.div`
  margin-right: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  & > * {
    margin-left: 10px;
    margin-right: 10px;
  }
`;

const StyledWordmark = styled.img`
  height: 70px;

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

const AvatarWrapper = styled.div`
  background-color: #E7CA22;
  width: 45px;
  height: 45px;

  border: 1px #F3C824 solid;
  border-radius: 50%;

  positoin: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  ${props => !props.collapsed ? "transform: rotate(-360deg);" : ""};
  transition: all 0.3s;

  &:hover {
    background-color: #F6DC2B;
  }
`;

const AvatarMask = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;

  &:hover {
    cursor: pointer;
  }
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
`;

export default Header;