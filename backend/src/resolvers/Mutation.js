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

    const newMap = getNewMap(data, user._id.toString());
    await MapModel(newMap).save();

    user.maps.push(data.mapName);
    await user.save();
    
    delete newMap.belonging;
    return { error: null, data: newMap };
  },

  editMap: async (_parent, { username, data }) => {
    const user = await UserModel.findOne({ username });
    if (!user) return { error: 'user', data: null };

    const map = await MapModel.findOne({ mapName: data.mapName, belonging: user._id });
    if (!map) return { error: 'map', data: null };

    await map.updateOne(data);
    return {
      error: null, 
      data: {
        mapName: map.mapName,
        xLen: map.xLen,
        yLen: map.yLen,
        zLen: map.zLen,
        playground: map.playground,
      }
    };
  },

  deleteMap: async (_parent, { username, mapName }) => {
    const user = await UserModel.findOne({ username });
    if (!user) return { error: 'user' };

    const map = await MapModel.findOne({ mapName, belonging: user._id });
    if (!map) return { error: 'map' };

    user.maps = user.maps.filter(name => name !== mapName);
    await user.save();

    await map.deleteOne();
    return { error: null };
  },
};

function getIronBlock() {
  return {
    type: 1,
    breakable: false,
    states: {
      power: 0,
      source: false
    }
  }
}

function getNewMap(data, userId) {
  const playground = Array.from({ length: data.xLen }, () => 
    Array.from({ length: data.yLen }, (_, y) => 
      Array.from({ length: data.zLen }, () => y === 0 ? getIronBlock() : null)
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




