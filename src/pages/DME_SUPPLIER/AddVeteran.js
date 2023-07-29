import { useForm } from "react-hook-form";
import { Helmet } from 'react-helmet-async';
import { React, useState } from 'react';
import { Card, Container, Grid, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Iconify from '../../components/iconify';
import { AuthRequest } from "../../services/AuthRequest";
import { enc, lib } from "crypto-js";


export default function AddVeteran() {
    const { register, watch, setValue, handleSubmit, reset, formState: { errors }, setFocus } = useForm();

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()

    const firstName = watch('firstName');
    const lastName = watch('lastName');


    let { id: dmeSupplierId } = JSON.parse(localStorage.getItem('user'));


    const { mutateAsync, isLoading: addVeteranLoading } = useMutation((veteran) => {

        return AuthRequest.post(`/api/v1/users`, veteran)
            .then(res => {
                toast.success("Veteran Added Successful!", res, {
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

    const generateEmail = () => {
        if (!firstName || !lastName) {
            toast.warning("Please provide First and Last Name first!")
            return
        }
        const randomNumber = Math.floor(Math.random() * 9000) + 1000;
        const generatedEmail = `${firstName.toLowerCase()}_${randomNumber}_${lastName.toLowerCase()}@vamcgnv.com`;

        return generatedEmail
    }

    const handleGeneratePassword = () => {

        if (!firstName || !lastName) {
            toast.warning("Please provide First and Last Name first!")
            return
        }

        const specialChars = "!@#$";
        const specialChar = specialChars.charAt(Math.floor(Math.random() * specialChars.length));
        const randomBytes = lib.WordArray.random(4).toString(enc.Hex);
        const password = `${firstName.substring(0, 2).toUpperCase()}${specialChar}${lastName.substring(0, 2)}${randomBytes}`;
        const truncatedPassword = password.substring(0, 8);

        return truncatedPassword

    }




    const onSubmit = data => {

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
            fullName: data.firstName + " " + data.lastName,
            userCategory: "63caa0348ceb169589e611c8",
            status: "63861954b3b3ded1ee267309",
            dmeSupplier: dmeSupplierId

        }


        if (!data.email || !data.password || !data.confirmPassword) {
            return toast.error("Please provide email, password and confirm password!")
        }

        mutateAsync(data)


    };



    return (
        <>
            <Helmet>
                <title> Add Veteran </title>
            </Helmet>
            <Container maxWidth="1350px">

                <Stack onClick={() => navigate(-1)} direction="row" spacing={1} style={{ cursor: "pointer", marginBottom: "15px", width: "150px" }} sx={{
                    "&:hover": {
                        color: "#3498db",
                    },
                }} >
                    <ArrowBackIcon /> <span>Back</span>
                </Stack>
                <Typography variant="h5">Add Veteran</Typography>
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
                                columnSpacing={{ xs: 2, sm: 1, md: 1, lg: 1 }}
                            >
                                <Grid item xs={4}>
                                    <TextField
                                        {...register("firstName", { required: "Field is required" })}
                                        error={errors.firstName && true}
                                        label="First Name*"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.firstName?.message}

                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        {...register("lastName", { required: "Field is required" })}
                                        error={errors.lastName && true}

                                        label="Last Name*"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.lastName?.message}

                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        {...register("lastFour", { required: "Field is required" })}
                                        error={errors.lastFour && true}

                                        label="Last Four*"
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.lastFour?.message}

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
                                <Grid item xs={12}>
                                    <TextField
                                        {...register("email")}
                                        error={errors.email && true}

                                        label="Email"
                                        autoComplete="false"
                                        type={'email'}
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.email?.message}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("password")}
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
                                        {...register("confirmPassword")}
                                        error={errors.confirmPassword && true}

                                        label="Confirm Password"
                                        type={'password'}
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.confirmPassword?.message}

                                    />
                                </Grid>



                                <Grid item xs={12}>
                                    <LoadingButton loading={addVeteranLoading} type={"submit"} sx={{ width: "200px" }} size="medium" variant="contained" endIcon={<Iconify icon="eva:plus-fill" />}>Add</LoadingButton>
                                </Grid>
                            </Grid>

                        </form>
                    </Card>
                </Grid>
            </Container>
        </>
    );
};
