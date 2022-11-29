import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
    Card,
    Table,
    Stack,
    Paper,
    Avatar,
    Button,
    Popover,
    Checkbox,
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
} from '@mui/material';
// components
import PopOver from '../../components/Popover/PopOver';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';

// sections
import { UserListHead } from '../../sections/@dashboard/user';
import InviteModal from '../Shared/InviteModal';




// ----------------------------------------------------------------------

const INVITED_STAFF_TABLE_HEAD = [
    { id: 'email', label: ' Email', alignRight: false },
    { id: 'action', label: 'Action', alignRight: false },
];
const INVITED_STAFF_LIST = [
    {
        id: 1,
        email: "KingoPoli@gmail.com",
    },

]
const REGISTERED_STAFF_TABLE_HEAD = [
    { id: 'Fname', label: 'First Name', alignRight: false },
    { id: 'Lname', label: 'Last Name', alignRight: false },
    { id: 'email', label: 'Staff Email', alignRight: false },
    { id: 'action', label: 'Action', alignRight: false },
];

const REGISTERED_STAFF_LIST = [
    {
        id: 1,
        Fname: "KingoPoli",
        Lname: "Khaan",
        email: "KingoPoli@gmail.com",
    },

]


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
        return filter(array, (_user) => _user.email.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function StaffPage() {
    const [open, setOpen] = useState(null);

    const [inviteOpen, setInviteOpen] = useState(false)

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [value, setValue] = useState(0);

    const searchFieldRef = useRef(null)

    const navigate = useNavigate()

    const handelInviteDoctor = (e) => {
        e.preventDefault()
        console.log(e.target.invitedEmail.value)
        setInviteOpen(false)
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = INVITED_STAFF_LIST.map((n) => n.name);
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - INVITED_STAFF_LIST.length) : 0;

    const filteredInvitedStaffs = applySortFilterInvitedStaff(INVITED_STAFF_LIST, getComparator(order, orderBy), filterName);
    const filteredRegisteredStaffs = applySortFilterRegisteredStaff(REGISTERED_STAFF_LIST, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredInvitedStaffs.length && !!filterName;

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


    useEffect(() => {
        if (searchFieldRef.current) {
            searchFieldRef.current.focus();
        }
    }, [filterName, handleFilterByName, searchFieldRef])

    return (
        <>
            <Helmet>
                <title> Staffs</title>
            </Helmet>

            <Container maxWidth="xl">
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography component={'span'} variant="h4" gutterBottom>
                        Staffs
                    </Typography>
                    <Button variant="contained" onClick={() => { setInviteOpen(true) }} startIcon={<Iconify icon="material-symbols:mark-email-read-sharp" />}>
                        Invite New Staff
                    </Button>
                </Stack>

                <InviteModal open={inviteOpen} setOpen={setInviteOpen} handelFormSubmit={handelInviteDoctor} title="Invite Staff" />
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
                        <Tab label="Invited Staff" {...a11yProps(0)} draggable="true" />
                        <Tab label="Registered Staff" {...a11yProps(1)} draggable="true" />
                    </Tabs>


                    {/* -------------------------------------------------------------------------
                                       1st
                   --------------------------------------------------------------------------- */}
                    <TabPanel value={value} index={0} >
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
                                            rowCount={INVITED_STAFF_LIST.length}
                                            numSelected={selected.length}
                                            onRequestSort={handleRequestSort}
                                            onSelectAllClick={handleSelectAllClick}
                                        />
                                        <TableBody>
                                            {filteredInvitedStaffs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                                const { id, email } = row;
                                                const selectedUser = selected.indexOf(email) !== -1;

                                                return (
                                                    <TableRow hover key={id} tabIndex={-1} selected={selectedUser}>

                                                        <TableCell component="th" scope="row" padding="none">
                                                            <Stack direction="row" alignItems="center" spacing={10}>
                                                                <Typography component={'span'} style={{ paddingLeft: "20px" }} variant="subtitle2" nowrap="true">
                                                                    {email}
                                                                </Typography>
                                                            </Stack>
                                                        </TableCell>
                                                        <TableCell >
                                                            <PopOver
                                                                option={[
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
                                                            <Typography component={'span'} variant="h6" paragraph>
                                                                Not found
                                                            </Typography>

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
                                        {INVITED_STAFF_LIST.length === 0 && (
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
                                count={INVITED_STAFF_LIST.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Card>
                    </TabPanel>

                    {/* -------------------------------------------------------------------------
                                       2nd
                   --------------------------------------------------------------------------- */}
                    <TabPanel value={value} index={1} >
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
                                            rowCount={REGISTERED_STAFF_LIST.length}
                                            numSelected={selected.length}
                                            onRequestSort={handleRequestSort}
                                            onSelectAllClick={handleSelectAllClick}
                                        />
                                        <TableBody>
                                            {filteredRegisteredStaffs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                                const { id, Fname, email, Lname } = row;
                                                const selectedUser = selected.indexOf(filterName) !== -1;

                                                return (
                                                    <TableRow hover key={id} tabIndex={-1} selected={selectedUser}>
                                                        {/* <TableCell padding="checkbox">
                                                                <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                                                                 </TableCell> */}

                                                        <TableCell component="th" scope="row" padding="none">
                                                            <Stack direction="row" alignItems="center" spacing={10}>
                                                                {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                                <Typography component={'span'} style={{ paddingLeft: "20px" }} variant="subtitle2" nowrap="true">
                                                                    {Fname}
                                                                </Typography>
                                                            </Stack>
                                                        </TableCell>

                                                        <TableCell align="left">{Lname}</TableCell>
                                                        <TableCell align="left">{email}</TableCell>


                                                        <TableCell >
                                                            <PopOver
                                                                option={[
                                                                    { label: "Edit" },
                                                                    { label: "Add Note" },
                                                                    { label: "Status" },
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
                                                            <Typography component={'span'} variant="h6" paragraph>
                                                                Not found
                                                            </Typography>

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
                                count={INVITED_STAFF_LIST.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Card>
                    </TabPanel>

                </Box>
            </Container>


            {/* Edit Delete Pop Over */}

            {/* <PopOver
                open={Boolean(open)}
                anchorEl={open}
                style={{ border: '2px solid red' }}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
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
            </PopOver> */}
        </>
    );
}
