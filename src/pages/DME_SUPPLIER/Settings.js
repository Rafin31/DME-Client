import { Alert, Avatar, Box, Button, Card, Container, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { deepOrange } from '@mui/material/colors';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthRequest } from '../../services/AuthRequest';

export default function Settings() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const navigate = useNavigate()
    const [dbError, setDbError] = useState(false)
    const { id } = useParams()


    const { mutateAsync, isLoading: bannerLoading } = useMutation((banner) => {

        return AuthRequest.post(`/api/v1/dme/banner/${id}`, banner,
            {
                headers: { "Content-Type": "multipart/form-data" }
            }
        )
            .then(res => {

                window.location.reload(false);

            })
            .catch((err) => {
                toast.error(err?.response?.data?.message, {
                    toastId: 'error4'
                })
            })
    })


    const onSubmit = data => {

        const file = data.companyBanner[0]
        const formData = new FormData()
        formData.append('dme-banner', file)

        if (!!formData.entries().next().value) {
            mutateAsync(formData)
            reset()
        } else {
            toast.error("Please upload first", {
                toastId: 'error49'
            })
        }

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
                                    <LoadingButton loading={bannerLoading} type={"submit"} sx={{ width: "200px" }} size="medium" variant="contained" >Upload</LoadingButton>
                                </Grid>
                            </Grid>

                        </form>
                    </Card>
                </Grid>
            </Container>
        </>
    );
};
