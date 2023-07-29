import { Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import EquipmentOrderHistory from '../OrderHistory/EquipmentOrderHistory';
import RepairOrderHistory from '../OrderHistory/RepairOrderHistory';
import { useConfirm } from 'material-ui-confirm';
import { toast } from 'react-toastify';
import { AuthRequest } from 'src/services/AuthRequest';
import { memo } from 'react';

const ClientCurrentOrders = () => {


    let { refetch, equipmentOrder, repairOrder } = useOutletContext();

    const confirm = useConfirm();

    const deleteEquipmentOrder = useCallback(async (id) => {
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
    }, [confirm, refetch])

    const deleteRepairOrder = useCallback(async (id) => {
        console.log(id)
        try {
            confirm({
                description: "Are you sure you want to Delete this order Permanently?",
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
    }, [confirm, refetch])



    equipmentOrder = equipmentOrder !== "No order found!" ? equipmentOrder.filter(eq => eq.status !== "Archived") : []
    repairOrder = repairOrder !== "No order found!" ? repairOrder.filter(rp => rp.status !== "Archived") : []


    return (
        <div>

            {
                equipmentOrder.length !== 0 && <div className="eqipmentOrder">
                    <Typography variant='h6' sx={{ pb: 1 }}>Equipment Order</Typography>
                    {/* Here We use Equipment OrderHistory as the re-useable component. We pass the equipment current order as the parameter which is "equipmentOrder" */}
                    <EquipmentOrderHistory
                        orders={equipmentOrder}
                        refetch={refetch}
                        fromPage={"patientStates"}
                        deleteEquipmentOrder={deleteEquipmentOrder}

                    />

                </div>


            }
            {
                repairOrder.length !== 0 && <div className="repaireOrder">
                    <Typography variant='h6' sx={{ pb: 1 }}>Repair Order</Typography>
                    <RepairOrderHistory
                        orders={repairOrder}
                        refetch={refetch}
                        fromPage={"patientStates"}
                        deleteRepairOrder={deleteRepairOrder}

                    />

                </div>
            }

            {
                equipmentOrder.length === 0 && repairOrder.length === 0 &&
                <Typography variant='body' sx={{ py: 10, display: "block", textAlign: "center" }}>No Order History!</Typography>
            }
        </div>
    );
};

export default memo(ClientCurrentOrders);