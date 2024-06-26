import { Box, Card, CircularProgress, Paper, Stack, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Tooltip, Typography } from '@mui/material';
import React, { useRef, useState } from 'react';
import { filter } from 'lodash';
import { Link, useOutletContext } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { sentenceCase } from 'change-case';
import ReactShowMoreText from 'react-show-more-text';
import Label from '../../../components/label';
import PopOver from '../../../components/Popover/PopOver';

import { UserListHead } from '../../../sections/@dashboard/user';
import Scrollbar from '../../../components/scrollbar';
import { fDate } from '../../../utils/formatTime';





const TABLE_HEAD = [
    { id: 'dateCreated', label: 'Date Created', alignRight: false },
    { id: 'Fname', label: 'First Name', alignRight: false },
    { id: 'Lname', label: 'Last Name', alignRight: false },
    { id: 'lastFOur', label: 'Last Four#', alignRight: false },
    { id: 'status', label: 'status', alignRight: false },
    { id: 'notes', label: 'Notes', alignRight: false },
    { id: 'action', label: 'Action', alignRight: false },
];
function descendingComparator(a, b, orderBy) {

    if (orderBy === "Fname") {
        if (b.veteranId.firstName < a.veteranId.firstName) {
            return -1;
        }
        if (b.veteranId.firstName > a.veteranId.firstName) {
            return 1;
        }
    }
    if (orderBy === "Lname") {
        if (b.veteranId.lastName < a.veteranId.lastName) {
            return -1;
        }
        if (b.veteranId.lastName > a.veteranId.lastName) {
            return 1;
        }
    }
    if (orderBy === "dateCreated") {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        if (dateB < dateA) {
            return -1;
        }
        if (dateB > dateA) {
            return 1;
        }
    }
    if (orderBy === "lastFOur") {
        const dateA = parseInt(a.veteranId.lastFour);
        const dateB = parseInt(b.veteranId.lastFour);

        if (dateB < dateA) {
            return -1;
        }
        if (dateB > dateA) {
            return 1;
        }
    }
    if (orderBy === "firstAttempt") {
        const dateA = new Date(a.firstAttempt);
        const dateB = new Date(b.firstAttempt);

        if (dateB < dateA) {
            return -1;
        }
        if (dateB > dateA) {
            return 1;
        }
    }
    if (orderBy === "secondAttempt") {
        const dateA = new Date(a.secondAttempt);
        const dateB = new Date(b.secondAttempt);

        if (dateB < dateA) {
            return -1;
        }
        if (dateB > dateA) {
            return 1;
        }
    }
    if (orderBy === "schedule") {
        const dateA = new Date(a.schedule);
        const dateB = new Date(b.schedule);

        if (dateB < dateA) {
            return -1;
        }
        if (dateB > dateA) {
            return 1;
        }
    }

    else {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
    }

    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    if (array) {
        const stabilizedThis = array?.map((el, index) => [el, index]);
        stabilizedThis?.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        if (query) {
            return filter(array, (_user) => _user.veteranId.fullName.toLowerCase().indexOf(query.toLowerCase()) !== -1 || _user.veteranId.lastFour.toLowerCase().indexOf(query.toLowerCase()) !== -1);
        }
        return stabilizedThis?.map((el) => el[0]);
    }
    return 0
}


const EstimateSent = () => {

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('PatientName');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(100);

    const searchFieldRef = useRef(null)

    let cancelledOrders
    let cancelledEmptyRows
    let filteredCancelledOrders
    let cancelledIsNotFound
    let row

    let { staffId } = JSON.parse(localStorage.getItem('user'));

    const options = [
        { label: "Edit" },
        { label: "Note Log" },
        { label: "Status" },
        { label: "Documents" }
    ];

    if (!staffId) {
        options.push({ label: "Delete" });
    }


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


    const [statesLoading, orders, deleteOrder] = useOutletContext();

    if (statesLoading) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }


    if (orders !== "No order found!") {
        cancelledOrders = orders?.filter((order) => order.status === "Estimate-sent-pending-po")
        cancelledEmptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - cancelledOrders.length) : 0;
        filteredCancelledOrders = applySortFilter(cancelledOrders, getComparator(order, orderBy), filterName);
        cancelledIsNotFound = !filteredCancelledOrders.length && !!filterName;
        row = filteredCancelledOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    }


    return (
        <>

            <Card style={{ margin: "20px 0px" }}>
                <input type="text"
                    style={{
                        margin: "20px 15px",
                        padding: "10px 5px",
                        width: "220px",
                    }}
                    ref={searchFieldRef}
                    placeholder="Patient Name or Last Four#"
                    value={filterName}
                    onChange={handleFilterByName} />

                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table size="small">

                            <UserListHead
                                order={order}
                                orderBy={orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={cancelledOrders.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                            />

                            <TableBody>

                                {
                                    row.map((row, index) => {
                                        const { _id, createdAt, veteranId, firstAttempt, secondAttempt, schedule, progress, notes, status, labourPo, partsPo } = row;
                                        const selectedUser = selected.indexOf(row._id) !== -1;
                                        return (
                                            <TableRow hover key={index} tabIndex={-1} selected={selectedUser}>



                                                <TableCell align="left">{fDate(createdAt)}</TableCell>
                                                <TableCell align="left">{veteranId.firstName}</TableCell>
                                                <TableCell align="left">{veteranId.lastName}</TableCell>

                                                <TableCell component="th" scope="row" padding="none">
                                                    <Link to={`/DME-supplier/dashboard/user-profile/${veteranId._id}`}
                                                        style={{ display: "block", fontSize: "small", color: "black", cursor: "pointer" }} underline="hover" nowrap="true">
                                                        <Tooltip title="Profile">
                                                            <Typography variant="subtitle2" sx={{ textAlign: "center" }}>
                                                                {veteranId.lastFour}
                                                            </Typography>
                                                        </Tooltip>
                                                    </Link>
                                                </TableCell>

                                                <TableCell align="left">
                                                    <Label
                                                        color={
                                                            status === 'Pending' || status === 'Cancelled' ? 'warning' : 'success'
                                                        }>
                                                        {sentenceCase(status)}
                                                    </Label>
                                                </TableCell>

                                                {
                                                    notes && notes?.length !== 0 ?
                                                        <TableCell sx={{ maxWidth: "200px", wordWrap: "break-word" }} align="left">
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
                                                        :
                                                        <TableCell width="auto" align="left">
                                                            <ReactShowMoreText
                                                                lines={1}
                                                                more={<ExpandMoreIcon style={{ cursor: "pointer", margin: '0px', padding: '0px' }} color='primary' />}
                                                                less={<ExpandLessIcon style={{ cursor: "pointer", margin: '0px', padding: '0px' }} color='primary' />}
                                                                anchorClass=""
                                                                expanded={false}
                                                            >
                                                                {"No Notes available"}
                                                            </ReactShowMoreText >
                                                        </TableCell>
                                                }

                                                <TableCell >
                                                    <PopOver
                                                        key={index}
                                                        source='veteran-order-page'
                                                        option={options}
                                                        id={row._id}
                                                        deleteOrder={deleteOrder}

                                                    />
                                                </TableCell>

                                            </TableRow>
                                        )
                                    })
                                }


                                {cancelledEmptyRows > 0 || (
                                    <TableRow style={{ height: 53 * cancelledEmptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}

                            </TableBody>

                            {
                                cancelledIsNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={12} sx={{ py: 3 }}>
                                                <Paper
                                                    sx={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Typography component={'span'} variant="h6" paragraph>
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
                                )
                            }
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    rowsPerPageOptions={[100, 50, 25]}
                    component="div"
                    count={cancelledOrders.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

            </Card>
        </>
    );
};

export default EstimateSent;