import PropTypes from 'prop-types';

import { useEffect, useState, useContext, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack, CircularProgress } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { userContext } from '../../../Context/AuthContext';
// mock
import account from '../../../_mock/account';
// hooks
import useResponsive from '../../../hooks/useResponsive';
import { AuthRequest } from '../../../services/AuthRequest';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
//
import navConfig from './config';



// ----------------------------------------------------------------------

const NAV_WIDTH = 220;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {

  const { pathname } = useLocation();
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(false)


  const { isLogin } = useContext(userContext)

  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const loadUserInfo = useCallback(() => {

    let user = localStorage.getItem('user');
    user = JSON.parse(user);

    const { id } = user

    AuthRequest.get(`/api/v1/users/${id}`)
      .then(res => {
        setUser(res.data.data)
        setLoading(false)
      })

  })



  useEffect(() => {
    setLoading(true)
    loadUserInfo()
  }, [])


  const renderContent = (
    <Scrollbar
      style={{ backgroundColor: "#ecf0f1" }}
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      {/* <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo />
      </Box> */}

      {
        !loading ?
          <Box sx={{ mb: 2, mx: 1.5, my: 2 }}>
            <Typography variant="h4" style={{ textAlign: "center", paddingTop: "10px" }}>{user?.category}</Typography>
            <Link underline="none">
              <StyledAccount>
                {/* <Avatar src={account.photoURL} alt="photoURL" /> */}
                <AccountCircleIcon style={{ fontSize: "40px" }} />

                <Box sx={{ ml: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                    {user?.fullName}
                  </Typography>

                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {/* {account.role} */}
                    {user?.category}
                  </Typography>
                </Box>
              </StyledAccount>
            </Link>
          </Box>
          :
          <Box style={{ margin: "20px 0px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
          </Box>
      }

      <NavSection data={navConfig} />
      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
