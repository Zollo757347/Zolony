import { MapModel, UserModel } from "../models.js";

const DEFAULT_AVATAR = 'https://i03piccdn.sogoucdn.com/aa852d73c1dbae45';
const DEFAULT_BIO = '向其他人介紹你自己吧';

const Mutation = {
  createUser: async (_parent, { username, password }) => {
    const user = await UserModel.findOne({ username });
    if (user) return { error: 'user', data: null };

    const newUser = { 
      username,
      password,
      avatar: DEFAULT_AVATAR,
      bio: DEFAULT_BIO,
      level: [],
      maps: []
    };
    await UserModel(newUser).save();

    delete newUser.password;
    return { error: null, data: newUser };
  },

  editUser: async (_parent, { data }) => { 
    const user = await UserModel.findOne({ username: data.username });
    if (!user) return { error: 'user', data: null };

    if (data.newPassword) {
      if (user.password !== data.password) return { error: 'password', data: null };
      user.password = data.newPassword;
    }
    if (data.newAvatar) user.avatar = data.newAvatar;
    if (data.newBio) user.bio = data.newBio;
    if (data.newLevel) user.level = data.newLevel;

    await user.save();

    return {
      error: null, 
      data: { 
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        level: user.level,
        maps: user.maps
      }
    };
  },

  deleteUser: async (_parent, { username, password }) => {
    const user = await UserModel.findOne({ username });
    if (!user) return { error: 'user', data: null };
    if (password !== user.password) return { error: 'password', data: null };

    await MapModel.deleteMany({ belonging: user._id });
    await user.deleteOne();

    return {
      error: null, 
      data: { 
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        level: user.level,
        maps: user.maps
      }
    };
  },

  createMap: async (_parent, { username, data }) => {
    const user = await UserModel.findOne({ username });
    if (!user) return { error: 'user', data: null };

    const map = await MapModel.findOne({ mapName: data.mapName, belonging: user._id });
    if (map) return { error: 'map', data: null };

    const newMap = getMap(data, user._id.toString());
    const mapModel = MapModel(newMap);

    user.maps.push(mapModel._id);
    await mapModel.save();
    await user.save();
    
    delete newMap.belonging;
    return { error: null, data: newMap };
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

  deleteUserMap: async (parent, args) => {
    let user = await UserModel.findOne({name: args.data.name, password: args.data.password});
    if(!user){
      console.log(`user ${args.data.name} not found.`);
      return false;
    }
    const count = await MapModel.deleteOne({mapName:args.data.mapName, belonging: user._id });
    if(count === 0){
      console.log(`user ${args.data.name}'s map ${args.data.mapName} already daleted.`);
      return false;
    }
    console.log(`user ${args.data.name}'s map ${args.data.mapName} dalete succeed.`)
    return true;
  },
};

function getConcrete() {
  return {
    type: 1,
    breakable: false,
    states: {
      power: 0,
      source: false
    }
  }
}

function getMap(data, userId) {
  const playground = Array.from({ length: data.xLen }, () => 
    Array.from({ length: data.yLen }, (_, y) => 
      Array.from({ length: data.zLen }, () => y === 0 ? getConcrete() : null)
    )
  );

  return {
    xLen: data.xLen,
    yLen: data.yLen,
    zLen: data.zLen,
    mapName: data.mapName,
    belonging: userId,
    playground: playground,
  };
}

export default Mutation;




