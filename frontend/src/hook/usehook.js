import { useLazyQuery, useMutation } from "@apollo/client";
import CryptoJs from 'crypto-js'
import { createContext, useContext, useState, useEffect } from "react";
import {LOG_IN, GET_MAP, CREATE_ACCOUNT, EDIT_PROFILE, INITIAL_MY_MAP, EDIT_MY_MAP, DELETE_USER, DELETE_USER_MAP} from '../graphql';


const HookContext = createContext({
    LogIn: () => {},
    LogOut: () => {},
    GetMap: () => {},
    CreateAccount: () => {},
    EditProfile: () => {},
    InitialMyMap: () => {},
    EditMyMap: () => {},
    DeleteUser: () => {},
    DeleteUserMap: () => {},
    user: '',
    isLogIn: false,
  });


const HookProvider = (props) => {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [isLogIn, setIsLogIn] = useState(false);

    const [createAccountMutation] = useMutation(CREATE_ACCOUNT);
    const [editProfileMutation] = useMutation(EDIT_PROFILE);
    const [initialMyMapMutation] = useMutation(INITIAL_MY_MAP);
    const [editMyMapMutation] = useMutation(EDIT_MY_MAP);
    const [deleteUserMutation] = useMutation(DELETE_USER);
    const [deleteUserMapMutation] = useMutation(DELETE_USER_MAP);
    const [logInQuery] = useLazyQuery(LOG_IN);
    const [getMapQuery] = useLazyQuery(GET_MAP);

    const LogIn = async (name, pwd) => {
        const cryptopwd = CryptoJs.MD5(pwd).toString();
        const {error, loading, data} = await logInQuery({
            variables: {
                name: name,
                password: cryptopwd,
            }
        })
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

    const GetMap = async (name, mapName) => {
        const {loading, data, error} = await getMapQuery({
            variables: {
                name: name,
                mapName: mapName,
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

    const CreateAccount = async (name, pwd) => {
        const cryptopwd = CryptoJs.MD5(pwd).toString();
        const {loading, data, error} = await createAccountMutation({
            variables: {
                name: name,
                password: cryptopwd,
            }
        });

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

    const LogOut = () => {
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

    const EditProfile = async (input) => {
        
        const {loading, data, error} = await editProfileMutation({
            variables: {
                name: user,
                password: password,
                newPassword: input.newPassword ? CryptoJs.MD5(input.newPassword).toString() : undefined,
                newAvatar: input.newAvatar,
                newBio: input.newBio,
                newLevel: input.newLevel,
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

    const InitialMyMap = async (xLen, yLen, zLen, mapName) => {
        
        const {loading, data, error} = await initialMyMapMutation({
            variables: {
                name: user,
                password: password,
                mapName: mapName,
                xLen: xLen,
                yLen: yLen,
                zLen: zLen,
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

    const EditMyMap = async (map) => {
        
        const {loading, data, error} = await editMyMapMutation({
            variables: {
                name: user,
                password: password,
                mapName: map.mapName,
                map: map,
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

    const DeleteUser = async () => {
        
        const {loading, data, error} = await deleteUserMutation({
            variables: {
                name: user,
                password: password,
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

    const DeleteUserMap = async (mapName) => {
        
        const {loading, data, error} = await deleteUserMapMutation({
            variables: {
                name: user,
                password: password,
                mapName: mapName,
            }
        })
        if(loading) return 'loading...';
        if(error){
            console.log(`[deleteUserMap function error]: ${error.message}.`);
            return false;
        }
        return data.deleteUserMap;
    }
    return (
        <HookContext.Provider
            value = {{
                LogIn,
                LogOut,
                GetMap,
                CreateAccount,
                EditProfile,
                InitialMyMap,
                EditMyMap,
                DeleteUser,
                DeleteUserMap,
                user,
                isLogIn,
            }}
            {...props}
        />
    );  
}

const UseHook = () => useContext(HookContext);
export { HookProvider, UseHook };