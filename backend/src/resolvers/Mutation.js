import {UserModel, MapModel} from "../models.js";
import db from "../db";

const DEFAULT_AVATAR = 'https://i03piccdn.sogoucdn.com/aa852d73c1dbae45'
const DEFAULT_BIO = "newer"

const initBlock = (x, y, z, type) => { //0 means air, 1 means concrete
  let block = {};
  if(type === 0){
    block = {
      x: x,
      y: y,
      z: z,
      blockName: 'Air',
      type: 0,
      breakable: false,
      states: {
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
      breakable: false,
      states: {
        power: 0,
        source: false,
      }
    }
  }
  return block;
}

const initMap = (x, y, z, mapName, user) => {
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
    belonging: user._id,
    playground: newPlayground,
  }
  console.log(newMap)
  return newMap;
}

const Mutation = {
  createAccount: async (parent, args) => {
    let user = await UserModel.findOne({ name: args.data.name });
    if(user){
      console.log(`user ${args.data.name} already exist.`);
      return null;
    }
    const newUser = { 
      name: args.data.name,
      password: args.data.password,
      avatar: DEFAULT_AVATAR,
      bio: DEFAULT_BIO,
      maps: [],
    }
    await UserModel(newUser).save();
    console.log(`user account ${args.data.name} created.`);
    console.log( newUser );
    return newUser;
  },

  editProfile: async (parent, args) => {
    let user = await UserModel.findOne({ name: args.data.name, password: args.data.password});
    if(!user){
      console.log(`user ${args.data.name} not found.`);
      return null;
    }
    if(args.data.newPassword) user.password = args.data.newPassword;
    if(args.data.newAvatar) user.avatar = args.data.newAvatar;
    if(args.data.newBio) user.bio = args.data.newBio;
    console.log(`new user ${args.data.name} info:`)
    console.log(user);
    await user.save();
    return user;
  },

  initialMyMap: async (parent, args) => {
    let user = await UserModel.findOne({ name: args.data.name, password: args.data.password});
    if(!user){
      console.log(`user ${args.data.name} not found.`);
      return null;
    }
    let sortMap = await MapModel.findOne({ mapName: args.data.mapName, belonging: user._id})
    if(sortMap){
      console.log(`map ${args.data.mapName} already existed.`);
      return null;
    }
    let newMap = initMap(args.data.xLen, args.data.yLen, args.data.zLen, args.data.mapName, user);
    let modelMap = MapModel(newMap);
    user.maps.push(modelMap._id);
    await modelMap.save();
    await user.save();
    console.log(`map ${args.data.mapName} initialize succeed.`)
    console.log(user);
    console.log(modelMap);
    
    return newMap;
  },

  editMyMap: async (parent, args) => {
    let user = await UserModel.findOne({ name: args.data.name, password: args.data.password });
    if(!user){
      console.log(`user ${args.data.name} not found.`);
      return false;
    }
    let sortMap = await MapModel.findOne({ mapName: args.data.mapName, belonging: user._id})
    if(!sortMap){
      console.log(`user ${args.data.name} doesn't own map ${args.data.mapName}.`);
      return null;
    }
    let addID = args.data.map;
    addID.belonging = user._id;
    await sortMap.replaceOne(addID);
    console.log(`user ${args.data.name} save map ${args.data.mapName} succeed`);
    console.log(sortMap);
    return sortMap;
  },

  deleteUser: async (parent, args) => {
    let user = await UserModel.findOne({name: args.data.name, password: args.data.password});
    if(!user){
      console.log(`user ${args.data.name} already deleted.`);
      return false;
    }
    await MapModel.deleteMany({belonging: user._id});
    await user.deleteOne();
    console.log(`user ${args.data.name} delete succeed.`);
    return true;
  },

  deleteUserMap: async (parent, args) => {
    let user = await UserModel.findOne({name: args.data.name, password: args.data.password});
    if(!user){
      console.log(`user ${args.data.name} not found.`);
      return false;
    }
    const count = await MapModel.deleteOne({mapName:args.data.mapName ,belonging: user._id });
    if(count === 0){
      console.log(`user ${args.data.name}'s map ${args.data.mapName} already daleted.`);
      return false;
    }
    console.log(`user ${args.data.name}'s map ${args.data.mapName} dalete succeed.`)
    return true;
  },
};
  
export { Mutation as default };




