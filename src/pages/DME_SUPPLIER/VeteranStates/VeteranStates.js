import React, { useCallback, useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Card, CircularProgress, Container, Divider, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { AuthRequest } from 'src/services/AuthRequest';
import { useQuery } from 'react-query';
import { Helmet } from 'react-helmet-async';
import VeteranStatesNotes from './VeteranStatesNotes';


const VeteranStates = () => {

    const [value, setValue] = useState(0);
    const { id: veteranId } = useParams()
    const navigate = useNavigate()

    const handleChange = useCallback((event, newValue) => {
        setValue(newValue)
    }, [])

    const fetchData = async (veteranId) => {
        const veteranCurrentOrderPromise = AuthRequest.get(`/api/v1/veteran-order/veteran/${veteranId}`).then(data => data.data.data);
        const veteranPromise = AuthRequest.get(`/api/v1/users/${veteranId}`).then(data => data.data.data);


        const [
            veteranCurrentOrder,
            veteran,
        ] = await Promise.all([veteranCurrentOrderPromise, veteranPromise]);

        return { veteranCurrentOrder, veteran };
    }


    const { isLoading, refetch, data: veteranData } = useQuery(`combinedOrderData-${veteranId}`, () => fetchData(veteranId));


    useEffect(() => {
        const path = window.location.pathname
        if (path === `/DME-supplier/dashboard/veteran-states/${veteranId}`) return setValue(0)
        if (path === `/DME-supplier/dashboard/veteran-states/${veteranId}/order-history`) return setValue(1)

        return () => {
            setValue(0)
        }

    }, [handleChange, veteranId])


    if (isLoading || !veteranData.veteran) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }

    const { veteranCurrentOrder, veteran } = veteranData

    const veteranCurrentOrderHistory = veteranCurrentOrder !== "No order found!" ? veteranCurrentOrder?.filter(eq => eq.status === "Archived") : []


    return (
        <>
            <Helmet>
                <title>  Veteran States </title>
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
                            to={`/DME-supplier/dashboard/user-profile/${veteran?._id}`}
                            style={{ color: "black", cursor: "pointer", marginLeft: "6px" }}
                            color="inherit" variant="subtitle2" nowrap="true"
                            rel="noopener noreferrer"
                        >{`${veteran?.fullName}'s`}</Link>
                    </Typography>


                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="basic tabs example"
                        style={{ marginBottom: "15px" }}>

                        <Tab label="Current Orders" to={`/DME-supplier/dashboard/veteran-states/${veteranId}`} style={{ backgroundColor: "#f9fafc" }} component={Link} draggable="true" />

                        <Tab label="Order History" style={{ backgroundColor: "#f9fafc" }} to={`/DME-supplier/dashboard/veteran-states/${veteranId}/order-history`} component={Link} draggable="true" />

                    </Tabs>
                </Box>

                <main>
                    <Outlet context={{ isLoading, refetch, veteranCurrentOrder, veteran, veteranCurrentOrderHistory }} />
                </main>
                <Divider />
                <Grid container spacing={1} justifyContent="center" sx={{ marginY: 1 }}>
                    <Grid item xs={12} sm={6}>
                        <Card variant='outlined' sx={{ paddingY: 1, paddingX: 1, marginY: 1, minHeight: "300px" }}
                            style={{ border: "1px solid #eaeeef", boxShadow: "none" }}>
                            <VeteranStatesNotes patientId={veteranId} />
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>

                    </Grid>
                </Grid>

                <Divider />
                {/* <Stack
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

                </Stack> */}

            </Container>
        </>
    );
};

export default VeteranStates;