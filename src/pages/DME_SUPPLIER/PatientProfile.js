import { Avatar, Box, Button, CircularProgress, Container, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { deepOrange } from '@mui/material/colors';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import Iconify from '../../components/iconify';
import { fDate } from '../../utils/formatTime';
import { AuthRequest } from '../../services/AuthRequest';

export default function PatientProfile() {

    const navigate = useNavigate()
    const { id } = useParams()

    const { isLoading: userLoading, refetch, data: user } = useQuery('user2',
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
                <title> Patient Profile </title>
            </Helmet>
            <Container maxWidth="xl">
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h4">Patient Profile </Typography>
                    <Button variant="contained"
                        onClick={() => { navigate(`/DME-supplier/dashboard/edit-patient-profile/${id}`) }}
                        startIcon={<Iconify icon="material-symbols:edit-document-rounded" />}>
                        Edit Profile
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
                            <Typography variant='subtitle'>Full Name</Typography>
                            <Typography variant='h6'>{user.fullName}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={4}>
                            <Typography variant='subtitle'>Email</Typography>
                            <Typography variant='h6'>{user.email}</Typography>
                        </Grid>

                        <Grid item xs={6} sm={6} md={4}>
                            <Typography variant='subtitle'>First Name</Typography>
                            <Typography variant='h6'>{user.firstName}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={4}>
                            <Typography variant='subtitle'>Last Name</Typography>
                            <Typography variant='h6'>{user.lastName}</Typography>
                        </Grid>

                        <Grid item xs={6} sm={6} md={4}>
                            <Typography variant='subtitle'>Date of Birth</Typography>
                            <Typography variant='h6'>{user.details.dob}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={4}>
                            <Typography variant='subtitle'>Gender</Typography>
                            <Typography variant='h6'>{user.details.gender}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={4}>
                            <Typography variant='subtitle'>Weight (lbs)</Typography>
                            <Typography variant='h6'>{user.details.weight}</Typography>
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
                            <Typography variant='subtitle'>Phone Number</Typography>
                            <Typography variant='h6'>{user.details.phoneNumber}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={4}>
                            <Typography variant='subtitle'>Primary Insurance</Typography>
                            <Typography variant='h6'>{user.details.primaryInsurance}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={4}>
                            <Typography variant='subtitle'>Secondary Insurance</Typography>
                            <Typography variant='h6'>{user.details.secondaryInsurance}</Typography>
                        </Grid>
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