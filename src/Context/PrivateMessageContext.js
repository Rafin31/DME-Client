import React, { createContext } from 'react';
import { useMutation, useQuery } from 'react-query';
import { AuthRequest } from 'src/services/AuthRequest';
const MessageContext = createContext()

const PrivateMessageContext = ({ children }) => {

    let user = localStorage.getItem('user');
    user = JSON.parse(user);

    const { isLoading: allActiveDmeLoading, data: allActiveDme } = useQuery(`allActiveDme`,
        async () => {
            return AuthRequest.get(`/api/v1/dme/active-dme`,).then(data => data.data.data)
        }
    )

    const { isLoading: allActiveUsersLoading, data: allActiveUsers } = useQuery(`allActiveUser`,
        async () => {
            return AuthRequest.get(`/api/v1/users/active-user`,).then(data => data.data.data)
        }
    )

    const { isLoading: fromLoading, data: fromUsers } = useQuery(`fromUser`,
        async () => {
            return AuthRequest.get(`/api/v1/users/${user.id}`,).then(data => data.data.data)
        }
    )

    const { isLoading: messageBySenderLoading, refetch: fetchMessage, data: messageBySender } = useQuery(`messageBySender`,
        async () => {
            return AuthRequest.get(`/api/v1/private-message/sender/${user.id}`,).then(data => data.data.data)
        }
    )

    const GetChat = (receiverId, senderId) => {
        const { isLoading: chatLoading, refetch: fetchChat, data: chat } = useQuery(["chat", receiverId, senderId],
            async () => {
                return AuthRequest.get(`/api/v1/private-message/chat/${receiverId}?si=${senderId}`,).then(data => data.data.data)
            }
        )

        return { chatLoading, chat, fetchChat }
    }



    const { mutateAsync: sentMessage, isLoading: sendingMessageLoading } = useMutation((message) => {
        return AuthRequest.post(`/api/v1/private-message`, message)
            .then(res => {
                fetchMessage()
                return res
            })
            .catch((err) => {
                return err
            })

    })

    return (
        <MessageContext.Provider
            value={{
                allActiveUsersLoading: allActiveUsersLoading,
                allActiveDmeLoading: allActiveDmeLoading,
                allActiveDme: allActiveDme,
                allActiveUsers: allActiveUsers,
                fromLoading: fromLoading,
                fromUsers: fromUsers,
                sendingMessageLoading: sendingMessageLoading,
                sentMessage: sentMessage,
                messageBySenderLoading: messageBySenderLoading,
                messageBySender: messageBySender,
                GetChat: GetChat
            }}>

            {children}
        </MessageContext.Provider>
    );
};

export { PrivateMessageContext, MessageContext };