import { Alert, Avatar, Box, Button, Card, Container, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { deepOrange } from '@mui/material/colors';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../components/iconify';
import { fDate } from '../../utils/formatTime';
import { AuthRequest } from '../../services/AuthRequest';
import { userContext } from '../../Context/AuthContext';

export default function UpdatePassword() {
    const { id } = useParams()
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const [dbError, setDbError] = useState(false)


    const { signOut } = useContext(userContext)


    const { mutateAsync, isLoading: passwordLoading } = useMutation((password) => {

        return AuthRequest.patch(`/api/v1/users/${id}`, password).then(res => {

            toast.success("Password Updated.Please login", {
                toastId: "success121"
            })

            signOut()

        }).catch(err => {
            toast.error(err.response?.data?.message.split(":")[1], {
                toastId: "error215"
            })
        })
    })


    const onSubmit = (data) => {

        if (data.newPassword !== data.confirmPassword) {
            return toast.error("Password did not matched!", { toastId: "error20" })
        }

        delete data.confirmPassword;

        return mutateAsync(data);
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
                                        {...register("password", { required: "Field is required" })}
                                        error={errors.currentPassword && true}
                                        id="outlined-basic"
                                        label="Current Password*"
                                        type="password"
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.password?.message}

                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        {...register("newPassword",
                                            {
                                                required: "Field is required",
                                                minLength: { value: 8, message: "Password must be at last 8 characters long!" },
                                            }
                                        )}
                                        error={errors.newPassword && true}
                                        id="outlined-basic"
                                        label="New Password*"
                                        type="password"
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.newPassword?.message}

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
                                        type="password"
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.confirmPassword?.message}

                                    />
                                </Grid>


                                <Grid item xs={12}>
                                    <LoadingButton loading={passwordLoading} type={"submit"} sx={{ width: "200px" }} size="medium" variant="contained" >Confirm</LoadingButton>
                                </Grid>
                            </Grid>

                        </form>
                    </Card>
                </Grid>
            </Container>
        </>
    );
};
