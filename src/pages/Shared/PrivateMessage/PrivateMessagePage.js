import { Box, Button, CircularProgress, Container, Stack, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { MessageContext } from '../../../Context/PrivateMessageContext';
import Iconify from '../../../components/iconify';
import SendMessageModal from '../SendMessageModal';
import { Message } from './Message';
import { toast } from 'react-toastify';
import { fDateTime } from '../../../utils/formatTime';

const PrivateMessagePage = () => {

    const [toValue, setToValue] = useState("")
    const [sendMessage, setSendMessage] = useState(false)

    let user = localStorage.getItem('user');
    user = JSON.parse(user);

    const { allActiveUsersLoading,
        allActiveUsers,
        fromLoading,
        fromUsers,
        sendingMessageLoading,
        sentMessage,
        messageBySenderLoading,
        messageBySender } = useContext(MessageContext)


    const handleSendMessage = async (e) => {
        e.preventDefault()
        setSendMessage(!sendMessage)
        const senderId = fromUsers._id
        const receiverId = toValue.id
        const subject = e.target.subject.value
        const message = e.target.message.value
        const hasRead = false

        if (!senderId || !receiverId || !subject || !message) {
            return toast.error("All fields are required!", {
                toastId: 'error656'
            })
        }
        const res = await sentMessage({
            senderId,
            receiverId,
            subject,
            message,
            hasRead
        })

        if (res.status === 200) {
            toast.success("Message Sent", {
                toastId: 'success699'
            })
        } else {
            toast.error("Something went Wrong", {
                toastId: 'error9735'
            })
        }
    }

    const removeDuplicate = (data) => {

        if (data === "No messages found!") {
            return []
        }

        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const conversationThreads = new Map();

        sortedData.forEach((message) => {
            const { senderId, receiverId } = message;

            const key1 = `${senderId._id}+${receiverId._id}`;
            const key2 = `${receiverId._id}+${senderId._id}`;

            if (!conversationThreads.has(key1) && !conversationThreads.has(key2)) {
                conversationThreads.set(key1, message);
            }
        });

        const result = Array.from(conversationThreads.values());
        return result

    }


    if (sendingMessageLoading || messageBySenderLoading || fromLoading) {
        return <Box style={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }

    const uniqueUser = removeDuplicate(messageBySender)


    return (
        <Container maxWidth="1350px">
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Private Message
                </Typography>
                <Button variant="contained" onClick={() => setSendMessage(!sendMessage)} startIcon={
                    <Iconify icon="material-symbols:send-rounded" />}>
                    Send New Message
                </Button>
            </Stack>

            <SendMessageModal open={sendMessage} setOpen={setSendMessage} handelFormSubmit={handleSendMessage} to={allActiveUsers} setToValue={setToValue} from={fromUsers} title={"Send Message"} loading={allActiveUsersLoading || fromLoading} />

            <Stack>
                {
                    uniqueUser && uniqueUser?.length !== 0 ? uniqueUser?.map((message, index) => {

                        return (
                            <Message
                                senderId={message.senderId._id}
                                receiverId={message.receiverId._id}
                                from={message.senderId.fullName}
                                to={message.receiverId.fullName}
                                subject={message.subject}
                                message={message.message}
                                timeStamp={fDateTime(message.createdAt)}
                                unread={message.hasRead}
                            />
                        )
                    })
                        : "No Messages!"
                }


            </Stack>


        </Container>
    );
};

export default PrivateMessagePage;