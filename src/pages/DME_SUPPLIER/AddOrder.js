import { Autocomplete, Card, CircularProgress, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material';

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
    const { search } = window.location;
    const params = new URLSearchParams(search);
    const orderCategory = params.get('orderCategory');

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [user, setUser] = useState()
    let patientArray = []
    const [loading, setLoading] = useState(false)
    const [toValue, setToValue] = useState("")

    const [toStatus, setToStatus] = useState(orderCategory === "equipment-order" ? "New-Referral" :
        orderCategory === "repair-order" ? "PRR" :
            orderCategory === "veteran-order" && "Equip")

    const navigate = useNavigate()


    const { id: dmeSupplierId } = JSON.parse(localStorage.getItem('user')); //dmeSupplierId


    const [firstAttempt, setFirstAttempt] = useState(null);
    const [secondAttempt, setSecondAttempt] = useState(null);
    const [schedule, setSchedule] = useState(null);


    const equipOrderStatus = [
        {
            id: "New-Referral",
            label: "New-Referral"
        },
        {
            id: "Evaluation",
            label: "Evaluation"
        },
        {
            id: "Evaluation-Completed",
            label: "Evaluation-Completed"
        },
        {
            id: "Paper-Work-In-Process",
            label: "Paper-Work-In-Process"
        },
        {
            id: "Prior-Auth-Status",
            label: "Prior-Auth-Status"
        },
        {
            id: "Prior-Auth-Receive",
            label: "Prior-Auth-Receive"
        },
        {
            id: "Holding-RTO",
            label: "Holding-RTO"
        },
        {
            id: "RTO",
            label: "RTO"
        },
        {
            id: "Delivered",
            label: "Delivered"
        },
        {
            id: "Authorization-Expiration-F/U",
            label: "Authorization-Expiration-F/U"
        },
        {
            id: "Order-Request",
            label: "Order-Request"
        },

    ]

    const repairOrderStatus = [
        {
            id: "PRR",
            label: "PRR"
        },
        {
            id: "Pending-Rx",
            label: "Pending-Rx"
        },
        {
            id: "Pending-Assess",
            label: "Pending-Assess"
        },
        {
            id: "Workup",
            label: "Workup"
        },
        {
            id: "Pa-Status",
            label: "Pa-Status"
        },
        {
            id: "RTO-Status",
            label: "RTO-Status"
        },
        {
            id: "Pending-Parts",
            label: "Pending-Parts"
        },
        {
            id: "Pending-Scheduling",
            label: "Pending-Scheduling"
        },
        {
            id: "Completed",
            label: "Completed"
        }
    ]


    const veteranOrderStatus = [
        {
            id: "Equip",
            label: "Equip"
        },
        {
            id: "New Repair",
            label: "New Repair"
        },
        {
            id: "Rcvd-pending-scheduling",
            label: "Rcvd-pending-scheduling"
        },
        {
            id: "Estimate-sent-pending-po",
            label: "Estimate-sent-pending-po"
        },
        {
            id: "Po-Received",
            label: "Po-Received"
        },
        {
            id: "Parts-ordered-by-VAMC",
            label: "Parts-ordered-by-VAMC"
        },
        {
            id: "Parts-ordered-by-GCM",
            label: "Parts-ordered-by-GCM"
        },
        {
            id: "Pending-scheduling",
            label: "Pending-scheduling"
        },
        {
            id: "Completed",
            label: "Completed"
        }
    ]


    const loadUserInfo = useCallback(() => {
        AuthRequest.get(`/api/v1/users/${dmeSupplierId}`)
            .then(res => {
                setUser(res.data.data)
                setLoading(false)
            })
    }, [dmeSupplierId])



    useEffect(() => {
        setLoading(true);
        loadUserInfo()
    }, [loadUserInfo])


    const { isLoading: patientLoading, data: patients } = useQuery('patient',
        async () => {
            if (orderCategory === "veteran-order") {
                return AuthRequest.get(`/api/v1/veteran/byDmeSupplier?dmeSupplier=${dmeSupplierId}`).then(data => data.data.data)
            } else {
                return AuthRequest.get(`/api/v1/patient/byDmeSupplier?dmeSupplier=${dmeSupplierId}`).then(data => data.data.data)
            }

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

    const onSubmit = useCallback((data) => {
        const { description, notes } = data
        const patientId = toValue?.id

        if (!patientId) return toast.error("Please Select Patient")

        const order = {
            dmeSupplierId: dmeSupplierId,
            patientId,
            description,
            notes,
            status: toStatus
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

    }, [toValue?.id, orderCategory, toStatus])



    if (!user || patientLoading) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }

    patients?.map(pt => {
        const patientInfo = {
            id: pt?.userId?._id,
            label: pt?.userId?.fullName,
        }

        if (pt.dob) patientInfo.dob = pt.dob
        if (pt.lastFour) patientInfo.lastFour = pt.lastFour

        patientArray.push(patientInfo)
        return patientArray
    })



    return (
        <>
            <Helmet>
                <title> Add Order </title>
            </Helmet>
            <Container maxWidth="1350px">

                <Stack onClick={() => navigate(-1)} direction="row" spacing={1} style={{ cursor: "pointer", marginBottom: "15px", width: "150px" }} sx={{
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
                    <Card sx={{ paddingY: 4, paddingX: 3, minHeight: "560px" }}>
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
                                        helperText={errors.supplier?.message}
                                        InputProps={{
                                            readOnly: true,
                                        }}

                                    />
                                </Grid>

                                <Grid item xs={12} >
                                    <FormControl fullWidth>
                                        {

                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                                options={patientArray}
                                                required
                                                sx={{ width: "100%" }}
                                                onChange={(e, newValue) => { setToValue(newValue) }}
                                                renderInput={(params) => <TextField {...params} label={orderCategory === "veteran-order" ? "Veteran" : "Patients"} />}
                                                renderOption={(props, option, state) => (
                                                    <li {...props} key={option.id} style={{ backgroundColor: state.selected ? 'white' : 'dark' }}>
                                                        {`${option.label} ${option.dob ? "(" + option.dob + ")" :
                                                            "(" + option.lastFour + ")"} `}
                                                    </li>
                                                )}


                                            />
                                        }

                                    </FormControl>
                                </Grid>


                                <Grid item xs={12} >
                                    <FormControl fullWidth>
                                        {

                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                value={toStatus}
                                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                                options={
                                                    orderCategory === "equipment-order" ? equipOrderStatus :
                                                        orderCategory === "repair-order" ? repairOrderStatus :
                                                            orderCategory === "veteran-order" && veteranOrderStatus
                                                }
                                                required
                                                sx={{ width: "100%", height: "auto" }}
                                                onChange={(e, newValue) => {
                                                    setToStatus(newValue.id)
                                                }}
                                                renderInput={(params) => <TextField {...params} label="Order Stage" />}
                                                renderOption={(props, option, state) => (
                                                    <li {...props} style={{ backgroundColor: state.selected ? 'white' : 'dark' }}>
                                                        {option.label}
                                                    </li>
                                                )}


                                            />
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
                                                helperText={errors.partsPo?.message}
                                                variant="outlined" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                {...register("labourPo")}
                                                id="outlined-basic"
                                                label="Labour PO#"
                                                error={errors.labourPo && true}
                                                fullWidth
                                                helperText={errors.labourPo?.message}
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
                                        helperText={errors.description?.message}
                                        variant="outlined" />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        {...register("notes")}
                                        id="outlined-basic"
                                        label="Notes"
                                        error={errors.notes && true}
                                        fullWidth
                                        multiline
                                        helperText={errors.notes?.message}
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
