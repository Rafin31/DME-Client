import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
import SignupForm from '../../sections/auth/login/SignupForm';
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

export default function SignupPage() {
    const mdUp = useResponsive('up', 'md');

    return (
        <>
            <Helmet>
                <title> Signup </title>
            </Helmet>

            <StyledRoot>

                {mdUp && (
                    <StyledSection>
                        <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
                            Hi, Create A Account
                        </Typography>
                        <img src="/assets/illustrations/signup.png" alt="signup" />
                    </StyledSection>
                )}

                <Container maxWidth="sm">
                    <StyledContent>
                        <Typography variant="h4" gutterBottom>
                            Sign Up
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 5 }}>
                            Already Have an account? {''}
                            <Link to={"/login"} variant="subtitle2">Login</Link>
                        </Typography>

                        <SignupForm />

                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    );
}
