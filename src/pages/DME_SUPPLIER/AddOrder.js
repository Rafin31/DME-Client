import { Button, Card, CircularProgress, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';

import { useForm } from "react-hook-form";
import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery } from 'react-query';
import { Box } from '@mui/system';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import { AuthRequest } from '../../services/AuthRequest';
import Iconify from '../../components/iconify';




export default function AddOrder() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(false)

    let loggedUser = localStorage.getItem('user');
    loggedUser = JSON.parse(loggedUser);

    const { id } = loggedUser

    const loadUserInfo = useCallback(() => {



        AuthRequest.get(`/api/v1/users/${id}`)
            .then(res => {
                setUser(res.data.data)
                setLoading(false)
            })
    }, [id])

    useEffect(() => {
        setLoading(true);
        loadUserInfo()
    }, [loadUserInfo])

    const { isLoading: patientLoading, data: patients } = useQuery('patient',
        async () => {
            return AuthRequest.get(`/api/v1/patient`).then(data => data.data.data)
        }
    )

    const { mutateAsync, isLoading: createOrderLoading } = useMutation((order) => {

        return AuthRequest.post(`/api/v1/order`, order)
            .then(res => {
                reset()
                toast.success("Order Created!", {
                    toastId: 'success5'
                })
            })
            .catch((err) => {
                toast.error("Something went wrong!", {
                    toastId: 'error3'
                })
            })
    })


    if (!user || patientLoading) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }

    const onSubmit = data => {
        const { patientId, description, note } = data
        const order = {
            dmeSupplierId: id,
            patientId,
            description,
            note,
            status: "New-Referral"
        }
        console.log(order)
        mutateAsync(order)
        reset()
    };


    return (
        <>
            <Helmet>
                <title> Add Order </title>
            </Helmet>
            <Container maxWidth="xl">
                <Typography variant="h5">Add Order</Typography>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    justify="center"
                    style={{ minHeight: '100vh', marginTop: '40px' }}
                >
                    <Card sx={{ paddingY: 4, paddingX: 3 }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid
                                container
                                rowSpacing={1}
                                columnSpacing={{ xs: 2, sm: 3, md: 5, lg: 5 }}
                            >
                                <Grid item xs={12}>
                                    <TextField
                                        {...register("supplier")}
                                        error={errors.supplier && true}
                                        id="outlined-basic"
                                        label="DME Supplier"
                                        fullWidth
                                        variant="outlined"
                                        defaultValue={user?.fullName}
                                        helpertext={errors.supplier?.message}
                                        InputProps={{
                                            readOnly: true,
                                        }}

                                    />
                                </Grid>


                                <Grid item xs={12} style={{ margin: "10px 0px" }}>
                                    <FormControl fullWidth>
                                        <InputLabel style={{ width: "auto", textAlign: "center", backgroundColor: "white" }} >{"Patient"}</InputLabel>
                                        <Select
                                            variant="outlined"
                                            defaultValue=""
                                            size="small"
                                            error={errors.supplier && true}
                                            rows={2}
                                            {...register("patientId", { required: true })}

                                        >
                                            {
                                                !patientLoading ?


                                                    patients.map((patient, index) => {
                                                        return <MenuItem key={index} value={patient.userId._id}>{patient.userId.fullName}</MenuItem>
                                                    })

                                                    :
                                                    <Box style={{ height: "50px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                        <CircularProgress />
                                                    </Box>
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>


                                <Grid item xs={12} >
                                    <TextField
                                        {...register("description", { required: true })}
                                        id="outlined-basic"
                                        label="Description"
                                        error={errors.description && true}
                                        fullWidth
                                        multiline
                                        rows={4}
                                        helpertext={errors.description?.message}
                                        variant="outlined" />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        {...register("note", { required: true })}
                                        id="outlined-basic"
                                        label="Notes"
                                        error={errors.notes && true}
                                        fullWidth
                                        multiline
                                        helpertext={errors.notes?.message}
                                        rows={4}
                                        variant="outlined" />
                                </Grid>
                                <Grid item xs={12}>
                                    <LoadingButton loading={createOrderLoading} type={"submit"} sx={{ width: "200px" }} size="medium" variant="contained" endIcon={<Iconify icon="eva:plus-fill" />}>Add</LoadingButton>
                                </Grid>
                            </Grid>
                        </form>
                    </Card>
                </Grid>
            </Container>
        </>
    );
};
