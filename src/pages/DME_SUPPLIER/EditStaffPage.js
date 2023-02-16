import { Box, Card, CircularProgress, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { AuthRequest } from '../../services/AuthRequest';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export default function EditStaffPage() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const navigate = useNavigate()


    const { id } = useParams()


    const { isLoading: userLoading, refetch, data: user } = useQuery('user',
        async () => {
            return AuthRequest.get(`/api/v1/users/${id}`).then(data => data.data.data)
        }
    )

    const { mutateAsync, isLoading: staffLoading } = useMutation((staff) => {

        return AuthRequest.patch(`/api/v1/users/${id}`, staff).then(res => {
            refetch()
            reset()
            navigate(-1)
            toast.success("Staff Updated!", {
                toastId: "success14"
            })
        }).catch(err => {
            toast.error("Something Went Wrong!", {
                toastId: "error14"
            })
        })
    })



    const onSubmit = async (data) => {
        delete data.email
        const updatedData = {
            ...data,
            fullName: data.firstName + " " + data.lastName,
        }
        mutateAsync(updatedData)
    };


    if (!user) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }





    return (
        <>
            <Helmet>
                <title> Edit - Staff </title>
            </Helmet>
            <Container maxWidth="1350px">
                <Typography variant="h5">Edit - Staff</Typography>

                <Stack onClick={() => navigate(-1)} direction="row" spacing={1} style={{ cursor: "pointer", margin: "15px 0px", }} sx={{
                    "&:hover": {
                        color: "#3498db",
                    },
                }} >
                    <ArrowBackIcon /> <span>Back</span>
                </Stack>
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
                                        {...register("companyName", { required: "Field is required" })}
                                        error={errors.companyName && true}
                                        id="outlined-basic"
                                        label="Company Name*"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.companyName?.message}
                                        defaultValue={user.details.companyName}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("npiNumber", {
                                            required: "Field is required",
                                            minLength: { value: 10, message: "NPI number should be at last 10 characters" },
                                        })}

                                        error={errors.npiNumber && true}
                                        label="NPI Number*"
                                        type={"number"}
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.npiNumber?.message}
                                        defaultValue={user.details.npiNumber}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("phoneNumber", {
                                            required: "Field is required",
                                            minLength: { value: 10, message: "Phone Number should be at last 10 characters" },
                                        })}

                                        error={errors.phoneNumber && true}
                                        label="Phone Number*"
                                        type={"text"}
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.phoneNumber?.message}
                                        defaultValue={user.details.phoneNumber}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("firstName", { required: "Field is required" })}
                                        error={errors.firstName && true}
                                        id="outlined-basic"
                                        label="First Name*"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.firstName?.message}
                                        defaultValue={user.firstName}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("lastName", { required: "Field is required" })}
                                        error={errors.lastName && true}
                                        id="outlined-basic"
                                        label="Last Name*"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.lastName?.message}
                                        defaultValue={user.lastName}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("email", { required: "Field is required" })}
                                        error={errors.email && true}
                                        id="outlined-basic"
                                        label="Email*"
                                        autoComplete="false"
                                        defaultValue={user.email}
                                        type={'email'}
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.email?.message}
                                        InputProps={{
                                            readOnly: true,
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("country", { required: "Field is required" })}
                                        error={errors.country && true}
                                        id="outlined-basic"
                                        label="Country*"
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.country?.message}
                                        defaultValue={user.details.country}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("city", { required: "Field is required" })}
                                        error={errors.city && true}
                                        id="outlined-basic"
                                        label="City*"
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.city?.message}
                                        defaultValue={user.details.city}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("state", { required: "Field is required" })}
                                        error={errors.state && true}
                                        id="outlined-basic"
                                        label="State*"
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.state?.message}
                                        defaultValue={user.details.state}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("zip", {
                                            required: "Field is required",
                                            minLength: { value: 3, message: "Zip Code should be at last 3 characters" },
                                        })}
                                        id="outlined-basic"
                                        error={errors.zip && true}
                                        label="Zip Code*"
                                        type={"number"}
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors?.zip?.message}
                                        defaultValue={user.details.zip}

                                    />

                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        {...register("address", { required: "Field is required" })}
                                        id="outlined-basic"
                                        label="Address"
                                        error={errors.address && true}
                                        fullWidth
                                        multiline
                                        helperText={errors.address?.message}
                                        rows={4}
                                        defaultValue={user.details.address}
                                        variant="outlined" />

                                </Grid>

                                <Grid item xs={12}>
                                    <LoadingButton loading={staffLoading} type={"submit"} sx={{ width: "200px" }} size="medium" variant="contained" >Confirm</LoadingButton>
                                </Grid>
                            </Grid>

                        </form>
                    </Card>
                </Grid>
            </Container>
        </>
    );
};
