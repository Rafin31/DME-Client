import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useCallback, useEffect, useState } from 'react';

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Box,
  CircularProgress,
} from '@mui/material';
// components

import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import { AuthRequest } from '../../services/AuthRequest';
// sections
import { UserListHead } from '../../sections/@dashboard/user';
import InviteModal from '../Shared/InviteModal';
import AddPatienttToDoctor from '../Shared/AddPatientToDoctorModal';




// mock
// import doctors from '../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Fname', label: 'First Name', alignRight: false },
  { id: 'Lname', label: 'Last Name', alignRight: false },
  { id: 'fullName', label: 'Full Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
  // { id: '' },
];

// const doctors = [
//   {
//     Fname: "Rafin ",
//     Lname: "asdas ",
//     email: "rere@gmail.com",
//   },
//   {
//     Fname: "loewm ",
//     Lname: "asdas ",
//     email: "rere@gmail.com",
//   },
//   {
//     Fname: "loewm ",
//     Lname: "asdas ",
//     email: "rere@gmail.com",
//   },
//   {
//     Fname: "loewm ",
//     Lname: "asdas ",
//     email: "rere@gmail.com",
//   },
//   {
//     Fname: "loewm ",
//     Lname: "asdas ",
//     email: "rere@gmail.com",
//   },
//   {
//     Fname: "loewm ",
//     Lname: "asdas ",
//     email: "rere@gmail.com",
//   },
//   {
//     Fname: "loewm ",
//     Lname: "asdas ",
//     email: "rere@gmail.com",
//   },
//   {
//     Fname: "loewm ",
//     Lname: "asdas ",
//     email: "rere@gmail.com",
//   },
//   {
//     Fname: "loewm ",
//     Lname: "asdas ",
//     email: "rere@gmail.com",
//   },
//   {
//     Fname: "loewm ",
//     Lname: "asdas ",
//     email: "rere@gmail.com",
//   },
//   {
//     Fname: "loewm ",
//     Lname: "asdas ",
//     email: "rere@gmail.com",
//   },
//   {
//     Fname: "loewm ",
//     Lname: "asdas ",
//     email: "rere@gmail.com",
//   },
//   {
//     Fname: "loewm ",
//     Lname: "asdas ",
//     email: "rere@gmail.com",
//   },
//   {
//     Fname: "loewm ",
//     Lname: "asdas ",
//     email: "rere@gmail.com",
//   },
//   {
//     Fname: "loewm ",
//     Lname: "asdas ",
//     email: "rere@gmail.com",
//   },

// ]


// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.userId.fullName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function DoctorPage() {

  const [inviteOpen, setInviteOpen] = useState(false)
  const [addPatientOpen, setAddPatientOpen] = useState(false)

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [user, setUser] = useState()
  const [loading, setLoading] = useState(false)

  const [invitedDoctorId, setInvitedDoctor] = useState()


  const { isLoading: doctorLoading, data: doctors } = useQuery('doctorsTemp',
    async () => {
      return AuthRequest.get(`/api/v1/doctor/`).then(data => data.data.data)
    }
  )


  const { isLoading: patientLoading, data: patients } = useQuery('patient',
    async () => {
      return AuthRequest.get(`/api/v1/patient`).then(data => data.data.data)
    }
  )

  let loggedUser = localStorage.getItem('user');
  loggedUser = JSON.parse(loggedUser);

  const { id } = loggedUser

  const loadUserInfo = useCallback(() => {



    AuthRequest.get(`/api/v1/users/${id}`)
      .then(res => {
        setUser(res.data.data)
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    setLoading(true);
    loadUserInfo()
  }, [loadUserInfo])


  if (!doctors || doctorLoading || patientLoading || !user) {
    return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <CircularProgress />
    </Box>
  }

  // Function to get invited doctor email  
  const handelInviteDoctor = async (e) => {
    e.preventDefault()
    await AuthRequest.post(`/api/v1/dme/invite-doctor`, { email: e.target.invitedEmail.value }).then((res) => {
      if (res.status === 200) {
        toast.success(`Invitation sent to ${e.target.invitedEmail.value}`, {
          toastId: 'success7'
        })
        setInviteOpen(false)
      } else {
        toast.error(`Something went wrong!`, {
          toastId: 'error7'
        })
        setInviteOpen(false)
      }


    })
  };


  const handelAddPatientToDoctor = async (e) => {
    e.preventDefault()
    const data = {
      patientUserId: e.target.addPatientToDoctor.value,
      doctorUserId: invitedDoctorId,
    }
    await AuthRequest.post(`/api/v1/dme/add-patient-to-doctor`, data)
      .then(res => {
        toast.success('Doctor successfully assigned to the patient', {
          toastId: "success9"
        })
      })
      .catch(err => {
        toast.error(err.response.data.data, {
          toastId: "error9"
        })
      })
    setAddPatientOpen(false)
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = doctors.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);

  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - doctors.length) : 0;

  const filteredUsers = applySortFilter(doctors, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;


  return (
    <>
      <Helmet>
        <title> Doctors</title>
      </Helmet>

      <Container maxWidth="1350px">

        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Doctor
          </Typography>
          <Button variant="contained" onClick={() => { setInviteOpen(true) }} startIcon={
            <Iconify icon="material-symbols:mark-email-read-sharp" />}>
            Invite New Doctor
          </Button>
        </Stack>

        <InviteModal open={inviteOpen} setOpen={setInviteOpen} user={user} handelFormSubmit={handelInviteDoctor} title="Invite Doctors" />

        <AddPatienttToDoctor open={addPatientOpen} setOpen={setAddPatientOpen}
          handelFormSubmit={handelAddPatientToDoctor} patients={patients} user={user} title="Add Patient to Doctor" />


        <Card className='new-referal'>
          <input type="text"
            style={{
              margin: "20px 15px",
              padding: "10px 5px",
              width: "220px"
            }}
            placeholder="Search by Name"
            value={filterName}
            onChange={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table size="small">
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={doctors.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { userId } = row;
                    const selectedUser = selected.indexOf(userId.fullName) !== -1;

                    return (
                      <TableRow hover key={userId._id} tabIndex={-1} selected={selectedUser}>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={10}>
                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                            <Typography style={{ paddingLeft: "20px" }} variant="subtitle2" nowrap="true">
                              {userId.firstName}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{userId.lastName}</TableCell>
                        <TableCell align="left">{userId.fullName}</TableCell>

                        <TableCell align="left">{userId.email}</TableCell>

                        <TableCell>

                          <Button
                            onClick={() => { setAddPatientOpen(true) }}
                            onMouseUp={() => setInvitedDoctor(userId._id)}
                            variant="contained" size='small' startIcon={<Iconify icon="eva:plus-fill" />}>
                            Add Patient
                          </Button>

                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={doctors.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

      </Container>
    </>
  );
}
