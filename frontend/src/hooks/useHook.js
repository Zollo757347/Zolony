import { useLazyQuery, useMutation } from "@apollo/client";
import CryptoJs from 'crypto-js';
import { createContext, useContext, useState } from "react";
import { LOG_IN, GET_MAP, CREATE_USER, EDIT_USER, DELETE_USER, CREATE_MAP, EDIT_MAP, DELETE_MAP } from '../graphql';

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
  createUser: async () => {},
  editUser: async () => {},
  deleteUser: async () => {},

  getMap: async () => {},
  createMap: async () => {},
  editMap: async () => {},
  deleteMap: async () => {},

  setUsername: () => {}, 
  setBio: () => {}, 
  setAvatar: () => {},
  setPageNum: () => {},
  setMaps: () => {},

  username: savedUsername,
  loggedIn: !!savedUsername,
  avatar: savedAvatar,
  bio: savedBio,
  maps: [],

  pageNum: 1
});

const HookProvider = (props) => {
  const [username, setUsername] = useState(savedUsername);
  const [loggedIn, setLoggedIn] = useState(!!savedUsername);
  const [avatar, setAvatar] = useState(savedAvatar);
  const [bio, setBio] = useState(savedBio);
  const [maps, setMaps] = useState(JSON.parse(savedMaps));
  const [pageNum, setPageNum] = useState(1);

  const [loginQuery] = useLazyQuery(LOG_IN);
  const [getMapQuery] = useLazyQuery(GET_MAP, { fetchPolicy: 'network-only' });
  const [createUserMutation] = useMutation(CREATE_USER);
  const [editUserMutation] = useMutation(EDIT_USER);
  const [deleteUserMutation] = useMutation(DELETE_USER);
  const [createMapMutation] = useMutation(CREATE_MAP);
  const [editMapMutation] = useMutation(EDIT_MAP);
  const [deleteMapMutation] = useMutation(DELETE_MAP);

  const setUser = (data) => {
    if (!data) {
      data = {
        username: '', 
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
    if (data.loggedIn != null) {
      setLoggedIn(data.loggedIn);
    }
  }

  const login = async (username, password) => {
    password = CryptoJs.MD5(password).toString();

    const result = await loginQuery({
      variables: { username, password }
    }).catch(error => console.error(JSON.parse(JSON.stringify(error, null, 2))));
    if (!result) return { error: 'connection', data: null };

    const { error, loading, data } = result;
    if (loading) return { error: 'loading', data: null };
    if (error) return { error: 'error', data: null };

    const user = data.login.data;
    if (!user) return { error: data.login.error, data: null };

    setUser({
      username, 
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
    }).catch(error => console.error(JSON.parse(JSON.stringify(error, null, 2))));
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
    }).catch(error => console.error(JSON.parse(JSON.stringify(error, null, 2))));
    if (!result) return { error: 'connection', data: null };

    const { error, loading, data } = result;
    if (loading) return { error: 'loading', data: null };
    if (error) return { error: 'error', data: null };

    const user = data.createUser.data;
    if (!user) return { error: data.createUser.error, data: null };

    setUser({
      username, 
      loggedIn: true, 
      avatar: user.avatar, 
      bio: user.bio, 
      maps: user.maps
    });
    return { error: null, data: user };
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
      loggedIn: true, 
      avatar: user.avatar, 
      bio: user.bio, 
      maps: user.maps
    });
    return { error: null, data: user };
  }

  const deleteUser = async (username, password) => {
    password = CryptoJs.MD5(password).toString();
    
    const result = await deleteUserMutation({
      variables: { username, password }
    }).catch(error => console.error(JSON.parse(JSON.stringify(error, null, 2))));
    if (!result) return { error: 'connection', data: null };

    const { error, loading, data } = result;
    if (loading) return { error: 'loading', data: null };
    if (error) return { error: 'error', data: null };

    const user = data.deleteUser.data;
    if (!user) return { error: data.deleteUser.error, data: null };

    logout();
    return { error: null, data: user };
  }

  const createMap = async (username, mapData) => {
    const result = await createMapMutation({
      variables: { username, data: mapData }
    }).catch(error => console.error(JSON.parse(JSON.stringify(error, null, 2))));
    if (!result) return { error: 'connection', data: null };

    const { error, loading, data } = result;
    if (loading) return { error: 'loading', data: null };
    if (error) return { error: 'error', data: null };

    const map = data.createMap.data;
    if (!map) return { error: data.createMap.error, data: null };

    setMaps([...maps, map.mapName]);

    return { error: null, data: map };
  }

  const editMap = async (username, mapData) => {
    const result = await editMapMutation({
      variables: { username, data: mapData }
    }).catch(error => console.error(JSON.parse(JSON.stringify(error, null, 2))));
    if (!result) return { error: 'connection', data: null };

    const { error, loading, data } = result;
    if (loading) return { error: 'loading', data: null };
    if (error) return { error: 'error', data: null };

    const map = data.editMap.data;
    if (!map) return { error: data.editMap.error, data: null };

    return { error: null, data: map };
  }

  const deleteMap = async (username, mapName) => {
    const result = await deleteMapMutation({
      variables: { username, mapName }
    }).catch(error => console.error(JSON.parse(JSON.stringify(error, null, 2))));
    if (!result) return { error: 'connection' };

    const { error, loading, data } = result;
    if (loading) return { error: 'loading' };
    if (error) return { error: 'error' };
    if (data.deleteMap.error) return { error: data.deleteMap.error };

    setMaps(maps.filter(name => name !== mapName));

    return { error: null };
  }

  return (
    <HookContext.Provider
      value = {{
        login,
        logout,
        getMap,
        createUser,
        editUser,
        createMap,
        editMap,
        deleteUser,
        deleteMap,
        setUsername,
        setBio, 
        setAvatar, 
        setPageNum, 
        setMaps, 
        username,
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