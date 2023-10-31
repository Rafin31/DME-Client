import { Box, Button, CircularProgress, Container, Stack, Tab, Tabs } from '@mui/material';
import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useMutation } from 'react-query';
import { Link, Outlet } from 'react-router-dom';
import { AuthRequest } from '../../../services/AuthRequest';
import Iconify from "../../../components/iconify"
import { toast } from 'react-toastify';
import { useConfirm } from 'material-ui-confirm';
import { MessageContext } from '../../../../src/Context/PrivateMessageContext';
import { useAssignedTaskContext } from '../../../../src/Context/AssignedTaskContext';
import scrollToTop from 'src/components/scroll-to-top';
import AssignTaskModal from 'src/pages/Shared/AssignTaskModal';
import { userContext } from 'src/Context/AuthContext';



const AssignedTaskRoot = () => {

    scrollToTop()

    const [value, setValue] = useState(0);
    const [AssignedTaskOpen, setAssignedTaskOpen] = useState(false)
    const [assignedUser, setAssignedUser] = useState()

    const { loggedInUser } = useContext(userContext)
    const user = loggedInUser()

    const confirm = useConfirm();

    const { allActiveDmeLoading, allActiveDme } = useContext(MessageContext)
    const { assignedTaskLoading, assignedTask, fetchAssignedTask, assignedByTaskLoading, assignedByTask, fetchAssignedByTask, fetchPendingAssignedTask } = useAssignedTaskContext()

    const handleChange = useCallback((event, newValue) => {
        setValue(newValue)
    }, [])

    const { mutateAsync: handleAssignTaskUpdate } = useMutation((params) => {

        const [status, id] = params;

        try {
            confirm({
                description: `You are ${status.slice(0, status.length - 2)}ing the task. Are you sure?`,
                confirmationText: status.slice(0, status.length - 2),
                confirmationButtonProps: { variant: "outlined", color: status === "Accepted" || status === "Completed" ? "success" : "error" },
            })
                .then(() => {
                    toast.promise(
                        AuthRequest.patch(`/api/v1/dme/assign-task/assignedTo/${id}`, { status })
                            .then(res => {
                                fetchAssignedTask()
                                fetchPendingAssignedTask()
                            })

                            .catch((err) => {
                                fetchAssignedTask()
                                fetchPendingAssignedTask()
                                return err
                            }),

                        {
                            pending: "Updating Task...",
                            success: `Task ${status} !`,
                            error: "Something Went Wrong!",
                        },
                        {
                            toastId: "updateTask",
                        }
                    );
                })
                .catch(() => {
                    return
                });
        } catch (err) {
            console.error(err);
        }


    })

    const { mutateAsync: assignTask } = useMutation((data) => {

        return AuthRequest.post(`/api/v1/dme/assign-task`, data)
            .then(res => {
                fetchAssignedTask()
                fetchAssignedByTask()
                setAssignedTaskOpen(false)
                toast.success("Task Assigned Successfully", res, {
                    toastId: 'success1999'
                })

            })
            .catch((err) => {
                fetchAssignedTask()
                fetchAssignedByTask()
                toast.error(err.response.data.message, {
                    toastId: 'error4999'
                })
            })
    })

    const handelAssignedTask = (e) => {

        e.preventDefault()
        const data = {
            assignedBy: user.id,
            assignedTo: assignedUser.id,
            title: e.target.title.value,
            deadline: e.target.deadline.value,
            description: e.target.description.value,
            status: "Pending"
        }

        assignTask(data)

    }


    useEffect(() => {
        const path = window.location.pathname
        if (path === "/DME-supplier/dashboard/assigned-task/all-assigned-task") return setValue(0)
        if (path === "/DME-supplier/dashboard/assigned-task") return setValue(1)

        return () => {
            setValue(0)
        }

    }, [handleChange])


    if (assignedTaskLoading || assignedByTaskLoading) {
        return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Box>
    }

    return (
        <>
            <Container maxWidth="1350px" style={{ minHeight: "120vh" }}>

                <AssignTaskModal open={AssignedTaskOpen} setOpen={setAssignedTaskOpen} user={user} assignTo={allActiveDme} setAssignedUser={setAssignedUser} handelFormSubmit={handelAssignedTask} loading={allActiveDmeLoading} title="Assigned Task" />

                <Stack direction="row" alignItems="center" justifyContent="start" mb={5}>

                    <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}
                        onClick={() => setAssignedTaskOpen(!AssignedTaskOpen)}
                    >
                        Assign New Tasks
                    </Button>
                </Stack>

                <Box>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="basic tabs example">

                        <Tab label="My Tasks" to="/DME-supplier/dashboard/assigned-task/all-assigned-task" style={{ backgroundColor: "#f9fafc" }} component={Link} draggable="true" />

                        <Tab label="My Assigns" to="/DME-supplier/dashboard/assigned-task" style={{ backgroundColor: "#f9fafc" }} component={Link} draggable="true" />




                    </Tabs>
                </Box>
                {
                    (!assignedTask || assignedTask.length === 0) && (!assignedByTask || assignedByTask.length === 0) ?

                        <p style={{ textAlign: "center" }}>No task assigned!</p>

                        :
                        <main>
                            <Outlet context={{
                                assignedTaskLoading,
                                assignedTask,
                                fetchAssignedTask,

                                assignedByTaskLoading,
                                assignedByTask,
                                fetchAssignedByTask,

                                handleAssignTaskUpdate
                            }} />
                        </main>
                }
            </Container>
        </>
    );
};

export default AssignedTaskRoot;