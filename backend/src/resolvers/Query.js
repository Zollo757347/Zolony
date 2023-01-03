import {UserModel, MapModel} from "../models.js";

const Query = {

  logIn: async (parent, args) => {
    let user = await UserModel.findOne({ name: args.data.name, password: args.data.password}).populate(`maps`);
    if(!user){
      console.log(`user ${args.data.name} not found.`);
      return null;
    }
    else{
      console.log(`user ${args.data.name} login:`)
      console.log(user);
      return user;
    }
  },

  getMap: async (parent, args) => {
    let user = await UserModel.findOne({ name: args.data.name }).populate(`maps`);
    if(!user){
      console.log(`user ${args.data.name} not found.`);
      return null;
    }

    let sortMap = await MapModel.findOne({mapName:args.data.mapName ,belonging: user._id });
    
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
