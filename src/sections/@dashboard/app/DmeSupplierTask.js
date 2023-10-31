// @mui
import PropTypes from 'prop-types';
import { FaUserAlt } from 'react-icons/fa'
import { Box, Stack, Link, Card, Button, Divider, Typography, CardHeader, IconButton, Popover, MenuItem, TextField } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AuthRequest } from '../../../services/AuthRequest';
// utils
import { fToNow, fDateTime, fDate } from '../../../utils/formatTime';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';


// ----------------------------------------------------------------------

DmeSupplierTask.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function DmeSupplierTask({ id, title, subheader, list, ...other }) {
  return (
    <Card sx={{ p: 0, boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;" }}>
      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {list.map((news) => (
            <NewsItem key={news.id} news={news} />
          ))}
        </Stack>
      </Scrollbar>

      <Divider />
    </Card>
  );
}

// ----------------------------------------------------------------------

NewsItem.propTypes = {
  news: PropTypes.shape({
    description: PropTypes.string,
    postedAt: PropTypes.instanceOf(Date),
    title: PropTypes.string,
  }),
};

function NewsItem({ news }) {
  const { id, title, patientId, patientName, description, postedAt, rftch: refetch } = news;
  const [open, setOpen] = useState(null);
  const navigate = useNavigate()

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleEdit = () => {
    navigate(`/DME-supplier/dashboard/edit-tasks/${id}`)
  }
  const handleDelete = () => {

    if (window.confirm("Are you sure you want to delete this task?")) {
      AuthRequest.delete(`/api/v1/dme/task/${id}`).then(res => {
        refetch()
        toast.success("Task Deleted!", {
          toastId: "success3"
        })
      })
    }

    setOpen(null);
  }



  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
        <Link color="inherit" variant="title" nowrap="true" underline='none' style={{ display: "block" }}>
          {title}
        </Link>

        <Link to={`/DME-supplier/dashboard/user-profile/${patientId}`} style={{ display: "inline", fontSize: "small", textDecoration: "none" }} color="inherit" nowrap="true">
          <FaUserAlt style={{ marginRight: "5px" }} /> Patient: {patientName}
        </Link>

        <Typography variant="body2" style={{ maxWidth: "95%", marginTop: "10px" }} sx={{ color: 'text.secondary' }} wrap='true'>
          {description}
        </Typography>
      </Box>

      <Typography variant="p" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
        {fDate(postedAt)}
      </Typography>

      <IconButton size="small" style={{ marginRight: "10px" }} color="inherit" onClick={handleOpenMenu}>
        <Iconify icon={'eva:more-vertical-fill'} />
      </IconButton>


      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={() => handleEdit()}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={() => handleDelete()}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>


    </Stack>
  );
}
