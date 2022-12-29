import axios from 'axios';

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
    console.log(error)
    return Promise.reject(error);
});



export {
    AuthRequest
}