import { Alert, Avatar, Box, Button, Card, Container, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { deepOrange } from '@mui/material/colors';
import { useForm } from 'react-hook-form';
import Iconify from '../../components/iconify';
import { fDate } from '../../utils/formatTime';

export default function Settings() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [dbError, setDbError] = useState(false)
    const onSubmit = data => {

        const file = data.companyBanner[0]
        const formData = new FormData()
        formData.append('file', file)
        console.log(!!formData.entries().next().value) // check if file uploaded or not
        reset()
    };
    return (
        <>
            <Helmet>
                <title> Settings </title>
            </Helmet>
            <Container maxWidth="xl">
                <Typography variant="h5">Settings</Typography>
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
                                <Grid item xs={12}>
                                    <p
                                        style={{ margin: "0px", padding: "0px" }}>
                                        Company Banner*
                                    </p>
                                    <p
                                        style={{ fontSize: "smaller", margin: "0px", marginBottom: "10px" }}>
                                        *Only png and jpg files are allowed
                                    </p>
                                    <TextField
                                        {...register("companyBanner", { required: "Field is required" })}
                                        error={errors.companyBanner && true}
                                        id="outlined-basic"
                                        type="file"
                                        fullWidth
                                        variant="outlined"
                                        helpertext={errors.companyBanner?.message}

                                    />
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
