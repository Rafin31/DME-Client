import React, { createContext, useContext, useEffect, useState } from 'react';
import { userContext } from '../Context/AuthContext';
import { AuthRequest } from './AuthRequest'

export const LoggedInUserContext = createContext()

const CheckCategory = ({ children, category }) => {
    const { signOut } = useContext(userContext)
    const [loggedUser, setLoggedUser] = useState()

    let user = JSON.parse(localStorage.getItem('user'));

    const { id } = user

    useEffect(() => {
        AuthRequest.get(`/api/v1/users/${id}`)
            .then(res => {
                setLoggedUser(res.data.data)
                if (res.data.data.category !== category) {
                    return signOut()
                }
            })

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