import { useRef, useState } from 'react';
import { Form, Input, Avatar, Image, Select, Modal, message as Message } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import './css/Info.css';
import { useHook } from '../hooks/useHook';
import { ButtonTexture } from '../classes/ButtonTexture';
import Utils from '../classes/Utils';
import Button from '../components/Button';
import Canvas from '../components/Canvas';

const Info = ({ setOpenModal }) => {
  const mapNameRef = useRef();
  const xLenRef = useRef();
  const yLenRef = useRef();
  const zLenRef = useRef();

  const [openMapModal, setOpenMapModal] = useState(false);
  const [currentMapName, setCurrentMapName] = useState('');
  const [displayCanvas, setDisplayCanvas] = useState(null);

  const { getMap, createMap, deleteMap, username, bio, maps, avatar } = useHook();

  const onSelect = async (mapName) => {
    const { error, data } = await getMap(username, mapName);
    switch (error) {
      case 'loading': return;

      case 'connection':
        Message.error({ content: '資料庫連線失敗', duration: 1 });
        return;

      case 'error':
        Message.error({ content: '地圖資料存取失敗', duration: 1 });
        return;

      case 'user':
        Message.error({ content: '此帳號名稱不存在', duration: 1 });
        return;

      case 'map':
        Message.error({ content: '你並沒有這張地圖', duration: 1 });
        return;
      
      default: 
        Message.success({ content: `成功開啟 ${mapName}`, duration: 1 });
    }

    setDisplayCanvas(null);
    await Utils.Sleep(1);

    const preLoadData = JSON.parse(JSON.stringify(data));
    setDisplayCanvas(<Canvas canvaswidth={500} canvasheight={500} xlen={data.xLen} yLen={data.yLen} zLen={data.zLen} preloaddata={preLoadData} storable={true} />);
    setCurrentMapName(preLoadData.mapName);
  }

  const handleModalOk = async () => {
    const { error, data } = await createMap(username, {
      xLen: parseInt(xLenRef.current.input.value), 
      yLen: parseInt(yLenRef.current.input.value), 
      zLen: parseInt(zLenRef.current.input.value), 
      mapName: mapNameRef.current.input.value
    });
    switch (error) {
      case 'loading': return;

      case 'connection':
        Message.error({ content: '資料庫連線失敗', duration: 1 });
        return;

      case 'error':
        Message.error({ content: '地圖資料存取失敗', duration: 1 });
        return;

      case 'user':
        Message.error({ content: '此帳號不存在', duration: 1 });
        return;

      case 'map':
        Message.error({ content: '你已經有一張相同名稱的地圖了', duration: 1 });
        return;
      
      default: 
        Message.success({ content: `成功建立地圖 ${data.mapName}`, duration: 1 });
    }

    setDisplayCanvas(null);
    await Utils.Sleep(1);

    const preLoadData = JSON.parse(JSON.stringify(data));
    setDisplayCanvas(<Canvas canvaswidth={500} canvasheight={500} xlen={data.xLen} yLen={data.yLen} zLen={data.zLen} preloaddata={preLoadData} storable={true} />);
    setCurrentMapName(preLoadData.mapName);

    setOpenMapModal(false);
  }

  const handleMapDelete = async () => {
    const { error } = await deleteMap(username, currentMapName);
    switch (error) {
      case 'loading': return;

      case 'connection':
        Message.error({ content: '資料庫連線失敗', duration: 1 });
        return;

      case 'error':
        Message.error({ content: '地圖資料存取失敗', duration: 1 });
        return;

      case 'user':
        Message.error({ content: '此帳號不存在', duration: 1 });
        return;

      case 'map':
        Message.error({ content: `你並沒有名稱為 ${currentMapName} 的地圖`, duration: 1 });
        return;
      
      default: 
        Message.success({ content: `成功刪除地圖 ${currentMapName}`, duration: 1 });
    }

    setDisplayCanvas(null);
    setCurrentMapName('');
  }

  const profileForm = <>
    <Form>
      <div id='Info-username' className='Info-left'>
        <Form.Item label="Username">
          <Input defaultValue={username} disabled={true}/>
        </Form.Item>
      </div>
      <div id='Info-avatar' className='Info-left'>
        <Avatar
          src={<Image src={avatar}/>}
          style={{
            width: 400,
            height: 400,
          }}
        />
      </div>
      <div id='Info-bio' className='Info-left'>
        <Form.Item label="Bio">{bio}</Form.Item>
      </div>
      <div id='Info-btn'>
        <Form.Item>
          <Button texture={ButtonTexture.Primary} onClick={() => setOpenModal(3)}>
            編輯個人資料
          </Button>
        </Form.Item>
        <Form.Item>
          <Button texture={ButtonTexture.Danger} onClick={() => setOpenModal(4)}>
            刪除帳號
          </Button>
        </Form.Item>
      </div>
    </Form>
  </>;

  const MapModal = <>
    <Input ref={mapNameRef} placeholder="輸入你的地圖名稱" prefix={<RightOutlined />} />
    <br/>
    <br/>
    <span>輸入三軸的長度</span>
    <div id='Map-Modal-xyz-wrapper'>
      <Input ref={xLenRef} placeholder="X 軸長" className='Map-Modal-xyz' />
      <Input ref={yLenRef} placeholder="Y 軸長" className='Map-Modal-xyz' />
      <Input ref={zLenRef} placeholder="Z 軸長" className='Map-Modal-xyz' />
    </div>
  </>;

  return (
    <div id='Info-wrapper'>
      <div id='Info-left-wrapper'>
        {profileForm}
      </div>
      <div id='Info-right-wrapper'>
        <div id='Info-right-header'>
          <div id='Info-select' width="100px">
            <Form><Form.Item><Select
              showSearch
              placeholder="請選擇一張地圖"
              optionFilterProp="children"
              onSelect={onSelect}
              onChange={onSelect}
              style = {{
                width: '100%'
              }}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={maps.map(name => ({ label: name, value: name }))}
            /></Form.Item></Form>
          </div>
          <Button texture={ButtonTexture.Danger} onClick={handleMapDelete} disabled={!displayCanvas}>
            刪除地圖
          </Button>
          <Button texture={ButtonTexture.Success} onClick={() => setOpenMapModal(true)}> 
            建立地圖
          </Button>
        </div>
        <div id='Info-right-section'>
          {displayCanvas ?? <></>}
        </div>
      </div>

      <Modal
        title="建立地圖"
        centered
        open={openMapModal}
        onOk={() => handleModalOk()}
        onCancel={() => setOpenMapModal(false)}
      >
        {MapModal}
      </Modal>
    </div>
  );
}

export default Info;