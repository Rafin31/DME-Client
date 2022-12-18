import { useCallback, useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';

import { Grid, Container, Typography, Stack, Button, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { userContext } from '../../Context/AuthContext';


// components
import Iconify from '../../components/iconify';
// sections
import {
  DmeSupplierTasks,
  AppWidgetSummary,
} from '../../sections/@dashboard/app';
import { AuthRequest } from '../../services/AuthRequest';




// ----------------------------------------------------------------------

export default function DmeDashboard() {
  const theme = useTheme();
  const navigate = useNavigate()


  const { loggedInUser } = useContext(userContext)
  const user = loggedInUser()


  const { isLoading: statesLoading, data: states } = useQuery('states',
    async () => {
      return AuthRequest.get(`/api/v1/dme/dashboardStates/${user.id}`).then(data => data.data.message)
    }
  )

  const { isLoading: taskLoading, data: tasks, refetch, isFetching } = useQuery('tasks',
    async () => {
      return AuthRequest.get(`/api/v1/dme/dme-task/${user.id}`).then(data => data.data.data)
    },
    {
      refetchInterval: 2000,
      refetchIntervalInBackground: true,
    }
  )


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

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="PATIENT" total={+(states?.patient)} icon={'medical-icon:i-outpatient'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="DOCTORS" total={+(states?.doctors)} color="info" icon={'fontisto:doctor'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="THERAPIST" total={+(states?.therapist)} color="warning" icon={'tabler:physotherapist'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="ORDERS" total={+(states?.orderCount)} color="error" icon={'fluent-mdl2:activate-orders'} />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" my={2}>
              <Typography variant="h4" gutterBottom>
                Tasks
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
