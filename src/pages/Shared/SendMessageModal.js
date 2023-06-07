import { Autocomplete, Backdrop, Box, Button, CircularProgress, Fade, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import Iconify from '../../components/iconify';


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

export default function SendMessageModal({ open, setOpen, handelFormSubmit, to = [], setToValue, from = "", title = "", loading }) {

    let toOption = to.filter((e) => { return e._id !== from._id })?.map((f) => ({
        id: f._id,
        label: f.fullName + " " + "|" + " " + f.companyName
    }))

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
                            !loading ?
                                <>
                                    <p style={{ textAlign: "center", marginBottom: "20px", fontWeight: "700", fontSize: "larger" }}>{title}</p>
                                    <form onSubmit={(e) => { handelFormSubmit(e) }}>
                                        <TextField
                                            sx={{ mb: 2 }}
                                            id="outlined-basic"
                                            label="From"
                                            type={'text'}
                                            fullWidth
                                            name="from"
                                            required
                                            defaultValue={from.fullName}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            variant="outlined" />

                                        <FormControl fullWidth>
                                            {

                                                <Autocomplete
                                                    disablePortal
                                                    id="combo-box-demo"
                                                    isOptionEqualToValue={(option, value) => option.value === value.value}
                                                    options={toOption}
                                                    required
                                                    sx={{ width: "100%", mb: 2 }}
                                                    onChange={(e, newValue) => { setToValue(newValue) }}
                                                    renderInput={(params) => <TextField {...params} label="To" />}

                                                />
                                            }
                                        </FormControl>

                                        <TextField
                                            sx={{ mb: 2 }}
                                            id="outlined-basic"
                                            label="Subject"
                                            required
                                            type={'text'}
                                            fullWidth
                                            name="subject"
                                            variant="outlined" />

                                        <TextField
                                            sx={{ mb: 2 }}
                                            id="outlined-basic"
                                            label="Message"
                                            type={'text'}
                                            required
                                            fullWidth
                                            name="message"
                                            multiline
                                            rows={3}
                                            variant="outlined" />

                                        <Button variant="contained" type="submit" fullWidth sx={{ my: 1 }} startIcon={
                                            <Iconify icon="material-symbols:send-rounded" />}>
                                            Sent
                                        </Button>
                                    </form>
                                    <Button variant="contained" color='warning' fullWidth onClick={(e) => { setOpen(!open) }}>
                                        Cancel
                                    </Button>
                                </>
                                :
                                <Box style={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <CircularProgress />
                                </Box>
                        }
                    </Box>

                </Fade>
            </Modal>
        </div >
    );
};
