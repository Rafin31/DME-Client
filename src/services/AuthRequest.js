import axios from 'axios';
import { useContext } from 'react';
import { useQueryClient } from 'react-query';
import { userContext } from '../../src/Context/AuthContext';

const AuthRequest = axios.create(
    {
        baseURL: process.env.REACT_APP_SERVER,
        headers: {
            "Content-type": "application/json"
        }
    }
)

AuthRequest.interceptors.request.use((config) => {

    const token = `Bearer ${localStorage.getItem('accessToken')}`
    config.headers.authorization = token
    return config;

}, (error) => {
    return Promise.reject(error);
});

AuthRequest.interceptors.response.use(

    (response) => {

        // If response status is not 400, return the response
        if (response.status !== 400) {
            return response;
        }
        // If response status is 400, redirect to home page
        // window.location.href = '/';
        // return Promise.reject(response);
    },
    (error) => {
        // If response status is 400, redirect to home page
        console.log("error=>", error)
        if (error.response && error.response.status === 404) {

            // window.location.href = '/';
        }
        return Promise.reject(error);
    }
);



export {
    AuthRequest
}