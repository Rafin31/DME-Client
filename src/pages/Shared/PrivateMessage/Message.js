import { Avatar, Badge, Stack } from "@mui/material";
import MailIcon from '@mui/icons-material/Mail';
import { useNavigate } from "react-router-dom";



export const Message = ({ senderId, receiverId, from, to, subject, message, timeStamp, unread, color = false }) => {

    const navigate = useNavigate()

    let user = localStorage.getItem('user');
    user = JSON.parse(user);

    let senderIdSwap = senderId
    let receiverIdSwap = receiverId

    if (receiverId === user.id) {
        let temp = senderId;
        senderIdSwap = receiverId
        receiverIdSwap = temp
    }

    return (
        <Stack
            sx={receiverId === user.id ? { backgroundColor: "#00B2FF", color: "white", cursor: "pointer" } : { backgroundColor: "white", color: "black", cursor: "pointer" }}
            className="chatWidget" onClick={() => navigate(`/DME-supplier/dashboard/private-message/chat/${receiverIdSwap}?si=${senderIdSwap}`)}>
            <div className="top">
                {
                    receiverId === user.id ?
                        <p>From: {from}</p>
                        :
                        <p>To: {to}</p>
                }

            </div>
            <hr />
            <div className="messageContain">
                <p>Subject: <span>{subject}</span></p>
                <p>Message :<span>{message}</span></p>
            </div>
            <hr />
            <div className="timeStamp">
                <p>{timeStamp}</p>
            </div>
            {/* <div className="notification">
                <Badge badgeContent={1} color="primary">
                    <MailIcon color="action" />
                </Badge>
            </div> */}
        </Stack>
    );
};