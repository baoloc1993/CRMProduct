import Cookies from "js-cookie";
import axios from "axios";
import {Redirect} from "react-router";
import React from "react";

export const logout =  () => {
    let token = Cookies.get('access_token');
    token = ("Bearer " + token);
    let URL = "http://112.78.4.119:8080/login/logout"
    axios.defaults.headers.common['Authorization'] = token;
    axios.post(URL, {
    }).then(r => {

        if (r.status == 200) {
            Cookies.set('access_token', undefined);
            window.location.href = "/login"

        } else {
            return <Redirect to={"/home"}/>
        }
    }).catch(e =>{
        return <Redirect to={"/home"}/>
    });
    return <div/>
};
