import { Alert, Avatar, Box, Button, Card, Container, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { deepOrange } from '@mui/material/colors';
import { useForm } from 'react-hook-form';
import Iconify from '../../components/iconify';
import { fDate } from '../../utils/formatTime';

export default function UpdatePassword() {
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const [dbError, setDbError] = useState(false)
    const onSubmit = data => {
        console.log(data)
        reset()
    };
    return (
        <>
            <Helmet>
                <title>Update Password</title>
            </Helmet>
            <Container maxWidth="xl">
                <Typography variant="h5">Update Password</Typography>
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
                                    <TextField
                                        {...register("currentPassword", { required: "Field is required" })}
                                        error={errors.currentPassword && true}
                                        id="outlined-basic"
                                        label="Current Password*"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        helpertext={errors.currentPassword?.message}

                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        {...register("newPassword",
                                            {
                                                required: "Field is required",
                                                minLength: { value: 8, message: "Password must be at last 8 characters" },
                                            }
                                        )}
                                        error={errors.newPassword && true}
                                        id="outlined-basic"
                                        label="New Password*"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        helpertext={errors.newPassword?.message}

                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        {...register("confirmPassword",
                                            {
                                                required: "Field is required",
                                                validate: (val) => {
                                                    if (watch('newPassword') !== val) {
                                                        return "Your passwords do no match";
                                                    }
                                                    return true;
                                                }
                                            }
                                        )}
                                        error={errors.confirmPassword && true}
                                        id="outlined-basic"
                                        label="Confirm Password*"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        helpertext={errors.confirmPassword?.message}

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
