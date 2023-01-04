import { useQuery, useMutation } from "@apollo/client";
import CryptoJs from 'crypto-js'
import { useState, useEffect } from "react";
import {LOG_IN, GET_MAP, CREATE_ACCOUNT, EDIT_PROFILE, INITIAL_MY_MAP, EDIT_MY_MAP, DELETE_USER, DELETE_USER_MAP} from '../graphql';


const [user, setUser] = useState('');
const [password, setPassword] = useState('');
const [isLogIn, setIsLogIn] = useState(false);

const [createAccountMutation] = useMutation(CREATE_ACCOUNT);
const [editProfileMutation] = useMutation(EDIT_PROFILE);
const [initialMyMapMutation] = useMutation(INITIAL_MY_MAP);
const [editMyMapMutation] = useMutation(EDIT_MY_MAP);
const [deleteUserMutation] = useMutation(DELETE_USER);
const [deleteUserMapMutation] = useMutation(DELETE_USER_MAP);


const logIn = (name, pwd) => {
    const cryptopwd = CryptoJs.MD5(pwd).toString();
    const {loading, data} = useQuery(LOG_IN, {
        variables: {
            data: {
                name: name,
                password: cryptopwd, 
            }
        }
    });
    if(loading) return 'loading...';
    else {
        if(!data.logIn) return 'not found';
        setUser(name);
        setPassword(cryptopwd);
        setIsLogIn(true);
        return data.logIn;
    }
}

const getMap = (name, mapName) => {
    const {loading, data} = useQuery(GET_MAP, {
        variables: {
            data: {
                name: name,
                mapName: mapName,
            }
        }
    });
    if(loading) return 'loading...';
    else {
        if(!data.getMap) return 'not found';
        return data.getMap;
    }
}

const createAccount = async (name, pwd) => {
    const cryptopwd = CryptoJs.MD5(pwd).toString();
    const {data, loading} = await createAccountMutation({
        variables: {
            data: {
                name: name,
                password: cryptopwd,
            }
        }
    }) 
    if(loading) return 'loading...';
    else {
        if(!data.createAccount) return '';
        setUser(name);
        setPassword(cryptopwd);
        setIsLogIn(true);
        return data.logIn;
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
    const {data, loading} = await editProfileMutation({
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
    else {
        if(!data.createAccount) return '';
        setPassword(CryptoJs.MD5(input.newPassword).toString());
        return data.editProfile;
    }
}

const initialMyMap = async () => {
    
}

const editMyMap = async () => {

}

const deleteUser = async () => {

}

const deleteUserMap = async () => {

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
    })
}
