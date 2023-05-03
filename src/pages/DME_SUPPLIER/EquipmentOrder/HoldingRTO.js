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





const TABLE_HEAD = [
    { id: 'PatientName', label: 'Patient Name', alignRight: false },
    { id: 'dob', label: 'Date of Birth', alignRight: false },
    { id: 'Description', label: 'Description', alignRight: false },
    { id: 'notes', label: 'Notes', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: 'Progress', label: 'Progress', alignRight: false },
    { id: 'action', label: 'Action', alignRight: false },
];

function descendingComparator(a, b, orderBy) {

    if (orderBy === "PatientName") {
        if (b.patientId.fullName < a.patientId.fullName) {
            return -1;
        }
        if (b.patientId.fullName > a.patientId.fullName) {
            return 1;
        }
    }
    if (orderBy === "dob") {
        const dateA = new Date(a.patientId.patientDob);
        const dateB = new Date(b.patientId.patientDob);

        if (dateB < dateA) {
            return -1;
        }
        if (dateB > dateA) {
            return 1;
        }
    }
    if (orderBy === "Description") {
        if (b.description < a.description) {
            return -1;
        }
        if (b.description > a.description) {
            return 1;
        }
    }
    if (orderBy === "notes") {
        if (b.notes < a.notes) {
            return -1;
        }
        if (b.notes > a.notes) {
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
            return filter(array, (_user) => _user.patientId.fullName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
        }
        return stabilizedThis?.map((el) => el[0]);
    }
    return 0
}


const HoldingRTO = () => {

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('PatientName');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const searchFieldRef = useRef(null)

    let holdingRTOOrders
    let holdingRTOEmptyRows
    let filteredHoldingRTOOrders
    let holdingRTOIsNotFound
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


    const [statesLoading, orders, deleteOrder] = useOutletContext();

    if (statesLoading) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }


    if (orders !== "No order found!") {
        holdingRTOOrders = orders?.filter((order) => order.status === "Holding-RTO")
        holdingRTOEmptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - holdingRTOOrders.length) : 0;
        filteredHoldingRTOOrders = applySortFilter(holdingRTOOrders, getComparator(order, orderBy), filterName);
        holdingRTOIsNotFound = !filteredHoldingRTOOrders.length && !!filterName;
        row = filteredHoldingRTOOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                                rowCount={holdingRTOOrders.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                            />

                            <TableBody>

                                {
                                    row.map((row, index) => {
                                        const { _id, patientId, status, notes, description, progress } = row;
                                        const selectedUser = selected.indexOf(row._id) !== -1;
                                        return (
                                            <TableRow hover key={index} tabIndex={-1} selected={selectedUser}>


                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={10}>
                                                        {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                        <Link to={`/DME-supplier/dashboard/user-profile/${patientId._id}`}
                                                            style={{ display: "block", fontSize: "small", color: "black", cursor: "pointer" }} underline="hover" nowrap="true">
                                                            <Tooltip title="Profile">
                                                                <Typography component={'span'} style={{ paddingLeft: "20px", wordWrap: "break-word" }} variant="subtitle2" nowrap="true">
                                                                    {patientId.fullName}
                                                                </Typography>
                                                            </Tooltip>
                                                        </Link>

                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">{patientId.patientDob}</TableCell>

                                                {
                                                    description ?
                                                        <TableCell align="left">{description}</TableCell>
                                                        :
                                                        <TableCell align="left">No Description Available</TableCell>
                                                }

                                                {notes && notes?.length !== 0 ?
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
                                                    :
                                                    <TableCell width="30%" align="left">
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
                                                <TableCell align="left">
                                                    <Label
                                                        color={
                                                            status === 'Pending' || status === 'Cancelled' ? 'warning' : 'success'
                                                        }>
                                                        {sentenceCase(status)}
                                                    </Label>
                                                </TableCell>

                                                <TableCell align="left">{!progress ? "Not Mentioned" : progress}</TableCell>


                                                <TableCell >
                                                    <PopOver
                                                        key={index}
                                                        source='order-page'
                                                        option={[
                                                            { label: "Edit" },
                                                            { label: "Note Log" },
                                                            { label: "Status" },
                                                            { label: "Documents" },
                                                            { label: "Delete" },
                                                        ]}
                                                        id={row._id}
                                                        deleteOrder={deleteOrder}
                                                    />
                                                </TableCell>

                                            </TableRow>
                                        )
                                    })
                                }


                                {holdingRTOEmptyRows > 0 || (
                                    <TableRow style={{ height: 53 * holdingRTOEmptyRows }}>
                                        <TableCell colSpan={7} />
                                    </TableRow>
                                )}

                            </TableBody>

                            {
                                holdingRTOIsNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
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
                    count={holdingRTOOrders.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

            </Card>
        </>
    );
};

export default HoldingRTO;