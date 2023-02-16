import { Box, Button, CircularProgress, Container, Stack, Tab, Tabs, Typography, } from '@mui/material';
import React, { useEffect, useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { DayPicker } from 'react-day-picker';
import { AuthRequest } from '../../../services/AuthRequest';
import Iconify from "../../../components/iconify"
import { parseISO } from 'date-fns';




const VeteranOrder = () => {

    const [value, setValue] = useState(0);
    const navigate = useNavigate()
    const [range, setRange] = useState([{
        from: "temp"
    }]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [updatedOrder, setUpdatedOrder] = useState([]);

    let footer = <p>Select Range of days</p>

    const { id } = JSON.parse(localStorage.getItem('user'));


    const { isLoading: statesLoading, data: orders } = useQuery('veteranOrders',
        async () => {
            return AuthRequest.get(`/api/v1/veteran-order/creator/${id}`).then(data => data.data.data)
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
        if (path === "/DME-supplier/dashboard/veteran-order") return setValue(0)
        if (path === "/DME-supplier/dashboard/veteran-order/new-repair") return setValue(1)
        if (path === "/DME-supplier/dashboard/veteran-order/rcvd-pend-schdling") return setValue(2)
        if (path === "/DME-supplier/dashboard/veteran-order/estimate-sent") return setValue(3)
        if (path === "/DME-supplier/dashboard/veteran-order/po-received") return setValue(4)
        if (path === "/DME-supplier/dashboard/veteran-order/parts-ordered-by-vamc") return setValue(5)
        if (path === "/DME-supplier/dashboard/veteran-order/parts-ordered-by-gcm") return setValue(6)
        if (path === "/DME-supplier/dashboard/veteran-order/pending-scheduling") return setValue(7)
        if (path === "/DME-supplier/dashboard/veteran-order/completed") return setValue(8)

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
            <Container maxWidth="1350px" style={{ minHeight: "120vh" }}>

                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Box>
                        <Typography component={'span'} variant="h4" gutterBottom>
                            Veteran Orders
                        </Typography>
                        {
                            orders !== "No order found!" && <Box>
                                <Button startIcon={<Iconify icon="material-symbols:filter-list" />} onClick={handleFilterClick} sx={{ mt: 2 }} variant="contained">{filterOpen ? "Close" : "Filter by date"}</Button>
                            </Box>
                        }
                    </Box>

                    <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}
                        onClick={() => { navigate('/DME-supplier/dashboard/add-order?orderCategory=veteran-order') }} >
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

                        <Tab label="Equip (No 1090)" to="/DME-supplier/dashboard/veteran-order" style={{ backgroundColor: "#f9fafc" }} component={Link} draggable="true" />

                        <Tab label="New Repair (No 1090)" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/veteran-order/new-repair" component={Link} draggable="true" />

                        <Tab label="1090 Rcvd Pend Scheduling" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/veteran-order/rcvd-pend-schdling" component={Link} draggable="true" />

                        <Tab label="Estimate Sent Pending PO#" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/veteran-order/estimate-sent" component={Link} draggable="true" />

                        <Tab label="PO Received" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/veteran-order/po-received" component={Link} draggable="true" />

                        <Tab label="Parts Ordered By VMAC" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/veteran-order/parts-ordered-by-vamc" component={Link} draggable="true" />

                        <Tab label="Parts Ordered By GCM" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/veteran-order/parts-ordered-by-gcm" component={Link} draggable="true" />

                        <Tab label="Pending Scheduling" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/veteran-order/pending-scheduling" component={Link} draggable="true" />

                        <Tab label="Completed" style={{ backgroundColor: "#f9fafc" }} to="/DME-supplier/dashboard/veteran-order/completed" component={Link} draggable="true" />



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

export default VeteranOrder;