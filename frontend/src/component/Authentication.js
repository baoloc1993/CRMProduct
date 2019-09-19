import Cookies from 'js-cookie'
import axios from "axios";

export const authentication =  (url,callback) => {
    let token = Cookies.get('access_token');
    token = ("Bearer " + token);
    let URL = "http://localhost:8080/" + url;
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
