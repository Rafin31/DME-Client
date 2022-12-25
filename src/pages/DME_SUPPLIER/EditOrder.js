import { Box, Button, Card, CircularProgress, Container, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { AuthRequest } from '../../services/AuthRequest';
import Iconify from '../../components/iconify';


export default function EditOrder() {
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(false)

    let loggedUser = localStorage.getItem('user');
    loggedUser = JSON.parse(loggedUser);

    const { id } = loggedUser
    const { id: orderId } = useParams()

    const loadUserInfo = useCallback(() => {
        AuthRequest.get(`/api/v1/users/${id}`)
            .then(res => {
                setUser(res.data.data)
                setLoading(false)
            })
    }, [id])

    const { isLoading: orderLoading, data: order } = useQuery('order',
        async () => {
            return AuthRequest.get(`/api/v1/order/${orderId}`).then(data => data.data.data)
        }
    )

    const { isLoading: patientLoading, data: patients } = useQuery('patient',
        async () => {
            return AuthRequest.get(`/api/v1/patient`).then(data => data.data.data)
        }
    )

    const { mutateAsync, isLoading: updateOrderLoading } = useMutation((order) => {

        return AuthRequest.patch(`/api/v1/order/${orderId}`, order)
            .then(res => {
                reset()
                toast.success("Order Updated!", res, {
                    toastId: 'success6'
                })
            })
            .catch((err) => {
                toast.error("Something went wrong!", {
                    toastId: 'error4'
                })
            })
    })

    if (errors) {
        console.log(errors);
    }
    const onSubmit = data => {
        const { patientId, note, description, status } = data
        const orderData = {
            dmeSupplierId: id,
            patientId,
            note,
            description,
            status
        }
        mutateAsync(orderData)
        reset()
    };

    useEffect(() => {
        setLoading(true);
        loadUserInfo()
    }, [loadUserInfo])


    if (!user || orderLoading || patientLoading) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }

    return (
        <>
            <Helmet>
                <title> Edit Order </title>
            </Helmet>
            <Container maxWidth="xl">
                <Typography variant="h5">Edit Order</Typography>
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

                                <Grid item xs={6} style={{ margin: "10px 0px" }}>
                                    <FormControl fullWidth>
                                        <InputLabel style={{ width: "auto", textAlign: "center", backgroundColor: "white" }} >Patient</InputLabel>
                                        <Select
                                            variant="outlined"
                                            size="small"
                                            error={errors.patient && true}
                                            rows={2}
                                            {...register("patientId",
                                                { required: "Filed Required" })}
                                            helpertext={errors.patient?.message}
                                            defaultValue={order.patientId._id}

                                        >
                                            {
                                                patients.map((patient, index) => {
                                                    return <MenuItem key={index} value={patient.userId._id}>{patient.userId.fullName}</MenuItem>
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} style={{ margin: "10px 0px" }}>
                                    <FormControl fullWidth>
                                        <InputLabel style={{ width: "auto", textAlign: "center", backgroundColor: "white" }} >Order Status</InputLabel>
                                        <Select
                                            variant="outlined"
                                            size="small"
                                            error={errors.orderStatus && true}
                                            rows={2}
                                            {...register("status",
                                                { required: "Filed Required" }
                                            )}
                                            helpertext={errors.orderStatus?.message}
                                            defaultValue={order.status}
                                        >
                                            {
                                                order.status === "New-Referral" &&
                                                <MenuItem value={"Evaluation"}>Evaluation</MenuItem>
                                            }
                                            {
                                                order.status === "Evaluation" &&
                                                <MenuItem value={"Evaluation-Completed"}>Evaluation Completed</MenuItem>
                                            }
                                            {
                                                order.status === "Evaluation-Completed" &&
                                                <MenuItem value={"Paper-Work-In-Process"}>Paper-Work-In-Process</MenuItem>
                                            }
                                            {
                                                order.status === "Paper-Work-In-Process" &&
                                                <MenuItem value={"Prior-Auth-Status"}>Prior Auth Status</MenuItem>
                                            }
                                            {
                                                order.status === "Prior-Auth-Status" &&
                                                <MenuItem value={"Prior-Auth-Receive"}>Prior Auth Receive</MenuItem>
                                            }
                                            {
                                                order.status === "Prior-Auth-Receive" &&
                                                <MenuItem value={"Holding-RTO"}>Holding RTO</MenuItem>
                                            }
                                            {
                                                order.status === "Holding-RTO" &&
                                                <MenuItem value={"RTO"}>RTO</MenuItem>
                                            }
                                            {
                                                order.status === "RTO" &&
                                                <MenuItem value={"Delivered"}>Delivered</MenuItem>
                                            }
                                            {
                                                order.status === "Delivered" &&
                                                <MenuItem value={"Authorization-Expiration-F/U"}>Authorization Expiration F/U</MenuItem>
                                            }
                                            {
                                                order.status === "Authorization-Expiration-F/U" &&
                                                <MenuItem value={"Order-Request"}>Order Request</MenuItem>
                                            }
                                            <MenuItem value={"Cancelled"}>Cancelled</MenuItem>

                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} >
                                    <TextField
                                        {...register("description")}
                                        id="outlined-basic"
                                        label="Description"
                                        error={errors.description && true}
                                        fullWidth
                                        multiline
                                        defaultValue={order?.description}
                                        rows={4}
                                        helpertext={errors.description?.message}
                                        variant="outlined" />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        {...register("note")}
                                        id="outlined-basic"
                                        label="Notes"
                                        error={errors.notes && true}
                                        fullWidth
                                        multiline
                                        helpertext={errors.notes?.message}
                                        defaultValue={order?.notes?.note}
                                        rows={4}
                                        variant="outlined" />
                                </Grid>
                                <Grid item xs={12}>
                                    <LoadingButton loading={updateOrderLoading} type={"submit"} sx={{ width: "200px" }} size="medium" variant="contained" endIcon={<Iconify icon="eva:plus-fill" />}>Update</LoadingButton>
                                </Grid>
                            </Grid>
                        </form>
                    </Card>
                </Grid>
            </Container>
        </>
    );
};
