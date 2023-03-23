import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  Tooltip,
} from '@mui/material';
// components

import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import { AuthRequest } from '../../services/AuthRequest';
// sections
import { UserListHead } from '../../sections/@dashboard/user';
import InviteModal from '../Shared/InviteModal';
import AddPatienttToDoctor from '../Shared/AddPatientToDoctorModal';
import { Link, useNavigate } from 'react-router-dom';
import PopOver from 'src/components/Popover/PopOver';




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
    return filter(array, (_user) => _user.userId.fullName.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
      _user.userId.email.toLowerCase().indexOf(query.toLowerCase()) !== -1);
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

  const navigate = useNavigate()

  const importButtonRef = useRef(null)


  const { isLoading: doctorLoading, refetch, data: doctors } = useQuery('doctorsTemp',
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

  const { id, staffId } = loggedUser

  const loadUserInfo = useCallback(() => {
    AuthRequest.get(`/api/v1/users/${id}`)
      .then(res => {
        setUser(res.data.data)
        setLoading(false)
      })
  }, [id])


  const { mutateAsync, isLoading: importDoctorLoading } = useMutation((importDoctor) => {

    return AuthRequest.post(`/api/v1/users/import-doctor`, importDoctor,
      {
        headers: { "Content-Type": "multipart/form-data" }
      }
    )
      .then(res => {
        toast.success("Import Successful!", res, {
          toastId: 'success1198'
        })
        refetch()
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message, {
          toastId: 'error13541'
        })
      })
  })

  useEffect(() => {
    setLoading(true);
    loadUserInfo()
  }, [loadUserInfo])


  if (!doctors || doctorLoading || patientLoading || !user || importDoctorLoading) {
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

  const exportDoctor = async () => {

    const resp = await AuthRequest.get("/api/v1/users/export-doctor", {
      responseType: 'arraybuffer',
      headers: { 'Content-Type': 'blob' },
    })

    const link = document.createElement('a');
    const fileName = 'Doctors-List.xlsx';
    link.setAttribute('download', fileName);
    link.href = URL.createObjectURL(new Blob([resp.data]));
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  const handleImportButtonClick = (e) => {
    e.preventDefault()
    importButtonRef.current.click()
  }

  const handleImportFormSubmit = (e) => {
    e.preventDefault()
    const file = e.target.importFile.files[0]
    const formData = new FormData()
    formData.append('doctor-list', file)

    if (!!formData.entries().next().value) {
      mutateAsync(formData)

    } else {
      toast.warning('Please Upload documents', {
        toastId: "warning1"
      })
    }
  }



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

        <Stack direction={{ sm: "col", lg: "row", xl: "row" }} alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Doctor
          </Typography>

          <Stack direction="row" alignItems="center" justifyContent="center" gap={1} >
            {
              !staffId &&
              <>
                <Tooltip
                  title="File type should be xlsx.There might be a column heading, but data should start from the second row.The colum sequence should be First name > Last name > Full name > Title > Email > Password > Category > Country > City > State > Zip > NPI Number > Company Name > Address > Phone Number"
                  arrow
                  placement="left">
                  <Iconify style={{ marginTop: "5px" }} icon="material-symbols:info-outline" color="#2065d1" />
                </Tooltip>

                <form onSubmit={(e) => handleImportFormSubmit(e)}>
                  <Button
                    variant="contained"
                    component="label"
                    color="success"
                    style={{ color: "white", width: "110px" }}
                    startIcon={<Iconify icon="ri:file-excel-2-fill" />}>
                    Import
                    <input name="importFile" hidden type="file" onChange={(e) => handleImportButtonClick(e)} />
                  </Button>
                  <input ref={importButtonRef} hidden type="submit" />
                </form>


                <Button
                  variant="contained"
                  component="label"
                  color="warning"
                  style={{ color: "white", width: "110px" }}
                  onClick={() => { exportDoctor() }}
                  startIcon={<Iconify icon="mdi:calendar-export" />}>
                  Export
                </Button>
              </>
            }

            <Button variant="outlined" startIcon={<Iconify icon="material-symbols:add" />}
              onClick={() => { navigate('/DME-supplier/dashboard/add-doctor') }}>
              New Doctor
            </Button>

            <Button variant="contained" onClick={() => { setInviteOpen(true) }} startIcon={
              <Iconify icon="material-symbols:mark-email-read-sharp" />}>
              Invite New Doctor
            </Button>
          </Stack>

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
            placeholder="Search by Name or Email"
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
                        <TableCell align="left">
                          <Tooltip title="Profile">
                            <Link to={`/DME-supplier/dashboard/user-profile/${userId._id}`}
                              style={{ display: "inline", fontSize: "small", color: "black", cursor: "pointer" }} underline="hover" nowrap="true">
                              {userId.fullName}
                            </Link>
                          </Tooltip>
                        </TableCell>

                        <TableCell align="left">{userId.email}</TableCell>

                        <TableCell>

                          <PopOver
                            key={userId._id}
                            source="doctor-page"
                            option={[
                              { label: "Assign Patient" },
                              { label: "Note" },
                            ]}
                            id={userId._id}
                            setAddPatientOpen={setAddPatientOpen}
                            setInvitedDoctor={setInvitedDoctor}

                          />

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

                {doctors.length === 0 && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="body2">
                            No Doctors found  &nbsp;
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
