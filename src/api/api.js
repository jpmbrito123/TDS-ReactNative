import axios from "axios";

import parseTrails from "./parsers/trailParser";
import parseAppAPI from './parsers/appParser';
import parseMediaAPI from './parsers/mediaParser';

import { insertApp } from '../database/queries/apps';
import { insertTrails } from "../database/queries/trail";
import { insertRelTrails } from "../database/queries/rel_trail";
import { insertPins } from "../database/queries/pin";
import { insertEdges } from "../database/queries/edge";
import { insertUser, updateUser } from '../database/queries/user';
import { insertPinRels } from "../database/queries/pin_rel";
import { insertContacts, insertMedia } from "../database/queries/contacts";
import { insertSocials } from "../database/queries/socials";
import { insertPartners } from "../database/queries/partners";
import { insertMedias } from "../database/queries/medias";

const baseUrl = "https://e70c-193-137-92-72.ngrok-free.app";

const trailsPath = "/trails";
const APP_ENDPOINT = "/app";
const LOGIN_ENDPOINT = "/login";
const USER_ENDPOINT = "/user";
const MEDIAS_ENDPOINT = "/content";

const CSRFTOKEN = 'csrftoken';
const CSRFTOKEN_RGX = /csrftoken=(.*?);/;
const SESSIONID = 'sessionid';
const SESSIONID_RGX = /sessionid=(.*?);/;
const MAXAGE = 'maxage';
const MAXAGE_RGX = /Max-Age=(.*?);/;

const apiInstance = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
});

export async function getTrails(db) {
    try {
        const response = await apiInstance.get(trailsPath);
        
        if (response.status !== 200) {
            console.log("Error fetching trails: code =", response.status);
            return;
        }

        const parsedData = parseTrails(response.data);

        await insertTrails(db, parsedData.trails);
        await insertRelTrails(db, parsedData.rel_trails);
        await insertPins(db, parsedData.pins);
        await insertPinRels(db, parsedData.rel_pins);
        await insertEdges(db, parsedData.edges);
        }
    catch (e) {
        console.log("[Api: getTrails] Error -", e);
    }
}

export async function attemptLogin(db, username, password) {
    return new Promise((resolve, reject) => {
        apiInstance.post(
            LOGIN_ENDPOINT,
            JSON.stringify({
                username: username,
                password: password,
            }),
            {
                withCredentials: false,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
        .then((response) => {
            const { headers, status, data } = response;

            if (status === 200) {
                // get connection cookies
                const cookies = headers['set-cookie'][0];
                const csrftoken = cookies.match(CSRFTOKEN_RGX)[1];
                const sessionid = cookies.match(SESSIONID_RGX)[1];
                const maxage = cookies.match(MAXAGE_RGX)[1];
                const success = {
                    all: cookies,
                    csrftoken: csrftoken,
                    sessionid: sessionid,
                    maxage: maxage,
                };
                // update user data on db
                insertUser(db, username, password).then(() => {
                    // return backend data for this user
                    resolve(success);
                });
            } else {
                console.log('[backendAPI]: error trying to connect to login');
                reject();
            }
        })
        .catch((err) => {
            console.error('Error trying to login:', err);
            reject(err);
        });
    });
}

export async function fetchUserDetails(db, username, cookies) {
    return new Promise((resolve, reject) => {
        apiInstance
        .get(    
            USER_ENDPOINT,
            {
                withCredentials: false,
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookies.join('; '),
                }
            }
        ).then(async (response) => {

            if (response) {
                data = response.data;

                const user = {
                    date_joined: data.date_joined,
                    email: data.email,
                    first_name: data.first_name,
                    is_staff: data.is_staff,
                    last_name: data.last_name,
                    user_type: data.user_type,
                    username: data.username,
                };

                updateUser(db, user).then((any) => resolve(user));
            }

            resolve(response);
        }).catch((err) => {
            console.log('[BackendAPI] [fetchUserDetails]: error ', err);
            reject(err);
        })
    });
}

export async function getAppInfo(db) {
    return new Promise((resolve, reject) => {
        apiInstance.get(APP_ENDPOINT)
            .then(async (response) => {

                data = response.data
                if (response.status !== 200) {
                    console.log('[BackendAPI] [getAppInfo]: Error fetching appInfo: code = ' + response.status)
                    return;
                }
                parsedObject = parseAppAPI(data);

                const app_info = parsedObject.app;
                const app_contacts= parsedObject.contacts;
                const app_socials = parsedObject.socials;
                const app_partners = parsedObject.partners;
              
                await insertApp(db, app_info);
                await insertContacts(db, app_contacts);
                await insertSocials(db, app_socials);
                await insertPartners(db, app_partners);
                

                resolve(response.data);
            }).catch ((error) => {
                console.error('[BackendAPI] [getAppInfo]: Error fetching app info: ', error);
            reject(error);
        });
    });
}
export async function getMedias(db) {
    return new Promise((resolve, reject) => {
        apiInstance.get(MEDIAS_ENDPOINT)
            .then(async (response) => {
                const data = response.data;
                
                if (response.status !== 200) {
                    console.log('[BackendAPI] [getMedias]: Error fetching media info: code = ' + response.status);
                    return reject(new Error('Error fetching media info: code ' + response.status));
                }

                const parsedObject = parseMediaAPI(baseUrl, data);
                await insertMedias(db, parsedObject);
                
                resolve(response.data);
            }).catch((error) => {
                console.error('[BackendAPI] [getMedias]: Error fetching medias: ', error);
                reject(error);
            });
    });
}



const apiService = {
    getTrails,
    getAppInfo,
    fetchUserDetails,
    attemptLogin,
    getMedias
};

export default apiService;
