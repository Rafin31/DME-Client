import { Backdrop, Box, Button, Fade, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
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

export default function AddVAProstheticsToVeteran({ open, setOpen, handelFormSubmit, vaProsthetics, veteran = "", title, setVeteranId }) {

    veteran && setVeteranId(veteran._id)

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
                        <form onSubmit={(e) => {
                            handelFormSubmit(e)
                            setVeteranId(veteran?._id)
                        }}>
                            <TextField
                                sx={{ mb: 2 }}
                                id="outlined-basic"
                                label="Veteran"
                                type={'text'}
                                fullWidth
                                name="veteran"
                                defaultValue={veteran?.fullName}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="outlined" />

                            <FormControl fullWidth>
                                <InputLabel style={{ width: "auto", textAlign: "center", backgroundColor: "white" }} >VA Prosthetics</InputLabel>
                                <Select
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                    size="small"
                                    required
                                    defaultValue=""
                                    name='addVAtoVeteran'
                                >
                                    {
                                        vaProsthetics?.length !== 0 ? vaProsthetics?.map((va, index) => {
                                            return <MenuItem key={index} value={va?.userId._id}>{va.userId.fullName}</MenuItem>
                                        })
                                            :
                                            <MenuItem disabled>No VA Prosthetics Found!</MenuItem>
                                    }
                                </Select>
                            </FormControl>

                            <Button variant="contained" type="submit" fullWidth sx={{ my: 1 }}>
                                Add
                            </Button>
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
