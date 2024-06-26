import { useForm } from "react-hook-form";
import { Helmet } from 'react-helmet-async';
import { React, useState } from 'react';
import { Alert, Card, Container, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Iconify from '../../components/iconify';
import { fDate } from "../../utils/formatTime";
import { AuthRequest } from "../../services/AuthRequest";
import { enc, lib } from "crypto-js";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'


export default function AddPatient() {
    const { register, watch, handleSubmit, reset, formState: { errors }, setValue, setFocus } = useForm();
    const [dbError, setDbError] = useState(false)
    const [dob, setDob] = useState(null)

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()

    const firstName = watch('firstName');
    const lastName = watch('lastName');




    const { id } = JSON.parse(localStorage.getItem('user'));

    const { mutateAsync, isLoading: addPatientLoading } = useMutation((patient) => {

        return AuthRequest.post(`/api/v1/users`, patient)
            .then(res => {
                toast.success("Patient Added Successful!", res, {
                    toastId: 'success11'
                })
                reset()
                navigate(-1)
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message, {
                    toastId: 'error11'
                })
            })
    })

    const nameOnchange = () => {
        // generateEmail()
    }

    const generateEmail = () => {

        const randomNumber = Math.floor(Math.random() * 9000) + 1000;
        const generatedEmail = `${firstName?.toLowerCase()}_${randomNumber}_${lastName?.toLowerCase()}@gcm.com`;
        // setValue("email", generatedEmail)
        return generatedEmail;
    }

    const handleGeneratePassword = () => {

        const specialChars = "!@#$";
        const specialChar = specialChars.charAt(Math.floor(Math.random() * specialChars.length));
        const randomBytes = lib.WordArray.random(4).toString(enc.Hex);
        const password = `${firstName.substring(0, 2).toUpperCase()}${specialChar}${lastName.substring(0, 2)}${randomBytes}`;
        const truncatedPassword = password.substring(0, 8);

        // setFocus("password")
        // setValue("password", truncatedPassword)
        // setFocus("confirmPassword")
        // setValue("confirmPassword", truncatedPassword)
        // navigator.clipboard.writeText(password);
        // toast.success("Generated Password has been copied to your clipboard!")

        return truncatedPassword;

    }

    const onSubmit = data => {
        if (dob !== "") {
            const givenDate = new Date(dob);
            const presentDate = new Date()
            if (givenDate > presentDate) {
                setDbError(true)
                return
            }
            data.dob = fDate(dob)
        }
        setDbError(false)

        if (!data.email) {
            data.email = generateEmail()
        }

        if (!data.password) {
            data.password = handleGeneratePassword()
        }

        if (!data.confirmPassword) {
            data.confirmPassword = data.password
        }

        if (data.confirmPassword !== data.password) {
            data.password = handleGeneratePassword()
            data.confirmPassword = data.password
        }

        data = {
            ...data,
            fullName: data?.firstName + " " + data?.lastName,
            secondaryInsurance: data?.secondaryInsurance,
            primaryInsurance: data?.primaryInsurance,
            userCategory: "63861b794e45673948bb7c9f",
            status: "63861954b3b3ded1ee267309",
            dmeSupplier: id,
        }

        if (!data.email || !data.password || !data.confirmPassword) {
            return toast.error("Please provide email, password and confirm password!")
        }

        mutateAsync(data)
    };

    return (
        <>
            <Helmet>
                <title> Add Client </title>
            </Helmet>
            <Container maxWidth="1350px">

                <Stack onClick={() => navigate(-1)} direction="row" spacing={1} style={{ cursor: "pointer", marginBottom: "15px", width: "150px" }} sx={{
                    "&:hover": {
                        color: "#3498db",
                    },
                }} >
                    <ArrowBackIcon /> <span>Back</span>
                </Stack>
                <Typography variant="h5">Add Client</Typography>
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
                                columnSpacing={{ xs: 2, sm: 3, md: 1, lg: 1 }}
                            >
                                <Grid item xs={4}>
                                    <TextField
                                        {...register("firstName", { required: "Field is required" })}
                                        error={errors.Fname && true}
                                        onChange={() => nameOnchange()}
                                        label="First Name*"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.Fname?.message}

                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        {...register("lastName", { required: "Field is required" })}
                                        error={errors.Lname && true}
                                        onChange={() => nameOnchange()}
                                        label="Last Name*"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.Lname?.message}

                                    />
                                </Grid>

                                <Grid item xs={4}>
                                    <FormControl fullWidth>
                                        <InputLabel style={{ width: "auto", textAlign: "center", backgroundColor: "white" }} >Gender*</InputLabel>
                                        <Select
                                            {...register("gender", { required: "Field is required" })}
                                            variant="outlined"
                                            size="small"
                                            error={errors.gender && true}
                                            helperText={errors.gender?.message}
                                            rows={2}
                                            defaultValue=""
                                        >
                                            <MenuItem value={"male"}>Male</MenuItem>
                                            <MenuItem value={"female"}>Female</MenuItem>
                                            <MenuItem value={"other"}>Other</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={6} >
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Date of Birth*"
                                            value={dob}
                                            onChange={(newValue) => {
                                                setDob(newValue);
                                            }}
                                            renderInput={(params) => <TextField {...params} fullWidth />}
                                        />
                                    </LocalizationProvider>
                                    {dbError && <Alert sx={{ py: 0 }} severity="error">Date can not be future!</Alert>}
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("weight")}
                                        error={errors.weight && true}

                                        type={'number'}
                                        label="Weight (lbs)"
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.weight?.message}

                                    />
                                </Grid>
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
                                        rows={2}
                                        variant="outlined" />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        {...register("city")}
                                        error={errors.city && true}

                                        label="City"
                                        fullWidth
                                        variant="outlined"
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
                                        helperText={errors.zip?.message}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("primaryInsurance")}
                                        error={errors.primaryInsurance && true}
                                        type="text"
                                        label="Primary Insurance"
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.primaryInsurance?.message}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("secondaryInsurance")}
                                        error={errors.secondaryInsurance && true}
                                        type="text"
                                        label="Secondary Insurance"
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.secondaryInsurance?.message}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        {...register("email")}
                                        error={errors.email && true}
                                        label="Email"
                                        autoComplete="off"
                                        type={'email'}
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.email?.message}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("password",
                                            // {
                                            //     required: "Field is required",
                                            //     minLength: { value: 8, message: "Password must be at last 8 characters" },
                                            // }

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
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("confirmPassword",
                                            // {
                                            //     required: "Field is required",
                                            // }

                                        )}
                                        error={errors.password && true}

                                        label="Confirm Password"
                                        type={'password'}
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.confirmPassword?.message}

                                    />
                                </Grid>


                                <Grid item xs={12}>
                                    <LoadingButton loading={addPatientLoading} type={"submit"} sx={{ width: "200px" }} size="medium" variant="contained" endIcon={<Iconify icon="eva:plus-fill" />}>Add</LoadingButton>
                                </Grid>
                            </Grid>

                        </form>
                    </Card>
                </Grid>
            </Container >
        </>
    );
};
