import { Avatar, Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { deepOrange } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../components/iconify';
import { fDate } from '../../utils/formatTime';

export default function PatientProfile() {

    const navigate = useNavigate()
    const user = [
        {
            name: "Karim Hasan",
            email: "karim@gmail.com",
            userCategory: "Patient",
            Fname: "karim",
            Lname: "Hasan",
            dob: fDate('6/25/1986'),
            gender: "Male",
            weight: 86,
            city: "New York",
            country: "USA",
            state: "New York",
            phoneNumber: "+95 6589 657 590",
            primaryInsurance: "67494564576",
            secondaryInsurance: "67494564576",
            address: "98/2 Street, New York USA"
        }
    ]


    return (
        <>
            <Helmet>
                <title> Patient Profile </title>
            </Helmet>
            <Container maxWidth="xl">
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h4">Patient Profile </Typography>
                    <Button variant="contained"
                        onClick={() => { navigate(`/DME-supplier/dashboard/edit-patient-profile/${12}`) }}
                        startIcon={<Iconify icon="material-symbols:edit-document-rounded" />}>
                        Edit Profile
                    </Button>
                </Stack>
                {
                    user.map(({ name, email, userCategory, Fname, Lname, dob, gender, weight, city, country, state, phoneNumber, primaryInsurance, secondaryInsurance, address }) => {
                        return (
                            <Box>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={2}
                                    sx={{ my: 5, py: 2 }}>
                                    <Avatar
                                        sx={{ bgcolor: deepOrange[500], height: '70px', width: '70px' }}>
                                        KH
                                    </Avatar>
                                    <Stack>
                                        <Typography variant='h5'>{name}</Typography>
                                        <Typography variant='subtitle'>{userCategory}</Typography>
                                    </Stack>
                                </Stack>

                                <Grid
                                    sx={{ marginY: 2, paddingX: 3 }}
                                    container
                                    rowSpacing={3}
                                    columnSpacing={5}>

                                    <Grid item xs={6} sm={6} md={4}>
                                        <Typography variant='subtitle'>Full Name</Typography>
                                        <Typography variant='h6'>{name}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4}>
                                        <Typography variant='subtitle'>Email</Typography>
                                        <Typography variant='h6'>{email}</Typography>
                                    </Grid>

                                    <Grid item xs={6} sm={6} md={4}>
                                        <Typography variant='subtitle'>First Name</Typography>
                                        <Typography variant='h6'>{Fname}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4}>
                                        <Typography variant='subtitle'>Last Name</Typography>
                                        <Typography variant='h6'>{Lname}</Typography>
                                    </Grid>

                                    <Grid item xs={6} sm={6} md={4}>
                                        <Typography variant='subtitle'>Date of Birth</Typography>
                                        <Typography variant='h6'>{dob}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4}>
                                        <Typography variant='subtitle'>Gender</Typography>
                                        <Typography variant='h6'>{gender}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4}>
                                        <Typography variant='subtitle'>Weight (lbs)</Typography>
                                        <Typography variant='h6'>{weight}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4}>
                                        <Typography variant='subtitle'>Country</Typography>
                                        <Typography variant='h6'>{country}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4}>
                                        <Typography variant='subtitle'>City</Typography>
                                        <Typography variant='h6'>{city}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4}>
                                        <Typography variant='subtitle'>State</Typography>
                                        <Typography variant='h6'>{state}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4}>
                                        <Typography variant='subtitle'>Phone Number</Typography>
                                        <Typography variant='h6'>{phoneNumber}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4}>
                                        <Typography variant='subtitle'>Primary Insurance</Typography>
                                        <Typography variant='h6'>{primaryInsurance}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4}>
                                        <Typography variant='subtitle'>Secondary Insurance</Typography>
                                        <Typography variant='h6'>{secondaryInsurance}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4}>
                                        <Typography variant='subtitle'>Address</Typography>
                                        <Typography variant='h6'>{address}</Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        )
                    })
                }
            </Container>
        </>
    );
}