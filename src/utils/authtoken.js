import React, { Children, useContext, createContext, useState, useEffect } from "react";
import api from "../api/api";
import { useDbContext } from "../database/dbContext";
import EncryptedStorage from 'react-native-encrypted-storage';
import { Alert } from "react-native";


export const AuthContext = createContext({
    username: null,
    setUsername: () => {}
});

export const AuthProvider = ({ children }) => {

    /**
     * user session details
     */
    const db = useDbContext();


    const CSRFTOKEN = 'csrftoken=';
    const SESSIONID = 'sessionid='
 

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    const [username, setUsername] = useState('');
    const [sessionid, setSessionId] = useState('');
    const [csrftoken, setCsrftoken] = useState('');
    const [fullCookie, setFullCookie] = useState('');
    const [user_type, setUserType] = useState('');

    /**
     * always check if a session was in place before opening the app
     */
    useEffect(function() {
        
        async function tryToReconnect() {
            await bypassLogin();
        }
        tryToReconnect();
        
    }, []);

    /**
     * | perform a login attempt, storing the received session details
     * @param {*} user_name 
     * @param {*} password 
     */
    const login = async (user_name, password) => {

        const response = await api.attemptLogin(db, user_name, password);
        if (response !== null) {

            const storeInfo = {
                username: user_name, 
                sessionid: SESSIONID + response.sessionid,
                csrftoken: CSRFTOKEN + response.csrftoken,
                isLoggedIn: true,
            };
        
            setUsername(user_name);
            setSessionId(storeInfo.sessionid);
            setCsrftoken(storeInfo.csrftoken);
            setFullCookie(response.all);
            setIsLoggedIn(true);

            await storeUserSession(storeInfo);
        }
    }

    /**
     * logout a user
     */
    const logout = async () => {

        setUsername('');
        setSessionId('');
        setCsrftoken('');
        setFullCookie('');
        setUserType('');
        setIsLoggedIn(false);
        await removeUserSession();
    }

    /**
     * | store the current user's usage type
     * @param {*} user_type 
     */
    async function storeUserType(user_type) {
        
        setUserType(user_type);
        try {
            await EncryptedStorage.setItem(
                "user_session",
                JSON.stringify({

                    username: username,
                    sessionid: sessionid,
                    csrftoken: csrftoken,
                    isLoggedIn: isLoggedIn,
                    user_type: user_type,
                })
            );

        } catch (error) {
            console.log('[authContext]: error ', error);
        }
    }

    /**
     * | store a user's session info
     * @param {*} login_response 
     */
    async function storeUserSession(login_response) {
        try {
            await EncryptedStorage.setItem(
                "user_session",
                JSON.stringify({

                    username: login_response.username,
                    sessionid: login_response.sessionid,
                    csrftoken: login_response.csrftoken,
                    isLoggedIn: login_response.isLoggedIn,
                    user_type: user_type,
                    //age : 21,
                    //token : "ACCESS_TOKEN",
                    //username : "emeraldsanto",
                    //languages : ["fr", "en", "de"]
                })
            );
        } catch (error) {
            console.log('[authContext]: error ', error);
        }
    }

    /**
     * | get stored info on user session
     * @returns 
     */
    async function retrieveUserSession() {

        return EncryptedStorage.getItem('user_session')
        .then((response) => {
            
            console.log(response);
            if (response) {
                const parsedSession = JSON.parse(response);
                setUsername(parsedSession.username);
                setSessionId(parsedSession.sessionid);
                setCsrftoken(parsedSession.csrftoken);
                setIsLoggedIn(parsedSession.isLoggedIn);
                setUserType(parsedSession.user_type);
            }
            return response
        }).catch((error) => {
            console.log('[authContext] [retrieveUserSession]: error ', error);
        })
    }

    /**
     * clean user session stored details 
     */
    async function removeUserSession() {
        try {
            await EncryptedStorage.removeItem("user_session");
        } catch (error) {
            console.log('[authContext] [removeUserSession]: error ', error);
        }
    }

    /**
     * | if the last stored session details are still valid in the backend, let the user
     *  continue using its session
     * @returns 
     */
    const bypassLogin = async () => {

        return new Promise((resolve, reject) => {

            retrieveUserSession()
            .then( async () => {
                
                if (username) {
                    const response = await api.fetchUserDetails(db, username, [sessionid, csrftoken]);
                    if (response !== null && response !== undefined) {
                    
                        // session is preserved!
                        Alert.alert("Welcome back, ", username);
                    } else {
                        logout();
                        await removeUserSession();
                    }
                    resolve(response);
                }
                resolve();
            })
            .catch(async (error) => {
                console.log('[authContext] [bypassLogin]: error ', error);
                logout();
                await removeUserSession()
                reject(error);
            });
        });
    }



    return (
        <AuthContext.Provider 
        value = {{
            storeUserType,
            bypassLogin,
            login, 
            logout, 
            isLoggedIn, 
            username, 
            sessionid,
            csrftoken,
            fullCookie,
            user_type,
        }}>
            
            {Children.toArray(children)}
        </AuthContext.Provider>
    );
}