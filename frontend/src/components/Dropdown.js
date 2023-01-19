import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Space } from 'antd';
import './css/Dropdown.css'
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
                setPageNum(1);
                break;
            default:
                break;
        }
    };
    
    const items = [
        {
            key: '1',
            label: 'Your Profile',
            disabled: (!loggedIn)
        },
        {
            key: '2',
            label: 'Log in',
            disabled: (loggedIn)
        },
        {
            key: '3',
            label: 'Sign up',
            disabled: (loggedIn)
        },
        {
            key: '4',
            danger: true,
            label: 'Log out',
            disabled: (!loggedIn)
        }
    ];

    return(
        <Dropdown
            menu={{
                items,
                onClick
            }}
            trigger={['click']}
            id="dropdown"
        >
            <span onClick={(e) => e.preventDefault()}>
                <Space>
                    {loggedIn ? <Avatar src={avatar}/> :  <b>Account</b>}
                    <DownOutlined />
                </Space>
            </span>
        </Dropdown>
    )
}

export default Dropdown_Components;