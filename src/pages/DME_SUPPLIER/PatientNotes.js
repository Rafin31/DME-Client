import { Link, useNavigate, useParams } from 'react-router-dom';
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
    CircularProgress,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


// components
import { useQuery } from 'react-query';
import ReactShowMoreText from 'react-show-more-text';
import { toast } from 'react-toastify';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import { UserListHead } from '../../sections/@dashboard/user';
import PopOver from '../../components/Popover/PopOver';
import InviteModal from '../Shared/InviteModal';
import { fDateTime } from '../../utils/formatTime';
import AddNotesToPatientModal from '../Shared/AddNotesToPatientModal';
import { AuthRequest } from '../../services/AuthRequest';



// mock
// import doctors from '../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'Description', label: 'Description', alignRight: false },
    { id: 'TimeStamp', label: 'Time', alignRight: false },
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
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => _user.note.toLowerCase().indexOf(query.toLowerCase()) !== -1);
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
    const [user, setUser] = useState()
    const [loading, setLoading] = useState()
    const [isEdit, setEdit] = useState(false)
    const [editNoteId, setEditNoteId] = useState(false)

    const navigate = useNavigate()

    const theme = useTheme();


    let loggedUser = JSON.parse(localStorage.getItem('user'));

    const { id: writerId } = loggedUser
    const { id: noteFor } = useParams()
    const data = { writerId, noteFor }


    const loadUserInfo = useCallback(() => {

        AuthRequest.get(`/api/v1/users/${writerId}`)
            .then(res => {
                setUser(res.data.data)
                setLoading(false)
            })
    }, [writerId])

    useEffect(() => {
        setLoading(true);
        loadUserInfo()
    }, [loadUserInfo])


    const { isLoading: noteLoading, refetch, data: notes } = useQuery('notes',
        async () => {
            return AuthRequest.get(`/api/v1/dme/notes-dme-noteFor?writerId=${writerId}&noteFor=${noteFor}`)
                .then(data => data.data.data)
        }
    )

    const { isLoading: patientLoading, data: patient2 } = useQuery('patient2',
        async () => {
            return AuthRequest.get(`/api/v1/users/${noteFor}`)
                .then(data => data.data.data)
        }
    )

    if (!notes || !user || !patient2) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }


    const handelAddNotesToPatient = async (e) => {
        e.preventDefault()
        if (!isEdit) {
            await AuthRequest.post(`/api/v1/dme/notes`, {
                ...data,
                note: e.target.PatientNote.value
            }).then(res => {
                toast.success("Note Added", {
                    toastId: "success12"
                })
                refetch()
                setAddNotesOpen(false)
            }).catch(err => {
                toast.error("Something Went Wrong!", {
                    toastId: "error12"
                })
            })
        } else {
            await AuthRequest.patch(`/api/v1/dme/notes/${editNoteId}`, {
                ...data,
                note: e.target.PatientNote.value
            }).then(res => {
                toast.success("Note Updated", {
                    toastId: "success13"
                })
                refetch()
                setEdit(false)
                setAddNotesOpen(false)
            }).catch(err => {
                toast.error("Something Went Wrong!", {
                    toastId: "error13"
                })
            })
        }

    };

    const handleDelete = async (id) => {
        await AuthRequest.delete(`/api/v1/dme/notes/${id}`)
            .then(res => {
                toast.success("Note deleted", {
                    toastId: "success13"
                })
                refetch()
                setAddNotesOpen(false)
            }).catch(err => {
                toast.error("Something Went Wrong!", {
                    toastId: "error13"
                })
            })
    }


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
                <title> Client Notes</title>
            </Helmet>

            <Container maxWidth="1350px">

                <Stack onClick={() => navigate(-1)} direction="row" spacing={1} style={{ cursor: "pointer", marginBottom: "15px", width: "150px" }} sx={{
                    "&:hover": {
                        color: "#3498db",
                    },
                }} >
                    <ArrowBackIcon /> <span>Back</span>
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Notes for <Link
                            to={`/DME-supplier/dashboard/user-profile/${65}`}
                            style={{ color: "black", cursor: "pointer", marginLeft: "6px" }}
                            color="inherit" variant="subtitle2" underline="hover" nowrap="true"
                            target="_blank" rel="noopener noreferrer"
                        >{patient2.fullName}</Link>
                    </Typography>
                    <Button variant="contained" onClick={() => { setAddNotesOpen(true) }} startIcon={
                        <Iconify icon="material-symbols:add" />}>
                        Add Note
                    </Button>
                </Stack>

                <AddNotesToPatientModal open={addNotesOpen} setOpen={setAddNotesOpen} handelFormSubmit={handelAddNotesToPatient} data={{ notes: "" }} title="Add Note" user={user} />

                <Card className='new-referal'>
                    <input type="text"
                        style={{
                            margin: "20px 15px",
                            padding: "10px 5px",
                            width: "220px"
                        }}
                        placeholder="Search by Description"
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
                                        const { _id, note, createdAt } = row;
                                        const selectedUser = selected.indexOf(note) !== -1;

                                        return (
                                            <TableRow hover key={_id} tabIndex={-1} selected={selectedUser}>
                                                <TableCell sx={{ width: "50%" }} component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={0}>
                                                        <Typography style={{ paddingLeft: "20px" }} variant="subtitle2" wrap="true">
                                                            <ReactShowMoreText
                                                                lines={0}
                                                                more={<ExpandMoreIcon style={{ cursor: "pointer", margin: '0px', padding: '0px' }} color='primary' />}
                                                                less={<ExpandLessIcon style={{ cursor: "pointer", margin: '0px', padding: '0px' }} color='primary' />}
                                                                anchorClass=""
                                                                expanded={false}
                                                            >
                                                                {note}
                                                            </ReactShowMoreText>
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">{fDateTime(createdAt)}</TableCell>

                                                <TableCell >
                                                    <PopOver
                                                        key={_id}
                                                        source="patient-notes-page"
                                                        option={[
                                                            { label: "Edit" },
                                                            { label: "Delete" }
                                                        ]}
                                                        id={_id}
                                                        deleteFunction={handleDelete}
                                                        setEdit={setEdit}
                                                        setEditNoteId={setEditNoteId}
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
