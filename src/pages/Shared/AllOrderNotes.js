import { Box, Button, Card, CircularProgress, Container, Grid, Stack, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AuthRequest } from '../../services/AuthRequest';
import Iconify from '../../components/iconify';
import { fDateTime } from '../../utils/formatTime';
import AddOrderNoteLogModal from './AddOrderNoteLogModal';
import { toast } from 'react-toastify';


export default function AllOrderNotes() {

    const navigate = useNavigate()
    const { id: orderId } = useParams()

    const { search } = window.location;
    const params = new URLSearchParams(search);
    const orderCategory = params.get('orderCategory');
    const orderStatus = params.get('orderStatus');

    const [user, setUser] = useState()
    const [addNotesOpen, setAddNotesOpen] = useState(false)
    const [loading, setLoading] = useState()


    let loggedUser = JSON.parse(localStorage.getItem('user'));
    const { id: writerId } = loggedUser

    const loadUserInfo = useCallback(() => {

        AuthRequest.get(`/api/v1/users/${writerId}`)
            .then(res => {
                setUser(res.data.data)
                setLoading(false)
            })
    }, [writerId])

    useEffect(() => {
        setLoading(true);
        loadUserInfo()
    }, [loadUserInfo])

    const { isLoading, refetch: orderNoteRefetch, data: note } = useQuery('note-log',
        async () => {
            if (orderCategory === "equipment-order") {
                return AuthRequest.get(`/api/v1/order/orderNote/${orderId}`).then(data => data.data.data)
            } else if (orderCategory === "veteran-order") {
                return AuthRequest.get(`/api/v1/veteran-order/veteran-order-note/${orderId}`).then(data => data.data.data)
            } else if (orderCategory === "repair-order") {
                return AuthRequest.get(`/api/v1/repair-order/repair-order-note/${orderId}`).then(data => data.data.data)
            }
        }, {
        cacheTime: 0
    })

    const { mutateAsync: addOrderNote, isLoading: addOrderNoteLog } = useMutation((data) => {

        if (orderCategory === "equipment-order") {
            return AuthRequest.post(`api/v1/order/orderNote/${orderId}`, data)
                .then(res => {
                    toast.success("Note Added", {
                        toastId: "success129"
                    })
                    orderNoteRefetch()
                    setAddNotesOpen(false)
                }).catch(err => {
                    toast.error("Something Went Wrong!", {
                        toastId: "error129"
                    })
                })
        } else if (orderCategory === "repair-order") {
            return AuthRequest.post(`api/v1/repair-order/repair-order-note/${orderId}`, data)
                .then(res => {
                    toast.success("Note Added", {
                        toastId: "success129"
                    })
                    orderNoteRefetch()
                    setAddNotesOpen(false)
                }).catch(err => {
                    toast.error("Something Went Wrong!", {
                        toastId: "error129"
                    })
                })
        } else if (orderCategory === "veteran-order") {
            return AuthRequest.post(`api/v1/veteran-order/veteran-order-note/${orderId}`, data)
                .then(res => {
                    toast.success("Note Added", {
                        toastId: "success129"
                    })
                    orderNoteRefetch()
                    setAddNotesOpen(false)
                }).catch(err => {
                    toast.error("Something Went Wrong!", {
                        toastId: "error129"
                    })
                })
        }
        return 0
    })


    const handelAddOrderNotes = async (e) => {
        e.preventDefault()
        if (writerId && orderId && e.target.notes.value) {
            const data = {
                writerId: writerId,
                orderId: orderId,
                notes: e.target.notes.value
            }
            addOrderNote(data)
            return
        }
        return toast.error("Fields are missing!", {
            toastId: "error1299"
        })

    };


    if (isLoading || loading) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }

    return (
        <>
            <Helmet>
                <title> Order Note Log </title>
            </Helmet>
            <Container maxWidth="1350px">

                <Stack onClick={() => navigate(-1)} direction="row" spacing={1} style={{ cursor: "pointer", marginBottom: "15px", }} sx={{
                    "&:hover": {
                        color: "#3498db",
                    },
                }} >
                    <ArrowBackIcon /> <span>Back</span>
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h5">Order Note Log</Typography>
                    {
                        orderStatus !== "archived" &&
                        <Button variant="contained" onClick={() => { setAddNotesOpen(true) }} startIcon={
                            <Iconify icon="material-symbols:add" />}>
                            Add Note
                        </Button>
                    }
                </Stack>

                <AddOrderNoteLogModal open={addNotesOpen} setOpen={setAddNotesOpen} handelFormSubmit={handelAddOrderNotes} data={{ notes: "" }} title="Add Note" user={user} addOrderNoteLog={addOrderNoteLog} />

                <Grid
                    container
                    spacing={0}
                    direction="column"
                    justify="center"
                    style={{ minHeight: '100vh', marginTop: '40px' }}
                >
                    {
                        note && note.length !== 0 ?
                            note?.map((nt, index) => {
                                return (
                                    <Card key={index} sx={{ paddingY: 2, paddingX: 2, marginY: 1 }}>

                                        <Stack direction="row" alignItems="start" mb={2}>

                                            <Box sx={{ ml: 2 }}>
                                                <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                                                    {nt?.writerId?.fullName} |  {nt?.writerId?.userCategory?.category}
                                                </Typography>

                                                <Typography variant="caption" sx={{ color: 'text.primary' }}>
                                                    {fDateTime(nt?.createdAt)}
                                                </Typography>

                                            </Box>
                                        </Stack>

                                        <Typography variant="subtitle2" sx={{ color: 'text.primary', paddingLeft: 2 }}>
                                            {nt.notes}
                                        </Typography>

                                    </Card>
                                )
                            })

                            :

                            <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                                No Notes Found!
                            </Typography>

                    }


                </Grid>
            </Container>
        </>
    );
};
