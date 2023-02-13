import { Box, Button, CircularProgress, Container, Stack, Tab, Tabs, Typography, } from '@mui/material';
import React, { useEffect, useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { DayPicker } from 'react-day-picker';
import { AuthRequest } from '../../../services/AuthRequest';
import Iconify from "../../../components/iconify"
import { parseISO } from 'date-fns';


const EquipmentOrder = () => {

    const [value, setValue] = useState(0);
    const navigate = useNavigate()
    const [range, setRange] = useState([{
        from: "temp"
    }]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [updatedOrder, setUpdatedOrder] = useState([]);

    let footer = <p>Select Range of days</p>
    const { id } = JSON.parse(localStorage.getItem('user'));


    const { isLoading: statesLoading, data: orders } = useQuery('equipmentOrders',
        async () => {
            return AuthRequest.get(`/api/v1/order/dme-supplier/${id}`).then(data => data.data.data)
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
        if (path === "/DME-supplier/dashboard/equipment-order") return setValue(0)
        if (path === "/DME-supplier/dashboard/equipment-order/cancelled-order") return setValue(1)
        if (path === "/DME-supplier/dashboard/equipment-order/evaluation") return setValue(2)
        if (path === "/DME-supplier/dashboard/equipment-order/evaluation-completed") return setValue(3)
        if (path === "/DME-supplier/dashboard/equipment-order/paperWork-in-process") return setValue(4)
        if (path === "/DME-supplier/dashboard/equipment-order/prior-auth-status") return setValue(5)
        if (path === "/DME-supplier/dashboard/equipment-order/prior-auth-received") return setValue(6)
        if (path === "/DME-supplier/dashboard/equipment-order/holding-RTO") return setValue(7)
        if (path === "/DME-supplier/dashboard/equipment-order/RTO") return setValue(8)
        if (path === "/DME-supplier/dashboard/equipment-order/delivered") return setValue(9)
        if (path === "/DME-supplier/dashboard/equipment-order/authorization-expirations-F/U") return setValue(10)
        if (path === "/DME-supplier/dashboard/equipment-order/order-request") return setValue(11)

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
            <Container maxWidth="xl" style={{ minHeight: "120vh" }}>

                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Box>
                        <Typography component={'span'} variant="h4" gutterBottom>
                            Equipment Orders
                        </Typography>
                        {
                            orders !== "No order found!" && <Box>
                                <Button startIcon={<Iconify icon="material-symbols:filter-list" />} onClick={handleFilterClick} sx={{ mt: 2 }} variant="contained">{filterOpen ? "Close" : "Filter by date"}</Button>
                            </Box>
                        }
                    </Box>

                    <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}
                        onClick={() => { navigate('/DME-supplier/dashboard/add-order?orderCategory=equipment-order') }} >
                        New Order
                    </Button>
                </Stack>


                <DayPicker
                    mode="range"
                    selected={range}
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

                        <Tab label="New Referral" to="/DME-supplier/dashboard/equipment-order" style={{ backgroundColor: "#f9fafc" }} component={Link} draggable="true" />

                        <Tab label="Cancelled Order" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/equipment-order/cancelled-order" component={Link} draggable="true" />

                        <Tab label="Evaluation" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/equipment-order/evaluation" component={Link} draggable="true" />

                        <Tab label="Evaluation Completed" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/equipment-order/evaluation-completed" component={Link} draggable="true" />

                        <Tab label="PaperWork in Process" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/equipment-order/paperWork-in-process" component={Link} draggable="true" />

                        <Tab label="Prior Auth Status" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/equipment-order/prior-auth-status" component={Link} draggable="true" />

                        <Tab label="Prior Auth Received" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/equipment-order/prior-auth-received" component={Link} draggable="true" />

                        <Tab label="Holding RTO" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/equipment-order/holding-RTO" component={Link} draggable="true" />

                        <Tab label="RTO" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/equipment-order/RTO" component={Link} draggable="true" />

                        <Tab label="Delivered" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/equipment-order/delivered" component={Link} draggable="true" />

                        <Tab label="Authorization Expirations F/U" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/equipment-order/authorization-expirations-F/U" component={Link} draggable="true" />

                        <Tab label="Order Request" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/equipment-order/order-request" component={Link} draggable="true" />


                    </Tabs>
                </Box>
                {
                    !orders || orders === "No order found!" ?

                        <p className='text-center'>No Order Found</p>

                        :
                        <main>
                            {
                                range?.from && range?.to ?
                                    <Outlet context={[statesLoading, updatedOrder]} />
                                    :
                                    <Outlet context={[statesLoading, orders]} />
                            }
                        </main>
                }
            </Container>
        </>
    );
};

export default EquipmentOrder;