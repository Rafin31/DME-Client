import React, { useCallback, useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Card, Chip, CircularProgress, Container, Divider, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { AuthRequest } from 'src/services/AuthRequest';
import { useMutation, useQuery } from 'react-query';
import { Helmet } from 'react-helmet-async';
import ClientNotes from './ClientNotes';
import ClientDocuments from './ClientDocuments';
import { useLoginUser } from 'src/services/CheckCategory';


const PatientStates = () => {

    const [value, setValue] = useState(0);
    const { id: patientId } = useParams()
    const navigate = useNavigate()

    const { loggedUser } = useLoginUser()

    const handleChange = useCallback((event, newValue) => {
        setValue(newValue)
    }, [])

    const fetchData = async (patientId) => {
        const equipmentPromise = AuthRequest.get(`/api/v1/order/patient/${patientId}`).then(data => data.data.data);
        const repairPromise = AuthRequest.get(`/api/v1/repair-order/patient/${patientId}`).then(data => data.data.data);
        const patientPromise = AuthRequest.get(`/api/v1/users/${patientId}`).then(data => data.data.data);


        const [
            equipmentOrder,
            repairOrder,
            patient,
        ] = await Promise.all([equipmentPromise, repairPromise, patientPromise]);

        return { equipmentOrder, repairOrder, patient };
    }


    const { isLoading, refetch, data } = useQuery(`combinedOrderData-${patientId}`, () => fetchData(patientId));


    useEffect(() => {
        const path = window.location.pathname
        if (path === `/DME-supplier/dashboard/patient-states/${patientId}`) return setValue(0)
        if (path === `/DME-supplier/dashboard/patient-states/${patientId}/order-history`) return setValue(1)

        return () => {
            setValue(0)
        }

    }, [handleChange, patientId])

    const { mutateAsync: removeDoctor } = useMutation((data) => {

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
    const { mutateAsync: removeTherapist } = useMutation((data) => {

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

    const handleChipClick = (id) => {
        navigate(`/DME-supplier/dashboard/user-profile/${id}`)
    }


    const handleDeleteDoctorClick = async (doctorUserId) => {
        const data = {
            patientUserId: patient._id,
            doctorUserId: doctorUserId
        }
        removeDoctor(data)
    };

    const handleTherapistDelete = (therapistUserId) => {
        const data = {
            patientUserId: patient._id,
            therapistUserId: therapistUserId
        }
        removeTherapist(data)
    };


    if (isLoading || !data.patient) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }

    const { equipmentOrder, repairOrder, patient } = data

    const equipmentOrderHistory = equipmentOrder !== "No order found!" ? equipmentOrder?.filter(eq => eq.status === "Archived") : []
    const repairOrderHistory = repairOrder !== "No order found!" ? repairOrder?.filter(rp => rp.status === "Archived") : []




    return (
        <>
            <Helmet>
                <title>  Client States </title>
            </Helmet>
            <Container maxWidth="1350px">
                <Stack onClick={() => navigate(-1)} direction="row" spacing={1} style={{ cursor: "pointer", marginBottom: "15px", width: "150px" }} sx={{
                    "&:hover": {
                        color: "#3498db",
                    },
                }} >
                    <ArrowBackIcon /> <span>Back</span>
                </Stack>


                <Box>
                    <Typography variant="h6" mb={3}>
                        All activities of <Link
                            to={`/DME-supplier/dashboard/user-profile/${patient?._id}`}
                            style={{ color: "black", cursor: "pointer", marginLeft: "6px" }}
                            color="inherit" variant="subtitle2" nowrap="true"
                            target="_blank" rel="noopener noreferrer"
                        >{`${patient?.fullName}'s`}</Link>
                    </Typography>


                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="basic tabs example"
                        style={{ marginBottom: "15px" }}>

                        <Tab label="Current Orders" to={`/DME-supplier/dashboard/patient-states/${patientId}`} style={{ backgroundColor: "#f9fafc" }} component={Link} draggable="true" />

                        <Tab label="Order History" style={{ backgroundColor: "#f9fafc" }} to={`/DME-supplier/dashboard/patient-states/${patientId}/order-history`} component={Link} draggable="true" />

                    </Tabs>
                </Box>

                <main>
                    <Outlet context={{ isLoading, refetch, equipmentOrder, repairOrder, patient, equipmentOrderHistory, repairOrderHistory }} />
                </main>
                <Divider />
                <Grid container spacing={1} justifyContent="center" sx={{ marginY: 1 }}>
                    <Grid item xs={12} sm={6}>
                        <Card variant='outlined' sx={{ paddingY: 1, paddingX: 1, marginY: 1, minHeight: "300px" }}
                            style={{ border: "1px solid #eaeeef", boxShadow: "none" }}>
                            <ClientNotes patientId={patientId} />
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card variant='outlined' sx={{ paddingY: 1, paddingX: 1, marginY: 1, minHeight: "300px" }}
                            style={{ border: "1px solid #eaeeef", boxShadow: "none" }}>
                            <ClientDocuments patientId={patientId} />
                        </Card>

                    </Grid>
                </Grid>

                <Divider />
                <Stack
                    direction="row"
                    alignItems="start"
                    spacing={2}
                    sx={{ my: 5, py: 2 }}
                >
                    {
                        patient?.details?.doctor &&
                        <Grid item xs={6} sm={6} md={4}>
                            <Typography variant='subtitle'>Assigned Doctors</Typography>
                            <br />
                            {
                                patient.details.doctor.length !== 0 ? patient.details?.doctor?.map((doc, index) => {
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
                        patient?.details?.therapist &&
                        <Grid item xs={6} sm={6} md={4}>
                            <Typography variant='subtitle'>Assigned Therapist</Typography>
                            <br />
                            {
                                patient.details.therapist.length !== 0 ? patient.details.therapist.map((therapist, index) => {
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

                </Stack>

            </Container>
        </>
    );
};

export default PatientStates;