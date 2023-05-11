import { Backdrop, Box, Button, CircularProgress, Fade, Modal, Typography } from '@mui/material';
import React from 'react';
import { AuthRequest } from 'src/services/AuthRequest';
import { useQuery } from 'react-query';
import EquipmentOrderPublish from '../DME_SUPPLIER/PublishOrder/EquipmentOrderPublish';
import RepairOrderPublish from '../DME_SUPPLIER/PublishOrder/RepairOrderPublish';
import { toast } from 'react-toastify';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "80%",
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '5px',
    p: 2,

};



export default function PublishNoteModal({ open, setOpen, patient, publishNote, title, ...other }) {


    const fetchData = async (patientId) => {
        const equipmentPromise = AuthRequest.get(`/api/v1/order/patient/${patientId}`).then(data => data.data.data);
        const repairPromise = AuthRequest.get(`/api/v1/repair-order/patient/${patientId}`).then(data => data.data.data);

        const [equipmentOrder, repairOrder] = await Promise.all([equipmentPromise, repairPromise]);

        return { equipmentOrder, repairOrder };
    }

    const { isLoading, data } = useQuery(`combinedOrderData-${patient._id}`, () => fetchData(patient._id));

    const publishNoteHandle = (orderId, orderType) => {
        const data = {
            notes: publishNote.note,
            writerId: publishNote.writerId,
            orderId
        }

        console.log(data)

        if (orderType === "equipment-order") {
            AuthRequest.post(`/api/v1/order/publish-notes/${orderId}`, data)
                .then(data => {
                    setOpen(!open)
                    toast.success("Note Published!")
                });
        }
        if (orderType === "repair-order") {
            AuthRequest.post(`/api/v1/repair-order/publish-notes/${orderId}`, data)
                .then(data => {
                    setOpen(!open)
                    toast.success("Note Published!")
                });
        }

    }

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >

                <Fade in={open}>
                    <Box sx={style}>

                        {
                            isLoading && <Box style={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <CircularProgress />
                            </Box>
                        }

                        <p style={{ textAlign: "center", marginBottom: "20px", fontWeight: "700", fontSize: "larger" }}>{`Current orders of ${patient.fullName}`}</p>

                        {
                            data?.equipmentOrder !== "No order found!" && <div className="eqipmentOrder">
                                <Typography variant='h6' sx={{ pb: 1 }}>Equipment Order</Typography>
                                <EquipmentOrderPublish
                                    orders={data?.equipmentOrder?.filter(eq => eq.status !== "Archived")}
                                    publishNoteHandle={publishNoteHandle} />
                            </div>
                        }
                        {
                            data?.repairOrder !== "No order found!" && <div className="repaireOrder">
                                <Typography variant='h6' sx={{ pb: 1 }}>Repair Order</Typography>
                                <RepairOrderPublish
                                    orders={data?.repairOrder?.filter(eq => eq.status !== "Archived")}
                                    publishNoteHandle={publishNoteHandle} />
                            </div>
                        }


                        {
                            data?.equipmentOrder === "No order found!" && data?.repairOrder === "No order found!" &&
                            <Typography variant='body' sx={{ py: 10, display: "block", textAlign: "center" }}>No Order for this Client!</Typography>
                        }

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={(e) => { setOpen(!open) }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
};
