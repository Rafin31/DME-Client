import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';

import { useState } from 'react';

// @mui
import {
    Card,
    Table,
    Stack,
    Paper,
    Button,
    Popover,
    TableRow,
    MenuItem,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination,
    Box,
    useTheme,
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import { UserListHead } from '../../sections/@dashboard/user';
import PopOver from '../../components/Popover/PopOver';
import InviteModal from '../Shared/InviteModal';
import AddPatienttToTherapist from '../Shared/AddPatientToTherapistModal';


// mock
// import doctors from '../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'Fname', label: 'First Name', alignRight: false },
    { id: 'Lname', label: 'Last Name', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'action', label: 'Action', alignRight: false },
    // { id: '' },
];

const doctors = [
    {
        Fname: "Rafin ",
        Lname: "asdas ",
        email: "rere@gmail.com",
    },
    {
        Fname: "loewm ",
        Lname: "asdas ",
        email: "rere@gmail.com",
    },
    {
        Fname: "loewm ",
        Lname: "asdas ",
        email: "rere@gmail.com",
    },
    {
        Fname: "loewm ",
        Lname: "asdas ",
        email: "rere@gmail.com",
    },
    {
        Fname: "loewm ",
        Lname: "asdas ",
        email: "rere@gmail.com",
    },
    {
        Fname: "loewm ",
        Lname: "asdas ",
        email: "rere@gmail.com",
    },
    {
        Fname: "loewm ",
        Lname: "asdas ",
        email: "rere@gmail.com",
    },
    {
        Fname: "loewm ",
        Lname: "asdas ",
        email: "rere@gmail.com",
    },
    {
        Fname: "loewm ",
        Lname: "asdas ",
        email: "rere@gmail.com",
    },
    {
        Fname: "loewm ",
        Lname: "asdas ",
        email: "rere@gmail.com",
    },
    {
        Fname: "loewm ",
        Lname: "asdas ",
        email: "rere@gmail.com",
    },
    {
        Fname: "loewm ",
        Lname: "asdas ",
        email: "rere@gmail.com",
    },
    {
        Fname: "loewm ",
        Lname: "asdas ",
        email: "rere@gmail.com",
    },
    {
        Fname: "loewm ",
        Lname: "asdas ",
        email: "rere@gmail.com",
    },
    {
        Fname: "loewm ",
        Lname: "asdas ",
        email: "rere@gmail.com",
    },

]


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
        return filter(array, (_user) => _user.Fname.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function TherapistPage() {

    const [inviteOpen, setInviteOpen] = useState(false)
    const [addPatientOpen, setAddPatientOpen] = useState(false)

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const theme = useTheme();


    const handelInviteTherapist = (e) => {
        e.preventDefault()
        console.log(e.target.invitedEmail.value)
        setInviteOpen(false)
    };

    const handelAddPatientToTherapist = (e) => {
        e.preventDefault()
        console.log(e.target.addPatientToDoctor.value)
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
                        <Typography>{children}</Typography>
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

    return (
        <>
            <Helmet>
                <title> Therapists</title>
            </Helmet>

            <Container maxWidth="xl">
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Therapists
                    </Typography>
                    <Button variant="contained" onClick={() => { setInviteOpen(true) }} startIcon={
                        <Iconify icon="material-symbols:mark-email-read-sharp" />}>
                        Invite New Therapist
                    </Button>
                </Stack>

                <InviteModal open={inviteOpen} setOpen={setInviteOpen} handelFormSubmit={handelInviteTherapist} title="Invite Therapist" />

                <AddPatienttToTherapist open={addPatientOpen} setOpen={setAddPatientOpen} handelFormSubmit={handelAddPatientToTherapist} title="Add Patient" />

                <Card className='new-referal'>
                    {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName}
                placeholder={"Search Orders"} /> */}

                    <input type="text"
                        style={{
                            margin: "20px 15px",
                            padding: "10px 5px",
                            width: "220px"
                        }}
                        placeholder="Search by First Name"
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
                                        const { id, Fname, Lname, email } = row;
                                        const selectedUser = selected.indexOf(Fname) !== -1;

                                        return (
                                            <TableRow hover key={id} tabIndex={-1} selected={selectedUser}>
                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={10}>
                                                        {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                        <Typography style={{ paddingLeft: "20px" }} variant="subtitle2" nowrap="true">
                                                            {Fname}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">{Lname}</TableCell>

                                                <TableCell align="left">{email}</TableCell>

                                                <TableCell >
                                                    <Button onClick={() => { setAddPatientOpen(true) }} variant="contained" size='small' startIcon={<Iconify icon="eva:plus-fill" />}>
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
