import { useState, useContext } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { QueryClient, useQueryClient } from 'react-query';
import { userContext } from '../../../Context/AuthContext';



export default function AccountPopover({ id, user }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()

  const { signOut } = useContext(userContext)

  const queryClient = useQueryClient()

  const MENU_OPTIONS = [
    {
      label: 'Profile',
      path: `/DME-supplier/dashboard/DME-supplier-profile/${id}`
    },
    {
      label: 'Settings',
      path: `/DME-supplier/dashboard/settings/${id}`
    },
  ];


  const handleOpen = (event) => {
    if (!open) {
      setOpen(event.currentTarget);

    } else {
      setOpen(null)
    }
  };

  const handleClose = (path) => {
    if (path === '/logout') {
      queryClient.removeQueries()
      signOut()
      setOpen(null);
      return
    }
    navigate(path)
    setOpen(null);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <AccountCircleIcon style={{ fontSize: "30px" }} />

      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" nowrap="true">
            {user?.fullName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', wordBreak: "break-word" }} nowrap="true">
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => { handleClose(option.path) }}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={() => handleClose('/logout')} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
