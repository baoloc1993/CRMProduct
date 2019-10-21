import Cookies from 'js-cookie'
import axios from "axios";

export const URL_PREFIX = "http://http://112.78.4.119:8080/";
export const authentication =  (url,callback) => {
    let token = Cookies.get('access_token');
    token = ("Bearer " + token);
    let URL = URL_PREFIX + url;
    axios.defaults.headers.common['Authorization'] = token;
    axios.post(URL, {
    }).then(r => {
        console.log(r);
        if (r.status == 200) {
            callback(true);
        } else {
            callback(false);
        }
    }).catch(e =>{
        console.log(e);
        callback(false);
    });

};

export const getRole =  (callback) => {
    let token = Cookies.get('access_token');
    token = ("Bearer " + token);
    let URL = URL_PREFIX + "getRole";
    axios.defaults.headers.common['Authorization'] = token;
    axios.post(URL, {
    }).then(r => {
        if (r.status == 200) {
            callback(r.data.role);
        } else {
            callback("GUEST");
        }
    }).catch(e =>{
        console.log(e);
        callback("GUEST");
    });

};

export const listRoles =  (callback) => {
    let token = Cookies.get('access_token');
    token = ("Bearer " + token);
    let URL = URL_PREFIX  + "listRoles";
    axios.get(URL, {
    }).then(r => {
        if (r.status == 200) {
            callback(r.data.roles);
        } else {
            callback([]);
        }
    }).catch(e =>{
        console.log(e);
        callback(undefined);
    });

};
