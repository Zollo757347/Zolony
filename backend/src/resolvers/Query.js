import {UserModel, MapModel} from "../models.js";

const Query = {
  
  checkMyMap: async (parent, {name, passWord, mapName}) => {
    let sortMap = await UserModel.find({name, passWord, mapName});
    if(!sortMap){
      console.log('there is no map in this user.');
      return 'there is no map in this user.';
    }
    else{
      console.log('find user map ' + mapName + ' :')
      console.log(sortMap);
      return sortMap;
    }
  },

  checkUser: async (parent, {name, passWord}) => {
    let user = await UserModel.findOne({ name, passWord});
    if(!user){
      console.log('user not found.');
      return 'user not found.';
    }
    else{
      console.log('find user ' + name + ' :')
      console.log(user);
      return user;
    }
  },

  checkMap: async (parent, { mapName }) => {
    let sortMap = await MapModel.findOne({ mapName })
    console.log('find map ' + mapName + ' :');
    console.log(sortMap);
    return sortMap;
  }
};
export default Query;
