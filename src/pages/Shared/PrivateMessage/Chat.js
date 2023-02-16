import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { Container, Stack } from '@mui/system';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import Iconify from '../../../components/iconify';
import { MessageContext } from '../../../Context/PrivateMessageContext';
import { fDateTime } from '../../../utils/formatTime';
import { ChatWidget } from './ChatWidget';
import { toast } from 'react-toastify';


const Chat = () => {

    const navigate = useNavigate()
    const messagesEndRef = useRef(null)

    const { id: receiverId } = useParams()

    const { search } = window.location;
    const params = new URLSearchParams(search);
    const senderId = params.get('si');


    let user = localStorage.getItem('user');
    user = JSON.parse(user);



    const { GetChat } = useContext(MessageContext)

    const { chatLoading, chat, fetchChat } = GetChat(receiverId, senderId)

    const { sentMessage } = useContext(MessageContext)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const handleChatSubmit = useCallback(
        async (e) => {
            e.preventDefault()

            const subject = e.target.subject.value
            const message = e.target.message.value

            const res = await sentMessage({
                senderId: user.id,
                receiverId,
                subject,
                message,
                hasRead: "false"
            })

            if (res.status === 200) {
                scrollToBottom()
                fetchChat()
            } else {
                toast.error("Something went Wrong", {
                    toastId: 'error9735'
                })
            }

            e.target.subject.value = " "
            e.target.message.value = " "
        }, [])


    useEffect(() => {
        scrollToBottom()
    }, [chat]);


    if (chatLoading) {
        return <Box style={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }


    return (
        <Container maxWidth="1350px" className="ChatContainer" margin="0px auto">
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0}>

                <Stack onClick={() => navigate(-1)} direction="row" spacing={1} style={{ cursor: "pointer", marginBottom: "15px", }} sx={{
                    "&:hover": {
                        color: "#3498db",
                    },
                }} >
                    <ArrowBackIcon /> <span>Back</span>
                </Stack>

                <Typography variant="h4" gutterBottom>
                    {chat[0]?.receiverId.fullName}
                </Typography>

                <Stack>

                </Stack>
            </Stack>


            <Stack className="chat">
                {
                    chat?.length !== 0 ? chat?.map((message, index) => {
                        return (
                            <ChatWidget
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

                <Stack ref={messagesEndRef} />
            </Stack>

            <Stack className="chatInputBox">
                <form onSubmit={(e) => handleChatSubmit(e)}>
                    <TextField
                        sx={{ width: "80%", margin: "0px 30px", my: 1 }}
                        label="Subject"
                        id="outlined-size-small"
                        size="small"
                        name='subject'
                        required
                    />
                    <TextField
                        sx={{ width: "80%", margin: "0px 30px" }}
                        label="Sent Message"
                        id="outlined-size-small"
                        size="small"
                        name='message'
                        required
                        InputProps={{
                            endAdornment:
                                <Button variant="contained" type='submit' sx={{ width: "150px", marginLeft: "10px" }} startIcon={<Iconify icon="material-symbols:send-rounded" />}>
                                    Sent
                                </Button>
                        }}
                    />
                </form>
            </Stack>
        </Container>
    );
};

export default Chat;