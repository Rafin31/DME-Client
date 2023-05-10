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
import { useConfirm } from 'material-ui-confirm';


const TABLE_HEAD = [
    { id: 'dob', label: 'Date of Birth', alignRight: false },
    { id: 'Fname', label: 'Full  Name', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'gender', label: 'Gender', alignRight: false },
    { id: 'action', label: 'Action', alignRight: false },
    // { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {

    if (orderBy === "Fname") {
        if (b.userId.fullName < a.userId.fullName) {
            return -1;
        }
        if (b.userId.fullName > a.userId.fullName) {
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
    if (orderBy === "dob") {
        const dateA = new Date(a.dob);
        const dateB = new Date(b.dob);

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
    const stabilizedThis = array?.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => _user.userId.fullName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}



export default function PatientPage() {
    const [open, setOpen] = useState(null);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const navigate = useNavigate()

    const importButtonRef = useRef(null)


    let { staffId } = JSON.parse(localStorage.getItem('user'));
    let { id: dmeSupplierId } = JSON.parse(localStorage.getItem('user'));

    const options = [
        { label: "Edit" },
        { label: "Note" },
        { label: "Documents" },
        { label: "Order History" },
    ];

    if (!staffId) {
        options.push({ label: "Delete" });
    }

    const confirm = useConfirm();

    const { isLoading: patientLoading, refetch, data: patient } = useQuery('patient',
        async () => {
            return AuthRequest.get(`/api/v1/patient/byDmeSupplier?dmeSupplier=${dmeSupplierId}`).then(data => data.data.data)
        }
    )

    const { mutateAsync, isLoading: importPatientLoading } = useMutation((importPatient) => {

        return AuthRequest.post(`/api/v1/users/import-patient`, importPatient,
            {
                headers: { "Content-Type": "multipart/form-data" }
            }
        )
            .then(res => {
                toast.success("Import Successful!", res, {
                    toastId: 'success11'
                })
                refetch()
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message, {
                    toastId: 'error11'
                })
            })
    })


    if (!patient || importPatientLoading || patientLoading) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }

    const handleImportButtonClick = (e) => {
        e.preventDefault()
        importButtonRef.current.click()
    }

    const handleImportFormSubmit = (e) => {
        e.preventDefault()
        const file = e.target.importFile.files[0]
        const formData = new FormData()
        formData.append('patient-list', file)

        if (!!formData.entries().next().value) {
            mutateAsync(formData)

        } else {
            toast.warning('Please Upload documents', {
                toastId: "warning1"
            })
        }
    }

    const exportPatient = async () => {

        const resp = await AuthRequest.get("/api/v1/users/export-patient", {
            responseType: 'arraybuffer',
            headers: { 'Content-Type': 'blob' },
        })

        const link = document.createElement('a');
        const fileName = 'Patient-List.xlsx';
        link.setAttribute('download', fileName);
        link.href = URL.createObjectURL(new Blob([resp.data]));
        document.body.appendChild(link);
        link.click();
        link.remove();
    }


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

    // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - patient.length) : 0;

    const filteredUsers = applySortFilter(patient, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    const deletePatient = (id) => {
        try {
            confirm({
                description: "Are you sure you want to Delete this Patient Permanently?",
                confirmationText: "Yes",
                confirmationButtonProps: { variant: "outlined", color: "error" },
            })
                .then(() => {
                    toast.promise(
                        AuthRequest.delete(`/api/v1/patient/${id}`)
                            .then((res) => {
                                refetch();

                            })
                            .catch((err) => {
                                return
                            }),
                        {
                            pending: "Deleting Patient...",
                            success: "Patient Deleted",
                            error: "Something Went Wrong!",
                        },
                        {
                            toastId: "deleteOrder",
                        }
                    );
                })
                .catch(() => {
                    return
                });
        } catch (err) {
            console.error(err);
        }
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
                <title> Clients</title>
            </Helmet>

            <Container maxWidth="1350px">
                <Stack sx={{ flexDirection: { xs: "column", md: "row" } }} alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Clients
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={1}
                        divider={<Divider orientation="vertical" flexItem />}>

                        {
                            !staffId &&
                            <>
                                <Tooltip
                                    title="File type should be xlsx. And the colum sequence should be First name > Last name > Full name > Email > Password > Category > Gender > Date of Birth > Weight > Country > City > State > Address > Primary Insurance > Secondary Insurance > Phone Number > DME Supplier ID. 
                                    Collect the DME Supplier ID from DME Supplier Profile"
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
                                    onClick={() => { exportPatient() }}
                                    startIcon={<Iconify icon="mdi:calendar-export" />}>
                                    Export
                                </Button>
                            </>
                        }






                        <Button variant="contained" startIcon={<Iconify icon="material-symbols:add" />}
                            onClick={() => { navigate('/DME-supplier/dashboard/add-patient') }}>
                            New Patient
                        </Button>
                    </Stack>
                </Stack>

                <Card className='new-referal'>

                    <input type="text"
                        style={{
                            margin: "20px 15px",
                            padding: "10px 5px",
                            width: "220px"
                        }}
                        placeholder="Search by Full Name"
                        value={filterName}
                        onChange={handleFilterByName} />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table size="small">
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={patient.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                />
                                <TableBody>
                                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const { userId, dob, gender } = row;
                                        const selectedUser = selected.indexOf(userId.fullName) !== -1;

                                        return (
                                            <TableRow hover key={userId._id} tabIndex={-1} selected={selectedUser}>
                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={10}>
                                                        {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                        <Typography style={{ paddingLeft: "20px" }} variant="subtitle2" nowrap="true">
                                                            {dob}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">
                                                    <Tooltip title="Profile">
                                                        <Link to={`/DME-supplier/dashboard/patient-states/${userId._id}`}
                                                            style={{ display: "inline", fontSize: "small", color: "black", cursor: "pointer" }} underline="hover" nowrap="true">
                                                            {userId.fullName}
                                                        </Link>
                                                    </Tooltip>
                                                </TableCell>

                                                <TableCell align="left">{userId.email}</TableCell>
                                                <TableCell align="left">{gender}</TableCell>

                                                <TableCell >
                                                    <PopOver
                                                        key={userId._id}
                                                        source="patient-page"
                                                        option={options}
                                                        id={userId._id}
                                                        deletePatient={deletePatient}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
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
                                {patient.length === 0 && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                <Paper
                                                    sx={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Typography variant="body2">
                                                        No Patient found  &nbsp;
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
                        count={patient.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>

            </Container>


            {/* Edit Delete Pop Over */}

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                style={{ border: '2px solid red' }}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        p: 1,
                        width: 140,
                        '& .MuiMenuItem-root': {
                            px: 1,
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}
            >
                <MenuItem>
                    <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                    Edit
                </MenuItem>

                <MenuItem sx={{ color: 'error.main' }}>
                    <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                    Delete
                </MenuItem>
            </Popover>
        </>
    );
}
