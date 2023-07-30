import { Backdrop, Autocomplete, Box, Button, CircularProgress, Container, Fade, FormControl, Grid, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { AuthRequest } from 'src/services/AuthRequest';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { fDate } from '../../utils/formatTime';
import { LoadingButton, LocalizationProvider } from '@mui/lab';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';
import Iconify from '../../components/iconify/Iconify';
import { useRef } from 'react';
import { memo } from 'react';



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "80%",
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '5px',
    p: 2,

};


function EditVeteranOrderModal({ open, setOpen, orderCategory, order, refetch, orderId, title, ...other }) {



    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(false)


    // const orderCategory = params.get('orderCategory');


    let patientArray = []
    const [toValue, setToValue] = useState()
    const [firstAttempt, setFirstAttempt] = useState(null);
    const [secondAttempt, setSecondAttempt] = useState(null);
    const [schedule, setSchedule] = useState(null);

    const { id } = JSON.parse(localStorage.getItem('user'));

    // const { id: orderId } = useParams()

    const loadUserInfo = useCallback(() => {
        AuthRequest.get(`/api/v1/users/${id}`)
            .then(res => {
                setUser(res.data.data)
                setLoading(false)
            })
    }, [id])


    // const { isLoading: orderLoading, refetch, data: order } = useQuery('order-in-edit-order-modal',
    //     async () => {
    //         if (orderCategory === "equipment-order") {
    //             return AuthRequest.get(`/api/v1/order/${orderId}`).then(data => data.data.data)
    //         } else if (orderCategory === "repair-order") {
    //             return AuthRequest.get(`/api/v1/repair-order/${orderId}`).then(data => data.data.data)
    //         } else if (orderCategory === "veteran-order") {
    //             return AuthRequest.get(`/api/v1/veteran-order/${orderId}`).then(data => {
    //                 if (data.data.data[0]?.firstAttempt) setFirstAttempt(data.data.data[0]?.firstAttempt)
    //                 if (data.data.data[0]?.secondAttempt) setSecondAttempt(data.data.data[0]?.secondAttempt)
    //                 if (data.data.data[0]?.schedule) setSchedule(data.data.data[0]?.schedule)
    //                 return data.data.data
    //             })
    //         }
    //         return 0
    //     }
    // )


    const { isLoading: patientLoading, data: patients } = useQuery('patient-in-edit-order-modal',
        async () => {
            if (orderCategory === "veteran-order") {
                return AuthRequest.get(`/api/v1/veteran/byDmeSupplier?dmeSupplier=${id}`)
                    .then(data => data.data.data)
            }
            return AuthRequest.get(`/api/v1/patient/byDmeSupplier?dmeSupplier=${id}`).then(data => data.data.data)
        }
    )


    const { mutateAsync, isLoading: updateOrderLoading } = useMutation((order) => {

        if (orderCategory === "equipment-order") {
            return AuthRequest.patch(`/api/v1/order/${orderId}`, order)
                .then(res => {
                    reset()
                    toast.success("Order Updated!", {
                        toastId: 'success6'
                    })
                    refetch()
                    setOpen(false)
                })
                .catch((err) => {
                    toast.error("Something went wrong!", {
                        toastId: 'error4'
                    })
                    refetch()
                    setOpen(false)
                })
        } else if (orderCategory === "repair-order") {
            return AuthRequest.patch(`/api/v1/repair-order/${orderId}`, order)
                .then(res => {
                    reset()
                    toast.success("Order Updated!", {
                        toastId: 'success6'
                    })
                    refetch()
                    setOpen(false)
                })
                .catch((err) => {
                    toast.error("Something went wrong!", {
                        toastId: 'error4'
                    })
                    refetch()
                    setOpen(false)
                })
        } else if (orderCategory === "veteran-order") {
            return AuthRequest.patch(`/api/v1/veteran-order/${orderId}`, order)
                .then(res => {
                    reset()
                    toast.success("Order Updated!", {
                        toastId: 'success6'
                    })
                    refetch()
                    setOpen(false)
                })
                .catch((err) => {
                    toast.error("Something went wrong!", {
                        toastId: 'error4'
                    })
                    refetch()
                    setOpen(false)
                })
        }
        return 0


    })

    useEffect(() => {
        if (order) {
            setToValue({
                id: order?.veteranId?._id ? order.veteranId._id : order?.patientId?._id
            })
        }

    }, [order])

    useEffect(() => {
        if (open) {
            reset()
        }
    }, [reset, open])


    const onSubmit = data => {
        const { notes, description, status } = data
        const patientId = toValue?.id


        const updatedOrder = {
            dmeSupplierId: id,
            patientId,
            notes,
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
        if (status === "Delivered" || status === "Completed") updatedOrder.dateCompleted = new Date()

        mutateAsync(updatedOrder)
    };

    useEffect(() => {
        setLoading(true);
        loadUserInfo()

        return () => {
            setLoading(false);
        }
    }, [loadUserInfo])




    if (!user || order?.length === 0 || patientLoading || loading) {
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
        <div>
            {
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >

                    <Fade in={open}>
                        <Box sx={style}>

                            {/* {
                            isLoading && <Box style={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <CircularProgress />
                            </Box>
                        } */}


                            <Container maxWidth="1350px">


                                <Typography variant="h5" sx={{ marginBottom: "30px" }}>Edit Order</Typography>
                                <Grid
                                    container
                                    spacing={1}
                                    direction="column"
                                    justify="center"

                                >

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
                                                    helperText={errors.supplier?.message}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}

                                                />
                                            </Grid>

                                            <Grid item xs={6} style={{ margin: "10px 0px" }}>
                                                <FormControl fullWidth>
                                                    <Autocomplete
                                                        disablePortal
                                                        id="combo-box-demo"
                                                        isOptionEqualToValue={(option, value) => option.value === value.value}
                                                        options={patientArray}
                                                        required
                                                        sx={{ width: "100%" }}
                                                        defaultValue={order?.veteranId ? order?.veteranId.fullName : order?.patientId?.fullName}
                                                        onChange={(e, newValue) => { setToValue(newValue) }}
                                                        renderInput={(params) => <TextField {...params} label={orderCategory === "veteran-order" ? "Veteran" : "Patients"} />}
                                                        renderOption={(props, option, state) => (
                                                            <li {...props} key={option.id} style={{ backgroundColor: state.selected ? 'white' : 'dark' }}>
                                                                {`${option.label} ${option.dob ? "(" + option.dob + ")" :
                                                                    "(" + option.lastFour + ")"} `}
                                                            </li>
                                                        )}


                                                    />
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
                                                            helperText={errors.orderStatus?.message}
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
                                                            {
                                                                (order.status === "Delivered" || order.status === "Authorization-Expiration-F/U" || order.status === "Order-Request" || order.status === "Cancelled") &&
                                                                <MenuItem value={"Archived"}>Archived</MenuItem>
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
                                                            helperText={errors.orderStatus?.message}
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
                                                            {
                                                                (order.status === "Completed" || order.status === "Cancelled") &&
                                                                <MenuItem value={"Archived"}>Archived</MenuItem>

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
                                                            helperText={errors.orderStatus?.message}
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

                                                            {/* <MenuItem value={"Cancelled"}>Cancelled</MenuItem> */}

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
                                                            helperText={errors.partsPo?.message}
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
                                                            helperText={errors.labourPo?.message}
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
                                                    defaultValue={order.description}
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
                                                    defaultValue={order.notes}
                                                    rows={4}
                                                    variant="outlined" />
                                            </Grid>


                                            <Grid item xs={12} >
                                                <TextField
                                                    {...register("progress")}
                                                    id="outlined-basic"
                                                    label="Order Progress"
                                                    error={errors.progress && true}
                                                    fullWidth
                                                    helperText={errors.progress?.message}
                                                    defaultValue={order?.progress}
                                                    variant="outlined" />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <LoadingButton loading={updateOrderLoading} type={"submit"} sx={{ width: "200px", margin: "15px 0px" }} size="medium" variant="contained" endIcon={<Iconify icon="eva:plus-fill" />}>Update</LoadingButton>
                                            </Grid>
                                        </Grid>
                                    </form>

                                </Grid>
                            </Container>


                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={(e) => { setOpen(!open) }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Box>
                    </Fade>
                </Modal>
            }
        </div>
    );
};

export default (EditVeteranOrderModal);
