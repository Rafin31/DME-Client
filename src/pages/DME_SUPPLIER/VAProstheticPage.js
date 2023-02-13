import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { filter } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
    Card,
    Table,
    Stack,
    Paper,
    Button,
    Box,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination,
    Tabs,
    Tab,
    CircularProgress,
} from '@mui/material';
// components
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import PopOver from '../../components/Popover/PopOver';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';

// sections
import { UserListHead } from '../../sections/@dashboard/user';
import InviteModal from '../Shared/InviteModal';
import { AuthRequest } from '../../services/AuthRequest';





// ----------------------------------------------------------------------

const INVITED_STAFF_TABLE_HEAD = [
    { id: 'email', label: ' Email', alignRight: false },
    { id: 'action', label: 'Action', alignRight: false },
];

const REGISTERED_STAFF_TABLE_HEAD = [
    { id: 'Fname', label: 'First Name', alignRight: false },
    { id: 'Lname', label: 'Last Name', alignRight: false },
    { id: 'fullName', label: 'Full Name', alignRight: false },
    { id: 'email', label: 'Staff Email', alignRight: false },
    { id: 'action', label: 'Action', alignRight: false },
];



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

function applySortFilterInvitedStaff(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => _user.email.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}
function applySortFilterRegisteredStaff(array, comparator, query) {
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

export default function VAProstheticPage() {

    const [inviteOpen, setInviteOpen] = useState(false)

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [value, setValue] = useState(0);

    const searchFieldRef = useRef(null)

    const [user, setUser] = useState()
    const [loading, setLoading] = useState()


    let { id, email: loggedInUserEmail } = JSON.parse(localStorage.getItem('user'));

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

    useEffect(() => {
        if (searchFieldRef.current) {
            searchFieldRef.current.focus();
        }
    }, [filterName, searchFieldRef])



    const { isLoading: invitedProstheticStaff, refetch, data: INVITED_PROSTHETICS_LIST } = useQuery('INVITED_PROSTHETICS_LIST',
        async () => {
            return AuthRequest.get(`/api/v1/va-staff/invited-va-staff/${id}`).then(data => data.data.data)
        }
    )
    const { isLoading: registeredProstheticStaff, refetch: refetchRegisteredStaff, data: REGISTERED_PROSTHETIC_STAFF_LIST } = useQuery('REGISTERED_PROSTHETIC_STAFF_LIST',
        async () => {
            return AuthRequest.get(`/api/v1/va-staff`).then(data => data.data.data)
        }
    )



    if (!user || !INVITED_PROSTHETICS_LIST || !REGISTERED_PROSTHETIC_STAFF_LIST) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }

    const handelDeleteInvitedStaff = async (token) => {
        console.log(token)

        await AuthRequest.delete(`/api/v1/va-staff/delete-invited-va-staff/${token}`)
            .then(res => {
                refetch()
                toast.success(`Invitation Deleted`, {
                    toastId: "success13"
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handelDeleteRegisteredStaff = async (id) => {

        await AuthRequest.delete(`/api/v1/va-staff/delete-registered-va-staff/${id}`)
            .then(res => {
                refetchRegisteredStaff()
                toast.success(`Staff Deleted`, {
                    toastId: "success16"
                })
            })
            .catch((err) => {
                toast.error(`Something Went Wrong`, {
                    toastId: "error17"
                })
            })

    }


    const handelInviteStaff = async (e) => {
        e.preventDefault()

        await AuthRequest.post(`/api/v1/dme/invite-va-staff`, {
            dmeSupplierEmail: loggedInUserEmail,
            vaProstheticsEmail: e.target.invitedEmail.value
        }).then(res => {
            refetch()
            toast.success(`Invitation sent to ${e.target.invitedEmail.value}`, {
                toastId: "success12"
            })
        })
            .catch((err) => {
                refetch()
                toast.error(err.response?.data?.data?.split('email:')[1], {
                    toastId: "error19"
                })
            })

        setInviteOpen(false)
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = INVITED_PROSTHETICS_LIST.map((n) => n.name);
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - INVITED_PROSTHETICS_LIST.length) : 0;

    const filteredInvitedStaffs = applySortFilterInvitedStaff(INVITED_PROSTHETICS_LIST, getComparator(order, orderBy), filterName);
    const filteredRegisteredStaffs = applySortFilterRegisteredStaff(REGISTERED_PROSTHETIC_STAFF_LIST, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredInvitedStaffs.length && !!filterName;
    const isNotFoundRegistered = !filteredRegisteredStaffs.length && !!filterName;

    // ---------------------------------Tabs-------------------------------------

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography component={'span'} >{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);

    };


    return (
        <>
            <Helmet>
                <title> VA Prosthetic Staffs</title>
            </Helmet>

            <Container maxWidth="xl">
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography component={'span'} variant="h4" gutterBottom>
                        VA Prosthetic Staffs
                    </Typography>
                    <Button variant="contained" onClick={() => { setInviteOpen(true) }} startIcon={<Iconify icon="material-symbols:mark-email-read-sharp" />}>
                        Invite VA Prosthetic Staffs
                    </Button>
                </Stack>

                <InviteModal open={inviteOpen} setOpen={setInviteOpen} user={user} handelFormSubmit={handelInviteStaff} title="Invite VA Prosthetic Staff" />
                {/* -------------------------------------------------------------------------
                                   TABS
              --------------------------------------------------------------------------- */}

                <Box>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="basic tabs example">
                        <Tab label="Invited VA Prosthetic Staff" {...a11yProps(0)} draggable="true" />
                        <Tab label="Registered VA Prosthetic Staff" {...a11yProps(1)} draggable="true" />
                    </Tabs>


                    {/* -------------------------------------------------------------------------
                                       1st
                   --------------------------------------------------------------------------- */}


                    <TabPanel value={value} index={0} >
                        {
                            INVITED_PROSTHETICS_LIST.length !== 0 ?
                                <Card>
                                    <input type="text"
                                        style={{
                                            margin: "20px 15px",
                                            padding: "10px 5px",
                                            width: "220px"
                                        }}
                                        ref={searchFieldRef}
                                        placeholder="Search by Email"
                                        value={filterName}
                                        onChange={handleFilterByName} />

                                    <Scrollbar>
                                        <TableContainer sx={{ minWidth: 800 }}>
                                            <Table size="small">
                                                <UserListHead
                                                    order={order}
                                                    orderBy={orderBy}
                                                    headLabel={INVITED_STAFF_TABLE_HEAD}
                                                    rowCount={INVITED_PROSTHETICS_LIST.length}
                                                    numSelected={selected.length}
                                                    onRequestSort={handleRequestSort}
                                                    onSelectAllClick={handleSelectAllClick}
                                                />
                                                <TableBody>
                                                    {filteredInvitedStaffs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                                        const { _id, email, inviteToken } = row;
                                                        const selectedUser = selected.indexOf(email) !== -1;

                                                        return (
                                                            <TableRow hover key={_id} tabIndex={-1} selected={selectedUser}>

                                                                <TableCell component="th" scope="row" padding="none">
                                                                    <Stack direction="row" alignItems="center" spacing={10}>
                                                                        <Typography component={'span'} style={{ paddingLeft: "20px" }} variant="subtitle2" nowrap="true">
                                                                            {email}
                                                                        </Typography>
                                                                    </Stack>
                                                                </TableCell>
                                                                <TableCell >
                                                                    <PopOver
                                                                        key={_id}
                                                                        source={"invited-staff-page"}
                                                                        option={[
                                                                            { label: "Delete" }
                                                                        ]}
                                                                        handelDeleteInvitedStaff={handelDeleteInvitedStaff}
                                                                        id={inviteToken}
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
                                                                    <Typography component={'span'} variant="h6" paragraph>
                                                                        Not found
                                                                    </Typography>
                                                                    <br />

                                                                    <Typography component={'span'} variant="body2">
                                                                        No results found for &nbsp;
                                                                        <strong>&quot;{filterName}&quot;</strong>.
                                                                        <br /> Try checking for typos or using complete words.
                                                                    </Typography>
                                                                </Paper>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                )}
                                                {INVITED_PROSTHETICS_LIST.length === 0 && (
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                                <Paper
                                                                    sx={{
                                                                        textAlign: 'center',
                                                                    }}
                                                                >

                                                                    <Typography component={'span'} variant="body2">
                                                                        No one is invited yet
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
                                        count={INVITED_PROSTHETICS_LIST.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </Card>
                                :
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center" colSpan={12} sx={{ py: 3 }}>

                                            <p
                                            >Not User found</p>


                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                        }
                    </TabPanel>


                    {/* -------------------------------------------------------------------------
                                       2nd
                   --------------------------------------------------------------------------- */}


                    <TabPanel value={value} index={1} >
                        {
                            REGISTERED_PROSTHETIC_STAFF_LIST.length !== 0 ?
                                <Card>
                                    <input type="text"
                                        style={{
                                            margin: "20px 15px",
                                            padding: "10px 5px",
                                            width: "220px"
                                        }}
                                        ref={searchFieldRef}
                                        placeholder="Search by Email"
                                        value={filterName}
                                        onChange={handleFilterByName} />

                                    <Scrollbar>
                                        <TableContainer sx={{ minWidth: 800 }}>
                                            <Table size="small">
                                                <UserListHead
                                                    order={order}
                                                    orderBy={orderBy}
                                                    headLabel={REGISTERED_STAFF_TABLE_HEAD}
                                                    rowCount={REGISTERED_PROSTHETIC_STAFF_LIST.length}
                                                    numSelected={selected.length}
                                                    onRequestSort={handleRequestSort}
                                                    onSelectAllClick={handleSelectAllClick}
                                                />
                                                <TableBody>
                                                    {filteredRegisteredStaffs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                                        const { userId } = row;
                                                        const selectedUser = selected.indexOf(userId.fullName) !== -1;

                                                        return (
                                                            <TableRow hover key={userId._id} tabIndex={-1} selected={selectedUser}>


                                                                <TableCell component="th" scope="row" padding="none">
                                                                    <Stack direction="row" alignItems="center" spacing={10}>
                                                                        {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                                        <Typography component={'span'} style={{ paddingLeft: "20px" }} variant="subtitle2" nowrap="true">
                                                                            {userId.firstName}
                                                                        </Typography>
                                                                    </Stack>
                                                                </TableCell>

                                                                <TableCell align="left">{userId.lastName}</TableCell>
                                                                <TableCell align="left">{userId.fullName}</TableCell>
                                                                <TableCell align="left">{userId.email}</TableCell>


                                                                <TableCell >
                                                                    <PopOver
                                                                        source={"va-staff-registered-page"}
                                                                        option={[
                                                                            { label: "Edit" },
                                                                            { label: "Delete" }
                                                                        ]}
                                                                        id={userId._id}
                                                                        handelDeleteRegisteredStaff={handelDeleteRegisteredStaff}
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

                                                {isNotFoundRegistered && (
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                                <Paper
                                                                    sx={{
                                                                        textAlign: 'center',
                                                                    }}
                                                                >
                                                                    <Typography component={'span'} variant="h6" paragraph>
                                                                        Not found
                                                                    </Typography>
                                                                    <br />
                                                                    <Typography component={'span'} variant="body2">
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
                                        count={INVITED_PROSTHETICS_LIST.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </Card>
                                :
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center" colSpan={12} sx={{ py: 3 }}>

                                            <p
                                            >Not User found</p>


                                        </TableCell>
                                    </TableRow>
                                </TableBody>

                        }
                    </TabPanel>


                </Box>
            </Container>
        </>
    );
}
