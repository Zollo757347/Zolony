import React from 'react';
import { Form, Input, Avatar, Image, Button } from 'antd';
import './css/Info.css'

const { TextArea } = Input;
const Info = ({ setOpenModal }) => {
    return(
        <div id='Info-wrapper'>
            <div id='Info-left-wrapper'>
                <div id='Info-username' className='Info-left'>
                    <Form.Item label="Username">
                        <Input defaultValue="Username" disabled={true}/>
                    </Form.Item>
                </div>
                <div id='Info-avator' className='Info-left'>
                    <Avatar
                        src={<Image src={require("./data/img/header/wordmark.png")}/>}
                        style={{
                            width: 400,
                            height: 400,
                        }}
                    />
                </div>
                <div id='Info-bio' className='Info-left'>
                    <Form.Item label="Bio">
                        <TextArea rows={4} defaultValue="在這裡放上自介" disabled={true}/>
                    </Form.Item>
                </div>
                <div id='Info-btn' className='Info-left'>
                    <Form.Item>
                        <Button onClick={() => setOpenModal(3)}>
                            修改密碼/編輯個人資料
                        </Button>
                    </Form.Item>
                </div>
            </div>
            <div id='Info-right-wrapper'>

            </div>
        </div>
    );
}

export default Info;