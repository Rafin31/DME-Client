import { useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
//
import Header from './header';
import Nav from './nav';
import { AuthRequest } from '../../services/AuthRequest';
import { Box, CircularProgress } from '@mui/material';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 60;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function DmeDashboardLayout() {

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(false)

  let loggedInUser = JSON.parse(localStorage.getItem('user'));

  const { id, staffId } = loggedInUser

  const loadUserInfo = useCallback(() => {

    if (!staffId) {
      AuthRequest.get(`/api/v1/users/${id}`)
        .then(res => {
          setUser(res.data.data)
          setLoading(false)
        })
    } else {
      AuthRequest.get(`/api/v1/users/${staffId}`)
        .then(res => {
          setUser(res.data.data)
          setLoading(false)
        })
    }

  }, [id, staffId])


  useEffect(() => {
    setLoading(true)
    loadUserInfo()
  }, [])


  if (loading || !user) {
    return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <CircularProgress />
    </Box>
  }

  return (

    <StyledRoot>
      <Header onOpenNav={() => setOpen(true)} id={id} user={user} />

      <Nav openNav={open} onCloseNav={() => setOpen(false)}
        user={user}
        setUser={setUser}
        loading={loading}
        setLoading={setLoading} />

      <Main>
        <Outlet context={[{ loggedInUser: user, loggedInUserLoading: loading }]} />
      </Main>
    </StyledRoot>
  );
}
