import React, { useContext } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, CircularProgress, Container, Stack, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { userContext } from 'src/Context/AuthContext';
import { AuthRequest } from 'src/services/AuthRequest';
import { useQuery } from 'react-query';
import RepairOrderHistory from './OrderHistory/RepairOrderHistory';
import EquipmentOrderHistory from './OrderHistory/EquipmentOrderHistory';
import { useConfirm } from 'material-ui-confirm';
import { toast } from 'react-toastify';

const PatientStates = () => {

    const { id } = useParams()
    const navigate = useNavigate()

    const confirm = useConfirm();

    const { loggedInUser } = useContext(userContext)
    const user = loggedInUser()



    const fetchData = async (patientId) => {
        const equipmentPromise = AuthRequest.get(`/api/v1/order/patient/${patientId}`).then(data => data.data.data);
        const repairPromise = AuthRequest.get(`/api/v1/repair-order/patient/${patientId}`).then(data => data.data.data);

        const [equipmentOrder, repairOrder] = await Promise.all([equipmentPromise, repairPromise]);

        return { equipmentOrder, repairOrder };
    }



    const { isLoading, refetch, data } = useQuery(`combinedOrderData-${id}`, () => fetchData(id));



    if (isLoading) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }
    const { equipmentOrder, repairOrder } = data

    const deleteEquipmentOrder = async (id) => {
        try {
            confirm({
                description: "Are you sure you want to Delete this order Permanently?",
                confirmationText: "Yes",
                confirmationButtonProps: { variant: "outlined", color: "error" },
            })
                .then(() => {
                    toast.promise(
                        AuthRequest.delete(`/api/v1/order/${id}`)
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


    return (
        <Container maxWidth="1350px">
            <Stack onClick={() => navigate(-1)} direction="row" spacing={1} style={{ cursor: "pointer", marginBottom: "15px", width: "150px" }} sx={{
                "&:hover": {
                    color: "#3498db",
                },
            }} >
                <ArrowBackIcon /> <span>Back</span>
            </Stack>

            {
                equipmentOrder !== "No order found!" && <div className="eqipmentOrder">
                    <Typography variant='h6' sx={{ pb: 1 }}>Equipment Order</Typography>
                    <EquipmentOrderHistory orders={equipmentOrder} fromPage={"patientStates"} />
                </div>
            }
            {
                repairOrder !== "No order found!" && <div className="repaireOrder">
                    <Typography variant='h6' sx={{ pb: 1 }}>Repair Order</Typography>
                    <RepairOrderHistory orders={repairOrder} fromPage={"patientStates"} />
                </div>
            }

            {
                equipmentOrder === "No order found!" && repairOrder === "No order found!" &&
                <Typography variant='body' sx={{ py: 10, display: "block", textAlign: "center" }}>No Order History!</Typography>
            }
        </Container>
    );
};

export default PatientStates;