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

export default function ForgetPassword() {
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const [dbError, setDbError] = useState(false)

    const { mutateAsync, isLoading: emailLoading } = useMutation((email) => {

        return AuthRequest.post(`/api/v1/users/reset-password-request`, email)
            .then(res => {

                toast.success(`A verification mail has been sent to ${email.email}`, {
                    toastId: 'success6565'
                })
                reset()

            })
            .catch((err) => {
                toast.error(err?.response?.data?.data, {
                    toastId: 'error4'
                })
            })
    })


    const onSubmit = data => {

        mutateAsync(data)
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
                                        {...register("email",
                                            {
                                                required: "Field is required",
                                            }
                                        )}
                                        error={errors.email && true}
                                        id="outlined-basic"
                                        label="Email address*"
                                        type="email"
                                        fullWidth
                                        variant="outlined"
                                        helperText={errors.email?.message}

                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <LoadingButton loading={emailLoading} type={"submit"} sx={{ width: "200px" }} size="medium" variant="contained" >
                                        Send Verification Email
                                    </LoadingButton>
                                </Grid>
                            </Grid>

                        </form>

                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    );
}
