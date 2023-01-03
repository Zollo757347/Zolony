import {UserModel, MapModel} from "../models.js";

const Query = {
  
  checkMyMap: async (parent, args) => {
    let sortMap = await UserModel.find({name: args.data.name, password: args.data.password, mapName: args.data.mapName});
    if(!sortMap){
      console.log(`there is no map ${args.data.mapName} in this user.`);
      return sortMap;
    }
    else{
      console.log(`find user map ${mapName} :`)
      console.log(sortMap);
      return sortMap;
    }
  },

  checkUser: async (parent, args) => {
    let user = await UserModel.findOne({ name: args.data.name, password: args.data.password});
    if(!user){
      console.log(`user ${args.data.name} not found.`);
      return user;
    }
    else{
      console.log(`find user ${args.data.name} :`)
      console.log(user);
      return user;
    }
  },

  checkMap: async (parent, args) => {
    let sortMap = await MapModel.findOne({ mapName: args.data.mapName })
    console.log(`find map ${args.data.mapName} :`);
    console.log(sortMap);
    return sortMap;
  }
};
export default Query;
