import React, { useContext, memo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { userContext } from '../Context/AuthContext';



const AuthRoute = ({ children }) => {

    const location = useLocation();
    const { isLogin } = useContext(userContext)

    if (!isLogin()) {

        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default AuthRoute;