import { LoadingButton } from '@mui/lab';
import { Backdrop, Box, Button, Fade, Modal, TextField, CircularProgress, FormControl, Autocomplete } from '@mui/material';
import React from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '5px',
    p: 2,

};

export default function AssignTaskModal({ open, setOpen, user, assignTo = [], setAssignedUser, handelFormSubmit, title, ...other }) {

    let toOption = assignTo.filter((e) => { return e._id !== user.id })?.map((f) => ({
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
                    {!other.loading ?
                        <Box sx={style}>
                            <p style={{ textAlign: "center", marginBottom: "20px", fontWeight: "700", fontSize: "larger" }}>{title}</p>
                            <form onSubmit={(e) => { handelFormSubmit(e) }}>

                                <FormControl fullWidth>
                                    {

                                        <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            isOptionEqualToValue={(option, value) => option.value === value.value}
                                            options={toOption}
                                            required
                                            sx={{ width: "100%", mb: 2 }}
                                            onChange={(e, newValue) => { setAssignedUser(newValue) }}
                                            renderInput={(params) => <TextField {...params} label="Assign To" />}

                                        />
                                    }
                                </FormControl>

                                <TextField
                                    sx={{ mb: 2 }}
                                    id="outlined-basic"
                                    label="Title"
                                    type={'text'}
                                    fullWidth
                                    name="title"
                                    required
                                    variant="outlined" />

                                <TextField
                                    sx={{ mb: 2 }}
                                    id="outlined-basic"
                                    label="Task Description"
                                    type={'text'}
                                    fullWidth
                                    name="description"
                                    required
                                    variant="outlined"
                                    multiline
                                    rows={5}
                                />
                                Deadline:
                                <TextField
                                    sx={{ mb: 2 }}
                                    id="outlined-basic"
                                    type={'date'}
                                    fullWidth
                                    name="deadline"
                                    required
                                    variant="outlined"
                                />

                                <LoadingButton loading={other.loading} variant="contained" type="submit" fullWidth sx={{ my: 1 }}>
                                    Assign
                                </LoadingButton>
                            </form>
                            <Button variant="contained" color='warning' fullWidth onClick={(e) => { setOpen(!open) }}>
                                Cancel
                            </Button>
                        </Box>
                        :
                        <Box style={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <CircularProgress />
                        </Box>
                    }
                </Fade>
            </Modal>
        </div>
    );
};
