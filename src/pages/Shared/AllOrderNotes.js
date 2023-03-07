import { Box, Button, Card, CircularProgress, Container, Paper, Stack, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AuthRequest } from '../../services/AuthRequest';
import { UserListHead } from '../../sections/@dashboard/user';
import Scrollbar from '../../components/scrollbar';
import Iconify from '../../components/iconify';
import { fDateTime } from '../../utils/formatTime';
import { filter } from 'lodash';
import AddOrderNoteLogModal from './AddOrderNoteLogModal';
import { toast } from 'react-toastify';
import ReactShowMoreText from 'react-show-more-text';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';


const TABLE_HEAD = [
    { id: 'TimeStamp', label: 'Created At', alignRight: false },
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'designation', label: 'Designation', alignRight: false },
    { id: 'note', label: 'Note', alignRight: false },
    // { id: 'action', label: 'Action', alignRight: false },
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

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => _user.notes.toLowerCase().indexOf(query.toLowerCase()) !== -1 || _user.writerId?.fullName.toLowerCase().indexOf(query.toLowerCase()) !== -1 || _user.writerId?.userCategory?.category.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}


export default function AllOrderNotes() {

    const navigate = useNavigate()
    const { id: orderId } = useParams()

    const { search } = window.location;
    const params = new URLSearchParams(search);
    const orderCategory = params.get('orderCategory');
    const orderStatus = params.get('orderStatus');

    const [user, setUser] = useState()
    const [addNotesOpen, setAddNotesOpen] = useState(false)
    const [loading, setLoading] = useState()

    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);



    let loggedUser = JSON.parse(localStorage.getItem('user'));
    const { id: writerId } = loggedUser

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

    const { isLoading, refetch: orderNoteRefetch, data: note } = useQuery('note-log',
        async () => {
            if (orderCategory === "equipment-order") {
                return AuthRequest.get(`/api/v1/order/orderNote/${orderId}`).then(data => data.data.data)
            } else if (orderCategory === "veteran-order") {
                return AuthRequest.get(`/api/v1/veteran-order/veteran-order-note/${orderId}`).then(data => data.data.data)
            } else if (orderCategory === "repair-order") {
                return AuthRequest.get(`/api/v1/repair-order/repair-order-note/${orderId}`).then(data => data.data.data)
            }
        }, {
        cacheTime: 0
    })

    const { mutateAsync: addOrderNote, isLoading: addOrderNoteLog } = useMutation((data) => {

        if (orderCategory === "equipment-order") {
            return AuthRequest.post(`api/v1/order/orderNote/${orderId}`, data)
                .then(res => {
                    toast.success("Note Added", {
                        toastId: "success129"
                    })
                    orderNoteRefetch()
                    setAddNotesOpen(false)
                }).catch(err => {
                    toast.error("Something Went Wrong!", {
                        toastId: "error129"
                    })
                })
        } else if (orderCategory === "repair-order") {
            return AuthRequest.post(`api/v1/repair-order/repair-order-note/${orderId}`, data)
                .then(res => {
                    toast.success("Note Added", {
                        toastId: "success129"
                    })
                    orderNoteRefetch()
                    setAddNotesOpen(false)
                }).catch(err => {
                    toast.error("Something Went Wrong!", {
                        toastId: "error129"
                    })
                })
        } else if (orderCategory === "veteran-order") {
            return AuthRequest.post(`api/v1/veteran-order/veteran-order-note/${orderId}`, data)
                .then(res => {
                    toast.success("Note Added", {
                        toastId: "success129"
                    })
                    orderNoteRefetch()
                    setAddNotesOpen(false)
                }).catch(err => {
                    toast.error("Something Went Wrong!", {
                        toastId: "error129"
                    })
                })
        }
        return 0
    })


    const handelAddOrderNotes = async (e) => {
        e.preventDefault()
        if (writerId && orderId && e.target.notes.value) {
            const data = {
                writerId: writerId,
                orderId: orderId,
                notes: e.target.notes.value
            }
            addOrderNote(data)
            return
        }
        return toast.error("Fields are missing!", {
            toastId: "error1299"
        })

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

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };


    if (isLoading || loading) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - note.length) : 0;

    const filteredUsers = applySortFilter(note, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;


    return (
        <>
            <Helmet>
                <title> Order Note Log </title>
            </Helmet>
            <Container maxWidth="1350px">

                <Stack onClick={() => navigate(-1)} direction="row" spacing={1} style={{ cursor: "pointer", marginBottom: "15px", }} sx={{
                    "&:hover": {
                        color: "#3498db",
                    },
                }} >
                    <ArrowBackIcon /> <span>Back</span>
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h5">Order Note Log</Typography>
                    {
                        orderStatus !== "archived" &&
                        <Button variant="contained" onClick={() => { setAddNotesOpen(true) }} startIcon={
                            <Iconify icon="material-symbols:add" />}>
                            Add Note
                        </Button>
                    }
                </Stack>

                <AddOrderNoteLogModal open={addNotesOpen} setOpen={setAddNotesOpen} handelFormSubmit={handelAddOrderNotes} data={{ notes: "" }} title="Add Note" user={user} addOrderNoteLog={addOrderNoteLog} />


                <Card className='new-referal'>
                    <input type="text"
                        style={{
                            margin: "20px 15px",
                            padding: "10px 5px",
                            width: "220px"
                        }}
                        placeholder="Search by Name,Designation,Note"
                        value={filterName}
                        onChange={handleFilterByName} />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table size="small">
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={note.length}
                                    onRequestSort={handleRequestSort}
                                />
                                <TableBody>
                                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const { _id, writerId, notes, createdAt } = row;

                                        return (
                                            <TableRow hover key={_id} tabIndex={-1}>
                                                <TableCell align="left">{fDateTime(createdAt)}</TableCell>
                                                <TableCell align="left">{writerId?.fullName}</TableCell>
                                                <TableCell align="left">{writerId?.userCategory?.category}</TableCell>
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
                                                                {notes}
                                                            </ReactShowMoreText>
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                {/* <TableCell >
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
                                                </TableCell> */}
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
                        count={note.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>


            </Container>
        </>
    );
};
