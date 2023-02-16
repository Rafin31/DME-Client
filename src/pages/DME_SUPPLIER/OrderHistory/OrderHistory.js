import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthRequest } from '../../../services/AuthRequest';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EquipmentOrderHistory from './EquipmentOrderHistory';
import RepairOrderHistory from './RepairOrderHistory';
import VeteranOrderHistory from './VeteranOrderHistory';

const OrderHistory = () => {

    const { id } = useParams()
    const navigate = useNavigate()

    const { isLoading: equipmentOrderLoading, data: equipmentOrder } = useQuery(`equipmentOrders-${id}`,
        async () => {
            return AuthRequest.get(`/api/v1/order/archive-orders/${id}`,).then(data => data.data.data)
        }
    )
    const { isLoading: repairOrderLoading, data: repairOrder } = useQuery(`repairOrders-${id}`,
        async () => {
            return AuthRequest.get(`/api/v1/repair-order/archive-orders/${id}`,).then(data => data.data.data)
        }
    )
    const { isLoading: veteranOrderLoading, data: veteranOrder } = useQuery(`veteranOrders-${id}`,
        async () => {
            return AuthRequest.get(`/api/v1/veteran-order/archive-orders/${id}`,).then(data => data.data.data)
        }
    )


    if (equipmentOrderLoading || repairOrderLoading || veteranOrderLoading) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }


    return (
        <>

            <Container maxWidth="1350px">
                <Typography variant='h5' sx={{ pb: 3 }}>Order History</Typography>

                <Stack onClick={() => navigate(-1)} direction="row" spacing={1} style={{ cursor: "pointer", marginBottom: "15px", }} sx={{
                    "&:hover": {
                        color: "#3498db",
                    },
                }} >
                    <ArrowBackIcon /> <span>Back</span>
                </Stack>

                {
                    equipmentOrder?.length !== 0 && <div className="eqipmentOrder">
                        <Typography variant='h6' sx={{ pb: 1 }}>Equipment Order</Typography>
                        <EquipmentOrderHistory orders={equipmentOrder} />
                    </div>
                }
                {
                    repairOrder?.length !== 0 && <div className="repaireOrder">
                        <Typography variant='h6' sx={{ pb: 1 }}>Repair Order</Typography>
                        <RepairOrderHistory orders={repairOrder} />
                    </div>
                }

                {
                    veteranOrder?.length !== 0 && <div className="veteranOrder">
                        <Typography variant='h6' sx={{ pb: 1 }}>Veteran Order</Typography>
                        <VeteranOrderHistory orders={veteranOrder} />
                    </div>
                }
                {
                    equipmentOrder?.length === 0 && repairOrder?.length === 0 && veteranOrder?.length === 0 &&
                    <Typography variant='body' sx={{ py: 10, display: "block", textAlign: "center" }}>No Order History!</Typography>
                }


            </Container>

        </>
    );
};

export default OrderHistory;

