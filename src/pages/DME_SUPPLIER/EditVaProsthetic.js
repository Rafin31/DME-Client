import { Box, Card, CircularProgress, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { AuthRequest } from '../../services/AuthRequest';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export default function EditVaProstheticPage() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const navigate = useNavigate()


    const { id } = useParams()


    const { isLoading: userLoading, refetch, data: user } = useQuery(`user-${id}`,
        async () => {
            return AuthRequest.get(`/api/v1/users/${id}`).then(data => data.data.data)
        }
    )

    const { mutateAsync, isLoading: vaProsthetic } = useMutation((vaProsthetic) => {

        return AuthRequest.patch(`/api/v1/users/${id}`, vaProsthetic).then(res => {
            refetch()
            reset()
            navigate(-1)
            toast.success("VA Prosthetic Updated!", {
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
                <title> Edit - VA Prosthetics </title>
            </Helmet>
            <Container maxWidth="1350px">
                <Typography variant="h5">Edit - VA Prosthetics</Typography>

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
                                <Grid item xs={12}>
                                    <LoadingButton loading={vaProsthetic} type={"submit"} sx={{ width: "200px" }} size="medium" variant="contained" >Confirm</LoadingButton>
                                </Grid>
                            </Grid>

                        </form>
                    </Card>
                </Grid>
            </Container>
        </>
    );
};
