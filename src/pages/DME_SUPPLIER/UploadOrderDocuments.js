
import { Helmet } from 'react-helmet-async';
import { React, useRef, useState } from 'react';
import { Backdrop, Box, Button, Card, CircularProgress, Container, Fade, Grid, IconButton, Modal, Stack, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Iconify from '../../components/iconify';
import { AuthRequest } from '../../services/AuthRequest';
import { fDateTime } from '../../utils/formatTime';
import { isArray } from 'lodash';

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


export default function UploadOrderDocuments() {

    const { id: orderId } = useParams()
    const submitButtonRef = useRef(null)
    const navigate = useNavigate()
    const [showModal, setModal] = useState(false)
    const [uploadedFileName, setUploadedFileName] = useState()

    const { search } = window.location;
    const params = new URLSearchParams(search);
    const orderCategory = params.get('orderCategory');


    const { isLoading: orderLoading, refetch, data: order } = useQuery(`order-${orderId}`,
        async () => {
            if (orderCategory === "equipment-order") {
                return AuthRequest.get(`/api/v1/order/${orderId}`).then(data => data.data.data)
            } else if (orderCategory === "repair-order") {
                return AuthRequest.get(`/api/v1/repair-order/${orderId}`).then(data => data.data.data)
            } else if (orderCategory === "veteran-order") {
                return AuthRequest.get(`/api/v1/veteran-order/${orderId}`).then(data => data.data.data)
            }
        }
    )

    const { mutateAsync, isLoading: orderDocumentsLoading } = useMutation((orderDocuments) => {

        return AuthRequest.post(`/api/v1/dme/upload-order-document`, orderDocuments,
            {
                headers: { "Content-Type": "multipart/form-data" }
            }
        )
            .then(res => {
                refetch()
                toast.success("Uploaded!", res, {
                    toastId: 'success6'
                })

            })
            .catch((err) => {
                refetch()
                toast.error(err.response.data.message, {
                    toastId: 'error4'
                })
            })
    })

    const deleteDocumentRequest = async (docId, orderId, orderCategory) => {

        await AuthRequest.delete(`/api/v1/dme/delete-document/${docId}?document=order-documents&orderCategory=${orderCategory}`, { data: { orderId } })
            .then(res => {
                refetch()
                toast.success("Deleted!", res, {
                    toastId: 'success6'
                })

            })
            .catch((err) => {
                refetch()
                toast.error(err.response.data.message, {
                    toastId: 'error4'
                })
            })
    }

    const handleUploadButtonClick = (e) => {
        e.preventDefault()
        setUploadedFileName(e.target.files[0].name)

    }
    const handleFormSubmit = (e) => {
        e.preventDefault()
        const file = e.target.uploadFile.files[0]
        const title = e.target.docTitle.value
        const description = e.target.docDescription.value
        const formData = new FormData()
        formData.append('order-document', file)
        formData.append('title', title)
        formData.append('description', description)

        if (!!formData.entries().next().value && file) {
            console.log("first")
            if (orderCategory !== "veteran-order") formData.append('uploaderId', order.patientId._id)
            if (orderCategory === "veteran-order") formData.append('uploaderId', order[0].veteranId._id)
            formData.append('orderId', orderId)
            formData.append('orderCategory', orderCategory)
            setUploadedFileName("")
            setModal(!showModal)
            mutateAsync(formData)

        } else {
            setModal(!showModal)
            toast.warning('Please Upload documents first', {
                toastId: "warning1"
            })
        }
    }

    const downloadDocument = async (doc) => {
        const url = `${process.env.REACT_APP_SERVER}/api/v1/dme/get-document?document=order-documents/${doc.split('/')[1]}`
        const a = document.createElement('a');
        a.href = url
        a.download = doc.split('/')[1];
        a.click();
    }

    const deleteDocument = async (docId) => {
        deleteDocumentRequest(docId, orderId, orderCategory)
    }

    // 
    if (orderLoading || orderDocumentsLoading) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }
    let plainOrder

    if (order && isArray(order)) {
        plainOrder = order[0]
    } else {
        plainOrder = order
    }

    return (
        <>
            <Helmet>
                <title> Order Documents </title>
            </Helmet>
            <Container maxWidth="xl">

                <Stack onClick={() => navigate(-1)} direction="row" spacing={1} style={{ cursor: "pointer", marginBottom: "15px", }} sx={{
                    "&:hover": {
                        color: "#3498db",
                    },
                }} >
                    <ArrowBackIcon /> <span>Back</span>
                </Stack>

                <Stack
                    sx={{
                        flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "start", md: "center" }
                    }} justifyContent="space-between" mb={5}>
                    <Typography variant="h5">Upload Order Documents for
                        {
                            !isArray(order) && orderCategory !== "veteran-order" &&
                            <Link
                                to={`/DME-supplier/dashboard/user-profile/${order?.patientId?._id}`}
                                style={{ color: "black", cursor: "pointer", margin: "0px 10px" }}
                                color="inherit" variant="subtitle2" underline="hover" nowrap="true"
                                target="_blank" rel="noopener noreferrer"
                            >{order?.patientId?.fullName}
                            </Link>
                        }
                        {
                            isArray(order) && orderCategory === "veteran-order" &&
                            <Link
                                to={`/DME-supplier/dashboard/user-profile/${order[0]?.veteranId?._id}`}
                                style={{ color: "black", cursor: "pointer", margin: "0px 10px" }}
                                color="inherit" variant="subtitle2" underline="hover" nowrap="true"
                                target="_blank" rel="noopener noreferrer"
                            >{order[0]?.veteranId?.fullName}
                            </Link>
                        }
                        Order
                    </Typography>
                    <form onSubmit={(e) => handleFormSubmit(e)}>
                        {
                            order &&
                            <Button variant="contained" onClick={() => { setModal(!showModal) }} startIcon={
                                <Iconify icon="material-symbols:cloud-upload" />}>
                                Upload Document
                            </Button>
                        }
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
                        plainOrder?.document?.length !== 0 ? plainOrder?.document?.map((data, index) => {
                            return (
                                <Card
                                    key={index}
                                    sx={{ paddingY: 2, paddingX: 2, marginY: 1 }}
                                    style={{ border: "1px solid #eaeeef", boxShadow: "none" }}
                                    variant="outlined"
                                >
                                    <Stack
                                        sx={{
                                            flexDirection: { xs: "column-reverse", md: "row" },
                                            alignItems: { xs: "start", md: "center" },
                                        }}
                                        direction="col" alignItems="center" justifyContent="space-between">

                                        <Stack direction="row" alignItems="center">
                                            <Tooltip title={data.document.split('__')[1].split('-')[1]}>
                                                <Stack sx={{ minWidth: "100px" }}>
                                                    <img src={

                                                        data.document.split('.')[1].toLowerCase() === 'jpg' ? `/ assets/icons/ic_img.svg`
                                                            :
                                                            data.document.split('.')[1].toLowerCase() === 'pdf' ? `/assets/icons/ic_pdf.svg`
                                                                :
                                                                data.document.split('.')[1].toLowerCase() === 'xlsx' ? `/assets/icons/xlsx-file.svg`
                                                                    :
                                                                    data.document.split('.')[1].toLowerCase() === 'doc' ? `/assets/icons/doc-file.svg` :
                                                                        data.document.split('.')[1].toLowerCase() === 'txt' ? `/assets/icons/notepad.svg` : data.document.split('.')[1].toLowerCase() === 'docx' && `/assets/icons/doc-file.svg`
                                                    }
                                                        alt="icon"
                                                        style={{ marginRight: "10px", width: "100px", height: "100px" }} />

                                                    <p style={{ margin: "0", padding: "0", fontSize: "13px", display: "inline", maxWidth: "100px", wordBreak: "break-word" }}>
                                                        {data.document.split('__')[1].split('-')[1].slice(0, 10) + "..."}
                                                    </p>
                                                </Stack>
                                            </Tooltip >

                                            <Stack>
                                                <Stack>
                                                    <p style={{ fontSize: "small", color: "#afb6bc", margin: "0", padding: "0", display: "inline" }}>
                                                        {fDateTime(data.createdAt)}
                                                    </p>
                                                </Stack>
                                                <Stack>
                                                    <Typography variant='h6'>{data?.title}</Typography>
                                                    <Typography variant='body2'>{data?.description}</Typography>
                                                </Stack>
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
                            :
                            <Typography variant='subtitle' sx={{ textAlign: "center" }}>No Documents Uploaded yet!</Typography>
                    }
                </Grid>


                {/* -------------------------------------Modal Start------------------------------------ */}

                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={showModal}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={showModal}>
                        <Box sx={style}>
                            <p style={{ textAlign: "center", marginBottom: "20px", fontWeight: "700", fontSize: "larger" }}>{"Upload Document"}</p>

                            <form onSubmit={(e) => handleFormSubmit(e)}>
                                {
                                    <>
                                        <TextField
                                            sx={{ mb: 2 }}
                                            id="outlined-basic"
                                            label="Document Title"
                                            type={'text'}
                                            fullWidth
                                            name="docTitle"
                                            required
                                            variant="outlined" />

                                        <TextField
                                            sx={{ mb: 2 }}
                                            id="outlined-basic"
                                            label="Description"
                                            type={'text'}
                                            fullWidth
                                            name="docDescription"
                                            multiline
                                            rows={3}
                                            variant="outlined" />

                                        <Stack variant="contained" fullWidth sx={{ mb: 2, border: "2px solid grey", borderStyle: "dashed", py: 2, px: 3, textAlign: "center", cursor: "pointer" }} component="label" startIcon={<Iconify icon="material-symbols:cloud-upload" />}>
                                            {!uploadedFileName ? "Upload" : uploadedFileName}
                                            <Typography variant='caption'>DOC/PDF/JPG/PNG/JPEG/XLSX</Typography>
                                            <input name="uploadFile" hidden type="file" onChange={(e) => handleUploadButtonClick(e)} />
                                        </Stack>
                                    </>
                                }
                                <Button variant="contained" sx={{ mb: 1 }} color='success' fullWidth type='submit'>
                                    Upload
                                </Button>
                            </form>

                            <Button variant="contained" color='warning' fullWidth onClick={(e) => {
                                setModal(!showModal); setUploadedFileName("")
                            }}>
                                Close
                            </Button>
                        </Box>
                    </Fade>
                </Modal>

                {/* -------------------------------------Modal End------------------------------------ */}




            </Container>
        </>
    );
};
