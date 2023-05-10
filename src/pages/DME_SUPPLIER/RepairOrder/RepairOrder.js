import { Box, Button, CircularProgress, Container, Stack, Tab, Tabs, Typography, } from '@mui/material';
import React, { useEffect, useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { DayPicker } from 'react-day-picker';
import { AuthRequest } from '../../../services/AuthRequest';
import Iconify from "../../../components/iconify"
import { parseISO } from 'date-fns';
import { useConfirm } from 'material-ui-confirm';
import { toast } from 'react-toastify';




const RepairOrder = () => {

    const [value, setValue] = useState(0);
    const navigate = useNavigate()
    const [range, setRange] = useState([{
        from: "temp"
    }]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [updatedOrder, setUpdatedOrder] = useState([]);

    const confirm = useConfirm();

    let footer = <p>Select Range of days</p>
    const loggedUser = JSON.parse(localStorage.getItem('user'));

    const { id } = loggedUser

    const { isLoading: statesLoading, refetch, data: orders } = useQuery('repairOrders',
        async () => {
            return AuthRequest.get(`/api/v1/repair-order/dme-supplier/${id}`).then(data => data.data.data)
        }
    )

    const handleChange = useCallback((event, newValue) => {
        setValue(newValue)
    }, [])

    const handleResetClick = () => {
        setRange([])
        setUpdatedOrder([])
    }

    const handleFilterClick = () => setFilterOpen(!filterOpen);

    useEffect(() => {
        const path = window.location.pathname
        if (path === "/DME-supplier/dashboard/repair-order") return setValue(0)
        if (path === "/DME-supplier/dashboard/repair-order/cancelled-order") return setValue(1)
        if (path === "/DME-supplier/dashboard/repair-order/pending-rx") return setValue(2)
        if (path === "/DME-supplier/dashboard/repair-order/pending-assess") return setValue(3)
        if (path === "/DME-supplier/dashboard/repair-order/workup") return setValue(4)
        if (path === "/DME-supplier/dashboard/repair-order/pa-status") return setValue(5)
        if (path === "/DME-supplier/dashboard/repair-order/rto-status") return setValue(6)
        if (path === "/DME-supplier/dashboard/repair-order/pending-parts") return setValue(7)
        if (path === "/DME-supplier/dashboard/repair-order/pending-schedule") return setValue(8)
        if (path === "/DME-supplier/dashboard/repair-order/completed") return setValue(9)

        return () => {
            setValue(0)
        }

    }, [handleChange])


    useEffect(() => {

        if (range?.from && range?.to) {

            const temp = orders.filter(or => {
                return new Date(or.createdAt) >= new Date(range?.from) && new Date(or.createdAt) <= new Date(range?.to)
            })
            setUpdatedOrder(temp)
        }

        return () => {
            setUpdatedOrder([])
        }

    }, [range.from, range.to])



    const deleteOrder = async (id) => {
        try {
            confirm({
                description: "Are you sure you want to Delete this Order Permanently?",
                confirmationText: "Yes",
                confirmationButtonProps: { variant: "outlined", color: "error" },
            })
                .then(() => {
                    toast.promise(
                        AuthRequest.delete(`/api/v1/repair-order/${id}`)
                            .then((res) => {
                                refetch();

                            })
                            .catch((err) => {
                                return
                            }),
                        {
                            pending: "Deleting Order...",
                            success: "Order Deleted",
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
    };



    if (statesLoading) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }


    if (range?.from) {
        footer = (
            <p>
                <Button startIcon={<Iconify icon="material-symbols:device-reset-rounded" />} onClick={handleResetClick} variant="contained">Reset</Button>
            </p>
        )
    }



    return (
        <>
            <Container maxWidth="1350px" style={{ minHeight: "120vh" }}>

                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Box>
                        <Typography component={'span'} variant="h4" gutterBottom>
                            Repair Orders
                        </Typography>
                        {
                            orders !== "No order found!" && <Box>
                                <Button startIcon={<Iconify icon="material-symbols:filter-list" />} onClick={handleFilterClick} sx={{ mt: 2 }} variant="contained">{filterOpen ? "Close" : "Filter by date"}</Button>
                            </Box>
                        }
                    </Box>

                    <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}
                        onClick={() => { navigate('/DME-supplier/dashboard/add-order?orderCategory=repair-order') }} >
                        New Order
                    </Button>
                </Stack>


                <DayPicker
                    mode="range"
                    selected={(range)}
                    footer={footer}
                    onSelect={(e) => e.from !== " " && setRange(e)}
                    className={`calender ${filterOpen ? "showCalender" : "hideCalender"}`}
                />


                <Box>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="basic tabs example">

                        <Tab label="All Orders" to="/DME-supplier/dashboard/repair-order" style={{ backgroundColor: "#f9fafc" }} component={Link} draggable="true" />

                        <Tab label="PRR" to="/DME-supplier/dashboard/repair-order/prr-order" style={{ backgroundColor: "#f9fafc" }} component={Link} draggable="true" />

                        <Tab label="Cancelled" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/repair-order/cancelled-order" component={Link} draggable="true" />

                        <Tab label="Pending Rx" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/repair-order/pending-rx" component={Link} draggable="true" />

                        <Tab label="Pending Assess." style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/repair-order/pending-assess" component={Link} draggable="true" />

                        <Tab label="Workup" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/repair-order/workup" component={Link} draggable="true" />

                        <Tab label="PA Status" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/repair-order/pa-status" component={Link} draggable="true" />

                        <Tab label="RTO Status" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/repair-order/rto-status" component={Link} draggable="true" />

                        <Tab label="Pending Parts" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/repair-order/pending-parts" component={Link} draggable="true" />

                        <Tab label="Pending Scheduling" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/repair-order/pending-schedule" component={Link} draggable="true" />

                        <Tab label="Completed" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/repair-order/completed" component={Link} draggable="true" />


                    </Tabs>
                </Box>
                {
                    !orders || orders === "No order found!" ?

                        <p className='text-center'>No Order Found</p>

                        :
                        <main>
                            {
                                range?.from && range?.to ?
                                    <Outlet context={[statesLoading, updatedOrder, deleteOrder]} />
                                    :
                                    <Outlet context={[statesLoading, orders, deleteOrder]} />
                            }
                        </main>
                }

            </Container>
        </>
    );
};

export default RepairOrder;