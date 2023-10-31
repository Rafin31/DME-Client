// @mui
import { Stack, Card, Typography, IconButton, Popover, MenuItem } from '@mui/material';
import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

// utils
import { fDate } from '../../utils/formatTime';
// components
import Iconify from '../../components/iconify';

import AccessTime from '@mui/icons-material/AccessTime';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckIcon from '@mui/icons-material/Check';


export default function AssignedTask({ assignedTaskToUser, handleAssignTaskUpdate }) {


    const [open, setOpen] = useState(null);
    const navigate = useNavigate()

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    return (
        <>
            <Card
                sx={{
                    p: 2, my: 1,
                    boxShadow: assignedTaskToUser.status !== 'Pending' ? 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;' : 'rgba(0, 0, 0, 0.2) 0px 18px 50px -10px;',

                }}
            >

                <Stack
                    direction="row"
                    justifyContent={"space-between"}
                >

                    <Stack direction="column">
                        <Typography variant="p" sx={{ pr: 3, fontSize: "small" }} color={'InfoText'}>
                            Assigned By : {
                                assignedTaskToUser.assignedBy.fullName
                            }

                        </Typography>
                        <Typography variant="p" sx={{ pr: 3, fontSize: "small" }} color={'InfoText'}>
                            Assigned on :   {fDate(assignedTaskToUser.createdAt)}
                        </Typography>
                        <Typography variant="p" sx={{ pr: 3, fontSize: "small" }}
                            color={assignedTaskToUser.status === 'Pending' ? "orange" : assignedTaskToUser.status === 'Accepted' ? "Green" : assignedTaskToUser.status === 'Rejected' ? "red" : 'green'}>
                            {
                                assignedTaskToUser.status
                            }
                        </Typography>
                        <Typography variant="h6" sx={{ pt: 3 }}>
                            {
                                assignedTaskToUser.title
                            }
                        </Typography>
                        <Typography variant="p">
                            {
                                assignedTaskToUser.description
                            }
                        </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent={"center"} alignItems={"center"}>
                        <Typography sx={{ pr: 3, fontSize: "small", display: "flex" }}>

                            <AccessTime style={{ fontSize: "20px", marginRight: "10px" }} />
                            {fDate(assignedTaskToUser.deadline)}

                        </Typography>

                        {
                            (assignedTaskToUser.status !== 'Rejected' && assignedTaskToUser.status !== 'Completed') &&
                            <IconButton size="small" style={{ marginRight: "10px" }} color="inherit" onClick={handleOpenMenu}>
                                <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                        }
                    </Stack>


                    <Popover
                        open={Boolean(open)}
                        anchorEl={open}
                        onClose={handleCloseMenu}
                        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        PaperProps={{
                            sx: {
                                p: 1,
                                width: 140,
                                '& .MuiMenuItem-root': {
                                    px: 1,
                                    typography: 'body2',
                                    borderRadius: 0.75,
                                },
                            },
                        }}
                        onClick={handleCloseMenu}
                    >

                        {
                            assignedTaskToUser.status === 'Pending' &&

                            <>
                                <MenuItem sx={{ color: "green" }} onClick={() => handleAssignTaskUpdate(["Accepted", assignedTaskToUser._id])}>
                                    <CheckIcon sx={{ mr: 2 }} />
                                    Accept
                                </MenuItem>
                                <MenuItem sx={{ color: "red" }} onClick={() => handleAssignTaskUpdate(["Rejected", assignedTaskToUser._id])}>
                                    <HighlightOffIcon sx={{ mr: 2 }} />
                                    Reject
                                </MenuItem>
                            </>

                        }
                        {
                            assignedTaskToUser.status === 'Accepted' &&
                            <>
                                <MenuItem sx={{ color: "green" }} onClick={() => handleAssignTaskUpdate(["Completed", assignedTaskToUser._id])}>
                                    <CheckIcon sx={{ mr: 2 }} />
                                    Completed
                                </MenuItem>
                            </>
                        }



                    </Popover>
                </Stack>

            </Card >

        </>
    );
}

