import { MapModel, UserModel } from "../models.js";

const DEFAULT_AVATAR = 'https://i03piccdn.sogoucdn.com/aa852d73c1dbae45'
const DEFAULT_BIO = "newer"

const initBlock = (type) => { //0 means air, 1 means concrete
  let block = {};
  if(type === 0){
    block = null;
  }
  else if(type === 1){
    block = {
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

  for (let i = 0; i < x; i++) {
    newPlayground.push([]);
    for (let j = 0; j < y; j++) {
      newPlayground[i].push([]);
      for (let k = 0; k < z; k++) {
        newPlayground[i][j].push(j === 0 ? initBlock(1) : initBlock(0));
      }
    }
  }

  const newMap = {
    xLen: x,
    yLen: y,
    zLen: z,
    mapName: mapName,
    belonging: user._id,
    validation: null,
    playground: newPlayground,
  }
  console.log("NEW", newMap)
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
      level: [],
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
    if(args.data.newLevel) user.level[args.data.newLevel] = true;
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
    console.log(args.data);
    let user = await UserModel.findOne({ name: args.data.name, password: args.data.password });
    if(!user){
      console.log(`user ${args.data.name} not found.`);
      return null;
    }
    let sortMap = await MapModel.findOne({ mapName: args.data.mapName, belonging: user._id})
    if(!sortMap){
      console.log(`user ${args.data.name} doesn't own map ${args.data.mapName}.`);
      return null;
    }
    let addID = args.data.map;
    addID.belonging = user._id;
    if(user.name !== 'admin' && addID.validation !== null){
      console.log(`you don't hava authority to modify validation.`);
      addID.validation = undefined;  // avoid normal user modify map to validation map
    } 
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




