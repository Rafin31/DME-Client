import { Avatar, Box, Button, CircularProgress, Container, Divider, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from 'react-query';
import { deepOrange } from '@mui/material/colors';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Iconify from '../../components/iconify';
import { AuthRequest } from '../../services/AuthRequest';

export default function DmeSupplierProfile() {
    const navigate = useNavigate()
    const { id } = useParams()

    const { isLoading: userLoading, refetch, data: user } = useQuery('user3',
        async () => {
            return AuthRequest.get(`/api/v1/users/${id}`).then(data => data.data.data)
        }
    )

    useEffect(() => {
        refetch()
    }, [id])



    if (!user || userLoading) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }



    const name = user.fullName.match(/\b(\w)/g); // ['J','S','O','N']
    const firstLetterName = name.join('').toUpperCase(); // JSON


    return (
        <>
            <Helmet>
                <title>  DME Supplier - Profile </title>
            </Helmet>
            <Container maxWidth="1350px">

                <Stack onClick={() => navigate(-1)} direction="row" spacing={1} style={{ cursor: "pointer", marginBottom: "15px", }} sx={{
                    "&:hover": {
                        color: "#3498db",
                    },
                }} >
                    <ArrowBackIcon /> <span>Back</span>
                </Stack>

                <Stack
                    direction="row"
                    spacing={1}
                    divider={<Divider orientation="vertical" flexItem />}>
                    <Button variant="contained"
                        onClick={() => { navigate(`/DME-supplier/dashboard/edit-dme-supplier-profile/${id}`) }}
                        startIcon={<Iconify icon="material-symbols:edit-document-rounded" />}>
                        Edit Profile
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        style={{ color: "white", width: "auto" }}
                        startIcon={<Iconify icon="mdi:password-reset" />}
                        onClick={() => { navigate(`/DME-supplier/dashboard/update-password/${id}`) }}>
                        Change Password
                    </Button>

                </Stack>
                <Box>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        sx={{ my: 5, py: 2 }}>
                        <Avatar
                            sx={{ bgcolor: deepOrange[500], height: '70px', width: '70px' }}>
                            {firstLetterName}
                        </Avatar>
                        <Stack>
                            <Typography variant='h5'>{user.fullName}</Typography>
                            <Typography variant='subtitle'>{user.category}</Typography>
                        </Stack>
                    </Stack>

                    <Grid
                        sx={{ marginY: 2, paddingX: 3 }}
                        container
                        rowSpacing={3}
                        columnSpacing={5}>

                        <Grid item xs={6} sm={6} md={4}>
                            <Typography variant='subtitle'>Company Name</Typography>
                            <Typography variant='h6'>{user.details.companyName}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={4}>
                            <Typography variant='subtitle'>NPI Number</Typography>
                            <Typography variant='h6'>{user.details.npiNumber}</Typography>
                        </Grid>

                        <Grid item xs={6} sm={6} md={4}>
                            <Typography variant='subtitle'>Email</Typography>
                            <Typography variant='h6'>{user.email}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={4}>
                            <Typography variant='subtitle'>First Name</Typography>
                            <Typography variant='h6'>{user.fullName}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={4}>
                            <Typography variant='subtitle'>Last Name</Typography>
                            <Typography variant='h6'>{user.lastName}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={4}>
                            <Typography variant='subtitle'>Full Name</Typography>
                            <Typography variant='h6'>{user.fullName}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={4}>
                            <Typography variant='subtitle'>Country</Typography>
                            <Typography variant='h6'>{user.details.country}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={4}>
                            <Typography variant='subtitle'>City</Typography>
                            <Typography variant='h6'>{user.details.city}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={4}>
                            <Typography variant='subtitle'>State</Typography>
                            <Typography variant='h6'>{user.details.state}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={4}>
                            <Typography variant='subtitle'>Zip Code</Typography>
                            <Typography variant='h6'>{user.details.zip}</Typography>
                        </Grid>
                        {
                            user.details.phoneNumber &&
                            <Grid item xs={6} sm={6} md={4}>
                                <Typography variant='subtitle'>Phone Number</Typography>
                                <Typography variant='h6'>{user.details.phoneNumber}</Typography>
                            </Grid>
                        }
                        <Grid item xs={6} sm={6} md={4}>
                            <Typography variant='subtitle'>Address</Typography>
                            <Typography variant='h6'>{user.details.address}</Typography>
                        </Grid>
                    </Grid>
                </Box>

            </Container>
        </>
    );
}