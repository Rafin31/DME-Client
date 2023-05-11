import { Typography } from '@mui/material';
import React from 'react';
import EquipmentOrderHistory from '../OrderHistory/EquipmentOrderHistory';
import RepairOrderHistory from '../OrderHistory/RepairOrderHistory';
import { useOutletContext } from 'react-router-dom';

const ClientOrderHistory = () => {
    const { equipmentOrderHistory, repairOrderHistory } = useOutletContext();


    return (
        <div>
            {
                equipmentOrderHistory.length !== 0 && <div className="eqipmentOrder" style={{ marginTop: "15px" }}>
                    <Typography variant='h6' sx={{ pb: 1 }}>Equipment Order</Typography>
                    <EquipmentOrderHistory orders={equipmentOrderHistory} fromPage={"ClientOrderHistory"} />
                </div>
            }
            {
                repairOrderHistory.length !== 0 && <div className="repaireOrder">
                    <Typography variant='h6' sx={{ pb: 1 }}>Repair Order</Typography>
                    <RepairOrderHistory orders={repairOrderHistory} fromPage={"ClientOrderHistory"} />
                </div>
            }

            {
                equipmentOrderHistory.length === 0 && repairOrderHistory.length === 0 &&
                <Typography variant='body' sx={{ py: 10, display: "block", textAlign: "center" }}>No Order History!</Typography>
            }
        </div>
    );
};

export default ClientOrderHistory;