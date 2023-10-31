import { useState, useContext } from 'react';
// @mui
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccessTime from '@mui/icons-material/AccessTime';
import { Box, Divider, Typography, Stack, MenuItem, IconButton, Menu, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { userContext } from '../../../Context/AuthContext';






export default function AccountPopover({ id, user, pendingAssignedTask }) {

  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState(null);
  const profileOpen = Boolean(anchorEl);

  const [anchorTaskEl, setAnchorTaskEl] = useState(null);
  const taskOpen = Boolean(anchorTaskEl);

  const { signOut } = useContext(userContext)

  const queryClient = useQueryClient()

  if (user?.category === "DME-Staff") {
    let loggedInUser = JSON.parse(localStorage.getItem('user'));
    id = loggedInUser.staffId
  }

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



  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleTaskClick = (event) => {
    setAnchorTaskEl(event.currentTarget);

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

  const handleTaskClose = () => {
    setAnchorTaskEl(null);
  };

  return (
    <>
      <div className="">
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <IconButton
            id="basic-button"
            aria-controls={taskOpen ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={taskOpen ? 'true' : undefined}
            onClick={handleTaskClick}>
            <AccessTime style={{ fontSize: "30px" }} />
          </IconButton>

          {pendingAssignedTask.length !== 0 && (
            <div
              style={{
                position: 'absolute',
                top: '0',
                right: '0',
                backgroundColor: 'red',
                height: '20px',
                width: '20px',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontSize: '12px',
              }}
            >
              {pendingAssignedTask.length}
            </div>
          )}
        </div>

        {
          pendingAssignedTask.length !== 0 &&
          <Menu
            id="basic-menu"
            anchorEl={anchorTaskEl}
            open={taskOpen}
            onClose={handleTaskClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >

            <Stack sx={{ p: 0 }}>
              {
                pendingAssignedTask.map(task => {
                  return (
                    <MenuItem onClick={() => {
                      navigate("/DME-supplier/dashboard/assigned-task/all-assigned-task")
                      handleTaskClose()
                    }} sx={{ p: "5px" }}>
                      {
                        <Alert severity="warning" sx={{ fontWeight: 800 }}>
                          {
                            `You have been Assigned to a new task by ${task.assignedBy.fullName}`
                          }
                        </Alert>

                      }
                    </MenuItem>
                  )
                })
              }
            </Stack>


          </Menu>
        }


      </div>

      <div>
        <IconButton
          id="basic-button"
          aria-controls={profileOpen ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={profileOpen ? 'true' : undefined}
          onClick={handleProfileClick}>
          <AccountCircleIcon style={{ fontSize: "30px" }} />
        </IconButton>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={profileOpen}
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
