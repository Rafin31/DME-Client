import { Helmet } from 'react-helmet-async';

// @mui
import { styled } from '@mui/material/styles';
import { Button, Container, Grid, TextField, Typography } from '@mui/material';
// hooks
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import { useNavigate, useParams } from 'react-router-dom';
import useResponsive from '../../../hooks/useResponsive';
import { AuthRequest } from '../../../services/AuthRequest';

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

export default function ResetPassword() {
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const [dbError, setDbError] = useState(false)
    const navigate = useNavigate()
    const { token } = useParams()

    const { mutateAsync, isLoading: dataLoading } = useMutation((data) => {

        return AuthRequest.post(`/api/v1/users/reset-password-operation`, data)
            .then(res => {

                navigate('/login')
                toast.success("Password successfully reset. Please login", {
                    toastId: 'success'
                })

            })
            .catch((err) => {
                toast.error(err?.response?.data?.data, {
                    toastId: 'error96'
                })
            })
    })

    const onSubmit = data => {

        const finalData = {
            ...data,
            token
        }
        mutateAsync(finalData);
        reset()
    };

    const mdUp = useResponsive('up', 'md');

    return (
        <>
            <Helmet>
                <title> Reset Password </title>
            </Helmet>

            <StyledRoot>

                {mdUp && (
                    <StyledSection>
                        <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
                            Reset Your Password
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
                                    <TextField
                                        {...register("newPassword", { required: "Field is required" })}
                                        error={errors.newPassword && true}
                                        id="outlined-basic"
                                        label="New Password*"
                                        type="Password"
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.newPassword?.message}

                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        {...register("confirmPassword",
                                            {
                                                required: "Field is required",
                                                minLength: { value: 8, message: "Password must be at last 8 characters" },
                                            }
                                        )}
                                        error={errors.confirmPassword && true}
                                        id="outlined-basic"
                                        label="Confirm Password*"
                                        type="password"
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.confirmPassword?.message}

                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <LoadingButton loading={dataLoading} type={"submit"} sx={{ width: "200px" }} size="medium" variant="contained" >Confirm</LoadingButton>
                                </Grid>
                            </Grid>

                        </form>

                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    );
}
