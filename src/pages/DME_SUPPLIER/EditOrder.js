import { Box, Card, CircularProgress, Container, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AuthRequest } from '../../services/AuthRequest';
import Iconify from '../../components/iconify';
import { fDate } from '../../utils/formatTime';


export default function EditOrder() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const { search } = window.location;
    const params = new URLSearchParams(search);
    const orderCategory = params.get('orderCategory');

    const [firstAttempt, setFirstAttempt] = useState(null);
    const [secondAttempt, setSecondAttempt] = useState(null);
    const [schedule, setSchedule] = useState(null);

    const { id } = JSON.parse(localStorage.getItem('user'));

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
            if (orderCategory === "equipment-order") {
                return AuthRequest.get(`/api/v1/order/${orderId}`).then(data => data.data.data)
            } else if (orderCategory === "repair-order") {
                return AuthRequest.get(`/api/v1/repair-order/${orderId}`).then(data => data.data.data)
            } else if (orderCategory === "veteran-order") {
                return AuthRequest.get(`/api/v1/veteran-order/${orderId}`).then(data => {
                    if (data.data.data[0]?.firstAttempt) setFirstAttempt(data.data.data[0]?.firstAttempt)
                    if (data.data.data[0]?.secondAttempt) setSecondAttempt(data.data.data[0]?.secondAttempt)
                    if (data.data.data[0]?.schedule) setSchedule(data.data.data[0]?.schedule)
                    return data.data.data
                })
            }
            return 0
        }
    )

    const { isLoading: patientLoading, data: patients } = useQuery('patient',
        async () => {
            if (orderCategory === "veteran-order") {
                return AuthRequest.get(`/api/v1/veteran`)
                    .then(data => data.data.data)
            }
            return AuthRequest.get(`/api/v1/patient`).then(data => data.data.data)
        }
    )

    const { mutateAsync, isLoading: updateOrderLoading } = useMutation((order) => {

        if (orderCategory === "equipment-order") {
            return AuthRequest.patch(`/api/v1/order/${orderId}`, order)
                .then(res => {
                    reset()
                    toast.success("Order Updated!", res, {
                        toastId: 'success6'
                    })
                    navigate(-1)
                })
                .catch((err) => {
                    toast.error("Something went wrong!", {
                        toastId: 'error4'
                    })
                })
        } else if (orderCategory === "repair-order") {
            return AuthRequest.patch(`/api/v1/repair-order/${orderId}`, order)
                .then(res => {
                    reset()
                    toast.success("Order Updated!", res, {
                        toastId: 'success6'
                    })
                    navigate(-1)
                })
                .catch((err) => {
                    toast.error("Something went wrong!", {
                        toastId: 'error4'
                    })
                })
        } else if (orderCategory === "veteran-order") {
            return AuthRequest.patch(`/api/v1/veteran-order/${orderId}`, order)
                .then(res => {
                    reset()
                    toast.success("Order Updated!", res, {
                        toastId: 'success6'
                    })
                    navigate(-1)
                })
                .catch((err) => {
                    toast.error("Something went wrong!", {
                        toastId: 'error4'
                    })
                })
        }
        return 0


    })

    const onSubmit = data => {
        const { patientId, note, description, status } = data
        const updatedOrder = {
            dmeSupplierId: id,
            patientId,
            note,
            description,
            status
        }
        if (orderCategory === "veteran-order") delete updatedOrder.patientId
        if (orderCategory === "veteran-order") updatedOrder.veteranId = patientId
        if (firstAttempt) updatedOrder.firstAttempt = fDate((firstAttempt))
        if (secondAttempt) updatedOrder.secondAttempt = fDate((secondAttempt))
        if (schedule) updatedOrder.schedule = fDate((schedule))
        if (data.partsPo) updatedOrder.partsPo = data.partsPo
        if (data.labourPo) updatedOrder.labourPo = data.labourPo
        if (data.progress) updatedOrder.progress = data.progress


        mutateAsync(updatedOrder)
    };

    useEffect(() => {
        setLoading(true);
        loadUserInfo()
        return () => {
            setLoading(false);
        }
    }, [loadUserInfo])




    if (!user || orderLoading || patientLoading || loading) {
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

                <Stack onClick={() => navigate(-1)} direction="row" spacing={1} style={{ cursor: "pointer", marginBottom: "15px", }} sx={{
                    "&:hover": {
                        color: "#3498db",
                    },
                }} >
                    <ArrowBackIcon /> <span>Back</span>
                </Stack>

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
                                            defaultValue={
                                                orderCategory === "veteran-order" ? order[0]?.veteranId?._id
                                                    : order.patientId?._id
                                            }

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
                                        {
                                            orderCategory === "equipment-order" &&
                                            <Select
                                                variant="outlined"
                                                size="small"
                                                error={errors.orderStatus && true}
                                                rows={2}
                                                {...register("status",
                                                    { required: "Filed Required" }
                                                )}
                                                helpertext={errors.orderStatus?.message}
                                                defaultValue={order.status ? order.status : ""}
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
                                        }
                                        {
                                            orderCategory === "repair-order" &&
                                            <Select
                                                variant="outlined"
                                                size="small"
                                                error={errors.orderStatus && true}
                                                rows={2}
                                                {...register("status",
                                                    { required: "Filed Required" }
                                                )}
                                                helpertext={errors.orderStatus?.message}
                                                defaultValue={order.status ? order.status : ""}
                                            >
                                                {
                                                    order.status === "PRR" &&
                                                    <MenuItem value={"Pending-Rx"}>Pending Rx</MenuItem>
                                                }
                                                {
                                                    order.status === "Pending-Rx" &&
                                                    <MenuItem value={"Pending-Assess"}>Pending Assess.</MenuItem>
                                                }
                                                {
                                                    order.status === "Pending-Assess" &&
                                                    <MenuItem value={"Workup"}>Workup</MenuItem>
                                                }
                                                {
                                                    order.status === "Workup" &&
                                                    <MenuItem value={"Pa-Status"}>PA Status</MenuItem>
                                                }
                                                {
                                                    order.status === "Pa-Status" &&
                                                    <MenuItem value={"RTO-Status"}>RTO Status</MenuItem>
                                                }
                                                {
                                                    order.status === "RTO-Status" &&
                                                    <MenuItem value={"Pending-Parts"}>Pending Parts</MenuItem>
                                                }
                                                {
                                                    order.status === "Pending-Parts" &&
                                                    <MenuItem value={"Pending-Scheduling"}>Pending Scheduling</MenuItem>
                                                }
                                                {
                                                    order.status === "Pending-Scheduling" &&
                                                    <MenuItem value={"Completed"}>Completed</MenuItem>
                                                }

                                                <MenuItem value={"Cancelled"}>Cancelled</MenuItem>

                                            </Select>
                                        }
                                        {
                                            orderCategory === "veteran-order" &&
                                            <Select
                                                variant="outlined"
                                                size="small"
                                                error={errors.orderStatus && true}
                                                rows={2}
                                                {...register("status",
                                                    { required: "Filed Required" }
                                                )}
                                                helpertext={errors.orderStatus?.message}
                                                defaultValue={order[0]?.status ? order[0].status : ""}
                                            >
                                                {
                                                    order[0].status === "Equip" &&
                                                    <MenuItem value={"New Repair"}>New Repair</MenuItem>
                                                }
                                                {
                                                    order[0].status === "New Repair" &&
                                                    <MenuItem value={"Rcvd-pending-scheduling"}>Rcvd pending scheduling</MenuItem>
                                                }
                                                {
                                                    order[0].status === "Rcvd-pending-scheduling" &&
                                                    <MenuItem value={"Estimate-sent-pending-po"}>Estimate sent pending po</MenuItem>
                                                }
                                                {
                                                    order[0].status === "Estimate-sent-pending-po" &&
                                                    <MenuItem value={"Po-Received"}>Po Received</MenuItem>
                                                }
                                                {
                                                    order[0].status === "Po-Received" &&
                                                    <MenuItem value={"Parts-ordered-by-VAMC"}>Parts ordered by VAMC</MenuItem>
                                                }
                                                {
                                                    order[0].status === "Parts-ordered-by-VAMC" &&
                                                    <MenuItem value={"Parts-ordered-by-GCM"}>Parts ordered by GCM</MenuItem>
                                                }
                                                {
                                                    order[0].status === "Parts-ordered-by-GCM" &&
                                                    <MenuItem value={"Pending-scheduling"}>Pending Scheduling</MenuItem>
                                                }
                                                {
                                                    order[0].status === "Pending-scheduling" &&
                                                    <MenuItem value={"Completed"}>Completed</MenuItem>
                                                }
                                                {
                                                    order[0].status === "Completed" &&
                                                    <MenuItem value={"Archived"}>Archived</MenuItem>
                                                }

                                                <MenuItem value={"Cancelled"}>Cancelled</MenuItem>

                                            </Select>
                                        }

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
                                                defaultValue={order[0]?.partsPo}
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
                                                defaultValue={order[0]?.labourPo}
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
                                                    defaultValue={order[0]?.secondAttempt}
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
                                                    defaultValue={order[0]?.schedule}
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
                                        defaultValue={
                                            orderCategory === "veteran-order" ? order[0]?.description
                                                : order.description
                                        }
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
                                        defaultValue={
                                            orderCategory === "veteran-order" ? order[0]?.notes?.note
                                                : order.notes?.note
                                        }
                                        rows={4}
                                        variant="outlined" />
                                </Grid>

                                {

                                    orderCategory === "equipment-order" &&

                                    <>
                                        <Grid item xs={12} >
                                            <TextField
                                                {...register("progress")}
                                                id="outlined-basic"
                                                label="Order Progress"
                                                error={errors.progress && true}
                                                fullWidth
                                                helpertext={errors.progress?.message}
                                                defaultValue={order?.progress}
                                                variant="outlined" />
                                        </Grid>
                                    </>

                                }
                                <Grid item xs={12}>
                                    <LoadingButton loading={updateOrderLoading} type={"submit"} sx={{ width: "200px", margin: "15px 0px" }} size="medium" variant="contained" endIcon={<Iconify icon="eva:plus-fill" />}>Update</LoadingButton>
                                </Grid>
                            </Grid>
                        </form>
                    </Card>
                </Grid>
            </Container>
        </>
    );
};
