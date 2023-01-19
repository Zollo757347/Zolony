import { useLazyQuery, useMutation } from "@apollo/client";
import CryptoJs from 'crypto-js'
import { createContext, useContext, useState } from "react";
import { LOG_IN, GET_MAP, CREATE_ACCOUNT, EDIT_PROFILE, INITIAL_MY_MAP, EDIT_MY_MAP, DELETE_USER, DELETE_USER_MAP } from '../graphql';


const HookContext = createContext({
  login: async () => {},
  LogOut: () => {},
  GetMap: () => {},
  createAccount: async () => {},
  editProfile: async () => {},
  initialMyMap: () => {},
  editMyMap: () => {},
  DeleteUser: () => {},
  deleteUserMap: () => {},
  setUser: () => {}, 
  setPassword: () => {},
  setBio: () => {}, 
  setAvatar: () => {},
  setPageNum: () => {},
  setMaps: () => {},
  user: '',
  password: '',
  bio: '',
  avatar: '',
  isLogin: false,
  pageNum: 1,
  maps: []
});


const HookProvider = (props) => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [maps, setMaps] = useState([]);

  const [createAccountMutation] = useMutation(CREATE_ACCOUNT);
  const [editProfileMutation] = useMutation(EDIT_PROFILE);
  const [initialMyMapMutation] = useMutation(INITIAL_MY_MAP);
  const [editMyMapMutation] = useMutation(EDIT_MY_MAP);
  const [deleteUserMutation] = useMutation(DELETE_USER);
  const [deleteUserMapMutation] = useMutation(DELETE_USER_MAP);
  const [loginQuery] = useLazyQuery(LOG_IN);
  const [getMapQuery] = useLazyQuery(GET_MAP);

  const login = async (username, password) => {
    password = CryptoJs.MD5(password).toString();

    const result = await loginQuery({
      variables: { username, password }
    }).catch(console.error);
    if (!result) return { error: 'connection', data: null };

    const { error, loading, data } = result;
    if (loading) return { error: 'loading', data: null };
    if (error) return { error: 'error', data: null };
    if (!data.login.data) return { error: data.login.error, data: null };

    const user = data.login.data;
    
    setIsLogin(true);
    setAvatar(user.avatar);
    setBio(user.bio);
    setMaps(user.maps);
    return { error: null, data: user };
  }

  const GetMap = async (name, mapName) => {
    const {loading, data, error} = await getMapQuery({
      variables: {
        name: name,
        mapName: mapName,
      }
    });

    if (loading) return 'loading...';
    if (error) {
      console.log(`[getMap function error]: ${error.message}.`);
      return 'error';
    }

    if (!data.getMap) {
      console.log(`user not found.`);
      return 'user not found';
    }
    
    console.log(`getmap succeed.`);
    console.log(data.getMap);
    return data.getMap;
  }

  const createAccount = async (name, pwd) => {
    const cryptopwd = CryptoJs.MD5(pwd).toString();
    const { loading, data, error } = await createAccountMutation({
      variables: {
        name: name,
        password: cryptopwd,
      }
    });

    if (loading) return 'loading...';
    if (error) {
      console.log(`[createAccount function error]: ${error.message}.`);
      return 'error';
    }
    else {
      if (!data.createAccount) {
        console.log(`${name} already used.`);
        return 'exist';
      }
      
      setIsLogin(true);
      setAvatar(data.createAccount.avatar);
      setBio(data.createAccount.bio);
      setMaps([]);
      return data.createAccount;
    }
  }

  const LogOut = () => {
    setUser('');
    setIsLogin(false);
  }

  const editProfile = async (name, pwd, input) => {
    const cryptopwd = CryptoJs.MD5(pwd).toString();

    const {loading, data, error} = await editProfileMutation({
      variables: {
        name: name,
        password: cryptopwd,
        newPassword: input.newPassword ? CryptoJs.MD5(input.newPassword).toString() : undefined,
        newAvatar: input.newAvatar,
        newBio: input.newBio,
        newLevel: input.newLevel,
      }
    });

    if (loading) return 'loading...';
    if (error) {
      return 'error';
    }
    else {
      if (!data.editProfile) {
        return 'invalid';
      }
      if (pwd === input.newPassword) {
        return 'password';
      }

      setAvatar(data.editProfile.avatar);
      setBio(data.editProfile.bio);
      return data.editProfile;
    }
  }

  const initialMyMap = async (name, pwd, xLen, yLen, zLen, mapName) => {
    const cryptopwd = CryptoJs.MD5(pwd).toString();
    
    const {loading, data, error} = await initialMyMapMutation({
      variables: {
        name: name,
        password: cryptopwd,
        mapName: mapName,
        xLen: xLen,
        yLen: yLen,
        zLen: zLen,
      }
    });

    if (loading) return 'loading...';
    if (error) {
      console.log(`[initialMyMap function error]: ${error.message}.`);
      return 'error';
    }
    else {
      if (!data.initialMyMap) {
        console.log(`map already exist.`);
        return 'map already exist';
      } 
      console.log(`initialmap succeed`);
      console.log(data.initialMyMap);
      setMaps([...maps, data.initialMyMap]);
      return data.initialMyMap;
    }
  }

  /* must wrap into a object

  map = {
    xLen,
    yLen,
    zLen,
    mapName,
    playground [[[{
      type,
      breakable,
      states {
        power,
        source,
        delay,
        facing,
        face,
        locked,
        powered,
        lit,
        east,
        south,
        west,
        north,
      }
    }]]],
  }
  */

  const editMyMap = async (name, pwd, map) => {
    const cryptopwd = CryptoJs.MD5(pwd).toString();
    
    const {loading, data, error} = await editMyMapMutation({
      variables: {
        name: name,
        password: cryptopwd,
        mapName: map.mapName,
        map: map
      }
    }).catch(e => console.log(JSON.stringify(e, null, 2)));

    if(loading) return 'loading...';
    if(error){
      console.log(`[editMyMap function error]: ${error.message}.`);
      return 'error';
    }
    else {
      if(!data.editMyMap){
        console.log(`save map fail.`);
        return 'map already exist';
      } 
      console.log(`edit map succeed.`)
      console.log(data.editMyMap);

      const index = maps.findIndex(a => a.mapName === map.mapName);
      console.log(index, maps.map(a => a.mapName), map.mapName);
      if (index !== -1) {
        maps[index] = data.editMyMap;
        setMaps(maps);
      }

      return data.editMyMap;
    }
  }

  const DeleteUser = async (name, pwd) => {
    const cryptopwd = CryptoJs.MD5(pwd).toString();
    
    const {loading, data, error} = await deleteUserMutation({
      variables: {
        name: name,
        password: cryptopwd
      }
    })
    if(loading) return 'loading...';
    if(error){
      console.log(`[deleteUser function error]: ${error.message}.`);
      return false;
    }
    LogOut();
    return data.deleteUser;
  }

  const deleteUserMap = async (name, pwd, mapName) => {
    const cryptopwd = CryptoJs.MD5(pwd).toString();

    console.log(name, pwd, mapName);
    const {loading, data, error} = await deleteUserMapMutation({
      variables: {
        name: name,
        password: cryptopwd,
        mapName: mapName
      }
    })
    if(loading) return 'loading...';
    if(error){
      console.log(`[deleteUserMap function error]: ${error.message}.`);
      return false;
    }

    console.log(maps, mapName);
    setMaps(maps.filter(m => m.mapName !== mapName));
    return data.deleteUserMap;
  }
  return (
    <HookContext.Provider
      value = {{
        login,
        LogOut,
        GetMap,
        createAccount,
        editProfile,
        initialMyMap,
        editMyMap,
        DeleteUser,
        deleteUserMap,
        setUser,
        setPassword,
        setBio, 
        setAvatar, 
        setPageNum, 
        setMaps, 
        user,
        password,
        bio, 
        avatar, 
        isLogin,
        pageNum,
        maps
      }}
      {...props}
    />
  );  
}

const UseHook = () => useContext(HookContext);
export { HookProvider, UseHook };