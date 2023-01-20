import { useLazyQuery, useMutation } from "@apollo/client";
import CryptoJs from 'crypto-js';
import { createContext, useContext, useState } from "react";
import { LOG_IN, GET_MAP, CREATE_USER, EDIT_USER, INITIAL_MY_MAP, EDIT_MY_MAP, DELETE_USER, DELETE_USER_MAP } from '../graphql';

const LSK_USERNAME = 'username';
const LSK_AVATAR = 'avatar';
const LSK_BIO = 'bio';
const LSK_MAPS = 'maps';
const savedUsername = localStorage.getItem(LSK_USERNAME) ?? localStorage.setItem(LSK_USERNAME, '') ?? '';
const savedAvatar = localStorage.getItem(LSK_AVATAR) ?? localStorage.setItem(LSK_AVATAR, '') ?? '';
const savedBio = localStorage.getItem(LSK_BIO) ?? localStorage.setItem(LSK_BIO, '') ?? '';
const savedMaps = localStorage.getItem(LSK_MAPS) ?? localStorage.setItem(LSK_MAPS, '[]') ?? '[]';

const HookContext = createContext({
  login: async () => {},
  logout: () => {},

  getMap: async () => {},

  createUser: async () => {},
  editUser: async () => {},
  deleteUser: async () => {},

  initialMyMap: () => {},
  editMyMap: () => {},
  deleteUserMap: () => {},

  setUsername: () => {}, 
  setPassword: () => {},
  setBio: () => {}, 
  setAvatar: () => {},
  setPageNum: () => {},
  setMaps: () => {},

  username: savedUsername,
  password: '',
  loggedIn: !!savedUsername,
  avatar: savedAvatar,
  bio: savedBio,
  maps: [],

  pageNum: 1
});

const HookProvider = (props) => {
  const [username, setUsername] = useState(savedUsername);
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(!!savedUsername);
  const [avatar, setAvatar] = useState(savedAvatar);
  const [bio, setBio] = useState(savedBio);
  const [maps, setMaps] = useState(JSON.parse(savedMaps));
  const [pageNum, setPageNum] = useState(1);

  const [loginQuery] = useLazyQuery(LOG_IN);
  const [getMapQuery] = useLazyQuery(GET_MAP);
  const [createUserMutation] = useMutation(CREATE_USER);
  const [editUserMutation] = useMutation(EDIT_USER);
  const [deleteUserMutation] = useMutation(DELETE_USER);
  const [initialMyMapMutation] = useMutation(INITIAL_MY_MAP);
  const [editMyMapMutation] = useMutation(EDIT_MY_MAP);
  const [deleteUserMapMutation] = useMutation(DELETE_USER_MAP);

  const setUser = (data) => {
    if (!data) {
      data = {
        username: '', 
        password: '', 
        avatar: '', 
        bio: '', 
        maps: [], 
        loggedIn: false
      };
    }

    if (data.username != null) {
      setUsername(data.username);
      localStorage.setItem(LSK_USERNAME, data.username);
    }
    if (data.avatar != null) {
      setAvatar(data.avatar);
      localStorage.setItem(LSK_AVATAR, data.avatar);
    }
    if (data.bio != null) {
      setBio(data.bio);
      localStorage.setItem(LSK_BIO, data.bio);
    }
    if (data.maps != null) {
      setMaps(data.maps);
      localStorage.setItem(LSK_MAPS, JSON.stringify(data.maps));
    }
    if (data.password != null) {
      setPassword(data.password);
    }
    if (data.loggedIn != null) {
      setLoggedIn(data.loggedIn);
    }
  }

  const login = async (username, password) => {
    password = CryptoJs.MD5(password).toString();

    const result = await loginQuery({
      variables: { username, password }
    }).catch(console.error);
    if (!result) return { error: 'connection', data: null };

    const { error, loading, data } = result;
    if (loading) return { error: 'loading', data: null };
    if (error) return { error: 'error', data: null };

    const user = data.login.data;
    if (!user) return { error: data.login.error, data: null };

    setUser({
      username, 
      password: '', 
      loggedIn: true, 
      avatar: user.avatar, 
      bio: user.bio, 
      maps: user.maps
    });

    return { error: null, data: user };
  }

  const logout = () => {
    setUser({
      username: '', 
      password: '', 
      loggedIn: false, 
      avatar: '', 
      bio: '', 
      maps: []
    });
    setPageNum(1);
  }

  const getMap = async (username, mapName) => {
    const result = await getMapQuery({
      variables: { username, mapName }
    }).catch(console.error);
    if (!result) return { error: 'connection', data: null };

    const { error, loading, data } = result;
    if (loading) return { error: 'loading', data: null };
    if (error) return { error: 'error', data: null };

    const map = data.getMap.data;
    if (!map) return { error: data.getMap.error, data: null };
    return { error: null, data: map };
  }

  const createUser = async (username, password) => {
    password = CryptoJs.MD5(password).toString();

    const result = await createUserMutation({
      variables: { username, password }
    }).catch(console.error);
    if (!result) return { error: 'connection', data: null };

    const { error, loading, data } = result;
    if (loading) return { error: 'loading', data: null };
    if (error) return { error: 'error', data: null };

    const user = data.createUser.data;
    if (!user) return { error: data.createUser.error, data: null };

    setUser({
      username, 
      password: '', 
      loggedIn: true, 
      avatar: user.avatar, 
      bio: user.bio, 
      maps: user.maps
    });
    return data.createUser;
  }

  const editUser = async (editData) => {
    editData.password = editData.password ? CryptoJs.MD5(editData.password).toString() : undefined;
    editData.newPassword = editData.newPassword ? CryptoJs.MD5(editData.newPassword).toString() : undefined;

    const result = await editUserMutation({
      variables: { data: editData }
    }).catch(error => console.error(JSON.parse(JSON.stringify(error, null, 2))));
    if (!result) return { error: 'connection', data: null };

    const { error, loading, data } = result;
    if (loading) return { error: 'loading', data: null };
    if (error) return { error: 'error', data: null };

    const user = data.editUser.data;
    if (!user) return { error: data.editUser.error, data: null };

    setUser({
      username: user.username, 
      password: '', 
      loggedIn: true, 
      avatar: user.avatar, 
      bio: user.bio, 
      maps: user.maps
    });
    return user;
  }

  const deleteUser = async (username, password) => {
    password = CryptoJs.MD5(password).toString();
    
    const result = await deleteUserMutation({
      variables: { username, password }
    }).catch(console.error);
    if (!result) return { error: 'connection', data: null };

    const { error, loading, data } = result;
    if (loading) return { error: 'loading', data: null };
    if (error) return { error: 'error', data: null };

    const user = data.deleteUser.data;
    if (!user) return { error: data.deleteUser.error, data: null };

    logout();
    return { error: null, data: user };
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
        logout,
        getMap,
        createUser,
        editUser,
        initialMyMap,
        editMyMap,
        deleteUser,
        deleteUserMap,
        setUsername,
        setPassword,
        setBio, 
        setAvatar, 
        setPageNum, 
        setMaps, 
        username,
        password,
        loggedIn,
        avatar, 
        bio, 
        maps,
        pageNum
      }}
      {...props}
    />
  );  
}

const useHook = () => useContext(HookContext);
export { HookProvider, useHook };