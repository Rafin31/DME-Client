
import { Helmet } from 'react-helmet-async';
import { React, useRef, useState } from 'react';
import { Box, Button, Card, CircularProgress, Container, Grid, IconButton, Stack, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import Iconify from '../../components/iconify';
import { AuthRequest } from '../../services/AuthRequest';
import { fDateTime } from '../../utils/formatTime';



export default function UploadOrderDocuments() {

    const { id: orderId } = useParams()
    const submitButtonRef = useRef(null)
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    let loggedUser = localStorage.getItem('user');
    loggedUser = JSON.parse(loggedUser);


    const { isLoading: orderLoading, refetch, data: order } = useQuery('order',
        async () => {
            return AuthRequest.get(`/api/v1/order/${orderId}`).then(data => data.data.data)
        }
    )

    const { mutateAsync, isLoading: orderDocumentsLoading } = useMutation((orderDocuments) => {

        return AuthRequest.post(`/api/v1/dme/upload-order-document`, orderDocuments,
            {
                headers: { "Content-Type": "multipart/form-data" }
            }
        )
            .then(res => {
                toast.success("Uploaded!", res, {
                    toastId: 'success6'
                })
                refetch()
            })
            .catch((err) => {
                toast.error(err.response.data.message, {
                    toastId: 'error4'
                })
            })
    })

    const { mutateAsync: deleteAsync, isLoading: deleteLoading } = useMutation((orderId) => {

        return AuthRequest.delete(`/api/v1/dme/delete-document/${orderId}?document=order-documents`, { orderId })
            .then(res => {
                toast.success("Deleted!", res, {
                    toastId: 'success6'
                })
                refetch()
            })
            .catch((err) => {
                toast.error(err.response.data.message, {
                    toastId: 'error4'
                })
            })
    })

    const handleUploadButtonClick = (e) => {
        e.preventDefault()
        submitButtonRef.current.click()
    }
    const handleFormSubmit = (e) => {
        e.preventDefault()
        const file = e.target.uploadFile.files[0]
        const formData = new FormData()
        formData.append('order-document', file)

        if (!!formData.entries().next().value) {
            formData.append('uploaderId', order.patientId._id)
            formData.append('orderId', orderId)
            mutateAsync(formData)

        } else {
            toast.warning('Upload documents', {
                toastId: "warning1"
            })
        }
    }

    const downloadDocument = async (doc) => {
        const url = `http://localhost:5000/api/v1/dme/get-document?document=order-documents/${doc.split('/')[1]}`
        const a = document.createElement('a');
        a.href = url
        a.download = 'employees.json';
        a.click();
    }

    const deleteDocument = async (docId) => {
        deleteAsync(docId)
    }

    // 
    if (orderLoading || orderDocumentsLoading) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }

    return (
        <>
            <Helmet>
                <title> Order Documents </title>
            </Helmet>
            <Container maxWidth="xl">
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h5">Upload Order Documents for
                        <Link
                            to={`/DME-supplier/dashboard/patient-profile/${order.patientId._id}`}
                            style={{ color: "black", cursor: "pointer", margin: "0px 10px" }}
                            color="inherit" variant="subtitle2" underline="hover" nowrap="true"
                            target="_blank" rel="noopener noreferrer"
                        >{order.patientId.fullName}
                        </Link>
                        Order
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
                    {
                        order.document.map((data, index) => {
                            return (
                                <Card
                                    key={index}
                                    sx={{ paddingY: 2, paddingX: 2, marginY: 1 }}
                                    style={{ border: "1px solid #eaeeef", boxShadow: "none" }}
                                    variant="outlined"
                                >
                                    <Stack direction="row" alignItems="center" justifyContent="space-between">

                                        <Stack direction="row" alignItems="center">
                                            <img src={

                                                data.document.split('.')[1].toLowerCase() === 'jpg' ? `/assets/icons/ic_img.svg`
                                                    :
                                                    data.document.split('.')[1].toLowerCase() === 'pdf' ? `/assets/icons/ic_pdf.svg`
                                                        :
                                                        `/assets/icons/doc.png`

                                            } alt="icon"
                                                style={{ marginRight: "10px", width: "20%" }} />
                                            <Stack>
                                                <p style={{ margin: "0", padding: "0", fontSize: "15px", fontWeight: "bold" }}>{data.document.split('__')[1].split('-')[1]}</p>
                                                <p style={{ fontSize: "small", color: "#afb6bc", margin: "0", padding: "0" }}>
                                                    {fDateTime(data.createdAt)}</p>
                                            </Stack>
                                        </Stack>

                                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                                            <IconButton aria-label="delete" onClick={() => downloadDocument(data.document)}>
                                                <CloudDownloadIcon color="primary" />
                                            </IconButton>
                                            <IconButton aria-label="delete" onClick={() => deleteDocument(data._id)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </Stack>
                                    </Stack>
                                </Card>
                            )
                        })
                    }
                </Grid>
            </Container>
        </>
    );
};
