import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// @mui
import {
    Card,
    Table,
    Stack,
    Paper,
    Button,
    Box,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination,
    Tabs,
    Tab,
    Tooltip,
    CircularProgress,
} from '@mui/material';
// components
import { useQueries, useQuery } from 'react-query';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import ReactShowMoreText from 'react-show-more-text';
import PopOver from '../../components/Popover/PopOver';
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';


// sections
import { UserListHead } from '../../sections/@dashboard/user';

import { AuthRequest } from '../../services/AuthRequest';





// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'PatientName', label: 'Patient Name', alignRight: false },
    { id: 'email', label: 'Patient Email', alignRight: false },
    { id: 'Description', label: 'Description', alignRight: false },
    { id: 'notes', label: 'Notes', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: 'Progress', label: 'Progress', alignRight: false },
    { id: 'action', label: 'Action', alignRight: false },
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

export default function OrderPage() {
    const [open, setOpen] = useState(null);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('PatientName');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [value, setValue] = useState(0);

    const searchFieldRef = useRef(null)

    const navigate = useNavigate()

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
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

    let loggedUser = localStorage.getItem('user');
    loggedUser = JSON.parse(loggedUser);

    const { id } = loggedUser


    const { isLoading: statesLoading, data: orders } = useQuery('orders',
        async () => {
            return AuthRequest.get(`/api/v1/order/dme-supplier/${id}`).then(data => data.data.data)
        }
    )

    useEffect(() => {
        if (searchFieldRef.current) {
            searchFieldRef.current.focus();
        }
    }, [filterName, handleFilterByName, searchFieldRef])


    if (statesLoading) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }

    if (orders !== "No order found!") {

        var newReferralOrders = orders?.filter((order) => order.status === "New-Referral")
        var cancelledOrders = orders?.filter((order) => order.status === "Cancelled")
        var evaluationOrders = orders?.filter((order) => order.status === "Evaluation")
        var evaluationCompletedOrders = orders?.filter((order) => order.status === "Evaluation-Completed")
        var paperWorkOrders = orders?.filter((order) => order.status === "Paper-Work-In-Process")
        var priorAuthOrders = orders?.filter((order) => order.status === "Prior-Auth-Status")
        var priorAuthReceiveOrders = orders?.filter((order) => order.status === "Prior-Auth-Receive")
        var holdingRtoOrders = orders?.filter((order) => order.status === "Holding-RTO")
        var rtoOrders = orders?.filter((order) => order.status === "RTO")
        var deliveredOrders = orders?.filter((order) => order.status === "Delivered")
        var authorizationExpirationOrders = orders?.filter((order) => order.status === "Authorization-Expiration-F/U")
        var requestOrders = orders?.filter((order) => order.status === "Order-Request")
        var pendingOrder = orders?.filter((order) => order.status === "Pending")


        var newReferralEmptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - newReferralOrders.length) : 0;
        var cancelledOrderEmptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - cancelledOrders.length) : 0;
        var evaluationOrderRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - evaluationOrders.length) : 0;
        var evaluationCompletedOrderRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - evaluationCompletedOrders.length) : 0;
        var paperWorkOrderRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - paperWorkOrders.length) : 0;
        var priorAuthOrderRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - priorAuthOrders.length) : 0;
        var priorAuthReceiveOrderRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - priorAuthReceiveOrders.length) : 0;
        var holdingRtoOrderRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - holdingRtoOrders.length) : 0;
        var rtoOrderRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rtoOrders.length) : 0;
        var deliveredOrderRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - deliveredOrders.length) : 0;
        var authorizationExpirationOrderRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - authorizationExpirationOrders.length) : 0;
        var requestOrderRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - requestOrders.length) : 0;
        var pendingOrderRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - pendingOrder.length) : 0;


        var filteredNewReferralOrders = applySortFilter(newReferralOrders, getComparator(order, orderBy), filterName);
        var filteredCancelledOrders = applySortFilter(cancelledOrders, getComparator(order, orderBy), filterName);
        var filteredEvaluationOrder = applySortFilter(evaluationOrders, getComparator(order, orderBy), filterName);
        var filteredEvaluationCompletedOrder = applySortFilter(evaluationCompletedOrders, getComparator(order, orderBy), filterName);
        var filteredPaperWorkOrder = applySortFilter(paperWorkOrders, getComparator(order, orderBy), filterName);
        var filteredPriorAuthOrder = applySortFilter(priorAuthOrders, getComparator(order, orderBy), filterName);
        var filteredPriorAuthReceiveOrder = applySortFilter(priorAuthReceiveOrders, getComparator(order, orderBy), filterName);
        var filteredHoldingRtoOrder = applySortFilter(holdingRtoOrders, getComparator(order, orderBy), filterName);
        var filteredRtoOrder = applySortFilter(rtoOrders, getComparator(order, orderBy), filterName);
        var filteredDeliveredOrder = applySortFilter(deliveredOrders, getComparator(order, orderBy), filterName);
        var filteredAuthorizationExpirationOrder = applySortFilter(authorizationExpirationOrders, getComparator(order, orderBy), filterName);
        var filteredRequestOrder = applySortFilter(requestOrders, getComparator(order, orderBy), filterName);
        var filteredPendingOrder = applySortFilter(pendingOrder, getComparator(order, orderBy), filterName);


        var newReferralIsNotFound = !filteredNewReferralOrders.length && !!filterName;
        var cancelledOrderIsNotFound = !filteredCancelledOrders.length && !!filterName;
        var evaluationOrderIsNotFound = !filteredEvaluationOrder.length && !!filterName;
        var evaluationCompletedOrderIsNotFound = !filteredEvaluationCompletedOrder.length && !!filterName;
        var paperWorkOrderIsNotFound = !filteredPaperWorkOrder.length && !!filterName;
        var priorAuthOrderIsNotFound = !filteredPriorAuthOrder.length && !!filterName;
        var priorAuthReceiveOrderIsNotFound = !filteredPriorAuthReceiveOrder.length && !!filterName;
        var holdingRtoOrderIsNotFound = !filteredHoldingRtoOrder.length && !!filterName;
        var rtoOrderIsNotFound = !filteredRtoOrder.length && !!filterName;
        var deliveredOrderIsNotFound = !filteredDeliveredOrder.length && !!filterName;
        var authorizationExpirationOrderIsNotFound = !filteredAuthorizationExpirationOrder.length && !!filterName;
        var requestOrderIsNotFound = !filteredRequestOrder.length && !!filterName;
        var pendingOrderIsNotFound = !filteredPendingOrder.length && !!filterName;
    }



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
                        <Typography component={'span'} >{children}</Typography>
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

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);

    };







    return (
        <>
            <Helmet>
                <title> Orders</title>
            </Helmet>

            <Container maxWidth="xl">
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography component={'span'} variant="h4" gutterBottom>
                        Orders
                    </Typography>
                    <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}
                        onClick={() => { navigate('/DME-supplier/dashboard/add-order') }} >
                        New Order
                    </Button>
                </Stack>

                {/* -------------------------------------------------------------------------
                                   TABS
              --------------------------------------------------------------------------- */}

                <Box>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="basic tabs example">
                        <Tab label="New Referral" {...a11yProps(0)} draggable="true" />
                        <Tab label="Cancelled Order" {...a11yProps(1)} draggable="true" />
                        <Tab label="Evaluation" {...a11yProps(2)} draggable="true" />
                        <Tab label="Evaluation Completed" {...a11yProps(3)} draggable="true" />
                        <Tab label="PaperWork in Process" {...a11yProps(4)} draggable="true" />
                        <Tab label="Prior Auth Status" {...a11yProps(5)} draggable="true" />
                        <Tab label="Prior Auth Received" {...a11yProps(6)} draggable="true" />
                        <Tab label="Holding RTO " {...a11yProps(7)} draggable="true" />
                        <Tab label="RTO" {...a11yProps(8)} draggable="true" />
                        <Tab label="Delivered" {...a11yProps(9)} draggable="true" />
                        <Tab label="Authorization Expirations F/U" {...a11yProps(10)} draggable="true" />
                        <Tab label="Order Request" {...a11yProps(11)} draggable="true" />

                    </Tabs>

                    {
                        orders !== "No order found!" ?
                            [
                                filteredNewReferralOrders,
                                filteredCancelledOrders,
                                filteredEvaluationOrder,
                                filteredEvaluationCompletedOrder,
                                filteredPaperWorkOrder,
                                filteredPriorAuthOrder,
                                filteredPriorAuthReceiveOrder,
                                filteredHoldingRtoOrder,
                                filteredRtoOrder,
                                filteredDeliveredOrder,
                                filteredAuthorizationExpirationOrder,
                                filteredRequestOrder,
                                filteredPendingOrder
                            ].map((tab, index) => {
                                return <TabPanel key={index} value={value} index={index} >
                                    <Card>
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

                                                            tab.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                                                const { _id, patientId, status, notes, description } = row;
                                                                const selectedUser = selected.indexOf(row._id) !== -1;
                                                                return (
                                                                    <TableRow hover key={_id} tabIndex={-1} selected={selectedUser}>


                                                                        <TableCell component="th" scope="row" padding="none">
                                                                            <Stack direction="row" alignItems="center" spacing={10}>
                                                                                {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                                                <Link to={`/DME-supplier/dashboard/patient-profile/${patientId._id}`}
                                                                                    style={{ display: "block", fontSize: "small", color: "black", cursor: "pointer" }} underline="hover" nowrap="true">
                                                                                    <Tooltip title="Profile">
                                                                                        <Typography component={'span'} style={{ paddingLeft: "20px", wordWrap: "break-word" }} variant="subtitle2" nowrap="true">
                                                                                            {patientId.fullName}
                                                                                        </Typography>
                                                                                    </Tooltip>
                                                                                </Link>

                                                                            </Stack>
                                                                        </TableCell>

                                                                        <TableCell align="left">{patientId.email}</TableCell>

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
                                                                                    {notes?.note}
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
                                                                                    status === 'Pending' || status === 'Cancelled' ? 'warning' : 'success'}>{sentenceCase(status)}</Label>
                                                                        </TableCell>
                                                                        <TableCell align="left">{"Not Mentioned"}</TableCell>



                                                                        <TableCell >
                                                                            <PopOver
                                                                                key={row._id}
                                                                                source='order-page'
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
                                                                );
                                                            })}

                                                        {newReferralEmptyRows > 0 || (
                                                            <TableRow style={{ height: 53 * newReferralEmptyRows }}>
                                                                <TableCell colSpan={6} />
                                                            </TableRow>
                                                        )}

                                                    </TableBody>

                                                    {tab === filteredNewReferralOrders && newReferralIsNotFound && (
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
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
                                                    {
                                                        tab === filteredCancelledOrders && cancelledOrderIsNotFound && (
                                                            <TableBody>
                                                                <TableRow>
                                                                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
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
                                                    {
                                                        tab === filteredEvaluationOrder && evaluationOrderIsNotFound && (
                                                            <TableBody>
                                                                <TableRow>
                                                                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
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
                                                    {
                                                        tab === filteredEvaluationCompletedOrder && evaluationCompletedOrderIsNotFound && (
                                                            <TableBody>
                                                                <TableRow>
                                                                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
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
                                                    {
                                                        tab === filteredPaperWorkOrder && paperWorkOrderIsNotFound && (
                                                            <TableBody>
                                                                <TableRow>
                                                                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
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
                                                    {
                                                        tab === filteredPriorAuthOrder && priorAuthOrderIsNotFound && (
                                                            <TableBody>
                                                                <TableRow>
                                                                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
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
                                                    {
                                                        tab === filteredPriorAuthReceiveOrder && priorAuthReceiveOrderIsNotFound && (
                                                            <TableBody>
                                                                <TableRow>
                                                                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
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
                                                    {
                                                        tab === filteredHoldingRtoOrder && holdingRtoOrderIsNotFound && (
                                                            <TableBody>
                                                                <TableRow>
                                                                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
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
                                                    {
                                                        tab === filteredRtoOrder && rtoOrderIsNotFound && (
                                                            <TableBody>
                                                                <TableRow>
                                                                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
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
                                                    {
                                                        tab === filteredDeliveredOrder && deliveredOrderIsNotFound && (
                                                            <TableBody>
                                                                <TableRow>
                                                                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
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
                                                    {
                                                        tab === filteredAuthorizationExpirationOrder && authorizationExpirationOrderIsNotFound && (
                                                            <TableBody>
                                                                <TableRow>
                                                                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
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
                                                    {
                                                        tab === filteredRequestOrder && requestOrderIsNotFound && (
                                                            <TableBody>
                                                                <TableRow>
                                                                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
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

                                        {tab === filteredNewReferralOrders && (
                                            <TablePagination
                                                rowsPerPageOptions={[5, 10, 25]}
                                                component="div"
                                                count={newReferralOrders.length}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                            />
                                        )
                                        }
                                        {
                                            tab === filteredCancelledOrders && (
                                                <TablePagination
                                                    rowsPerPageOptions={[5, 10, 25]}
                                                    component="div"
                                                    count={cancelledOrders.length}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    onPageChange={handleChangePage}
                                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                                />
                                            )
                                        }
                                        {
                                            tab === filteredEvaluationOrder && (
                                                <TablePagination
                                                    rowsPerPageOptions={[5, 10, 25]}
                                                    component="div"
                                                    count={evaluationOrders.length}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    onPageChange={handleChangePage}
                                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                                />
                                            )
                                        }
                                        {
                                            tab === filteredEvaluationCompletedOrder && (
                                                <TablePagination
                                                    rowsPerPageOptions={[5, 10, 25]}
                                                    component="div"
                                                    count={evaluationCompletedOrders.length}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    onPageChange={handleChangePage}
                                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                                />
                                            )
                                        }
                                        {
                                            tab === filteredPaperWorkOrder && (
                                                <TablePagination
                                                    rowsPerPageOptions={[5, 10, 25]}
                                                    component="div"
                                                    count={paperWorkOrders.length}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    onPageChange={handleChangePage}
                                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                                />
                                            )
                                        }
                                        {
                                            tab === filteredPriorAuthOrder && (
                                                <TablePagination
                                                    rowsPerPageOptions={[5, 10, 25]}
                                                    component="div"
                                                    count={priorAuthOrders.length}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    onPageChange={handleChangePage}
                                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                                />
                                            )
                                        }
                                        {
                                            tab === filteredPriorAuthReceiveOrder && (
                                                <TablePagination
                                                    rowsPerPageOptions={[5, 10, 25]}
                                                    component="div"
                                                    count={priorAuthReceiveOrders.length}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    onPageChange={handleChangePage}
                                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                                />
                                            )
                                        }
                                        {
                                            tab === filteredHoldingRtoOrder && (
                                                <TablePagination
                                                    rowsPerPageOptions={[5, 10, 25]}
                                                    component="div"
                                                    count={holdingRtoOrders.length}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    onPageChange={handleChangePage}
                                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                                />
                                            )
                                        }
                                        {
                                            tab === filteredRtoOrder && (
                                                <TablePagination
                                                    rowsPerPageOptions={[5, 10, 25]}
                                                    component="div"
                                                    count={rtoOrders.length}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    onPageChange={handleChangePage}
                                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                                />
                                            )
                                        }
                                        {
                                            tab === filteredDeliveredOrder && (
                                                <TablePagination
                                                    rowsPerPageOptions={[5, 10, 25]}
                                                    component="div"
                                                    count={deliveredOrders.length}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    onPageChange={handleChangePage}
                                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                                />
                                            )
                                        }
                                        {
                                            tab === filteredAuthorizationExpirationOrder && (
                                                <TablePagination
                                                    rowsPerPageOptions={[5, 10, 25]}
                                                    component="div"
                                                    count={authorizationExpirationOrders.length}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    onPageChange={handleChangePage}
                                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                                />
                                            )
                                        }
                                        {
                                            tab === filteredRequestOrder && (
                                                <TablePagination
                                                    rowsPerPageOptions={[5, 10, 25]}
                                                    component="div"
                                                    count={requestOrders.length}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    onPageChange={handleChangePage}
                                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                                />
                                            )
                                        }
                                    </Card>
                                </TabPanel>
                            })
                            :
                            <TableBody>
                                <TableRow>
                                    <TableCell align="center" colSpan={12} sx={{ py: 3 }}>

                                        <p
                                        >Not orders found</p>


                                    </TableCell>
                                </TableRow>
                            </TableBody>
                    }




                </Box >
            </Container >
        </>
    );
}
