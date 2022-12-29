import { Alert, alpha, Avatar, Box, Button, Card, CircularProgress, Container, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import styled from '@emotion/styled';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AuthRequest } from '../../services/AuthRequest';
import Iconify from '../../components/iconify';
import { fDateTime } from '../../utils/formatTime';

const StyledAccount = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 2.5),
    borderRadius: Number(theme.shape.borderRadius) * 1.5,
    backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

export default function AllOrderNotes() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const navigate = useNavigate()
    const [dbError, setDbError] = useState(false)
    const { id } = useParams()


    const { isLoading: noteLoading, refetch, data: note } = useQuery('note',
        async () => {
            return AuthRequest.get(`/api/v1/order/orderNote/${id}`).then(data => data.data.data)
        }
    )

    if (!note) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }

    return (
        <>
            <Helmet>
                <title> Order Note Log </title>
            </Helmet>
            <Container maxWidth="xl">

                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h5">Order Note Log</Typography>
                    <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}
                        onClick={() => { navigate(`/DME-supplier/dashboard/edit-order/${id}`) }} >
                        Add Note
                    </Button>
                </Stack>

                <Grid
                    container
                    spacing={0}
                    direction="column"
                    justify="center"
                    style={{ minHeight: '100vh', marginTop: '40px' }}
                >
                    {
                        note.length !== 0 ?
                            note.map((nt, index) => {
                                return (
                                    <Card key={index} sx={{ paddingY: 2, paddingX: 2, marginY: 1 }}>

                                        <Stack direction="row" alignItems="start" mb={2}>

                                            <Box sx={{ ml: 2 }}>
                                                <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                                                    {nt?.writerId?.fullName}
                                                </Typography>

                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {nt?.writerId?.userCategory?.category}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                                    {fDateTime(nt.writerId.createdAt)}
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
