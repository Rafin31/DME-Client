import { Box, Button, Card, CircularProgress, Container, Grid, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AuthRequest } from '../../services/AuthRequest';
import Iconify from '../../components/iconify';
import { fDate, fDateTime } from '../../utils/formatTime';


export default function AllOrderNotes() {

    const navigate = useNavigate()
    const { id } = useParams()

    const { search } = window.location;
    const params = new URLSearchParams(search);
    const orderCategory = params.get('orderCategory');
    const orderStatus = params.get('orderStatus');

    const { isLoading, data: note } = useQuery('note-log',
        async () => {
            if (orderCategory === "equipment-order") {
                return AuthRequest.get(`/api/v1/order/orderNote/${id}`).then(data => data.data.data)
            } else if (orderCategory === "veteran-order") {
                return AuthRequest.get(`/api/v1/veteran-order/veteran-order-note/${id}`).then(data => data.data.data)
            } else if (orderCategory === "repair-order") {
                return AuthRequest.get(`/api/v1/repair-order/repair-order-note/${id}`).then(data => data.data.data)
            }
        }, {
        cacheTime: 0
    }
    )

    if (isLoading) {
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
                        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}
                            onClick={() => { navigate(`/DME-supplier/dashboard/edit-order/${id}?orderCategory=veteran-order`) }} >
                            Add Note
                        </Button>
                    }
                </Stack>

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
                                            {nt.note}
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
