import PropTypes from 'prop-types';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, CircularProgress } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Iconify from "../../../components/iconify"
// mock
import account from '../../../_mock/account';
// hooks
import useResponsive from '../../../hooks/useResponsive';

// components

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


const bottomNavConfig = [
  {
    title: 'veteran orders',
    path: '/DME-supplier/dashboard/veteran-order',
    icon: <Iconify icon="fluent-mdl2:activate-orders" />,
  },
  {
    title: 'veterans',
    path: '/DME-supplier/dashboard/app',
    icon: <Iconify icon="mdi:user-group" />,
  },
  {
    title: 'VA prosthetics staff',
    path: '/DME-supplier/dashboard/app',
    icon: <Iconify icon="icon-park-outline:file-staff" />,
  },

];


export default function Nav({ openNav, onCloseNav, user, loading }) {

  const { pathname } = useLocation();


  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);


  const renderContent = (
    <Scrollbar
      style={{ backgroundColor: "#ecf0f1" }}
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >

      {
        !loading ?
          <Box sx={{ mb: 2, mx: 1.5, my: 2 }}>
            <Typography variant="h4" style={{ textAlign: "center", paddingTop: "10px" }}>{user?.details.companyName}</Typography>
            <Link underline="none">
              <StyledAccount>
                {
                  user?.details?.banner ?
                    <Avatar src={`${process.env.REACT_APP_SERVER}/documents/uploads/${user?.details?.banner}`} alt="photoURL" />
                    :
                    <AccountCircleIcon style={{ fontSize: "40px" }} />
                }

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

      <Box sx={{ flexGrow: 0.5, borderBottom: 1.5, borderColor: "#ffff" }} />

      <NavSection data={bottomNavConfig} />

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
