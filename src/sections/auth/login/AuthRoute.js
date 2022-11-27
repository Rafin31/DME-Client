import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';


const AuthRoute = ({ children }) => {

    const location = useLocation();
    const [user, setUser] = useState(true)

    if (!user) {

        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default AuthRoute;