import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';

import { useRef, useState } from 'react';


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
    CircularProgress,
} from '@mui/material';
// components
import { toast } from 'react-toastify';
import { useMutation, useQuery } from 'react-query';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import PopOver from '../../components/Popover/PopOver';
// sections
import { UserListHead } from '../../sections/@dashboard/user';
import { AuthRequest } from '../../services/AuthRequest';
import InviteModal from '../Shared/InviteModal';
import AddVAProstheticsToVeteran from '../Shared/AddVAProstheticsToVeteran';


const TABLE_HEAD = [
    { id: 'id', label: 'ID#', alignRight: false },
    { id: 'Fname', label: 'Full  Name', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'phone', label: 'Phone#', alignRight: false },
    { id: 'city', label: 'City', alignRight: false },
    { id: 'action', label: 'Action', alignRight: false },
    // { id: '' },
];

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
    const stabilizedThis = array?.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => _user.userId.fullName.toLowerCase().indexOf(query.toLowerCase()) !== -1 || _user.userId._id.substring(_user.userId._id.length - 4, _user.userId._id.length).toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function VeteranPage() {
    const [addedVeteran, setAddedVeteran] = useState();

    const [inviteOpen, setInviteOpen] = useState(false)

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const navigate = useNavigate()




    const { isLoading: veteranLoading, refetch, data: veteran } = useQuery('veteran',
        async () => {
            return AuthRequest.get(`/api/v1/veteran/`).then(data => data.data.data)
        }
    )

    const { isLoading: vaProstheticsLoading, data: vaProsthetics } = useQuery('registered-va-prosthetics',
        async () => {
            return AuthRequest.get(`/api/v1/va-staff`).then(data => data.data.data)
        }
    )

    if (!veteran || veteranLoading) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }

    const handelAddVaProsthetics = async (e) => {
        e.preventDefault()
        setInviteOpen(!inviteOpen)
        console.log(e.target.veteran.value, e.target.addVAtoVeteran.value)
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


    const filteredUsers = applySortFilter(veteran, getComparator(order, orderBy), filterName);
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
                <title> Veterans</title>
            </Helmet>

            <Container maxWidth="xl">
                <Stack sx={{ flexDirection: { xs: "column", md: "row" } }} alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Veterans
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={1}
                        divider={<Divider orientation="vertical" flexItem />}>

                        <Button variant="contained" startIcon={<Iconify icon="material-symbols:add" />}
                            onClick={() => { navigate('/DME-supplier/dashboard/add-veteran') }}>
                            New Veteran
                        </Button>
                    </Stack>
                </Stack>

                <AddVAProstheticsToVeteran open={inviteOpen} setOpen={setInviteOpen} handelFormSubmit={handelAddVaProsthetics} vaProsthetics={vaProsthetics} veteran={addedVeteran} title="Add VA Prosthetics" />

                <Card className='new-referal'>

                    <input type="text"
                        style={{
                            margin: "20px 15px",
                            padding: "10px 5px",
                            width: "220px"
                        }}
                        placeholder="Search by Full Name or ID#"
                        value={filterName}
                        onChange={handleFilterByName} />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table size="small">
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={veteran.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                />
                                <TableBody>
                                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const { userId, phoneNumber, city } = row;
                                        const selectedUser = selected.indexOf(userId.fullName) !== -1;

                                        return (
                                            <TableRow hover key={userId._id} tabIndex={-1} selected={selectedUser}>
                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={10}>
                                                        {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                        <Typography style={{ paddingLeft: "20px" }} variant="subtitle2" nowrap="true">
                                                            {userId._id.substring(userId._id.length - 4, userId._id.length)}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">
                                                    <Tooltip title="Profile">
                                                        <Link to={`/DME-supplier/dashboard/user-profile/${userId._id}`}
                                                            style={{ display: "inline", fontSize: "small", color: "black", cursor: "pointer" }} underline="hover" nowrap="true">
                                                            {userId.fullName}
                                                        </Link>
                                                    </Tooltip>
                                                </TableCell>

                                                <TableCell align="left">{userId.email}</TableCell>
                                                <TableCell align="left">{phoneNumber}</TableCell>
                                                <TableCell align="left">{city}</TableCell>

                                                <TableCell >
                                                    <PopOver
                                                        key={userId._id}
                                                        source="veteran-page"
                                                        option={[
                                                            { label: "Edit" },
                                                            { label: "Add VA Prosthetics" },
                                                        ]}
                                                        id={userId._id}
                                                        setAddVaModalOpen={setInviteOpen}
                                                        setAddedVeteran={setAddedVeteran}
                                                        user={userId}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
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
                                {veteran.length === 0 && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                <Paper
                                                    sx={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Typography variant="body2">
                                                        No Veteran found  &nbsp;
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
                        count={veteran.length}
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
