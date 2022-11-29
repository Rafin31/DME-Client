import { Alert, Avatar, Box, Button, Card, Container, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { deepOrange } from '@mui/material/colors';
import { useForm } from 'react-hook-form';
import Iconify from '../../components/iconify';
import { fDate } from '../../utils/formatTime';

export default function EditPatient() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [dbError, setDbError] = useState(false)
    if (errors) {
        console.log(errors);
    }
    const onSubmit = data => {
        const givenDate = new Date(data?.dob);
        const presentDate = new Date()
        if (givenDate > presentDate) {
            setDbError(true)
            return
        }
        data.dob = fDate(data.dob)
        setDbError(false)
        console.log(data)
        reset()
    };
    return (
        <>
            <Helmet>
                <title> Edit - Patient Profile </title>
            </Helmet>
            <Container maxWidth="xl">
                <Typography variant="h5">Edit - Patient Profile</Typography>
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
                                    <FormControl fullWidth>
                                        <InputLabel style={{ width: "auto", textAlign: "center", backgroundColor: "white" }} >Gender*</InputLabel>
                                        <Select
                                            variant="outlined"
                                            size="small"
                                            defaultValue=""
                                            error={errors.gender && true}
                                            helpertext={errors.gender?.message}
                                            rows={2}
                                            {...register("gender", { required: "Field is required" })}
                                        >
                                            <MenuItem value={"male"}>Male</MenuItem>
                                            <MenuItem value={"female"}>Female</MenuItem>
                                            <MenuItem value={"other"}>Other</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("dob", { required: "Field is required" })}
                                        error={errors.dob && true}
                                        id="outlined-basic"
                                        label="Date of Birth*"
                                        onFocus={(e) => { (e.target.type = "date") }}
                                        onBlur={(e) => { (e.target.type = "text") }}
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        helpertext={errors.dob?.message}
                                    />
                                    {dbError && <Alert sx={{ py: 0 }} severity="error">Date can not be future!</Alert>}
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("weight", { required: "Field is required" })}
                                        error={errors.weight && true}
                                        id="outlined-basic"
                                        type={'number'}
                                        label="Weight (lbs)*"
                                        fullWidth
                                        variant="outlined"
                                        helpertext={errors.weight?.message}

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
                                        {...register("phoneNumber", {
                                            required: "Field is required",
                                            minLength: { value: 6, message: "Phone number should be at last 6 characters" },
                                        })}
                                        id="outlined-basic"
                                        error={errors.phoneNumber && true}
                                        label="Phone Number*"
                                        type={"tel"}
                                        fullWidth
                                        variant="outlined"
                                        helpertext={errors?.phoneNumber?.message}

                                    />

                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        {...register("primaryInsurance", { required: "Field is required" })}
                                        error={errors.primaryInsurance && true}
                                        id="outlined-basic"
                                        label="Primary Insurance*"
                                        fullWidth
                                        variant="outlined"
                                        helpertext={errors.primaryInsurance?.message}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        {...register("secondaryInsurance", { required: "Field is required" })}
                                        error={errors.secondaryInsurance && true}
                                        id="outlined-basic"
                                        label="Secondary Insurance*"
                                        fullWidth
                                        variant="outlined"
                                        helpertext={errors.secondaryInsurance?.message}

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
