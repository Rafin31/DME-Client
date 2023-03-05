import { LoadingButton } from '@mui/lab';
import { Backdrop, Box, Button, Fade, Modal, TextField } from '@mui/material';
import React from 'react';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '5px',
    p: 2,

};

export default function AddOrderNoteLogModal({ open, setOpen, handelFormSubmit, title, data, user, addOrderNoteLog }) {
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
                        <p style={{ textAlign: "center", marginBottom: "20px", fontWeight: "700", fontSize: "larger" }}>{title}</p>
                        <form onSubmit={(e) => { handelFormSubmit(e) }}>
                            <TextField
                                sx={{ mb: 2 }}
                                id="outlined-basic"
                                label="Your Name"
                                type={'text'}
                                fullWidth
                                name="writerId"
                                defaultValue={user.fullName}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="outlined" />

                            <TextField
                                sx={{ mb: 2 }}
                                id="outlined-basic"
                                label="Note"
                                type={'text'}
                                fullWidth
                                multiline
                                rows={4}
                                name="notes"
                                required
                                defaultValue={data?.notes}
                                variant="outlined" />

                            <LoadingButton loading={addOrderNoteLog} variant="contained" type="submit" fullWidth sx={{ my: 1 }}>
                                Add
                            </LoadingButton>

                            {/* {
                                !addOrderNoteLog ?
                                    <Button variant="contained" type="submit" fullWidth sx={{ my: 1 }}>
                                        Add
                                    </Button>
                                    :
                                    <LoadingButton loading={addOrderNoteLog} variant="contained" type="submit" fullWidth sx={{ my: 1 }}>
                                        Add
                                    </LoadingButton>
                            } */}
                        </form>
                        <Button variant="contained" color='warning' fullWidth onClick={(e) => { setOpen(!open) }}>
                            Cancel
                        </Button>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
};
