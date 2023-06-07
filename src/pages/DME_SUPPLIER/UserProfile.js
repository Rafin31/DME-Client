import { Avatar, Box, Button, Chip, CircularProgress, Container, Divider, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { deepOrange } from '@mui/material/colors';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Iconify from '../../components/iconify';
import { AuthRequest } from '../../services/AuthRequest';
import { useLoginUser } from '../../services/CheckCategory';
import { toast } from 'react-toastify';

export default function UserProfile() {

    const navigate = useNavigate()
    const { id } = useParams()

    const { loggedUser } = useLoginUser()

    const { isLoading: userLoading, refetch, data: user } = useQuery(`user-profile-${id}`,
        async () => {
            return AuthRequest.get(`/api/v1/users/${id}`).then(data => data.data.data)
        }
    )

    const { mutateAsync: removeDoctor, isLoading: removeDoctorLoading } = useMutation((data) => {

        return AuthRequest.post(`/api/v1/dme/remove-doctor-from-patient`, data)
            .then(res => {
                refetch()
                toast.success("Doctor Removed!", res, {
                    toastId: 'success699'
                })

            })
            .catch((err) => {
                refetch()
                toast.error(err.response.data.message, {
                    toastId: 'error4'
                })
            })
    })
    const { mutateAsync: removeTherapist, isLoading: removeTherapistLoading } = useMutation((data) => {

        return AuthRequest.post(`/api/v1/dme/remove-therapist-from-patient`, data)
            .then(res => {
                refetch()
                toast.success("Therapist Removed!", res, {
                    toastId: 'success6899'
                })

            })
            .catch((err) => {
                refetch()
                toast.error(err.response.data.message, {
                    toastId: 'error94'
                })
            })
    })

    useEffect(() => {
        refetch()
    }, [id])


    if (!user || userLoading || !loggedUser || removeDoctorLoading || removeTherapistLoading) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }

    const name = user.fullName.match(/\b(\w)/g); // ['J','S','O','N']
    const firstLetterName = name.join('').toUpperCase(); // JSON

    const handleChipClick = (id) => {
        navigate(`/DME-supplier/dashboard/user-profile/${id}`)
    }

    const handleDeleteDoctorClick = async (doctorUserId) => {
        const data = {
            patientUserId: id,
            doctorUserId: doctorUserId
        }
        removeDoctor(data)
    };

    const handleTherapistDelete = (therapistUserId) => {
        const data = {
            patientUserId: id,
            therapistUserId: therapistUserId
        }
        removeTherapist(data)
    };



    return (
        <>
            <Helmet>
                <title> User Profile </title>
            </Helmet>
            <Container maxWidth="1350px">

                <Stack onClick={() => navigate(-1)} direction="row" spacing={1} style={{ cursor: "pointer", marginBottom: "15px", width: "150px" }} sx={{
                    "&:hover": {
                        color: "#3498db",
                    },
                }} >
                    <ArrowBackIcon /> <span>Back</span>
                </Stack>


                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h4">User Profile </Typography>
                    <Button variant="contained"
                        onClick={() => { navigate(`/DME-supplier/dashboard/edit-user-profile/${id}?user=${user.category.toLowerCase()}`) }}
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

                    {
                        user.category === "Patient" &&
                        <Stack
                            direction="row"
                            alignItems="start"
                            spacing={2}
                            sx={{ my: 5, py: 2 }}
                        >
                            {
                                user.details.doctor &&
                                <Grid item xs={6} sm={6} md={4}>
                                    <Typography variant='subtitle'>Assigned Doctors</Typography>
                                    <br />
                                    {
                                        user.details.doctor.length !== 0 ? user.details?.doctor?.map((doc, index) => {
                                            return (
                                                <Chip
                                                    key={index}
                                                    label={doc?.fullName}
                                                    sx={{ fontWeight: 800, mr: 1, my: 1 }}
                                                    onClick={() => handleChipClick(doc._id)}
                                                    onDelete={
                                                        (loggedUser?.category === "DME-Supplier" || loggedUser?.category === "DME-Staff") ?
                                                            () => { handleDeleteDoctorClick(doc._id) }
                                                            :
                                                            false
                                                    }
                                                />
                                            )
                                        })
                                            :
                                            <p style={{ maxWidth: "220px", fontSize: "12px" }}>No doctors has been assigned yet!</p>
                                    }
                                </Grid>
                            }
                            {
                                user.details.therapist &&
                                <Grid item xs={6} sm={6} md={4}>
                                    <Typography variant='subtitle'>Assigned Therapist</Typography>
                                    <br />
                                    {
                                        user.details.therapist.length !== 0 ? user.details.therapist.map((therapist, index) => {
                                            return (
                                                <Chip
                                                    key={index}
                                                    label={therapist?.fullName}
                                                    sx={{ fontWeight: 800, mr: 1, my: 1 }}
                                                    onClick={() => handleChipClick(therapist._id)}
                                                    onDelete={(loggedUser?.category === "DME-Supplier" || loggedUser?.category === "DME-Staff") ?
                                                        () => handleTherapistDelete(therapist._id)
                                                        :
                                                        false
                                                    }
                                                />
                                            )
                                        })
                                            :
                                            <p style={{ maxWidth: "220px", fontSize: "12px" }}>No Therapist has been assigned yet!</p>
                                    }

                                </Grid>
                            }
                            <Divider variant="middle" />
                        </Stack>

                    }



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
                        {
                            user.details.title &&
                            <Grid item xs={6} sm={6} md={4}>
                                <Typography variant='subtitle'>Title</Typography>
                                <Typography variant='h6'>{user.details.title}</Typography>
                            </Grid>
                        }

                        {
                            user.details.dob &&
                            <Grid item xs={6} sm={6} md={4}>
                                <Typography variant='subtitle'>Date of Birth</Typography>
                                <Typography variant='h6'>{user.details.dob}</Typography>
                            </Grid>
                        }

                        {
                            user.details.gender &&
                            <Grid item xs={6} sm={6} md={4}>
                                <Typography variant='subtitle'>Gender</Typography>
                                <Typography variant='h6'>{user.details.gender}</Typography>
                            </Grid>
                        }
                        {
                            user.details.weight &&
                            <Grid item xs={6} sm={6} md={4}>
                                <Typography variant='subtitle'>Weight (lbs)</Typography>
                                <Typography variant='h6'>{user.details.weight}</Typography>
                            </Grid>
                        }
                        {
                            user.details.zip &&
                            <Grid item xs={6} sm={6} md={4}>
                                <Typography variant='subtitle'>Zip</Typography>
                                <Typography variant='h6'>{user.details.zip}</Typography>
                            </Grid>
                        }
                        {
                            user.details.city &&
                            <Grid item xs={6} sm={6} md={4}>
                                <Typography variant='subtitle'>City</Typography>
                                <Typography variant='h6'>{user.details.city}</Typography>
                            </Grid>
                        }
                        {
                            user.details.state &&
                            <Grid item xs={6} sm={6} md={4}>
                                <Typography variant='subtitle'>State</Typography>
                                <Typography variant='h6'>{user.details.state}</Typography>
                            </Grid>
                        }
                        {
                            user.details.phoneNumber &&
                            <Grid item xs={6} sm={6} md={4}>
                                <Typography variant='subtitle'>Phone Number</Typography>
                                <Typography variant='h6'>{user.details.phoneNumber}</Typography>
                            </Grid>
                        }
                        {
                            user.details.primaryInsurance &&
                            <Grid item xs={6} sm={6} md={4}>
                                <Typography variant='subtitle'>Primary Insurance</Typography>
                                <Typography variant='h6'>{user.details.primaryInsurance}</Typography>
                            </Grid>
                        }
                        {
                            user.details.secondaryInsurance &&
                            <Grid item xs={6} sm={6} md={4}>
                                <Typography variant='subtitle'>Secondary Insurance</Typography>
                                <Typography variant='h6'>{user.details.secondaryInsurance}</Typography>
                            </Grid>
                        }
                        {
                            user.details.address &&
                            <Grid item xs={6} sm={6} md={4}>
                                <Typography variant='subtitle'>Address</Typography>
                                <Typography variant='h6'>{user.details.address}</Typography>
                            </Grid>
                        }
                        <Grid item xs={6} sm={6} md={4}>
                            <Typography variant='subtitle'>ID#</Typography>
                            <Typography variant='h6'>{id.substring(id.length - 4, id.length)}</Typography>
                        </Grid>
                        {
                            user.details.lastFour &&
                            <Grid item xs={6} sm={6} md={4}>
                                <Typography variant='subtitle'>Last Four#</Typography>
                                <Typography variant='h6'>{user.details.lastFour}</Typography>
                            </Grid>
                        }
                        {
                            user.details.companyName &&
                            <Grid item xs={6} sm={6} md={4}>
                                <Typography variant='subtitle'>Company Name</Typography>
                                <Typography variant='h6'>{user.details.companyName}</Typography>
                            </Grid>
                        }
                        {
                            user.details.npiNumber &&
                            <Grid item xs={6} sm={6} md={4}>
                                <Typography variant='subtitle'>NPI#</Typography>
                                <Typography variant='h6'>{user.details.npiNumber}</Typography>
                            </Grid>
                        }
                    </Grid>
                </Box>
            </Container>
        </>
    );
}