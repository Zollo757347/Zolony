import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import './css/Dropdown.css'
import { UseHook } from '../hook/usehook';

const Dropdown_Components = ({ setOpenModal }) => {
    const { isLogIn , LogOut, setPageNum } = UseHook();
    
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
                LogOut(); 
                setPageNum(1);
                break;
            default:
                break;
        }
    };
    
    const items = [
        {
            key: '1',
            label: <div>Your Profile</div>,
            disabled: (!isLogIn)
        },
        {
            key: '2',
            label: <div>Log in</div>,
            disabled: (isLogIn)
        },
        {
            key: '3',
            label: <div>Sign up</div>,
            disabled: (isLogIn)
        },
        {
            key: '4',
            danger: true,
            label: <div onClick={() => {LogOut(); setPageNum(1);}}>Log out</div>,
            disabled: (!isLogIn)
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
                    <b>Account</b>
                    <DownOutlined />
                </Space>
            </span>
        </Dropdown>
    )
}

export default Dropdown_Components;