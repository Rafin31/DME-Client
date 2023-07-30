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
import EditOrderModal from 'src/pages/Shared/EditOrderModal';
import { useEffect } from 'react';




const TABLE_HEAD = [
    { id: 'create', label: 'Date Created', alignRight: false },
    { id: 'dateCompleted', label: 'Date Completed', alignRight: false },
    { id: 'PatientName', label: 'Patient Name', alignRight: false },
    { id: 'dob', label: 'Date of Birth', alignRight: false },
    { id: 'Description', label: 'Description', alignRight: false },
    { id: 'notes', label: 'Notes', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: 'action', label: 'Action', alignRight: false },
];

function descendingComparator(a, b, orderBy) {

    if (orderBy === "create") {

        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        if (dateB < dateA) {
            return -1;
        }
        if (dateB > dateA) {
            return 1;
        }
    }

    if (orderBy === "PatientName") {
        if (b.patientId.lastName < a.patientId.lastName) {
            return -1;
        }
        if (b.patientId.lastName > a.patientId.lastName) {
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
    if (orderBy === "status") {
        if (b.status < a.status) {
            return -1;
        }
        if (b.status > a.status) {
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


const EquipmentOrderHistory = ({ orders, refetch, fromPage, deleteEquipmentOrder }) => {

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('PatientName');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(100);

    const searchFieldRef = useRef(null)
    let { staffId } = JSON.parse(localStorage.getItem('user'));

    let newReferralOrders
    let newReferralEmptyRows
    let filteredNewReferralOrders
    let newReferralIsNotFound
    let row

    const [openModal, setOpenModal] = useState(false)
    const [editedOrderId, setEditedOrderId] = useState()

    const options = [
        { label: "Note Log" },
        { label: "Documents" },
    ]


    fromPage === "patientStates" && options.push({ label: "Status" })
    fromPage === "patientStates" && options.push({ label: "Edit", fromPage: "states" })
    fromPage === "patientStates" && !staffId && options.push({ label: "Delete" })

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


    if (orders !== "No order found!" || orders.length !== 0) {
        newReferralOrders = orders
        newReferralEmptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - newReferralOrders.length) : 0;
        filteredNewReferralOrders = applySortFilter(newReferralOrders, getComparator(order, orderBy), filterName);
        newReferralIsNotFound = !filteredNewReferralOrders.length && !!filterName;
        row = filteredNewReferralOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    }


    return (
        <>
            <EditOrderModal open={openModal} setOpen={setOpenModal} orderCategory={"equipment-order"}
                order={orders.find(order => order._id === editedOrderId) || {}} refetch={refetch} orderId={editedOrderId} title="Edit Order" />

            <Card style={{ margin: "20px 0px" }}>
                {
                    (fromPage !== "patientStates" && fromPage !== "ClientOrderHistory") &&
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
                }

                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>

                        <Table size="small">

                            <UserListHead
                                order={order}
                                orderBy={orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={newReferralOrders.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                            />


                            <TableBody>

                                {
                                    row?.map((row, index) => {
                                        const { _id, createdAt, dateCompleted, patientId, status, notes, description, progress } = row;
                                        const selectedUser = selected.indexOf(row._id) !== -1;
                                        return (
                                            <TableRow hover key={index} tabIndex={-1} selected={selectedUser}>

                                                <TableCell align="left">{fDate(createdAt)}</TableCell>
                                                <TableCell align="left">{dateCompleted ? fDate(dateCompleted) : "Not Mentioned"}</TableCell>

                                                <TableCell width="30%">
                                                    <Stack direction="row" alignItems="center" spacing={10}>
                                                        {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                        <Link to={`/DME-supplier/dashboard/user-profile/${patientId._id}`}
                                                            style={{ display: "block", fontSize: "small", color: "black", cursor: "pointer" }} underline="hover" nowrap="true">
                                                            <Tooltip title="Profile">
                                                                <Typography component={'span'} variant="subtitle2" nowrap="true">
                                                                    {patientId.fullName}
                                                                </Typography>
                                                            </Tooltip>
                                                        </Link>

                                                    </Stack>
                                                </TableCell>

                                                <TableCell width="30%" align="left">{patientId.patientDob}</TableCell>

                                                {
                                                    description ?
                                                        <TableCell align="left">{description}</TableCell>
                                                        :
                                                        <TableCell align="left">No Description Available</TableCell>
                                                }

                                                {notes && notes?.length !== 0 ?
                                                    <TableCell align="left">
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

                                                <TableCell >
                                                    <PopOver
                                                        key={index}
                                                        source='order-page'
                                                        orderStatus="archived"
                                                        option={options}
                                                        id={row._id}
                                                        deleteOrder={deleteEquipmentOrder ? deleteEquipmentOrder : ""}
                                                        setEditOrderModal={setOpenModal}
                                                        setEditedOrderId={setEditedOrderId}
                                                    />
                                                </TableCell>

                                            </TableRow>
                                        )
                                    })
                                }


                                {newReferralEmptyRows > 0 || (
                                    <TableRow style={{ height: 53 * newReferralEmptyRows }}>
                                        <TableCell colSpan={9} />
                                    </TableRow>
                                )}

                            </TableBody>

                            {
                                newReferralIsNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={9} sx={{ py: 3 }}>
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
                    count={newReferralOrders?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

            </Card>

        </>
    );
};

export default EquipmentOrderHistory;