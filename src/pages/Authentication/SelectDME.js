import { Helmet } from 'react-helmet-async';

// @mui
import { styled } from '@mui/material/styles';
import { Box, CircularProgress, Container, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
// hooks
import { useForm } from 'react-hook-form';
import { useState } from 'react';

import useResponsive from '../../hooks/useResponsive';
import { LoadingButton } from '@mui/lab';
import { useQuery } from 'react-query';
import { AuthRequest } from '../../../src/services/AuthRequest';
import { usePatientContext } from '../../../src/Context/PatientSignupContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// components


const StyledRoot = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

const StyledSection = styled('div')(({ theme }) => ({
    width: '100%',
    maxWidth: 480,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: theme.customShadows.card,
    backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function SelectDME() {
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { patientData } = usePatientContext()
    const navigate = useNavigate()

    const { isLoading: activeDMELoading, data: activeDME } = useQuery('activeDME',
        async () => {
            return AuthRequest.get(`/api/v1/dme/active-dme`).then(data => data.data.data)
        }
    )


    const onSubmit = async (data) => {
        setLoading(true)
        const patient = patientData
        patient.dmeSupplier = data.activeDmeList

        await axios.post('/api/v1/users', patient)
            .then(res => {
                setLoading(false)
                toast.success("Successfully Signed up! Please login", {
                    toastId: 'success1',
                });
                navigate('/', { replace: true });
            })
            .catch(error => {
                setLoading(false)
                toast.error(error.response.data.message, {
                    toastId: 'error1',
                });
            });
    };


    const mdUp = useResponsive('up', 'md');


    if (activeDMELoading) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }



    return (
        <>
            <Helmet>
                <title> Select Your Preferred DME Supplier </title>
            </Helmet>

            <StyledRoot>

                {mdUp && (
                    <StyledSection>
                        <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
                            Select Your Preferred DME Supplier
                        </Typography>
                        <img src="/assets/illustrations/auth.png" alt="signup" />
                    </StyledSection>
                )}

                <Container maxWidth="sm">
                    <StyledContent>
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <Grid
                                container
                                rowSpacing={2}
                                columnSpacing={{ xs: 2, sm: 3, md: 5, lg: 5 }}
                            >
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel style={{ width: "auto", textAlign: "center", backgroundColor: "white" }} >DME Supplier*</InputLabel>
                                        <Select
                                            {...register("activeDmeList", { required: "Field is required" })}
                                            variant="outlined"
                                            size="small"
                                            error={errors.activeDmeList && true}
                                            helperText={errors.activeDmeList?.message}
                                            defaultValue=""

                                        >
                                            {
                                                activeDME.map(dme => {
                                                    return <MenuItem key={dme._id} value={dme._id}>{dme.fullName}</MenuItem>
                                                })
                                            }


                                        </Select>
                                    </FormControl>


                                </Grid>
                                <Grid item xs={12}>
                                    <LoadingButton loading={loading} fullWidth size="small" type="submit"
                                        variant="contained" >
                                        Done
                                    </LoadingButton>
                                </Grid>

                            </Grid>

                        </form>

                    </StyledContent>
                </Container>
            </StyledRoot >
        </>
    );
}
