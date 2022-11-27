import { Button, Card, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';

import { useForm } from "react-hook-form";
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Iconify from '../../components/iconify';




export default function AddOrder() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const onSubmit = data => {
        console.log(data)
        reset()
    };
    return (
        <>
            <Helmet>
                <title> Add Order </title>
            </Helmet>
            <Container maxWidth="xl">
                <Typography variant="h5">Add Order</Typography>
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
                                rowSpacing={1}
                                columnSpacing={{ xs: 2, sm: 3, md: 5, lg: 5 }}
                            >
                                <Grid item xs={12}>
                                    <TextField
                                        {...register("supplier")}
                                        error={errors.supplier && true}
                                        id="outlined-basic"
                                        label="DME Supplier"
                                        fullWidth
                                        variant="outlined"
                                        defaultValue={"Jaydon"}
                                        helpertext={errors.supplier?.message}
                                        InputProps={{
                                            readOnly: true,
                                        }}

                                    />
                                </Grid>

                                <Grid item xs={12} style={{ margin: "10px 0px" }}>
                                    <FormControl fullWidth>
                                        <InputLabel style={{ width: "auto", textAlign: "center", backgroundColor: "white" }} >Patient</InputLabel>
                                        <Select
                                            variant="outlined"
                                            size="small"
                                            defaultValue=""
                                            error={errors.patient && true}
                                            rows={2}
                                            {...register("patient", { required: true })}

                                        >
                                            <MenuItem value={1}>Option 1</MenuItem>
                                            <MenuItem value={2}>Option 2</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} >
                                    <TextField
                                        {...register("description", { required: true })}
                                        id="outlined-basic"
                                        label="Description"
                                        error={errors.description && true}
                                        fullWidth
                                        multiline
                                        rows={4}
                                        helpertext={errors.description?.message}
                                        variant="outlined" />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        {...register("notes", { required: true })}
                                        id="outlined-basic"
                                        label="Notes"
                                        error={errors.notes && true}
                                        fullWidth
                                        multiline
                                        helpertext={errors.notes?.message}
                                        rows={4}
                                        variant="outlined" />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type={"submit"} sx={{ width: "200px" }} size="medium" variant="contained" endIcon={<Iconify icon="eva:plus-fill" />}>Add</Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Card>
                </Grid>
            </Container>
        </>
    );
};
