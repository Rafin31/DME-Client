import { Alert, Autocomplete, Box, Button, Card, CircularProgress, Container, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useForm } from "react-hook-form";
import React, { useContext, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery } from 'react-query';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { userContext } from '../../Context/AuthContext';
import Iconify from '../../components/iconify';
import { AuthRequest } from '../../services/AuthRequest';
import { fDateTime } from '../../utils/formatTime';






export default function AddTasks() {
    const [date, setDate] = useState(new Date())
    const [toValue, setToValue] = useState("")
    let patientArray = []
    const [dateError, setError] = useState({
        status: false,
        message: " "
    })
    const navigate = useNavigate()
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const { loggedInUser } = useContext(userContext)
    const user = loggedInUser()

    const { isLoading: patientLoading, data: patients } = useQuery('patient',
        async () => {
            return AuthRequest.get(`/api/v1/patient/byDmeSupplier?dmeSupplier=${user?.id}`).then(data => data.data.data)
        }
    )
    //   add Task
    const { mutateAsync, isLoading: postTaskLoading } = useMutation((task) => {

        return AuthRequest.post(`/api/v1/dme/task`, task)
            .then(res => {

                reset()
                toast.success("Task Added!", {
                    toastId: 'success4'
                })
                navigate(-1)
            })
    })


    const onSubmit = data => {

        if (toValue === "") {
            return toast.error("Patient is missing!")
        }


        if (!date) {
            setError({
                status: true,
                message: "Date is required"
            })
            return
        }
        const givenDate = new Date(date);
        const presentDate = new Date()

        if (givenDate < presentDate) {
            setError({
                status: true,
                message: "Date can not be in past"
            })
            return
        }
        const { patient, ...other } = data
        data = { ...other, taskDate: fDateTime(givenDate), dmeSupplierId: user.id, patientId: toValue.id }
        mutateAsync(data)
    };


    if (!user || patientLoading) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }

    patients.map(pt => {
        const patientInfo = {
            id: pt?.userId?._id,
            label: pt?.userId?.fullName
        }
        patientArray.push(patientInfo)
        return patientArray
    })


    return (
        <>
            <Helmet>
                <title> Add Task </title>
            </Helmet>
            <Container maxWidth="1350px">



                <Stack onClick={() => navigate(-1)} direction="row" spacing={1} style={{ cursor: "pointer", marginBottom: "15px", width: "150px" }} sx={{
                    "&:hover": {
                        color: "#3498db",
                    },
                }} >
                    <ArrowBackIcon /> <span>Back</span>
                </Stack>




                <Typography variant="h5">Add Task</Typography>
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

                                <Grid item xs={12} style={{ margin: "10px 0px" }}>
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
                                                renderInput={(params) => <TextField {...params} label={"Patients"} />}
                                                renderOption={(props, option, state) => (
                                                    <li {...props} style={{ backgroundColor: state.selected ? 'white' : 'dark' }}>
                                                        {option.label}
                                                    </li>
                                                )}


                                            />
                                        }
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} >
                                    <TextField
                                        {...register("title", { required: true })}
                                        id="outlined-basic"
                                        label="Title"
                                        error={errors.title && true}
                                        fullWidth
                                        multiline
                                        helperText={errors.title?.message}
                                        variant="outlined" />
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
                                        helperText={errors.description?.message}
                                        variant="outlined" />
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack spacing={3}>

                                        <DayPicker
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                        />
                                    </Stack>
                                    {dateError?.status && <Alert severity="error">{dateError?.message}</Alert>}
                                </Grid>

                                <Grid item xs={12}>
                                    <LoadingButton loading={postTaskLoading} type={"submit"} sx={{ width: "200px" }} size="medium" variant="contained" endIcon={<Iconify icon="eva:plus-fill" />}>Add</LoadingButton>
                                </Grid>
                            </Grid>
                        </form>
                    </Card>
                </Grid>
            </Container>
        </>
    );
};
