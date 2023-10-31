import { useContext, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { Grid, Container, Typography, Stack, Button, Box, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { userContext } from '../../Context/AuthContext';
import AssignTaskModal from '../Shared/AssignTaskModal';

import { MessageContext } from '../../Context/PrivateMessageContext';
import { useAssignedTaskContext } from '../../Context/AssignedTaskContext';

import Iconify from '../../components/iconify';

import {
  DmeSupplierTasks,
  AppWidgetSummary,
} from '../../sections/@dashboard/app';
import { AuthRequest } from '../../services/AuthRequest';
import { toast } from 'react-toastify';
import AssignedTask from '../Shared/AssignedTask';
import { useConfirm } from 'material-ui-confirm';





// ----------------------------------------------------------------------

export default function DmeDashboard() {
  const navigate = useNavigate()

  const [AssignedTaskOpen, setAssignedTaskOpen] = useState(false)
  const [assignedUser, setAssignedUser] = useState()


  const { loggedInUser } = useContext(userContext)
  const user = loggedInUser()

  const confirm = useConfirm()

  const { allActiveDmeLoading, allActiveDme } = useContext(MessageContext)
  const { assignedTaskLoading, assignedTask: assignedTaskToUser, fetchAssignedTask, fetchPendingAssignedTask } = useAssignedTaskContext()



  const { isLoading: statesLoading, data: states } = useQuery('states',
    async () => {
      return AuthRequest.get(`/api/v1/dme/dashboardStates/${user.id}`).then(data => data.data.message)
    }
  )

  const { isLoading: taskLoading, data: tasks, refetch } = useQuery(`task-${user.id}`,
    async () => {
      return AuthRequest.get(`/api/v1/dme/dme-task/${user.id}`).then(data => data.data.data)
    }
  )

  const handleWidgetClick = (dest) => {
    if (dest === "new-referrals") {
      navigate('/DME-supplier/dashboard/equipment-order')
    }
    else if (dest === "repair") {
      navigate('/DME-supplier/dashboard/repair-order')
    }
    else if (dest === "veteran-order") {
      navigate('/DME-supplier/dashboard/veteran-order')
    }
    else if (dest === "equip-order") {
      navigate('/DME-supplier/dashboard/equipment-order')
    }
  }

  const { mutateAsync: assignTask } = useMutation((data) => {

    return AuthRequest.post(`/api/v1/dme/assign-task`, data)
      .then(res => {
        refetch()
        setAssignedTaskOpen(false)
        toast.success("Task Assigned Successfully", res, {
          toastId: 'success1999'
        })

      })
      .catch((err) => {
        refetch()
        toast.error(err.response.data.message, {
          toastId: 'error4999'
        })
      })
  })


  const { mutateAsync: handleAssignTaskUpdate } = useMutation((params) => {

    const [status, id] = params;

    console.log(status, id)
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



  const handelAssignedTask = (e) => {

    e.preventDefault()
    console.log(assignedUser)
    if (!assignedUser) {
      toast.error("Provide Assigned to User!")
      return
    }


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



  if (statesLoading || taskLoading) {
    return <Box style={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <CircularProgress />
    </Box>
  }



  return (
    <>
      <Helmet>
        <title> Dashboard | DME Supplier </title>
      </Helmet>

      <Container maxWidth="1350px">


        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>

          <Grid item xs={12} sm={6} md={3} >
            <AppWidgetSummary className="cursor-pointer" onClick={() => handleWidgetClick("new-referrals")} title="New Referrals" total={+(states?.equipmentOrderNewReferralCount)} icon={'medical-icon:i-outpatient'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary className="cursor-pointer" onClick={() => handleWidgetClick("repair")} title="Repairs" total={+(states?.repairOrderCount)} color="info" icon={'fontisto:doctor'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary className="cursor-pointer" onClick={() => handleWidgetClick("veteran-order")} title="Veteran Orders" total={+(states?.veteranOrderCount)} color="warning" icon={'tabler:physotherapist'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary className="cursor-pointer" onClick={() => handleWidgetClick("equip-order")} title="Equip Orders" total={+(states?.equipmentOrderTotalCount)} color="error" icon={'fluent-mdl2:activate-orders'} />
          </Grid>

          {/* Assign Task */}


          <AssignTaskModal open={AssignedTaskOpen} setOpen={setAssignedTaskOpen} user={user} assignTo={allActiveDme} setAssignedUser={setAssignedUser} handelFormSubmit={handelAssignedTask} loading={allActiveDmeLoading} title="Assigned Task" />

          <Grid item xs={12} md={12} lg={12}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" my={2}>
              <Typography variant="h4" gutterBottom>
                Task Assigned
              </Typography>
              <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={() => setAssignedTaskOpen(!AssignedTaskOpen)}
              >
                Assign New Tasks
              </Button>
            </Stack>

            {
              !assignedTaskLoading ?
                assignedTaskToUser.length !== 0 ?
                  assignedTaskToUser.filter((t) => t.status !== "Completed" && t.status !== "Rejected").slice(0, 5).length !== 0 ?
                    assignedTaskToUser.filter((t) => t.status !== "Completed" && t.status !== "Rejected").slice(0, 5).map((at) => {
                      return (
                        <AssignedTask assignedTaskToUser={at} handleAssignTaskUpdate={handleAssignTaskUpdate} />
                      )
                    })
                    :
                    <div className="noTask" style={{ height: 'auto', width: "100%", display: 'flex', justifyContent: "center", alignItems: "center" }}>
                      <p>No Pending or Accepted task!</p>
                    </div>
                  :
                  <div className="noTask" style={{ height: 'auto', width: "100%", display: 'flex', justifyContent: "center", alignItems: "center" }}>
                    <p>No task has been assigned to you yet!</p>
                  </div>
                :
                <Box style={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <CircularProgress />
                </Box>

            }
            <Stack direction="row" justifyContent="end" my={2}>
              <Link to={"/DME-supplier/dashboard/assigned-task/all-assigned-task"}>All Assigned Task</Link>
            </Stack>




          </Grid>

          {/* Task */}

          <Grid item xs={12} md={12} lg={12}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" my={2}>
              <Typography variant="h4" gutterBottom>
                My Tasks
              </Typography>
              <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={() => { navigate(`/DME-supplier/dashboard/add-tasks`) }}
              >
                New Tasks
              </Button>
            </Stack>
            {
              tasks.length !== 0 ? <DmeSupplierTasks
                list={tasks.map((task, index) => ({
                  id: task._id,
                  title: task.title,
                  patientId: task.patientId._id,
                  patientName: task.patientId.fullName,
                  description: task.description,
                  image: `/assets/images/covers/cover_${index + 1}.jpg`,
                  postedAt: task.taskDate,
                  rftch: refetch
                }))}
              />
                :
                <div className="noTask" style={{ height: '300px', width: "100%", display: 'flex', justifyContent: "center", alignItems: "center" }}>
                  <p>No Task found. Please add </p>
                </div>
            }
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
