import { Alert, Box, Card, CircularProgress, Container, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../components/iconify';
import { fDate } from '../../utils/formatTime';
import { AuthRequest } from '../../services/AuthRequest';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

export default function EditUser() {
    const { register, watch, handleSubmit, reset, formState: { errors } } = useForm();
    const [dbError, setDbError] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const { id: userId } = useParams()
    const navigate = useNavigate()

    const [dob, setDob] = useState()

    const { search } = window.location;
    const params = new URLSearchParams(search);
    const userCategory = params.get('user');

    const patientEmail = watch("email")



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


    useEffect(() => {
        user && setDob(user.details.dob)
    }, [user])

    const [{ loggedInUser, loggedInUserLoading }] = useOutletContext();

    if (!user || loggedInUserLoading) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }


    const onSubmit = data => {
        let givenDate
        let presentDate

        if (dob) givenDate = new Date(dob);
        if (dob) presentDate = new Date()

        if (dob) {
            if (givenDate > presentDate) {
                setDbError(true)
                return
            }
        }

        if (dob) data.dob = fDate(dob)

        if (data.password === "") delete data.password

        data = {
            ...data,
            fullName: data.firstName + " " + data.lastName,
        }

        if (userCategory !== "patient" && userCategory !== "veteran") {
            delete data.email
        }

        if ((userCategory !== "patient" || userCategory !== "veteran") && patientEmail === user.email) {
            delete data.email
        }

        setDbError(false)
        // console.log(data)
        mutateAsync(data)
    };

    return (
        <>
            <Helmet>
                <title> Edit - User Profile </title>
            </Helmet>
            <Container maxWidth="1350px">

                <Stack onClick={() => navigate(-1)} direction="row" spacing={1} style={{ cursor: "pointer", marginBottom: "15px", width: "150px" }} sx={{
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
                                columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 1 }}
                            >
                                <Grid item xs={4}>
                                    <TextField
                                        {...register("firstName", { required: "Field is required" })}
                                        error={errors.Fname && true}
                                        label="First Name*"
                                        type="text"
                                        fullWidth
                                        defaultValue={user.firstName}
                                        variant="outlined"
                                        helperText={errors.Fname?.message}

                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        {...register("lastName", { required: "Field is required" })}
                                        error={errors.Lname && true}

                                        label="Last Name*"
                                        type="text"
                                        fullWidth
                                        defaultValue={user.lastName}
                                        variant="outlined"
                                        helperText={errors.Lname?.message}

                                    />
                                </Grid>
                                {
                                    userCategory === "patient" &&
                                    <Grid item xs={4}>
                                        <FormControl fullWidth>
                                            <InputLabel style={{ width: "auto", textAlign: "center", backgroundColor: "white" }} >Gender*</InputLabel>
                                            <Select
                                                variant="outlined"
                                                size="small"
                                                error={errors.gender && true}
                                                helperText={errors.gender?.message}
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
                                    userCategory === "veteran" &&
                                    <Grid item xs={4}>
                                        <TextField
                                            {...register("lastFour", { required: "Field is required" })}
                                            error={errors.lastFour && true}
                                            defaultValue={user.details.lastFour}
                                            label="Last Four*"
                                            fullWidth
                                            variant="outlined"
                                            helperText={errors.lastFour?.message}

                                        />
                                    </Grid>
                                }

                                {
                                    userCategory === "patient" &&
                                    <Grid item xs={6}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                label="Date of Birth"
                                                value={dob}
                                                onChange={(newValue) => {
                                                    setDob(newValue);
                                                }}
                                                renderInput={(params) => <TextField {...params} fullWidth />}
                                            />
                                        </LocalizationProvider>
                                        {dbError && <Alert sx={{ py: 0 }} severity="error">Date can not be future!</Alert>}
                                    </Grid>
                                }

                                {
                                    userCategory === "patient" &&
                                    <Grid item xs={6}>
                                        <TextField
                                            {...register("weight")}
                                            error={errors.weight && true}

                                            type={'number'}
                                            label="Weight (lbs)"
                                            fullWidth
                                            variant="outlined"
                                            defaultValue={user.details.weight}
                                            helperText={errors.weight?.message}

                                        />
                                    </Grid>
                                }


                                <Grid item xs={12}>
                                    <TextField
                                        {...register("phoneNumber", {
                                            minLength: { value: 6, message: "Phone number should be at last 6 characters" },
                                        })}

                                        error={errors.phoneNumber && true}
                                        label="Phone Number"
                                        type={"tel"}
                                        fullWidth
                                        variant="outlined"
                                        defaultValue={user.details?.phoneNumber}
                                        helperText={errors?.phoneNumber?.message}

                                    />

                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        {...register("address")}

                                        label="Address"
                                        error={errors.address && true}
                                        fullWidth
                                        multiline
                                        helperText={errors.address?.message}
                                        defaultValue={user.details?.address}
                                        rows={4}
                                        variant="outlined" />
                                </Grid>

                                <Grid item xs={4}>
                                    <TextField
                                        {...register("city")}
                                        error={errors.city && true}

                                        label="City"
                                        fullWidth
                                        variant="outlined"
                                        defaultValue={user.details.city}
                                        helperText={errors.city?.message}

                                    />
                                </Grid>



                                <Grid item xs={4}>
                                    <TextField
                                        {...register("state")}
                                        error={errors.state && true}

                                        label="State"
                                        fullWidth
                                        variant="outlined"
                                        defaultValue={user.details.state}
                                        helperText={errors.state?.message}

                                    />
                                </Grid>

                                <Grid item xs={4}>
                                    <TextField
                                        {...register("zip")}
                                        error={errors.zip && true}

                                        label="Zip"
                                        fullWidth
                                        variant="outlined"
                                        defaultValue={user.details.zip}
                                        helperText={errors.zip?.message}

                                    />
                                </Grid>
                                {
                                    userCategory === "patient" &&
                                    <Grid item xs={6}>
                                        <TextField
                                            {...register("primaryInsurance")}
                                            error={errors.primaryInsurance && true}
                                            type="text"
                                            label="Primary Insurance"
                                            fullWidth
                                            defaultValue={user.details?.primaryInsurance}
                                            variant="outlined"
                                            helperText={errors.primaryInsurance?.message}

                                        />
                                    </Grid>
                                }

                                {
                                    userCategory === "patient" &&
                                    <Grid item xs={6}>
                                        <TextField
                                            {...register("secondaryInsurance")}
                                            error={errors.secondaryInsurance && true}
                                            type="text"
                                            label="Secondary Insurance"
                                            fullWidth
                                            defaultValue={user.details?.secondaryInsurance}
                                            variant="outlined"
                                            helperText={errors.secondaryInsurance?.message}

                                        />
                                    </Grid>
                                }

                                {
                                    (userCategory === "doctor" || userCategory === "therapist") &&
                                    <Grid item xs={6}>
                                        <TextField
                                            {...register("title")}
                                            error={errors.title && true}
                                            defaultValue={user.details?.title}
                                            label="Title"
                                            fullWidth
                                            variant="outlined"
                                            helperText={errors.title?.message}

                                        />
                                    </Grid>
                                }
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
                                        helperText={errors.email?.message}
                                        InputProps={{
                                            readOnly: userCategory !== "patient" && userCategory !== "veteran" ? true : false,
                                        }}


                                    />
                                </Grid>

                                {
                                    (loggedInUser.category === "DME-Supplier" || loggedInUser.category === "DME-Staff")
                                    && (userCategory === "patient" || userCategory === "veteran") &&
                                    <Grid item xs={6}>
                                        <TextField
                                            {...register("password",
                                                {
                                                    minLength: { value: 8, message: "Password must be at last 8 characters" },
                                                }

                                            )}
                                            error={errors.password && true}
                                            label="Password"
                                            type={showPassword ? 'text' : 'password'}
                                            fullWidth
                                            variant="outlined"
                                            helperText={errors.password?.message}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                            <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}

                                        />
                                    </Grid>
                                }

                                {
                                    (userCategory === "doctor" || userCategory === "therapist") &&
                                    <Grid item xs={6}>
                                        <TextField
                                            {...register("npiNumber", { required: "Field is required" })}
                                            error={errors.lastFour && true}
                                            label="NPI Number*"
                                            fullWidth
                                            variant="outlined"
                                            defaultValue={user.details?.npiNumber}
                                            helperText={errors.npiNumber?.message}

                                        />
                                    </Grid>
                                }
                                {
                                    (userCategory === "doctor" || userCategory === "therapist") &&
                                    <Grid item xs={6}>
                                        <TextField
                                            {...register("companyName", { required: "Field is required" })}
                                            error={errors.lastFour && true}

                                            label="Company Name*"
                                            fullWidth
                                            variant="outlined"
                                            defaultValue={user.details?.companyName}
                                            helperText={errors.companyName?.message}

                                        />
                                    </Grid>
                                }


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
