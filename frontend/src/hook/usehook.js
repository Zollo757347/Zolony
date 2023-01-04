import { useQuery, useMutation } from "@apollo/client";
import CryptoJs from 'crypto-js'
import { useState, useEffect } from "react";
import {LOG_IN, GET_MAP, CREATE_ACCOUNT, EDIT_PROFILE, INITIAL_MY_MAP, EDIT_MY_MAP, DELETE_USER, DELETE_USER_MAP} from '../graphql';


const [user, setUser] = useState('');
const [password, setPassword] = useState('');
const [isLogIn, setIsLogIn] = useState(false);



const logIn = (name, pwd) => {
    const cryptopwd = CryptoJs.MD5(pwd).toString();
    const {loading, data, error} = useQuery(LOG_IN, {
        variables: {
            data: {
                name: name,
                password: cryptopwd, 
            }
        }
    });
    if(loading) return 'loading...';
    if(error){
        console.log(`[logIn function error]: ${error.message}.`);
        return 'error';
    }
    else {
        if(!data.logIn){
            console.log(`user not found.`);
            return 'user not found';
        } 
        setUser(name);
        setPassword(cryptopwd);
        setIsLogIn(true);
        console.log(`data query succeed.`);
        console.log(data.logIn);
        return data.logIn;
    }
}

const getMap = (name, mapName) => {
    const {loading, data, error} = useQuery(GET_MAP, {
        variables: {
            data: {
                name: name,
                mapName: mapName,
            }
        }
    });
    if(loading) return 'loading...';
    if(error){
        console.log(`[getMap function error]: ${error.message}.`);
        return 'error';
    }
    else {
        if(!data.getMap){
            console.log(`user not found.`);
            return 'user not found';
        }
        console.log(`getmap succeed.`);
        console.log(data.getMap);
        return data.getMap;
    }
}

const createAccount = async (name, pwd) => {
    const cryptopwd = CryptoJs.MD5(pwd).toString();
    const [createAccountMutation, {loading, data, error}] = useMutation(CREATE_ACCOUNT);
    await createAccountMutation({
        variables: {
            data: {
                name: name,
                password: cryptopwd,
            }
        }
    }) 
    if(loading) return 'loading...';
    if(error){
        console.log(`[createAccount function error]: ${error.message}.`);
        return 'error';
    }
    else {
        if(!data.createAccount){
            console.log(`${name} already used.`);
            return '';
        } 
        setUser(name);
        setPassword(cryptopwd);
        setIsLogIn(true);
        return data.createAccount;
    }
}

const logOut = () => {
    setUser('');
    setPassword('');
    setIsLogIn(false);
}

/* must wrap into a object

input = {
    newPassword,
    newAvatar,
    newBio,
    newLevel
}
*/

const editProfile = async (input) => {
    const [editProfileMutation, {data, loading, error}] = useMutation(EDIT_PROFILE);
    await editProfileMutation({
        variables: {
            data: {
                name: user,
                password: password,
                newPassword: input.newPassword ? CryptoJs.MD5(input.newPassword).toString() : undefined,
                newAvatar: input.newAvatar,
                newBio: input.newBio,
                newLevel: input.newLevel,
            }
        }
    })
    if(loading) return 'loading...';
    if(error){
        console.log(`[editProfile function error]: ${error.message}.`);
        return 'error';
    }
    else {
        if(!data.editProfile){
            console.log(`user not found.`);
            return 'user not found';
        } 
        setPassword(CryptoJs.MD5(input.newPassword).toString());
        console.log(`edit profile succeed.`)
        return data.editProfile;
    }
}

const initialMyMap = async (xLen, yLen, zLen, mapName) => {
    const [initialMyMapMutation, {data, error, loading}] = useMutation(INITIAL_MY_MAP);
    await initialMyMapMutation({
        variables: {
            data: {
                name: user,
                password: password,
                mapName: mapName,
                xLen: xLen,
                yLen: yLen,
                zLen: zLen,
            }
        }
    })
    if(loading) return 'loading...';
    if(error){
        console.log(`[initialMyMap function error]: ${error.message}.`);
        return 'error';
    }
    else {
        if(!data.initialMyMap){
            console.log(`map already exist.`);
            return 'map already exist';
        } 
        console.log(`initialmap succeed`);
        console.log(data.initialMyMap);
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
        blockName,
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

const editMyMap = async (map) => {
    const [editMyMapMutation, {data, error, loading}] = useMutation(EDIT_MY_MAP);
    await editMyMapMutation({
        variables: {
            data: {
                name: user,
                password: password,
                mapName: map.mapName,
                map: map,
            }
        }
    })
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
        return data.editMyMap;
    }
}

const deleteUser = async () => {
    const [deleteUserMutation, {data, error, loading}] = useMutation(DELETE_USER);
    await deleteUserMutation({
        variables: {
            data: {
                name: user,
                password: password,
            }
        }
    })
    if(loading) return 'loading...';
    if(error){
        console.log(`[deleteUser function error]: ${error.message}.`);
        return false;
    }
    logOut();
    return data.deleteUser;
}

const deleteUserMap = async (mapName) => {
    const [deleteUserMapMutation, {data, error, loading}] = useMutation(DELETE_USER_MAP);
    await deleteUserMapMutation({
        variables: {
            data: {
                name: user,
                password: password,
                mapName: mapName,
            }
        }
    })
    if(loading) return 'loading...';
    if(error){
        console.log(`[deleteUserMap function error]: ${error.message}.`);
        return false;
    }
    return data.deleteUserMap;
}

export const usehook = () => {
    return({
        logIn: logIn,
        logOut: logOut,
        getMap: getMap,
        createAccount: createAccount,
        editProfile: editProfile,
        initialMyMap: initialMyMap,
        editMyMap: editMyMap,
        deleteUser: deleteUser,
        deleteUserMap: deleteUserMap,
        user: user,
        isLogIn: isLogIn,
    })
}
