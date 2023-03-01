import { useState, useContext } from 'react';
// @mui
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box, Divider, Typography, Stack, MenuItem, IconButton, Menu } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { userContext } from '../../../Context/AuthContext';






export default function AccountPopover({ id, user }) {

  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
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



  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (path) => {
    if (typeof (path) !== "object") {

      if (path === '/logout') {
        queryClient.removeQueries()
        signOut()
        setAnchorEl(null);
      } else {
        setAnchorEl(null);
        navigate(path)
      }
    } else {
      setAnchorEl(null);
    }

  };

  return (
    <>

      <div>
        <IconButton
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}>
          <AccountCircleIcon style={{ fontSize: "30px" }} />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
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
            {MENU_OPTIONS.map((option, index) => (
              <MenuItem key={index} onClick={() => { handleClose(option.path) }}>
                {option.label}
              </MenuItem>
            ))}
          </Stack>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem onClick={() => handleClose('/logout')} sx={{ m: 1 }}>
            Logout
          </MenuItem>

        </Menu>
      </div>
    </>
  );
}
