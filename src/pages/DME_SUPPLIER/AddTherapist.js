import { useForm } from "react-hook-form";
import { Helmet } from 'react-helmet-async';
import { React } from 'react';
import { Card, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Iconify from '../../components/iconify';
import { AuthRequest } from "../../services/AuthRequest";



export default function AddTherapist() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const navigate = useNavigate()


    const { mutateAsync, isLoading: addTherapistLoading } = useMutation((therapist) => {

        return AuthRequest.post(`/api/v1/users`, therapist)
            .then(res => {
                toast.success("Therapist Added Successful!", res, {
                    toastId: 'success191'
                })
                reset()
                navigate(-1)
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message, {
                    toastId: 'error711'
                })
            })
    })



    const onSubmit = data => {
        data = {
            ...data,
            fullName: data?.firstName + " " + data?.lastName,
            npiNumber: data?.npiNumber,
            userCategory: "638f770aa7f2be8abe01d2d0",
            status: "63861954b3b3ded1ee267309",
        }
        mutateAsync(data)

    };

    return (
        <>
            <Helmet>
                <title> Add Therapist </title>
            </Helmet>
            <Container maxWidth="1350px">

                <Stack onClick={() => navigate(-1)} direction="row" spacing={1} style={{ cursor: "pointer", marginBottom: "15px", width: "150px" }} sx={{
                    "&:hover": {
                        color: "#3498db",
                    },
                }} >
                    <ArrowBackIcon /> <span>Back</span>
                </Stack>
                <Typography variant="h5">Add Therapist</Typography>
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
                                        variant="outlined"
                                        helperText={errors.Fname?.message}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("lastName", { required: "Field is required" })}
                                        error={errors.Lname && true}

                                        label="Last Name*"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.Lname?.message}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("title")}
                                        error={errors.title && true}
                                        label="Title"
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.title?.message}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("email", { required: "Field is required" })}
                                        error={errors.email && true}

                                        label="Email*"
                                        autoComplete="false"
                                        type={'email'}
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.email?.message}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("password",
                                            {
                                                required: "Field is required",
                                                minLength: { value: 8, message: "Password must be at last 8 characters" },
                                            }

                                        )}
                                        error={errors.password && true}

                                        label="Password*"
                                        type={'password'}
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.password?.message}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("confirmPassword",
                                            {
                                                required: "Field is required",
                                            }

                                        )}
                                        error={errors.password && true}

                                        label="Confirm Password*"
                                        type={'password'}
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.confirmPassword?.message}

                                    />
                                </Grid>

                                <Grid item xs={6}>
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
                                        {...register("city")}
                                        error={errors.city && true}
                                        label="City"
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.city?.message}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("state")}
                                        error={errors.state && true}
                                        label="State"
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.state?.message}

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
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("companyName", { required: "Field is required" })}
                                        error={errors.npiNumber && true}
                                        type="text"
                                        label="Company Name*"
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.companyName?.message}

                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        {...register("npiNumber", { required: "Field is required" })}
                                        error={errors.npiNumber && true}
                                        type="text"
                                        label="Npi Number*"
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.npiNumber?.message}

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

                                <Grid item xs={12}>
                                    <LoadingButton loading={addTherapistLoading} type={"submit"} sx={{ width: "200px" }} size="medium" variant="contained" endIcon={<Iconify icon="eva:plus-fill" />}>Add</LoadingButton>
                                </Grid>
                            </Grid>

                        </form>
                    </Card>
                </Grid>
            </Container>
        </>
    );
};
