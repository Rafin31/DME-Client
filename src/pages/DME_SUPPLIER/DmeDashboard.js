import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';

import { Grid, Container, Typography, Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// components
import Iconify from '../../components/iconify';
// sections
import {
  DmeSupplierTaks,
  AppWidgetSummary,
} from '../../sections/@dashboard/app';



// ----------------------------------------------------------------------

export default function DmeDashboard() {
  const theme = useTheme();
  const navigate = useNavigate()

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
            <AppWidgetSummary title="PATIENT" total={2} icon={'medical-icon:i-outpatient'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="DOCTORS" total={5} color="info" icon={'fontisto:doctor'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="THERAPIST" total={4} color="warning" icon={'tabler:physotherapist'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="ORDERS" total={0} color="error" icon={'fluent-mdl2:activate-orders'} />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" my={2}>
              <Typography variant="h4" gutterBottom>
                Tasks
              </Typography>
              <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={() => { navigate(`/DME-supplier/dashboard/add-tasks/${654}`) }}
              >
                New Tasks
              </Button>
            </Stack>
            <DmeSupplierTaks
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                patientName: "KingoPOLI",
                description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English",
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: new Date(),
              }))}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
