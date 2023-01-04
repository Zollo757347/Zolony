import React, { useState } from 'react';
import { Form, Input, Avatar, Image, Button, Select, Modal } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import Canvas from './Canvas';
import './css/Info.css'

const { TextArea } = Input;
const Info = ({ setOpenModal }) => {
    const [selectItems, setSelectItems] = useState([]);
    const [openMapModal, setOpenMapModal] = useState(false);

    const check = () => setSelectItems([
        {
            value: 'jack',
            label: 'Jack',
        },
        {
            value: 'lucy',
            label: 'Lucy',
        },
        {
            value: 'tom',
            label: 'Tom',
        },
    ])

    const onSelect = (value) => {
        console.log(value)
    }

    const MapModal = <>
        <Input placeholder="輸入你的地圖名稱" prefix={<RightOutlined />} onChange={e => console.log(e.target.value)}/>
        <br/>
        <br/>
        <span> 輸入長寬高↓ </span>
        <div id='Map-Modal-xyz-wrapper'>
            <Input placeholder="xlen" className='Map-Modal-xyz' onChange={e => console.log(e.target.value)}/>
            <Input placeholder="ylen" className='Map-Modal-xyz' onChange={e => console.log(e.target.value)}/>
            <Input placeholder="zlen" className='Map-Modal-xyz' onChange={e => console.log(e.target.value)}/>
        </div>
    </>

    return(
        <div id='Info-wrapper'>
            <div id='Info-left-wrapper'>
                <Form>
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
                </Form>
            </div>
            <div id='Info-right-wrapper'>
                <div id='Info-right-header'>
                    <div id='Info-select'>
                        <Form><Form.Item><Select
                            showSearch
                            placeholder="Select a map"
                            optionFilterProp="children"
                            onSelect={onSelect}
                            style = {{
                                width: '100%'
                            }}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={selectItems}
                        /></Form.Item></Form>
                    </div>
                    <div id='Info-del'>
                        <Button onClick={check} className="Info-del-btn">
                            刪減目前地圖
                        </Button>
                    </div>
                    <div id='Info-add'>
                        <Button onClick={() => setOpenMapModal(true)} className="Info-add-btn"> 
                            增加地圖
                        </Button>
                    </div>
                </div>
                <div id='Info-right-section'>
                    <Canvas canvaswidth={500} canvasheight={500} xlen={5} ylen={5} zlen={5}/>
                </div>
            </div>

            <Modal
                title="新增地圖"
                centered
                open={openMapModal}
                onOk={() => {setOpenMapModal(false);}}
                onCancel={() => setOpenMapModal(false)}
            >
                {MapModal}
            </Modal>
        </div>
    );
}

export default Info;