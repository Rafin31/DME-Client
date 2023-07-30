import { Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import VeteranOrderHistory from '../OrderHistory/VeteranOrderHistory';
import { useConfirm } from 'material-ui-confirm';
import { toast } from 'react-toastify';
import { AuthRequest } from 'src/services/AuthRequest';

const VeteranCurrentOrders = () => {

    let { refetch, veteranCurrentOrder } = useOutletContext();

    const confirm = useConfirm();

    const deleteVeteranCurrentOrder = useCallback(async (id) => {
        try {
            confirm({
                description: "Are you sure you want to Delete this order Permanently?",
                confirmationText: "Yes",
                confirmationButtonProps: { variant: "outlined", color: "error" },
            })
                .then(() => {
                    toast.promise(
                        AuthRequest.delete(`/api/v1/veteran-order/${id}`)
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
    }, [confirm, refetch])


    veteranCurrentOrder = veteranCurrentOrder !== "No order found!" ? veteranCurrentOrder.filter(eq => eq.status !== "Archived") : []





    return (
        <div>
            {
                veteranCurrentOrder.length !== 0 && <div className="eqipmentOrder">
                    <Typography variant='h6' sx={{ pb: 1 }}>Current Orders</Typography>
                    <VeteranOrderHistory
                        orders={veteranCurrentOrder}
                        fromPage={"veteranStates"}
                        deleteVeteranOrder={deleteVeteranCurrentOrder}
                        refetch={refetch} />
                </div>
            }


            {
                veteranCurrentOrder.length === 0 &&
                <Typography variant='body' sx={{ py: 10, display: "block", textAlign: "center" }}>No Order History!</Typography>
            }
        </div>
    );
};

export default VeteranCurrentOrders;