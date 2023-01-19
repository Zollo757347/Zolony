import { MapModel, UserModel } from "../models.js";

const Query = {
  login: async (parent, { username, password }) => {
    const user = await UserModel.findOne({ username });

    if (!user) return { error: 'User Not Found', data: null };
    if (user.password !== password) return { error: 'Incorrect password.', data: null };

    await user.populate({ path: 'maps', select: 'mapName' });
    const result = {
      error: null, 
      data: {
        username: user.username, 
        avatar: user.avatar, 
        bio: user.bio, 
        level: user.level, 
        maps: user.maps.map(m => m.mapName)
      }
    };
    console.log(result);
    return result;
  },

  getMap: async (parent, args) => {
    let user = await UserModel.findOne({ name: args.data.name }).populate(`maps`);
    if (!user) return null;

    let sortMap = await MapModel.findOne({ mapName: args.data.mapName, belonging: user._id });
    
    if(sortMap){
      console.log(`find map ${args.data.mapName} from user ${args.data.name}:`);
      console.log(sortMap);
      return sortMap;
    }
    console.log(`user ${args.data.name} doesn't own map ${args.data.mapName}.`);
    return null;
  }
};
export default Query;
