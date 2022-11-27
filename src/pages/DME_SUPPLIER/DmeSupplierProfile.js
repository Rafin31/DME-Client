import { Avatar, Box, Button, Container, Divider, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { deepOrange } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../components/iconify';

export default function DmeSupplierProfile() {

    const navigate = useNavigate()
    const user = [
        {
            companyName: "DHL Fedex",
            name: "Jaydon Frankie",
            userName: "Karim986",
            email: "jaydon@gmail.com",
            userCategory: "DME Supplier",
            Fname: "karim",
            Lname: "Hasan",
            city: "New York",
            country: "USA",
            state: "New York",
            zipCode: "9565",
            address: "98/2 Street, New York USA"
        }
    ]


    return (
        <>
            <Helmet>
                <title>  DME Supplier - Profile </title>
            </Helmet>
            <Container maxWidth="xl">
                <Stack
                    direction="row"
                    spacing={1}
                    divider={<Divider orientation="vertical" flexItem />}>
                    <Button variant="contained"
                        onClick={() => { navigate(`/DME-supplier/dashboard/edit-dme-supplier-profile/${12}`) }}
                        startIcon={<Iconify icon="material-symbols:edit-document-rounded" />}>
                        Edit Profile
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        style={{ color: "white", width: "auto" }}
                        startIcon={<Iconify icon="mdi:password-reset" />}
                        onClick={() => { navigate(`/DME-supplier/dashboard/update-password/${654}`) }}>
                        Change Password
                    </Button>

                </Stack>
                {
                    user.map(({ companyName, name, userName, email, userCategory, Fname, Lname, city, country, state, zipCode, address }) => {
                        return (
                            <Box>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={2}
                                    sx={{ my: 5, py: 2 }}>
                                    <Avatar
                                        sx={{ bgcolor: deepOrange[500], height: '70px', width: '70px' }}>
                                        JF
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
                                        <Typography variant='subtitle'>Company Name</Typography>
                                        <Typography variant='h6'>{companyName}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4}>
                                        <Typography variant='subtitle'>User Name</Typography>
                                        <Typography variant='h6'>{userName}</Typography>
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
                                        <Typography variant='subtitle'>Full Name</Typography>
                                        <Typography variant='h6'>{name}</Typography>
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
                                        <Typography variant='subtitle'>Zip Code</Typography>
                                        <Typography variant='h6'>{zipCode}</Typography>
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