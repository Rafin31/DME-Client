import React, { useContext, memo, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { userContext } from '../Context/AuthContext';



const AuthRoute = ({ children }) => {

    const location = useLocation();
    const { isLogin } = useContext(userContext)

    useEffect(() => {
        if (!isLogin()) {

            return <Navigate to="/login" state={{ from: location }} replace />;
        }
    }, [isLogin])


    return children;
};

export default AuthRoute;