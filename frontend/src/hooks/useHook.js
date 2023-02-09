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

  user: {
    loggedIn: false,
    username: '',
    avatar: '',
    bio: '',
    maps: []
  }
});

const HookProvider = (props) => {
  const [user, _setUser] = useState({
    loggedIn: !!savedUsername,
    username: savedUsername,
    avatar: savedAvatar,
    bio: savedBio,
    maps: JSON.parse(savedMaps)
  });

  const [loginQuery] = useLazyQuery(LOG_IN);
  const [getMapQuery] = useLazyQuery(GET_MAP, { fetchPolicy: 'network-only' });
  const [createUserMutation] = useMutation(CREATE_USER);
  const [editUserMutation] = useMutation(EDIT_USER);
  const [deleteUserMutation] = useMutation(DELETE_USER);
  const [createMapMutation] = useMutation(CREATE_MAP);
  const [editMapMutation] = useMutation(EDIT_MAP);
  const [deleteMapMutation] = useMutation(DELETE_MAP);

  const setUser = (data) => {
    const newData = {
      loggedIn: data.loggedIn ?? user.loggedIn, 
      username: data.username ?? user.username, 
      avatar: data.avatar ?? user.avatar, 
      bio: data.bio ?? user.bio, 
      maps: data.maps ?? user.maps
    };

    _setUser(newData);
    localStorage.setItem(LSK_USERNAME, newData.username);
    localStorage.setItem(LSK_AVATAR, newData.avatar);
    localStorage.setItem(LSK_BIO, newData.bio);
    localStorage.setItem(LSK_MAPS, JSON.stringify(newData.maps));
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

    const newUser = data.login.data;
    if (!newUser) return { error: data.login.error, data: null };

    setUser({
      username, 
      loggedIn: true, 
      avatar: newUser.avatar, 
      bio: newUser.bio, 
      maps: newUser.maps
    });

    return { error: null, data: newUser };
  }

  const logout = () => {
    setUser({
      username: '', 
      loggedIn: false, 
      avatar: '', 
      bio: '', 
      maps: []
    });
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

    const newUser = data.createUser.data;
    if (!newUser) return { error: data.createUser.error, data: null };

    setUser({
      username, 
      loggedIn: true, 
      avatar: newUser.avatar, 
      bio: newUser.bio, 
      maps: newUser.maps
    });
    return { error: null, data: newUser };
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

    const newUser = data.editUser.data;
    if (!newUser) return { error: data.editUser.error, data: null };

    setUser({
      username: newUser.username, 
      loggedIn: true, 
      avatar: newUser.avatar, 
      bio: newUser.bio, 
      maps: newUser.maps
    });
    return { error: null, data: newUser };
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

    const oldUser = data.deleteUser.data;
    if (!oldUser) return { error: data.deleteUser.error, data: null };

    logout();
    return { error: null, data: oldUser };
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

    setUser({ maps: [...user.maps, map.mapName] });
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

    setUser({ maps: user.maps.filter(name => name !== mapName) });
    return { error: null };
  }

  return (
    <HookContext.Provider
      value = {{
        login, 
        logout, 
        createUser, 
        editUser, 
        deleteUser, 

        getMap, 
        createMap, 
        editMap, 
        deleteMap, 

        user
      }}
      {...props}
    />
  );  
}

const useHook = () => useContext(HookContext);
export { HookProvider, useHook };