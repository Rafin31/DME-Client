import React, { createContext, useContext, useEffect, useState } from 'react';
import { userContext } from '../Context/AuthContext';
import { AuthRequest } from './AuthRequest'

export const LoggedInUserContext = createContext()

const CheckCategory = ({ children, category }) => {
    const { signOut } = useContext(userContext)
    const [loggedUser, setLoggedUser] = useState()
    let categoryArray = category.split(", ");

    let user = JSON.parse(localStorage.getItem('user'));

    const { id, staffId } = user


    useEffect(() => {
        if (!staffId) {
            AuthRequest.get(`/api/v1/users/${id}`)
                .then(res => {
                    if (categoryArray.indexOf(res.data.data.category) === -1) {
                        return signOut()
                    }
                    setLoggedUser(res.data.data)
                })
        } else {
            AuthRequest.get(`/api/v1/users/${staffId}`)
                .then(res => {
                    if (categoryArray.indexOf(res.data.data.category) === -1) {
                        return signOut()
                    }
                    setLoggedUser(res.data.data)
                })
        }


        return () => {
            setLoggedUser()
        }
    }, [category, id, signOut])


    return (
        <LoggedInUserContext.Provider value={{ loggedUser }}>
            {children}
        </LoggedInUserContext.Provider>
    );

};

const useLoginUser = () => {
    const userContext = useContext(LoggedInUserContext)
    return userContext
}

export { CheckCategory, useLoginUser };