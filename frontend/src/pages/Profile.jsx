import styled from 'styled-components';
import { useState } from 'react';

import { useHook } from '../hooks/useHook';
import { sleep } from '../utils';

import Button, { ButtonTexture } from '../components/Button';
import Canvas from '../components/Canvas';
import Message from "../components/Message"
import Modal from '../components/Modal';
import Select from '../components/Select';

import createMapData from "../assets/json/modals/createMap.json";

const Info = () => {
  const [modalCollapsed, setModalCollapsed] = useState(true);
  const [currentMapName, setCurrentMapName] = useState('');
  const [displayCanvas, setDisplayCanvas] = useState(<Canvas canvasWidth={500} canvasHeight={500} xLen={1} yLen={1} zLen={1}></Canvas>);

  const { getMap, createMap, deleteMap, user } = useHook();

  const handleChange = async (mapName) => {
    const { error, data } = await getMap(user.username, mapName);
    switch (error) {
      case 'loading': return;

      case 'connection':
        Message.send({ content: '資料庫連線失敗', duration: 2000, type: 'error' });
        return;

      case 'error':
        Message.send({ content: '地圖資料存取失敗', duration: 2000, type: 'error' });
        return;

      case 'user':
        Message.send({ content: '此帳號名稱不存在', duration: 2000, type: 'error' });
        return;

      case 'map':
        Message.send({ content: '你並沒有這張地圖', duration: 2000, type: 'error' });
        return;
      
      default: 
        Message.send({ content: `成功開啟 ${mapName}`, duration: 2000, type: 'success' });
    }

    setDisplayCanvas(null);
    await sleep(1);

    const preLoadData = JSON.parse(JSON.stringify(data));
    setDisplayCanvas(<Canvas canvasWidth={500} canvasHeight={500} xLen={data.xLen} yLen={data.yLen} zLen={data.zLen} preLoadData={preLoadData} storable={true} />);
    setCurrentMapName(preLoadData.mapName);
  }

  const handleConfirm = async modalData => {
    const { error, data } = await createMap(user.username, {
      xLen: parseInt(modalData[1]), 
      yLen: parseInt(modalData[2]), 
      zLen: parseInt(modalData[3]), 
      mapName: modalData[0]
    });
    switch (error) {
      case 'loading': return;

      case 'connection':
        Message.send({ content: '資料庫連線失敗', duration: 2000, type: 'error' });
        return;

      case 'error':
        Message.send({ content: '地圖資料存取失敗', duration: 2000, type: 'error' });
        return;

      case 'user':
        Message.send({ content: '此帳號不存在', duration: 2000, type: 'error' });
        return;

      case 'map':
        Message.send({ content: '你已經有一張相同名稱的地圖了', duration: 2000, type: 'error' });
        return;
      
      default: 
        Message.send({ content: `成功建立地圖 ${data.mapName}`, duration: 2000, type: 'success' });
    }

    setDisplayCanvas(null);
    await sleep(1);

    const preLoadData = JSON.parse(JSON.stringify(data));
    setDisplayCanvas(<Canvas canvasWidth={500} canvasHeight={500} xLen={data.xLen} yLen={data.yLen} zLen={data.zLen} preLoadData={preLoadData} storable={true} />);
    setCurrentMapName(preLoadData.mapName);

    setModalCollapsed(true);
  }

  const handleMapDelete = async () => {
    const { error } = await deleteMap(user.username, currentMapName);
    switch (error) {
      case 'loading': return;

      case 'connection':
        Message.send({ content: '資料庫連線失敗', duration: 2000, type: 'error' });
        return;

      case 'error':
        Message.send({ content: '地圖資料存取失敗', duration: 2000, type: 'error' });
        return;

      case 'user':
        Message.send({ content: '此帳號不存在', duration: 2000, type: 'error' });
        return;

      case 'map':
        Message.send({ content: `你並沒有名稱為 ${currentMapName} 的地圖`, duration: 2000, type: 'error' });
        return;
      
      default: 
        Message.send({ content: `成功刪除地圖 ${currentMapName}`, duration: 2000, type: 'success' });
    }

    setDisplayCanvas(null);
    setCurrentMapName('');
  }

  return (
    <ProfileWrapper>
      <ProfileCard>
        <ProfileInfo>
          <Username>{user.username}</Username>
          <Bio>{user.bio}</Bio>
        </ProfileInfo>
        <ProfileImageWrapper>
          <ProfileImage src={user.avatar} alt='avatar' />
        </ProfileImageWrapper>
      </ProfileCard>

      <ProfileMapWrapper>
        <MapFunctions>
          <Select
            placeholder={user.maps.length ? "請選擇一張地圖" : "你還沒有任何地圖"}
            onChange={handleChange}
            options={user.maps.map(name => ({ label: name, value: name }))}
          />
          <Button texture={ButtonTexture.Danger} onClick={handleMapDelete} disabled={!displayCanvas}>
            刪除地圖
          </Button>
          <Button texture={ButtonTexture.Success} onClick={() => setModalCollapsed(false)}> 
            建立地圖
          </Button>
        </MapFunctions>
        <MapArea>
          {displayCanvas ?? <></>}
        </MapArea>
      </ProfileMapWrapper>
      <Modal collapsed={modalCollapsed} setCollapsed={setModalCollapsed} onConfirm={handleConfirm} items={createMapData.items} title={createMapData.title} />
    </ProfileWrapper>
  );
}

const ProfileWrapper = styled.div`
  width: 100%;
  
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileCard = styled.div`
  width: 95%;
  margin: 20px;
  padding: 10px 10px 20px 10px;
  border-bottom: 2px solid #B3A773;

  display: flex;
  justify-content: space-between;
`;

const ProfileInfo = styled.div`
  padding-left: 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Username = styled.div`
  color: #883500;
  font-size: 5em;
  font-family: 'Trebuchet MS';
`;

const Bio = styled.div`
  font-size: 1em;
`;

const ProfileImageWrapper = styled.div`
  background-color: #EBEAB7;
  width: 300px;
  height: 300px;
  border: 5px solid #EE8500;
  border-radius: 50%;
  overflow: hidden;
`;

const ProfileImage = styled.img`
  height: 100%;
`;

const ProfileMapWrapper = styled.div`
  padding: 10px;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MapFunctions = styled.div`
  padding: 5px;
`;

const MapArea = styled.div`
  height: 550px;
  padding: 5px;
`;

export default Info;