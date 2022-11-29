import { Alert, Avatar, Box, Button, Card, Container, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { deepOrange } from '@mui/material/colors';
import { useForm } from 'react-hook-form';
import Iconify from '../../components/iconify';
import { fDate } from '../../utils/formatTime';

export default function EditDMESupplier() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [dbError, setDbError] = useState(false)
    const onSubmit = data => {
        console.log(data)
        reset()
    };
    return (
        <>
            <Helmet>
                <title> Edit - DME Supplier Profile </title>
            </Helmet>
            <Container maxWidth="xl">
                <Typography variant="h5">Edit - DME Supplier Profile</Typography>
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
                                        helpertext={errors.companyName?.message}

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
                                        helpertext={errors.npiNumber?.message}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("Fname", { required: "Field is required" })}
                                        error={errors.Fname && true}
                                        id="outlined-basic"
                                        label="First Name*"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        helpertext={errors.Fname?.message}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("Lname", { required: "Field is required" })}
                                        error={errors.Lname && true}
                                        id="outlined-basic"
                                        label="Last Name*"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        helpertext={errors.Lname?.message}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("email", { required: "Field is required" })}
                                        error={errors.email && true}
                                        id="outlined-basic"
                                        label="Email*"
                                        autoComplete="false"
                                        defaultValue={"demo@minimals.cc"}
                                        type={'email'}
                                        fullWidth
                                        variant="outlined"
                                        helpertext={errors.email?.message}
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
                                        helpertext={errors.country?.message}

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
                                        helpertext={errors.city?.message}

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
                                        helpertext={errors.state?.message}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("zipCode", {
                                            required: "Field is required",
                                            minLength: { value: 3, message: "Zip Code should be at last 3 characters" },
                                        })}
                                        id="outlined-basic"
                                        error={errors.zipCode && true}
                                        label="Zip Code*"
                                        type={"number"}
                                        fullWidth
                                        variant="outlined"
                                        helpertext={errors?.zipCode?.message}

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
                                        helpertext={errors.address?.message}
                                        rows={4}
                                        variant="outlined" />
                                </Grid>

                                <Grid item xs={12}>
                                    <Button type={"submit"} sx={{ width: "200px" }} size="medium" variant="contained" >Confirm</Button>
                                </Grid>
                            </Grid>

                        </form>
                    </Card>
                </Grid>
            </Container>
        </>
    );
};
