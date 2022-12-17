import axios from 'axios';

const AuthRequest = axios.create(
    {
        baseURL: "http://localhost:5000",
        headers: {
            "Content-type": "application/json"
        }
    }
)

AuthRequest.interceptors.request.use((config) => {

    // const token = `Bearer ${localStorage.getItem('accessToken')}`
    // const token = `Bearer test`
    // config.headers.authorization = token
    return config;

}, (error) => {
    console.log(error)
    return Promise.reject(error);
});



export {
    AuthRequest
}