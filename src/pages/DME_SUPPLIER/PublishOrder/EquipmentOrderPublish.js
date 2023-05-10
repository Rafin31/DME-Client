import { Card, Paper, Stack, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import { filter } from 'lodash';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { sentenceCase } from 'change-case';
import ReactShowMoreText from 'react-show-more-text';
import Label from '../../../components/label';


import { UserListHead } from '../../../sections/@dashboard/user';
import Scrollbar from '../../../components/scrollbar';
import { fDate } from '../../../utils/formatTime';




const TABLE_HEAD = [
    { id: 'create', label: 'Date Created', alignRight: false },
    { id: 'PatientName', label: 'Patient Name', alignRight: false },
    { id: 'dob', label: 'Date of Birth', alignRight: false },
    { id: 'Description', label: 'Description', alignRight: false },
    { id: 'notes', label: 'Notes', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: 'Progress', label: 'Progress', alignRight: false },
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
            return filter(array, (_user) => _user.patientId.fullName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
        }
        return stabilizedThis?.map((el) => el[0]);
    }
    return 0
}


const EquipmentOrderPublish = ({ orders, publishNoteHandle }) => {

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('PatientName');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    let newReferralOrders
    let newReferralEmptyRows
    let filteredNewReferralOrders
    let newReferralIsNotFound
    let row


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    if (orders !== "No order found!") {
        newReferralOrders = orders
        newReferralEmptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - newReferralOrders.length) : 0;
        filteredNewReferralOrders = applySortFilter(newReferralOrders, getComparator(order, orderBy), filterName);
        newReferralIsNotFound = !filteredNewReferralOrders.length && !!filterName;
        row = filteredNewReferralOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    }

    return (
        <>

            <Card style={{ margin: "20px 0px" }}>

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
                                            <TableRow hover style={{ cursor: "pointer" }} key={index} tabIndex={-1} selected={selectedUser}
                                                onClick={() => publishNoteHandle(_id, "equipment-order")}>

                                                <TableCell align="left">{fDate(createdAt)}</TableCell>
                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={10}>
                                                        <Typography component={'span'} style={{ paddingLeft: "20px", wordWrap: "break-word" }} variant="subtitle2" nowrap="true">
                                                            {patientId.fullName}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">{patientId.patientDob}</TableCell>

                                                {
                                                    description ?
                                                        <TableCell align="left">{description}</TableCell>
                                                        :
                                                        <TableCell align="left">No Description Available</TableCell>
                                                }

                                                {
                                                    notes && notes?.length !== 0 ?
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
                    rowsPerPageOptions={[5, 10, 25]}
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

export default EquipmentOrderPublish;