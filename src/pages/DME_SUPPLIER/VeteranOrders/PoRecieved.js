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
    { id: 'partsPo', label: 'Parts PO#', alignRight: false },
    { id: 'labourPo', label: 'Labour PO#', alignRight: false },
    { id: 'firstAttempt', label: '1st Attempt', alignRight: false },
    { id: 'secondAttempt', label: '2nd Attempt', alignRight: false },
    { id: 'schedule', label: 'Schedule', alignRight: false },
    { id: 'status', label: 'status', alignRight: false },
    { id: 'notes', label: 'Notes', alignRight: false },
    { id: 'action', label: '', alignRight: false },
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
    if (array) {
        const stabilizedThis = array?.map((el, index) => [el, index]);
        stabilizedThis?.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        if (query) {
            return filter(array, (_user) => _user.veteranId.fullName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
        }
        return stabilizedThis?.map((el) => el[0]);
    }
    return 0
}


const PoRecieved = () => {

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('PatientName');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const searchFieldRef = useRef(null)

    let cancelledOrders
    let cancelledEmptyRows
    let filteredCancelledOrders
    let cancelledIsNotFound
    let row


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


    const [statesLoading, orders] = useOutletContext();

    if (statesLoading) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }


    if (orders !== "No order found!") {
        cancelledOrders = orders?.filter((order) => order.status === "Po-Received")
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
                                rowCount={cancelledOrders.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                            />

                            <TableBody>

                                {
                                    row.map((row, index) => {
                                        const { _id, createdAt, veteranId, firstAttempt, secondAttempt, schedule, notes, status, labourPo, partsPo } = row;
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

                                                <TableCell align="left">{!partsPo ? "Not Mentioned" : partsPo}</TableCell>
                                                <TableCell align="left">{!labourPo ? "Not Mentioned" : labourPo}</TableCell>

                                                <TableCell align="left">{!firstAttempt ? "Not Mentioned" : firstAttempt}</TableCell>
                                                <TableCell align="left">{!secondAttempt ? "Not Mentioned" : secondAttempt}</TableCell>
                                                <TableCell align="left">{!schedule ? "Not Mentioned" : schedule}</TableCell>

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
                                                                {notes?.note}
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
                                                        option={[
                                                            { label: "Edit" },
                                                            { label: "Add Note" },
                                                            { label: "Note Log" },
                                                            { label: "Status" },
                                                            { label: "Documents" },
                                                        ]}
                                                        id={row._id}
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
                    rowsPerPageOptions={[5, 10, 25]}
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

export default PoRecieved;