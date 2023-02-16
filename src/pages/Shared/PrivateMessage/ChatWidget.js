import { Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";




export const ChatWidget = ({ senderId, receiverId, from, to, subject, message, timeStamp, unread }) => {


    const navigate = useNavigate()

    let user = localStorage.getItem('user');
    user = JSON.parse(user);

    const color = senderId === user.id


    return (
        <Stack
            sx={!color ? { backgroundColor: "#00B2FF", color: "white" } : { backgroundColor: "white", color: "black" }}
            className="chatWidget" onClick={() => navigate(`/DME-supplier/dashboard/private-message/chat/${receiverId}?si=${senderId}`)}>
            <div className="top">
                <p>To: {receiverId === user.id ? "Me" : to} </p>
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
        </Stack>
    );
};