import { MapModel, UserModel } from "../models.js";

const Query = {
  login: async (_parent, { username, password }) => {
    const user = await UserModel.findOne({ username });

    if (!user) return { error: 'username', data: null };
    if (user.password !== password) return { error: 'password', data: null };

    await user.populate({ path: 'maps', select: 'mapName' });

    return {
      error: null, 
      data: {
        username: user.username, 
        avatar: user.avatar, 
        bio: user.bio, 
        level: user.level, 
        maps: user.maps.map(m => m.mapName)
      }
    };
  },

  getMap: async (_parent, { username, mapName }) => {
    const user = await UserModel.findOne({ username });
    if (!user) return { error: 'username', data: null };

    const map = await MapModel.findOne({ mapName: mapName, belonging: user._id });
    if (!map) return { error: 'mapName', data: null };

    return {
      error: null,
      data: {
        xLen: map.xLen, 
        yLen: map.yLen, 
        zLen: map.zLen, 
        mapName: mapName, 
        availableBlocks: map.availableBlocks, 
        validation: map.validation, 
        playground: map.playground
      }
    };
  }
};
export default Query;
