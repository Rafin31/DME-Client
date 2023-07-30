import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';

import { useRef, useState } from 'react';


// @mui
import {
    Card,
    Table,
    Stack,
    Paper,
    Button,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination,
    Box,
    Divider,
    Tooltip,
    CircularProgress,
} from '@mui/material';
// components
import { toast } from 'react-toastify';
import { useMutation, useQuery } from 'react-query';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import PopOver from '../../components/Popover/PopOver';
// sections
import { UserListHead } from '../../sections/@dashboard/user';
import { AuthRequest } from '../../services/AuthRequest';
import AddVAProstheticsToVeteran from '../Shared/AddVAProstheticsToVeteran';


const TABLE_HEAD = [
    { id: 'id', label: 'ID#', alignRight: false },
    { id: 'Fname', label: 'Full  Name', alignRight: false },
    { id: 'lastFour', label: 'Last  Four#', alignRight: false },
    { id: 'phone', label: 'Phone#', alignRight: false },
    { id: 'city', label: 'City', alignRight: false },
    { id: 'assignedVA', label: 'Assigned VA', alignRight: false },
    { id: 'action', label: 'Action', alignRight: false },
    // { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {

    if (orderBy === "id") {
        if (b.userId._id < a.userId._id) {
            return -1;
        }
        if (b.userId._id > a.userId._id) {
            return 1;
        }
    }

    if (orderBy === "Fname") {
        if (b.userId.lastName < a.userId.lastName) {
            return -1;
        }
        if (b.userId.lastName > a.userId.lastName) {
            return 1;
        }
    }
    if (orderBy === "email") {
        if (b.userId.email < a.userId.email) {
            return -1;
        }
        if (b.userId.email > a.userId.email) {
            return 1;
        }
    }
    if (orderBy === "lastFour") {
        if (b.lastFour < a.lastFour) {
            return -1;
        }
        if (b.lastFour > a.lastFour) {
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
    const stabilizedThis = array?.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => _user.userId.fullName.toLowerCase().indexOf(query.toLowerCase()) !== -1 || _user.userId._id.substring(_user.userId._id.length - 4, _user.userId._id.length).toLowerCase().indexOf(query.toLowerCase()) !== -1 || _user.lastFour.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function VeteranPage() {
    const [addedVeteran, setAddedVeteran] = useState();

    const [inviteOpen, setInviteOpen] = useState(false)

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(100);

    const [invitedVeteran, setVeteranId] = useState()

    const navigate = useNavigate()

    const importButtonRef = useRef(null)

    let { staffId } = JSON.parse(localStorage.getItem('user'));
    let { id: dmeSupplierId } = JSON.parse(localStorage.getItem('user'));


    const { isLoading: veteranLoading, refetch: veteranRefetch, data: veteran } = useQuery(
        ["veteran", addedVeteran !== null && addedVeteran],
        async () => {
            return AuthRequest.get(`/api/v1/veteran/byDmeSupplier?dmeSupplier=${dmeSupplierId}`).then(data => data.data.data)
        }
    )

    const { isLoading: vaProstheticsLoading, data: vaProsthetics } = useQuery('registered-va-prosthetics',
        async () => {
            return AuthRequest.get(`/api/v1/va-staff`).then(data => data.data.data)
        }
    )

    const { mutateAsync: addVaToVeteran, isLoading: addVALoading } = useMutation((data) => {
        return AuthRequest.post(`/api/v1/dme/add-va-to-veteran`, data)
            .then(res => {
                veteranRefetch()
                toast.success('VA successfully assigned to the Veteran', {
                    toastId: "success100"
                })
            })
            .catch(err => {
                veteranRefetch()
                toast.error(err.response.data.data, {
                    toastId: "error109"
                })
            })
    })

    const { mutateAsync: importVeteran, isLoading: importDoctorLoading } = useMutation((importVeteran) => {

        return AuthRequest.post(`/api/v1/users/import-veteran`, importVeteran,
            {
                headers: { "Content-Type": "multipart/form-data" }
            }
        )
            .then(res => {
                toast.success("Import Successful!", res, {
                    toastId: 'success11w98'
                })
                veteranRefetch()
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message, {
                    toastId: 'error13e541'
                })
            })
    })

    if (!veteran || veteranLoading || addVALoading || importDoctorLoading) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }

    const handelAddVaProsthetics = async (e) => {
        e.preventDefault()

        if (!e.target.veteran.value || !e.target.addVAtoVeteran.value) {
            return toast.error("All fields are required!", {
                toastId: "error1099"
            })
        }

        const data = {
            veteranId: invitedVeteran,
            vaProstheticId: e.target.addVAtoVeteran.value
        }
        setInviteOpen(!inviteOpen)
        addVaToVeteran(data)

    };


    const exportVeteran = async () => {

        const resp = await AuthRequest.get(`/api/v1/users/export-veteran?dmeSupplier=${dmeSupplierId}`, {
            responseType: 'arraybuffer',
            headers: { 'Content-Type': 'blob' },
        })

        const link = document.createElement('a');
        const fileName = 'Veterans-List.xlsx';
        link.setAttribute('download', fileName);
        link.href = URL.createObjectURL(new Blob([resp.data]));
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    const handleImportButtonClick = (e) => {
        e.preventDefault()
        importButtonRef.current.click()
    }

    const handleImportFormSubmit = (e) => {
        e.preventDefault()
        const file = e.target.importFile.files[0]
        const formData = new FormData()
        formData.append('veteran-list', file)

        if (!!formData.entries().next().value) {
            importVeteran(formData)

        } else {
            toast.warning('Please Upload documents', {
                toastId: "warning1"
            })
        }
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


    const filteredUsers = applySortFilter(veteran, getComparator(order, orderBy), filterName);
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
                <title> Veterans</title>
            </Helmet>

            <Container maxWidth="1350px">
                <Stack sx={{ flexDirection: { xs: "column", md: "row" } }} alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Veterans
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={1}
                        divider={<Divider orientation="vertical" flexItem />}>

                        <Stack direction="row" alignItems="center" justifyContent="center" gap={1} >
                            {
                                !staffId && <>
                                    <Tooltip
                                        title="File type should be xlsx.There might be a column heading, but data should start from the second row.The colum sequence should be, First name > Last name > Full name > last Four > Email > Password > User Category > Zip > City > State > Address > Phone Number > DME-Supplier ID"
                                        arrow
                                        placement="left">
                                        <Iconify style={{ marginTop: "5px" }} icon="material-symbols:info-outline" color="#2065d1" />
                                    </Tooltip>

                                    <form onSubmit={(e) => handleImportFormSubmit(e)}>
                                        <Button
                                            variant="contained"
                                            component="label"
                                            color="success"
                                            style={{ color: "white", width: "110px" }}
                                            startIcon={<Iconify icon="ri:file-excel-2-fill" />}>
                                            Import
                                            <input name="importFile" hidden type="file" onChange={(e) => handleImportButtonClick(e)} />
                                        </Button>
                                        <input ref={importButtonRef} hidden type="submit" />
                                    </form>


                                    <Button
                                        variant="contained"
                                        component="label"
                                        color="warning"
                                        style={{ color: "white", width: "110px" }}
                                        onClick={() => { exportVeteran() }}
                                        startIcon={<Iconify icon="mdi:calendar-export" />}>
                                        Export
                                    </Button>
                                </>
                            }

                            <Button variant="contained" startIcon={<Iconify icon="material-symbols:add" />}
                                onClick={() => { navigate('/DME-supplier/dashboard/add-veteran') }}>
                                New Veteran
                            </Button>

                        </Stack>
                    </Stack>
                </Stack>

                <AddVAProstheticsToVeteran open={inviteOpen} setOpen={setInviteOpen} handelFormSubmit={handelAddVaProsthetics} vaProsthetics={vaProsthetics} veteran={addedVeteran} title="Add VA Prosthetics" setVeteranId={setVeteranId} />

                <Card className='new-referal'>

                    <input type="text"
                        style={{
                            margin: "20px 15px",
                            padding: "10px 5px",
                            width: "220px"
                        }}
                        placeholder="Full Name or Last four or ID#"
                        value={filterName}
                        onChange={handleFilterByName} />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table size="small">
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={veteran.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                />
                                <TableBody>
                                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const { userId, phoneNumber, city, assignedVaProsthetic, lastFour } = row;
                                        const selectedUser = selected.indexOf(userId.fullName) !== -1;

                                        return (
                                            <TableRow hover key={userId._id} tabIndex={-1} selected={selectedUser}>
                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={10}>
                                                        {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                        <Typography style={{ paddingLeft: "20px" }} variant="subtitle2" nowrap="true">
                                                            {userId._id.substring(userId._id.length - 4, userId._id.length)}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">
                                                    <Tooltip title="Veteran States">
                                                        <Link to={`/DME-supplier/dashboard/veteran-states/${userId._id}`}
                                                            style={{ display: "inline", fontSize: "small", color: "black", cursor: "pointer" }} underline="hover" nowrap="true">
                                                            {userId.fullName}
                                                        </Link>
                                                    </Tooltip>
                                                </TableCell>

                                                <TableCell align="left">{lastFour ? lastFour : "Not Given!"}</TableCell>
                                                <TableCell align="left">{!phoneNumber ? "Not Given!" : phoneNumber}</TableCell>
                                                <TableCell align="left">{!city ? "Not Given!" : city}</TableCell>

                                                <TableCell align="left">
                                                    {
                                                        !assignedVaProsthetic || assignedVaProsthetic.length !== 0 ?
                                                            assignedVaProsthetic[assignedVaProsthetic.length - 1].fullName
                                                            : "No one is Assigned!"
                                                    }
                                                </TableCell>

                                                <TableCell >
                                                    <PopOver
                                                        key={userId._id}
                                                        source="veteran-page"
                                                        option={[
                                                            { label: "Profile" },
                                                            { label: "Edit" },
                                                            { label: "Notes" },
                                                            { label: "Documents" },
                                                            { label: "Add VA Prosthetics" },
                                                            { label: "Order History" },
                                                        ]}
                                                        id={userId._id}
                                                        setAddVaModalOpen={setInviteOpen}
                                                        setAddedVeteran={setAddedVeteran}
                                                        user={userId}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>

                                {isNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
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
                                {veteran.length === 0 && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
                                                <Paper
                                                    sx={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Typography variant="body2">
                                                        No Veterans found  &nbsp;
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
                        rowsPerPageOptions={[100, 50, 25]}
                        component="div"
                        count={veteran.length}
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
