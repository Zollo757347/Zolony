import {UserModel, MapModel} from "../models.js";
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
  createAccount: async (parent, args) => {
    const newUser = { 
      name: args.data.name,
      password: args.data.password,
      avatar: DEFAULT_AVATAR,
      maps: [],
    }
    console.log( newUser );
    await UserModel(newUser).save();
    return newUser;
  },

  editProfile: async (parent, args) => {
    let user = await UserModel.findOne({ name: args.data.name, password: args.data.password});
    if(args.data.newName) user.name = args.data.newName;
    if(args.data.newPassword) user.password = args.data.newPassword;
    if(args.data.newAvatar) user.avatar = args.data.newAvatar;
    console.log(user);
    await user.save();
    return user;
  },

  initialMyMap: async (parent, args) => {
    let user = await UserModel.findOne({ name: args.data.name, password: args.data.password});
    let newMap = initMap(args.data.xLen, args.data.yLen, args.data.zLen, args.data.mapName);
    user.maps.push(MapModel(newMap));
    console.log(user);
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




