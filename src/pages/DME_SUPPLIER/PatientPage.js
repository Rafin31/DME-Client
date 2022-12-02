import { Link, useNavigate } from 'react-router-dom';
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
    Divider,
    Tooltip,
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import PopOver from '../../components/Popover/PopOver';
// sections
import { UserListHead } from '../../sections/@dashboard/user';
import { fDate } from '../../utils/formatTime';

const TABLE_HEAD = [
    { id: 'dob', label: 'Date of Birth', alignRight: false },
    { id: 'Fname', label: 'Full  Name', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'gender', label: 'Gender', alignRight: false },
    { id: 'action', label: 'Action', alignRight: false },
    // { id: '' },
];

const patient = [
    {
        id: 1,
        dob: fDate('1/2/1998'),
        Fname: "Putin Khan",
        email: "rere@gmail.com",
        gender: "Male"
    },
    {
        id: 2,
        dob: fDate('8/24/1986'),
        Fname: "Messi Hasan",
        email: "rere@gmail.com",
        gender: "Male"
    },
    {
        id: 3,
        dob: fDate('10/9/1998'),
        Fname: "parim Khan",
        email: "rere@gmail.com",
        gender: "Male"
    },
    {
        id: 4,
        dob: fDate('8/31/1998'),
        Fname: "karim Jinna",
        email: "rere@gmail.com",
        gender: "Male"
    },
    {
        id: 5,
        dob: fDate('2/9/2001'),
        Fname: "chatu Khan",
        email: "rere@gmail.com",
        gender: "Male"
    },
    {
        id: 6,
        dob: fDate('4/19/1986'),
        Fname: "king Khan",
        email: "rere@gmail.com",
        gender: "Male"
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

export default function PatientPage() {
    const [open, setOpen] = useState(null);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const navigate = useNavigate()

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = patient.map((n) => n.name);
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - patient.length) : 0;

    const filteredUsers = applySortFilter(patient, getComparator(order, orderBy), filterName);

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
                <title> Patients</title>
            </Helmet>

            <Container maxWidth="xl">
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Patients
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={1}
                        divider={<Divider orientation="vertical" flexItem />}>
                        <Tooltip
                            title="File type should be xlsx. And the colum sequence should be First name > Last name > Full name > Email > Password > Category > Gender > Date of Birth > age > Weight > Country > City > State > Address > Primary Insurance > Secondary Insurance."
                            arrow
                            placement="left">
                            <Button
                                variant="contained"
                                color="success"
                                style={{ color: "white", width: "110px" }}
                                startIcon={<Iconify icon="ri:file-excel-2-fill" />}>
                                Import
                            </Button>
                        </Tooltip>

                        <Button variant="contained" startIcon={<Iconify icon="material-symbols:add" />}
                            onClick={() => { navigate('/DME-supplier/dashboard/add-patient') }}>
                            New Patient
                        </Button>
                    </Stack>
                </Stack>

                <Card className='new-referal'>

                    <input type="text"
                        style={{
                            margin: "20px 15px",
                            padding: "10px 5px",
                            width: "220px"
                        }}
                        placeholder="Search by Full Name"
                        value={filterName}
                        onChange={handleFilterByName} />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table size="small">
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={patient.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                />
                                <TableBody>
                                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const { id, Fname, dob, email, gender } = row;
                                        const selectedUser = selected.indexOf(Fname) !== -1;

                                        return (
                                            <TableRow hover key={id} tabIndex={-1} selected={selectedUser}>
                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={10}>
                                                        {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                        <Typography style={{ paddingLeft: "20px" }} variant="subtitle2" nowrap="true">
                                                            {dob}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">
                                                    <Tooltip title="Profile">
                                                        <Link to={`/DME-supplier/dashboard/patient-profile/${id}`}
                                                            style={{ display: "inline", fontSize: "small", color: "black", cursor: "pointer" }} underline="hover" nowrap="true">
                                                            {Fname}
                                                        </Link>
                                                    </Tooltip>
                                                </TableCell>

                                                <TableCell align="left">{email}</TableCell>
                                                <TableCell align="left">{gender}</TableCell>

                                                <TableCell >
                                                    <PopOver
                                                        source="patient-page"
                                                        option={[
                                                            { label: "Edit" },
                                                            { label: "Add Note" },
                                                            { label: "Documents" },
                                                            { label: "Delete" }
                                                        ]}
                                                        id={id}
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
                                {patient.length === 0 && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                <Paper
                                                    sx={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Typography variant="body2">
                                                        No Patient found  &nbsp;
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
                        count={patient.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>

            </Container>


            {/* Edit Delete Pop Over */}

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                style={{ border: '2px solid red' }}
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
                <MenuItem>
                    <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                    Edit
                </MenuItem>

                <MenuItem sx={{ color: 'error.main' }}>
                    <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                    Delete
                </MenuItem>
            </Popover>
        </>
    );
}
