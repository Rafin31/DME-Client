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
    useTheme,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';


// components
import ReactShowMoreText from 'react-show-more-text';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import { UserListHead } from '../../sections/@dashboard/user';
import PopOver from '../../components/Popover/PopOver';
import InviteModal from '../Shared/InviteModal';
import { fDateTime } from '../../utils/formatTime';
import AddNotesToPatientModal from '../Shared/AddNotesToPatientModal';


// mock
// import doctors from '../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'Description', label: 'Description', alignRight: false },
    { id: 'TimeStamp', label: 'Time', alignRight: false },
    { id: 'action', label: 'Action', alignRight: false },
    // { id: '' },
];

const notes = [
    {
        id: 1,
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum malesuada metus sed lacinia aliquet. Nulla a tristique mauris. Fusce sit amet orci fringilla, volutpat ligula sed, congue augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc at rutrum massa. Cras in consectetur lorem. Cras pulvinar laoreet magna, eu aliquet eros condimentum eget. Maecenas in sapien porta, sodales massa ac, molestie mi. Sed eleifend justo ut sem viverra pharetra.",
        timeStamp: fDateTime(new Date()),
    },
    {
        id: 2,
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum malesuada metus sed lacinia aliquet. Nulla a tristique mauris. Fusce sit amet orci fringilla, volutpat ligula sed, congue augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc at rutrum massa. Cras in consectetur lorem. Cras pulvinar laoreet magna, eu aliquet eros condimentum eget. Maecenas in sapien porta, sodales massa ac, molestie mi. Sed eleifend justo ut sem viverra pharetra.",
        timeStamp: fDateTime(new Date("2/11/2022 4:50 PM")),
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
        return filter(array, (_user) => _user.timeStamp.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function PatientNotes() {

    const [addNotesOpen, setAddNotesOpen] = useState(false)

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const theme = useTheme();


    const handelAddNotesToPatient = (e) => {
        e.preventDefault()
        console.log(e.target.PatientNote.value)
        setAddNotesOpen(false)
    };


    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = notes.map((n) => n.name);
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - notes.length) : 0;

    const filteredUsers = applySortFilter(notes, getComparator(order, orderBy), filterName);

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
                <title> Patients Notes</title>
            </Helmet>

            <Container maxWidth="xl">
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Notes for <Link
                            to={`/DME-supplier/dashboard/patient-profile/${65}`}
                            style={{ color: "black", cursor: "pointer", marginLeft: "6px" }}
                            color="inherit" variant="subtitle2" underline="hover" nowrap="true"
                            target="_blank" rel="noopener noreferrer"
                        >Karim Hasan</Link>
                    </Typography>
                    <Button variant="contained" onClick={() => { setAddNotesOpen(true) }} startIcon={
                        <Iconify icon="material-symbols:add" />}>
                        Add Note
                    </Button>
                </Stack>

                <AddNotesToPatientModal open={addNotesOpen} setOpen={setAddNotesOpen} handelFormSubmit={handelAddNotesToPatient} data={{ notes: "" }} title="Add Note" />

                <Card className='new-referal'>
                    <input type="text"
                        style={{
                            margin: "20px 15px",
                            padding: "10px 5px",
                            width: "220px"
                        }}
                        placeholder="Search by Date/Time"
                        value={filterName}
                        onChange={handleFilterByName} />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table size="small">
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={notes.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const { id, description, timeStamp } = row;
                                        const selectedUser = selected.indexOf(timeStamp) !== -1;

                                        return (
                                            <TableRow hover key={id} tabIndex={-1} selected={selectedUser}>
                                                <TableCell sx={{ width: "50%" }} component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={0}>
                                                        <Typography style={{ paddingLeft: "20px" }} variant="subtitle2" wrap="true">
                                                            <ReactShowMoreText
                                                                lines={2}
                                                                more={<ExpandMoreIcon style={{ cursor: "pointer", margin: '0px', padding: '0px' }} color='primary' />}
                                                                less={<ExpandLessIcon style={{ cursor: "pointer", margin: '0px', padding: '0px' }} color='primary' />}
                                                                anchorClass=""
                                                                expanded={false}
                                                            >
                                                                {description}
                                                            </ReactShowMoreText>
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">{timeStamp}</TableCell>

                                                <TableCell >
                                                    <PopOver
                                                        source="patient-notes-page"
                                                        option={[
                                                            { label: "Edit" },
                                                            { label: "Delete" }
                                                        ]}
                                                        id={id}
                                                        setOpen={setAddNotesOpen}
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
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={notes.length}
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
