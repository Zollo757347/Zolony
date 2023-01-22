import { MapModel, UserModel } from "../models.js";

const Query = {
  login: async (_parent, { username, password }) => {
    const user = await UserModel.findOne({ username });

    if (!user) return { error: 'user', data: null };
    if (user.password !== password) return { error: 'password', data: null };

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

  getMap: async (_parent, { username, mapName }) => {
    const user = await UserModel.findOne({ username });
    if (!user) return { error: 'user', data: null };

    const map = await MapModel.findOne({ mapName, belonging: user._id });
    if (!map) return { error: 'map', data: null };

    return {
      error: null,
      data: {
        mapName, 
        xLen: map.xLen, 
        yLen: map.yLen, 
        zLen: map.zLen, 
        availableBlocks: map.availableBlocks, 
        validation: map.validation, 
        playground: map.playground
      }
    };
  }
};
export default Query;
