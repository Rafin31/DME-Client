import React, { createContext, useContext } from 'react';

import io from 'socket.io-client';

const SocketContext = createContext({})


const AppSocket = ({ children }) => {

    const serverURL = process.env.REACT_APP_SERVER
    const socket = io(serverURL);

    return (
        <SocketContext.Provider value={{ socket }} >
            {children}
        </SocketContext.Provider>
    );
};


const useSocketContext = () => {
    const socket = useContext(SocketContext)
    return socket
}



export { AppSocket, useSocketContext }
