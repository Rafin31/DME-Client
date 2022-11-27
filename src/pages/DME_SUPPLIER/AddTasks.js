import { Alert, Button, Card, Container, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useForm } from "react-hook-form";
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Iconify from '../../components/iconify';
// import { fDate } from '../utils/formatTime';





export default function AddTasks() {
    const [date, setDate] = useState(new Date())
    const [dateError, setError] = useState({
        status: false,
        message: " "
    })
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const onSubmit = data => {
        if (!date) {
            setError({
                status: true,
                message: "Date is required"
            })
            return
        }
        const givenDate = new Date(date);
        const presentDate = new Date()

        if (givenDate < presentDate) {
            setError({
                status: true,
                message: "Date can not be in past"
            })
            return
        }
        console.log(data, date.toDateString())
        reset()
    };



    return (
        <>
            <Helmet>
                <title> Add Notes </title>
            </Helmet>
            <Container maxWidth="xl">
                <Typography variant="h5">Add Notes</Typography>
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

                                <Grid item xs={12} style={{ margin: "10px 0px" }}>
                                    <FormControl fullWidth>
                                        <InputLabel style={{ width: "auto", textAlign: "center", backgroundColor: "white" }} >{"Patient"}</InputLabel>
                                        <Select
                                            variant="outlined"
                                            defaultValue=""
                                            size="small"
                                            error={errors.supplier && true}
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
                                    <Stack spacing={3}>

                                        <DayPicker
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                        />
                                    </Stack>
                                    {dateError?.status && <Alert severity="error">{dateError?.message}</Alert>}
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
