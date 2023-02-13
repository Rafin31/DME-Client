import { Card, CircularProgress, Container, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';

import { useForm } from "react-hook-form";
import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery } from 'react-query';
import { Box } from '@mui/system';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { sentenceCase } from 'change-case';
import { AuthRequest } from '../../services/AuthRequest';
import Iconify from '../../components/iconify';
import { fDate } from '../../utils/formatTime';




export default function AddOrder() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()


    const { id } = JSON.parse(localStorage.getItem('user'));


    const [firstAttempt, setFirstAttempt] = useState(null);
    const [secondAttempt, setSecondAttempt] = useState(null);
    const [schedule, setSchedule] = useState(null);

    const loadUserInfo = useCallback(() => {



        AuthRequest.get(`/api/v1/users/${id}`)
            .then(res => {
                setUser(res.data.data)
                setLoading(false)
            })
    }, [id])

    const { search } = window.location;
    const params = new URLSearchParams(search);
    const orderCategory = params.get('orderCategory');

    useEffect(() => {
        setLoading(true);
        loadUserInfo()
    }, [loadUserInfo])


    const { isLoading: patientLoading, data: patients } = useQuery('patient',
        async () => {
            if (orderCategory === "veteran-order") {
                return AuthRequest.get(`/api/v1/veteran`).then(data => data.data.data)
            }
            return AuthRequest.get(`/api/v1/patient`).then(data => data.data.data)
        }
    )



    const { mutateAsync, isLoading: createOrderLoading } = useMutation((order) => {

        if (orderCategory === "equipment-order") {
            return (AuthRequest.post(`/api/v1/order`, order)
                .then(res => {
                    reset()
                    toast.success("Order Created!", {
                        toastId: 'success5'
                    })
                    navigate(-1)
                })
                .catch((err) => {
                    toast.error("Something went wrong!", {
                        toastId: 'error3'
                    })
                }))
        } else if (orderCategory === "repair-order") {
            return AuthRequest.post(`/api/v1/repair-order`, order)
                .then(res => {
                    reset()
                    toast.success("Order Created!", {
                        toastId: 'success5'
                    })
                    navigate(-1)
                })
                .catch((err) => {
                    toast.error("Something went wrong!", {
                        toastId: 'error3'
                    })
                })
        } else if (orderCategory === "veteran-order") {
            return AuthRequest.post(`/api/v1/veteran-order`, order)
                .then(res => {
                    reset()
                    toast.success("Order Created!", {
                        toastId: 'success5'
                    })
                    navigate(-1)
                })
                .catch((err) => {
                    toast.error("Something went wrong!", {
                        toastId: 'error3'
                    })
                })
        }
        return 0
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
            status:
                orderCategory === "equipment-order" ? "New-Referral" :
                    orderCategory === "repair-order" ? "PRR" :
                        orderCategory === "veteran-order" && "Equip"
        }
        if (orderCategory === "veteran-order") delete order.patientId
        if (orderCategory === "veteran-order") order.veteranId = patientId
        if (firstAttempt) order.firstAttempt = fDate((firstAttempt))
        if (secondAttempt) order.secondAttempt = fDate((secondAttempt))
        if (schedule) order.schedule = fDate((schedule))
        if (data.partsPo) order.partsPo = data.partsPo
        if (data.labourPo) order.labourPo = data.labourPo

        mutateAsync(order)
        reset()
    };


    return (
        <>
            <Helmet>
                <title> Add Order </title>
            </Helmet>
            <Container maxWidth="xl">

                <Stack onClick={() => navigate(-1)} direction="row" spacing={1} style={{ cursor: "pointer", marginBottom: "15px", }} sx={{
                    "&:hover": {
                        color: "#3498db",
                    },
                }} >
                    <ArrowBackIcon /> <span>Back</span>
                </Stack>

                <Typography variant="h5">
                    {`Add ${sentenceCase(orderCategory.split("-").join(" "))}`}
                </Typography>

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
                                rowSpacing={2}
                                columnSpacing={{ xs: 2, sm: 3, md: 2, lg: 2 }}
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


                                <Grid item xs={12} >
                                    <FormControl fullWidth>
                                        <InputLabel style={{ width: "auto", textAlign: "center", backgroundColor: "white" }} >
                                            {orderCategory === "veteran-order" ? "Veteran" : "Patient"}
                                        </InputLabel>
                                        <Select
                                            variant="outlined"
                                            defaultValue=""
                                            size="small"
                                            error={errors.supplier && true}
                                            rows={2}
                                            {...register("patientId", { required: true })}
                                            helperText={errors.patientId?.message}

                                        >
                                            {
                                                !patientLoading ?


                                                    patients.length !== 0 ?
                                                        patients.map((patient, index) => {
                                                            return <MenuItem key={index} value={patient.userId._id}>{patient.userId.fullName}</MenuItem>
                                                        }) : <MenuItem disabled>No Veteran Found</MenuItem>

                                                    :
                                                    <Box style={{ height: "50px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                        <CircularProgress />
                                                    </Box>
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                                {
                                    orderCategory === "veteran-order" &&
                                    <>
                                        <Grid item xs={6} >
                                            <TextField
                                                {...register("partsPo")}
                                                id="outlined-basic"
                                                label="Parts PO#"
                                                error={errors.partsPo && true}
                                                fullWidth
                                                helpertext={errors.partsPo?.message}
                                                variant="outlined" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                {...register("labourPo")}
                                                id="outlined-basic"
                                                label="Labour PO#"
                                                error={errors.labourPo && true}
                                                fullWidth
                                                helpertext={errors.labourPo?.message}
                                                variant="outlined" />
                                        </Grid>

                                        <Grid item xs={6} >
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    label="1st Attempt"
                                                    value={firstAttempt}
                                                    onChange={(newValue) => {
                                                        setFirstAttempt(newValue);
                                                    }}
                                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item xs={6} >
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    label="2nd Attempt"
                                                    value={secondAttempt}
                                                    onChange={(newValue) => {
                                                        setSecondAttempt(newValue);
                                                    }}
                                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item xs={6} >
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    label="Scheduled/Deliver"
                                                    value={schedule}
                                                    onChange={(newValue) => {
                                                        setSchedule(newValue);
                                                    }}
                                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                    </>
                                }

                                <Grid item xs={12} >
                                    <TextField
                                        {...register("description")}
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
                                        {...register("note")}
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
