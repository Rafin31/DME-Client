import { Box, Card, CircularProgress, Paper, Stack, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography } from '@mui/material';
import React, { useRef, useState } from 'react';
import { filter } from 'lodash';
import { useOutletContext } from 'react-router-dom';

import { sentenceCase } from 'change-case';
import Label from '../../../components/label';
import PopOver from '../../../components/Popover/PopOver';

import { UserListHead } from '../../../sections/@dashboard/user';
import Scrollbar from '../../../components/scrollbar';
import { fDate } from 'src/utils/formatTime';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckIcon from '@mui/icons-material/Check';


const TABLE_HEAD = [
    { id: 'Assigning on', label: 'Assigning on', alignRight: false },
    { id: 'Assigned By', label: 'Assigned By', alignRight: false },
    { id: 'Title', label: 'Title', alignRight: false },
    { id: 'Description', label: 'Description', alignRight: false },
    { id: 'Deadline', label: 'Deadline', alignRight: false },
    { id: 'Status', label: 'Status', alignRight: false },
    { id: 'Action', label: 'Action', alignRight: false },
];

function descendingComparator(a, b, orderBy) {

    if (orderBy === "Assigned By") {
        if (b.assignedBy.fullName < a.assignedBy.fullName) {
            return -1;
        }
        if (b.assignedBy.fullName > a.assignedBy.fullName) {
            return 1;
        }
    }
    if (orderBy === "Assigning on") {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

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
    if (orderBy === "Title") {
        if (b.title < a.description) {
            return -1;
        }
        if (b.title > a.title) {
            return 1;
        }
    }
    if (orderBy === "Status") {
        if (b.status < a.status) {
            return -1;
        }
        if (b.status > a.status) {
            return 1;
        }
    }
    if (orderBy === "Deadline") {
        if (b.deadline < a.deadline) {
            return -1;
        }
        if (b.deadline > a.deadline) {
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
            return filter(array, (_user) => _user.assignedBy.fullName.toLowerCase().indexOf(query.toLowerCase()) !== -1 || _user.description.toLowerCase().indexOf(query.toLowerCase()) !== -1 || _user.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
        }
        return stabilizedThis?.map((el) => el[0]);
    }
    return 0
}


const AllAssignedTask = () => {

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('PatientName');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(100);

    const searchFieldRef = useRef(null)

    let AllAssignedTask
    let assignedTaskEmptyRows
    let filteredAssignedTask
    let assignedTaskNotFound
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

    const { assignedTaskLoading, assignedTask, handleAssignTaskUpdate } = useOutletContext();


    if (assignedTaskLoading) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }

    if (assignedTask.length !== 0) {
        AllAssignedTask = assignedTask
        assignedTaskEmptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - AllAssignedTask.length) : 0;
        filteredAssignedTask = applySortFilter(AllAssignedTask, getComparator(order, orderBy), filterName);
        assignedTaskNotFound = !filteredAssignedTask.length && !!filterName;
        row = filteredAssignedTask.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    }


    return (
        <>

            {
                assignedTask.length !== 0 ?
                    <Card style={{ margin: "20px 0px" }}>
                        <input type="text"
                            style={{
                                margin: "20px 15px",
                                padding: "10px 5px",
                                width: "220px"
                            }}
                            ref={searchFieldRef}
                            placeholder="Search"
                            value={filterName}
                            onChange={handleFilterByName} />

                        <Scrollbar>
                            <TableContainer sx={{ minWidth: 800 }}>

                                <Table size="small">

                                    <UserListHead
                                        order={order}
                                        orderBy={orderBy}
                                        headLabel={TABLE_HEAD}
                                        rowCount={AllAssignedTask.length}
                                        numSelected={selected.length}
                                        onRequestSort={handleRequestSort}
                                    />


                                    <TableBody>

                                        {
                                            row?.map((row, index) => {
                                                const { _id, assignedBy, title, status, description, deadline, createdAt } = row;
                                                const selectedUser = selected.indexOf(row._id) !== -1;
                                                return (
                                                    <TableRow hover key={index} tabIndex={-1} selected={selectedUser}>

                                                        <TableCell width="10%" align="left">{fDate(createdAt)}</TableCell>

                                                        <TableCell width="20%">
                                                            <Stack direction="row" alignItems="center" spacing={10}>
                                                                <Typography variant="subtitle2" nowrap="true">
                                                                    {assignedBy.fullName}
                                                                </Typography>

                                                            </Stack>
                                                        </TableCell>

                                                        <TableCell width="10%" align="left">{title}</TableCell>
                                                        <TableCell width="10%" align="left">{description}</TableCell>
                                                        <TableCell width="10%" align="left">{fDate(deadline)}</TableCell>



                                                        <TableCell align="left">
                                                            <Label
                                                                color={
                                                                    status === 'Pending' ? "warning" : status === 'Accepted' ? "primary" : status === 'Rejected' ? "error" : 'success'
                                                                }>
                                                                {sentenceCase(status)}
                                                            </Label>
                                                        </TableCell>




                                                        <TableCell >
                                                            {
                                                                status !== 'Rejected' && status !== 'Completed' &&

                                                                <PopOver
                                                                    key={index}
                                                                    source='assigned-task-page'
                                                                    option={
                                                                        row.status === "Pending"
                                                                            ? [
                                                                                {
                                                                                    label: "Accept",
                                                                                    icon: <CheckIcon sx={{ mr: 2 }} />,
                                                                                    color: "green"
                                                                                },

                                                                                {
                                                                                    label: "Reject",
                                                                                    icon: <HighlightOffIcon sx={{ mr: 2 }} />,
                                                                                    color: "red"
                                                                                }
                                                                            ]
                                                                            : row.status === "Accepted"
                                                                                ? [
                                                                                    {
                                                                                        label: "Completed",
                                                                                        icon: <CheckIcon sx={{ mr: 2 }} />,
                                                                                        color: "green"
                                                                                    }
                                                                                ]
                                                                                :
                                                                                row.status === "Completed"
                                                                                && []

                                                                    }
                                                                    id={_id}
                                                                    handleAssignTaskUpdate={handleAssignTaskUpdate}
                                                                />
                                                            }
                                                        </TableCell>

                                                    </TableRow>
                                                )
                                            })
                                        }


                                        {assignedTaskEmptyRows > 0 || (
                                            <TableRow style={{ height: 53 * assignedTaskEmptyRows }}>
                                                <TableCell colSpan={7} />
                                            </TableRow>
                                        )}

                                    </TableBody>

                                    {
                                        assignedTaskNotFound && (
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
                            rowsPerPageOptions={[100, 50, 25]}
                            component="div"
                            count={AllAssignedTask?.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />

                    </Card>
                    :
                    <p style={{ textAlign: "center" }}>No task has been assigned to you!</p>
            }

        </>
    );
};

export default AllAssignedTask;