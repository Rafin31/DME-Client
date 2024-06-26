import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';




const userContext = createContext({})

const AuthContext = ({ children }) => {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    let user = JSON.parse(localStorage.getItem('user'));

    const signOut = () => {
        localStorage.clear('accessToken')
        localStorage.clear('user')
        navigate('/')
    }

    const signIn = (user) => {
        const userInfo = {
            id: user.data?.data?._id,
            email: user.data?.data?.email
        }
        if (user.data.data.staffId) {
            userInfo.staffId = user.data.data.staffId
            userInfo.staffEmail = user.data.data.staffEmail
        }

        localStorage.setItem('user', JSON.stringify(userInfo))
        localStorage.setItem('accessToken', user.data?.data?.token)

        navigate('/DME-supplier/dashboard', { replace: true });
    }

    const isLogin = () => {
        setLoading(true)

        const user = localStorage.getItem('user')
        const token = localStorage.getItem('accessToken')

        if (!token || !user) {
            setLoading(false)
            return false;
        }

        if (Date.now() >= token.exp * 1000) {
            setLoading(false)
            return false;
        }
        setLoading(false)
        return true

    }

    const loggedInUser = () => {
        return user
    }

    return (
        <userContext.Provider value={{ signOut, signIn, isLogin, loading, loggedInUser }} >
            {children}
        </userContext.Provider>
    );
};



export { AuthContext, userContext };