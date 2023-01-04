import { useQuery, useMutation } from "@apollo/client";
import CryptoJs from 'crypto-js'
import { createContext, useContext, useState, useEffect } from "react";
import {LOG_IN, GET_MAP, CREATE_ACCOUNT, EDIT_PROFILE, INITIAL_MY_MAP, EDIT_MY_MAP, DELETE_USER, EDIT_PROFILE} from '../graphql';


const [user, setUser] = useState('');
const [password, setPassword] = useState('');
const [isLogIn, setIsLogIn] = useState(false);

const LogIn = (name, pwd) => {
    const cryptopwd = CryptoJs.MD5(pwd).toString();useMutation
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
        if(!data) return 'not found';
        setUser(name);
        setPassword(cryptopwd);
    }
}



