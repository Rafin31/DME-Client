import { Alert, Box, Card, CircularProgress, Container, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../components/iconify';
import { fDate } from '../../utils/formatTime';
import { AuthRequest } from '../../services/AuthRequest';

export default function EditUser() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [dbError, setDbError] = useState(false)
    const { id: userId } = useParams()
    const navigate = useNavigate()


    const { search } = window.location;
    const params = new URLSearchParams(search);
    const userCategory = params.get('user');


    const { isLoading: userLoading, refetch, data: user } = useQuery(`user-${userId}`,
        async () => {
            return AuthRequest.get(`/api/v1/users/${userId}`).then(data => data.data.data)
        }
    )

    const { mutateAsync, isLoading: updateUserLoading } = useMutation((user) => {

        return AuthRequest.patch(`/api/v1/users/${userId}`, user)
            .then(res => {
                toast.success("User Updated Successful!", res, {
                    toastId: 'success12'
                })
                reset()
                refetch()
                navigate(-1)
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message, {
                    toastId: 'error12'
                })
            })
    })



    if (!user) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }

    const onSubmit = data => {
        let givenDate
        let presentDate

        if (data?.dob) givenDate = new Date(data?.dob);
        if (data?.dob) presentDate = new Date()

        if (data?.dob) {
            if (givenDate > presentDate) {
                setDbError(true)
                return
            }
        }

        if (data?.dob) data.dob = fDate(data.dob)

        data = {
            ...data,
            fullName: data.firstName + " " + data.lastName,
        }
        if (data.secondaryInsurance) data.secondaryInsurance = (+data.secondaryInsurance)
        if (data.primaryInsurance) data.primaryInsurance = (+data.primaryInsurance)

        delete data.email

        setDbError(false)
        mutateAsync(data)
    };


    return (
        <>
            <Helmet>
                <title> Edit - User Profile </title>
            </Helmet>
            <Container maxWidth="xl">

                <Stack onClick={() => navigate(-1)} direction="row" spacing={1} style={{ cursor: "pointer", marginBottom: "15px", }} sx={{
                    "&:hover": {
                        color: "#3498db",
                    },
                }} >
                    <ArrowBackIcon /> <span>Back</span>
                </Stack>

                <Typography variant="h5">Update User</Typography>
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
                                columnSpacing={{ xs: 2, sm: 3, md: 5, lg: 5 }}
                            >
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("firstName", { required: "Field is required" })}
                                        error={errors.Fname && true}
                                        label="First Name*"
                                        type="text"
                                        fullWidth
                                        defaultValue={user.firstName}
                                        variant="outlined"
                                        helpertext={errors.Fname?.message}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("lastName", { required: "Field is required" })}
                                        error={errors.Lname && true}

                                        label="Last Name*"
                                        type="text"
                                        fullWidth
                                        defaultValue={user.lastName}
                                        variant="outlined"
                                        helpertext={errors.Lname?.message}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("email", { required: "Field is required" })}
                                        error={errors.email && true}

                                        label="Email*"
                                        autoComplete="false"
                                        type={'email'}
                                        defaultValue={user.email}
                                        fullWidth
                                        variant="outlined"
                                        helpertext={errors.email?.message}
                                        InputProps={{
                                            readOnly: true,
                                        }}


                                    />
                                </Grid>


                                {
                                    userCategory === "patient" &&
                                    <Grid item xs={6}>
                                        <FormControl fullWidth>
                                            <InputLabel style={{ width: "auto", textAlign: "center", backgroundColor: "white" }} >Gender*</InputLabel>
                                            <Select
                                                variant="outlined"
                                                size="small"
                                                error={errors.gender && true}
                                                helpertext={errors.gender?.message}
                                                rows={2}
                                                defaultValue={user.details.gender.toLowerCase()}
                                                {...register("gender", { required: "Field is required" })}
                                            >
                                                <MenuItem value={"male"}>Male</MenuItem>
                                                <MenuItem value={"female"}>Female</MenuItem>
                                                <MenuItem value={"other"}>Other</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                }

                                {
                                    userCategory === "patient" &&
                                    <Grid item xs={6}>
                                        <TextField
                                            {...register("dob", { required: "Field is required" })}
                                            error={errors.dob && true}

                                            label="Date of Birth*"
                                            onFocus={(e) => { (e.target.type = "date") }}
                                            onBlur={(e) => { (e.target.type = "text") }}
                                            type="text"
                                            fullWidth
                                            variant="outlined"
                                            defaultValue={user.details.dob}
                                            helpertext={errors.dob?.message}
                                        />
                                        {dbError && <Alert sx={{ py: 0 }} severity="error">Date can not be future!</Alert>}
                                    </Grid>
                                }

                                {
                                    userCategory === "patient" &&
                                    <Grid item xs={6}>
                                        <TextField
                                            {...register("weight", { required: "Field is required" })}
                                            error={errors.weight && true}

                                            type={'number'}
                                            label="Weight (lbs)*"
                                            fullWidth
                                            variant="outlined"
                                            defaultValue={user.details.weight}
                                            helpertext={errors.weight?.message}

                                        />
                                    </Grid>
                                }


                                <Grid item xs={6}>
                                    <TextField
                                        {...register("country", { required: "Field is required" })}
                                        error={errors.country && true}

                                        label="Country*"
                                        fullWidth
                                        variant="outlined"
                                        defaultValue={user.details.country}
                                        helpertext={errors.country?.message}

                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        {...register("city", { required: "Field is required" })}
                                        error={errors.city && true}

                                        label="City*"
                                        fullWidth
                                        variant="outlined"
                                        defaultValue={user.details.city}
                                        helpertext={errors.city?.message}

                                    />
                                </Grid>



                                <Grid item xs={6}>
                                    <TextField
                                        {...register("state", { required: "Field is required" })}
                                        error={errors.state && true}

                                        label="State*"
                                        fullWidth
                                        variant="outlined"
                                        defaultValue={user.details.state}
                                        helpertext={errors.state?.message}

                                    />
                                </Grid>


                                <Grid item xs={6}>
                                    <TextField
                                        {...register("phoneNumber", {
                                            required: "Field is required",
                                            minLength: { value: 6, message: "Phone number should be at last 6 characters" },
                                        })}

                                        error={errors.phoneNumber && true}
                                        label="Phone Number*"
                                        type={"tel"}
                                        fullWidth
                                        variant="outlined"
                                        defaultValue={user.details?.phoneNumber}
                                        helpertext={errors?.phoneNumber?.message}

                                    />

                                </Grid>


                                {
                                    userCategory === "patient" &&
                                    <Grid item xs={6}>
                                        <TextField
                                            {...register("primaryInsurance", { required: "Field is required" })}
                                            error={errors.primaryInsurance && true}
                                            type="number"
                                            label="Primary Insurance*"
                                            fullWidth
                                            defaultValue={user.details?.primaryInsurance}
                                            variant="outlined"
                                            helpertext={errors.primaryInsurance?.message}

                                        />
                                    </Grid>
                                }

                                {
                                    userCategory === "patient" &&
                                    <Grid item xs={6}>
                                        <TextField
                                            {...register("secondaryInsurance", { required: "Field is required" })}
                                            error={errors.secondaryInsurance && true}
                                            type="number"
                                            label="Secondary Insurance*"
                                            fullWidth
                                            defaultValue={user.details?.secondaryInsurance}
                                            variant="outlined"
                                            helpertext={errors.secondaryInsurance?.message}

                                        />
                                    </Grid>
                                }

                                <Grid item xs={12}>
                                    <TextField
                                        {...register("address", { required: "Field is required" })}

                                        label="Address"
                                        error={errors.address && true}
                                        fullWidth
                                        multiline
                                        helpertext={errors.address?.message}
                                        defaultValue={user.details?.address}
                                        rows={4}
                                        variant="outlined" />
                                </Grid>


                                <Grid item xs={12}>
                                    <LoadingButton loading={updateUserLoading} type={"submit"} sx={{ width: "200px" }} size="medium" variant="contained" endIcon={<Iconify icon="eva:plus-fill" />}>Update</LoadingButton>
                                </Grid>
                            </Grid>

                        </form>
                    </Card>
                </Grid>
            </Container>
        </>
    );
};
