import { Typography } from '@mui/material';
import React from 'react';
import VeteranOrderHistory from '../OrderHistory/VeteranOrderHistory';
import { useOutletContext } from 'react-router-dom';

const VeteranStatesOrderHistory = () => {
    const { veteranCurrentOrderHistory } = useOutletContext();


    return (
        <div>

            {
                veteranCurrentOrderHistory.length !== 0 && <div className="repaireOrder">
                    <Typography variant='h6' sx={{ pb: 1 }}>Repair Order</Typography>
                    <VeteranOrderHistory orders={veteranCurrentOrderHistory} fromPage={"ClientOrderHistory"} />
                </div>
            }

            {
                veteranCurrentOrderHistory.length === 0 &&
                <Typography variant='body' sx={{ py: 10, display: "block", textAlign: "center" }}>No Order History!</Typography>
            }
        </div>
    );
};

export default VeteranStatesOrderHistory;