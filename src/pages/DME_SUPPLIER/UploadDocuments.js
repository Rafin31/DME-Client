
import { Helmet } from 'react-helmet-async';
import { React, useRef, useState } from 'react';
import { Box, Button, Card, CircularProgress, Container, Grid, IconButton, Stack, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Link, useParams } from "react-router-dom";
import { useQuery } from 'react-query';
import Iconify from '../../components/iconify';
import { AuthRequest } from '../../services/AuthRequest';




export default function UploadDocuments() {

    const { orderId } = useParams()
    const submitButtonRef = useRef(null)


    const handleUploadButtonClick = (e) => {
        e.preventDefault()
        submitButtonRef.current.click()
    }
    const handleFormSubmit = (e) => {
        e.preventDefault()
        const file = e.target.uploadFile.files[0]
        const formData = new FormData()
        formData.append('file', file)
        console.log(!!formData.entries().next().value) // check if file uploaded or not
    }


    return (
        <>
            <Helmet>
                <title> Documents </title>
            </Helmet>
            <Container maxWidth="xl">
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h5">Upload Documents for Patient
                        <Link
                            to={`/DME-supplier/dashboard/patient-profile/32463`}
                            style={{ color: "black", cursor: "pointer", marginLeft: "10px" }}
                            color="inherit" variant="subtitle2" underline="hover" nowrap="true"
                            target="_blank" rel="noopener noreferrer"
                        >{"KARIM HASAN"}
                        </Link>
                    </Typography>
                    <form onSubmit={(e) => handleFormSubmit(e)}>
                        <Button variant="contained" component="label" startIcon={<Iconify icon="material-symbols:cloud-upload" />}>
                            Upload
                            <input name="uploadFile" hidden type="file" onChange={(e) => handleUploadButtonClick(e)} />
                        </Button>
                        <input ref={submitButtonRef} hidden type="submit" />
                    </form>
                </Stack>

                <Grid
                    container
                    spacing={1}
                    direction="column"
                    justify="center"
                    style={{ minHeight: '100vh', marginTop: '40px' }}
                >
                    <Card
                        sx={{ paddingY: 2, paddingX: 2, marginY: 1 }}
                        style={{ border: "1px solid #eaeeef", boxShadow: "none" }}
                        variant="outlined"
                    >
                        <Stack direction="row" alignItems="center" justifyContent="space-between">

                            <Stack direction="row" alignItems="center">
                                <img src="/assets/icons/ic_pdf.svg" alt="icon"
                                    style={{ marginRight: "10px", width: "20%" }} />
                                <Stack>
                                    <p style={{ margin: "0", padding: "0", fontSize: "15px", fontWeight: "bold" }}>documents.pdf</p>
                                    <p style={{ fontSize: "small", color: "#afb6bc", margin: "0", padding: "0" }}>
                                        48 MB | 24 Nov 2022 1:54 PM</p>
                                </Stack>
                            </Stack>

                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <IconButton aria-label="delete">
                                    <CloudDownloadIcon color="primary" />
                                </IconButton>
                                <IconButton aria-label="delete">
                                    <DeleteIcon color="error" />
                                </IconButton>
                            </Stack>
                        </Stack>
                    </Card>
                    <Card
                        sx={{ paddingY: 2, paddingX: 2, marginY: 1 }}
                        style={{ border: "1px solid #eaeeef", boxShadow: "none" }}
                        variant="outlined"
                    >
                        <Stack direction="row" alignItems="center" justifyContent="space-between">

                            <Stack direction="row" alignItems="center">
                                <img src="/assets/icons/ic_img.svg" alt="icon"
                                    style={{ marginRight: "10px", width: "20%" }} />
                                <Stack>
                                    <p style={{ margin: "0", padding: "0", fontSize: "15px", fontWeight: "bold" }}>documents.jpg</p>
                                    <p style={{ fontSize: "small", color: "#afb6bc", margin: "0", padding: "0" }}>
                                        48 MB | 24 Nov 2022 1:54 PM</p>
                                </Stack>
                            </Stack>

                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <IconButton aria-label="delete">
                                    <CloudDownloadIcon color="primary" />
                                </IconButton>
                                <IconButton aria-label="delete">
                                    <DeleteIcon color="error" />
                                </IconButton>
                            </Stack>
                        </Stack>
                    </Card>
                    <Card
                        sx={{ paddingY: 2, paddingX: 2, marginY: 1 }}
                        style={{ border: "1px solid #eaeeef", boxShadow: "none" }}
                        variant="outlined"
                    >
                        <Stack direction="row" alignItems="center" justifyContent="space-between">

                            <Stack direction="row" alignItems="center">
                                <img src="/assets/icons/doc.png" alt="icon"
                                    style={{ marginRight: "10px", width: "20%" }} />
                                <Stack>
                                    <p style={{ margin: "0", padding: "0", fontSize: "15px", fontWeight: "bold" }}>documents.doc</p>
                                    <p style={{ fontSize: "small", color: "#afb6bc", margin: "0", padding: "0" }}>
                                        48 MB | 24 Nov 2022 1:54 PM</p>
                                </Stack>
                            </Stack>

                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <IconButton aria-label="delete">
                                    <CloudDownloadIcon color="primary" />
                                </IconButton>
                                <IconButton aria-label="delete">
                                    <DeleteIcon color="error" />
                                </IconButton>
                            </Stack>
                        </Stack>
                    </Card>
                </Grid>
            </Container>
        </>
    );
};
