import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    Tooltip,
} from '@mui/material';
// components

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import ReactShowMoreText from 'react-show-more-text';
import PopOver from '../../components/Popover/PopOver';
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';


// sections
import { UserListHead } from '../../sections/@dashboard/user';





// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'PatientName', label: 'Patient Name', alignRight: false },
    { id: 'email', label: 'Patient Email', alignRight: false },
    { id: 'Description', label: 'Description', alignRight: false },
    { id: 'notes', label: 'Notes', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: 'Progress', label: 'Progress', alignRight: false },
    { id: 'action', label: 'Action', alignRight: false },


];


const ordersList = [
    {
        id: 1,
        patientName: "Kingo Poli",
        email: "KingoPoli@gmail.com",
        description: "Kingo Poli is a youtuber who makes contents",
        notes: "Kingo Poli is not good.Kingo Poli is not good.Kingo Poli is not good.Kingo Poli is not good.Kingo Poli is not good.Kingo Poli is not goodKingo Poli is not goodKingo Poli is not goodKingo Poli is not goodKingo Poli is not good",
        status: "Active",
        progress: "Not Mentioned",
    },
    {
        id: 2,
        patientName: "Chingo Poli",
        email: "Chingo@gmail.com",
        description: "Chingo Poli is a youtuber who makes contents.",
        notes: "Kingo Poli is not good.Kingo Poli.Kingo Poli is not good.Kingo Poli is not good.Kingo Poli is not good.Kingo Poli is not good.Kingo Poli is not good.Kingo Poli is not goodKingo Poli is not goodKingo Poli is not goodKingo Poli is not goodKingo Poli is not good ",
        status: "Pending",
        progress: "Not Mentioned",
    },
    {
        id: 3,
        patientName: "Tingo Poli",
        email: "Tingo@gmail.com",
        description: "Kingo Poli is a youtuber who makes contents",
        notes: "Kingo Poli is not good",
        status: "Active",
        progress: "Not Mentioned",
    },
    {
        id: 4,
        patientName: "Bingo Poli",
        email: "Bingo@gmail.com",
        description: "Kingo Poli is a youtuber who makes contents",
        notes: "Kingo Poli is not good",
        status: "Pending",
        progress: "Not Mentioned",
    }
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
        return filter(array, (_user) => _user.patientName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function OrderPage() {
    const [open, setOpen] = useState(null);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('PatientName');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [value, setValue] = useState(0);

    const searchFieldRef = useRef(null)

    const navigate = useNavigate()

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - ordersList.length) : 0;

    const filteredUsers = applySortFilter(ordersList, getComparator(order, orderBy), filterName);

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
                <title> Orders</title>
            </Helmet>

            <Container maxWidth="xl">
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography component={'span'} variant="h4" gutterBottom>
                        Orders
                    </Typography>
                    <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}
                        onClick={() => { navigate('/DME-supplier/dashboard/add-order') }} >
                        New Order
                    </Button>
                </Stack>

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
                        <Tab label="New Referral" {...a11yProps(0)} draggable="true" />
                        <Tab label="Cancelled Order" {...a11yProps(1)} draggable="true" />
                        <Tab label="Evaluation" {...a11yProps(2)} draggable="true" />
                        <Tab label="Evaluation Completed" {...a11yProps(3)} draggable="true" />
                        <Tab label="PaperWork in Process" {...a11yProps(4)} draggable="true" />
                        <Tab label="Prior Auth Status" {...a11yProps(5)} draggable="true" />
                        <Tab label="Prior Auth Received" {...a11yProps(6)} draggable="true" />
                        <Tab label="Holding RTO " {...a11yProps(7)} draggable="true" />
                        <Tab label="RTO" {...a11yProps(8)} draggable="true" />
                        <Tab label="Delivered" {...a11yProps(9)} draggable="true" />
                        <Tab label="Authorization Expirations F/U" {...a11yProps(10)} draggable="true" />
                        <Tab label="Order Request" {...a11yProps(11)} draggable="true" />

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
                                placeholder="Search Orders by Patient Name"
                                value={filterName}
                                onChange={handleFilterByName} />

                            <Scrollbar>
                                <TableContainer sx={{ minWidth: 800 }}>
                                    <Table size="small">
                                        <UserListHead
                                            order={order}
                                            orderBy={orderBy}
                                            headLabel={TABLE_HEAD}
                                            rowCount={ordersList.length}
                                            numSelected={selected.length}
                                            onRequestSort={handleRequestSort}
                                        />
                                        <TableBody>
                                            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                                const { id, patientName, email, description, notes, status, progress } = row;
                                                const selectedUser = selected.indexOf(patientName) !== -1;

                                                return (
                                                    <TableRow hover key={id} tabIndex={-1} selected={selectedUser}>


                                                        <TableCell component="th" scope="row" padding="none">
                                                            <Stack direction="row" alignItems="center" spacing={10}>
                                                                {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                                <Link to={`/DME-supplier/dashboard/patient-profile/${id}`}
                                                                    style={{ display: "block", fontSize: "small", color: "black", cursor: "pointer" }} underline="hover" nowrap="true">
                                                                    <Tooltip title="Profile">
                                                                        <Typography component={'span'} style={{ paddingLeft: "20px" }} variant="subtitle2" nowrap="true">
                                                                            {patientName}
                                                                        </Typography>
                                                                    </Tooltip>
                                                                </Link>

                                                            </Stack>
                                                        </TableCell>

                                                        <TableCell align="left">{email}</TableCell>

                                                        <TableCell align="left">{description}</TableCell>

                                                        <TableCell width="30%" align="left">
                                                            <ReactShowMoreText
                                                                lines={1}
                                                                more={<ExpandMoreIcon style={{ cursor: "pointer", margin: '0px', padding: '0px' }} color='primary' />}
                                                                less={<ExpandLessIcon style={{ cursor: "pointer", margin: '0px', padding: '0px' }} color='primary' />}
                                                                anchorClass=""
                                                                expanded={false}
                                                            >
                                                                {notes}
                                                            </ReactShowMoreText >

                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Label color={(status === 'Pending' && 'warning') || 'success'}>{sentenceCase(status)}</Label>
                                                        </TableCell>
                                                        <TableCell align="left">{progress}</TableCell>



                                                        <TableCell >
                                                            <PopOver
                                                                key={id}
                                                                source='order-page'
                                                                option={[
                                                                    { label: "Edit" },
                                                                    { label: "Add Note" },
                                                                    { label: "Status" },
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
                                count={ordersList.length}
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
                                placeholder="Search Orders"
                                value={filterName}
                                onChange={handleFilterByName} />

                            <Scrollbar>
                                <TableContainer sx={{ minWidth: 800 }}>
                                    <Table size="small">
                                        <UserListHead
                                            order={order}
                                            orderBy={orderBy}
                                            headLabel={TABLE_HEAD}
                                            rowCount={ordersList.length}
                                            numSelected={selected.length}
                                            onRequestSort={handleRequestSort}
                                        />
                                        <TableBody>
                                            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                                const { id, patientName, email, description, notes, status, progress } = row;
                                                const selectedUser = selected.indexOf(patientName) !== -1;

                                                return (
                                                    <TableRow hover key={id} tabIndex={-1} selected={selectedUser}>
                                                        {/* <TableCell padding="checkbox">
                                                                <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                                                                 </TableCell> */}

                                                        <TableCell component="th" scope="row" padding="none">
                                                            <Stack direction="row" alignItems="center" spacing={10}>
                                                                {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                                <Typography component={'span'} style={{ paddingLeft: "20px" }} variant="subtitle2" nowrap="true">
                                                                    {patientName}
                                                                </Typography>
                                                            </Stack>
                                                        </TableCell>

                                                        <TableCell align="left">{email}</TableCell>

                                                        <TableCell align="left">{description}</TableCell>

                                                        <TableCell align="left">{notes}</TableCell>
                                                        <TableCell align="left">
                                                            <Label color={(status === 'Pending' && 'warning') || 'success'}>{sentenceCase(status)}</Label>
                                                        </TableCell>
                                                        <TableCell align="left">{progress}</TableCell>



                                                        <TableCell >
                                                            {/* <IconButton size="small" color="inherit" onClick={handleOpenMenu}>
                                                                <Iconify icon={'eva:more-vertical-fill'} />
                                                            </IconButton> */}
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
                                count={ordersList.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Card>
                    </TabPanel>

                    {/* -------------------------------------------------------------------------
                                       3rd
                    --------------------------------------------------------------------------- */}

                    <TabPanel value={value} index={2}>
                        Item Three
                    </TabPanel>


                </Box >
            </Container >


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
