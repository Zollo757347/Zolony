import UserModel from "../models/userinfo";
import MapModel from "../models/map";
import db from "../db";

const DEFAULT_AVATAR = 'https://i03piccdn.sogoucdn.com/aa852d73c1dbae45'

const initBlock = (x, y, z, type) => { //0 means air, 1 means concrete
  let block = {};
  if(type === 0){
    block = {
      x: x,
      y: y,
      z: z,
      blockName: 'Air',
      type: 0,
      status: {
        power: 0,
        source: false,
      }
    }
  }
  else if(type === 1){
    block = {
      x: x,
      y: y,
      z: z,
      blockName: 'Concrete',
      type: 1,
      status: {
        power: 0,
        source: false,
      }
    }
  }
  return block;
}

const initMap = (x, y, z, mapName) => {
  let newPlayground = [];
  let newBasePlayground = [];
  for(let i = 0; i < y; i++){
    let newSubPlayground = [];
    for(let j = 0; j < z; j++){
      const newBlock = initBlock(0, i, j, 1);
      newSubPlayground.push( newBlock );
    }
    newBasePlayground.push( newSubPlayground );
  }
  newPlayground.push( newBasePlayground );

  for(let i = 1; i < x; i++){
    let newSubPlayground = [];
    for(let j = 0; j < y; j++){
      let newSubSubPlayground = [];
      for(let k = 0; k < z; k++){
        const newBlock = initBlock(i, j, k, 0);
        newSubSubPlayground.push( newBlock );
      }
      newSubPlayground.push( newSubSubPlayground );
    }
    newPlayground.push( newSubPlayground );
  }
  const newMap = {
    xLen: x,
    yLen: y,
    zLen: z,
    mapName: mapName,
    playground: newPlayground,
  }
  return newMap;
}

const Mutation = {
  createAccount: async (parent, {name, passWord}) => {
    const newUser = {
      name: name,
      password: passWord,
      avatar: DEFAULT_AVATAR,
      maps: [],
    }
    console.log( newUser );
    await new UserModel( newUser ).save();
    return newUser;
  },

  editProfile: async (parent, {name, passWord, newAvatar, newName, newPassWord}) => {
    let user = await UserModel.findOne({ name, passWord});
    if(newName) user.name = newName;
    if(newPassWord) user.password = newPassWord;
    if(newAvatar) user.avatar = newAvatar;
    console.log(user);
    await user.save();
    return user;
  },

  initialMyMap: async (parent, {name, passWord, mapName, xLen, yLen, zLen}) => {
    let user = await UserModel.findOne({ name, passWord});
    let newMap = initMap(xLen, yLen, zLen, mapName);
    user.maps.push(newMap);
    console.log(newMap);
    await user.save();
    return newMap;
  },

  editMyMap: async (parent, {name, passWord, mapName, map}) => {
    let user = await UserModel.findOne({ name, passWord});
    for(let i=0; i < user.maps.length(); i++){
      if(user.maps[i].mapName === mapName){
        user.maps[i] = map;
        console.log(map);
        await user.save();
        return map;
      }
    }
  },

  initialMap: async () => {
    let existing = await MapModel.findOne();
    if(existing){
      console.log('mapmodel database is not clean, clean the database first.');
      return false;
    }

    for(let i=0; i < db.maps.length(); i++){
      await MapModel.create(db.maps[i]);
    }
    console.log('import data from backend to database succeed.')
    return true;
  },

  deleteUser: async (parent, {name, passWord}) => {
    let msg = await UserModel.deleteOne( { name } );
    if(msg.deletedCount === 0){
      console.log('delete user fail.');
      return false;
    }
    else{
      console.log('delete user succeed.');
      return true;
    }
  },

  deleteUserMap: async (parent, {name, passWord, mapName}) => {
    let user = await UserModel.findOne({ name, passWord});
    for(let i=0; i < user.maps.length(); i++){
      if(user.maps[i].mapName === mapName){
        user.maps[i].delete();
        await user.save();
        console.log(`map ${mapName} delete succeed.`);
        return map;
      }
    }
    console.log('no map to delete.');
    return false;
  },
};
  
export { Mutation as default };




