import React, { useContext } from 'react';
import { userContext } from '../Context/AuthContext';
import { AuthRequest } from './AuthRequest'

const CheckCategory = ({ children, category }) => {
    const { signOut } = useContext(userContext)

    let user = localStorage.getItem('user');
    user = JSON.parse(user);

    const { id } = user

    AuthRequest.get(`/api/v1/users/${id}`)
        .then(res => {
            if (res.data.data.category !== category) {
                return signOut()
            }
        })


    return children;

};

export default CheckCategory;