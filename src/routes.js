import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import DmeDashboardLayout from './layouts/dashboard';

import LoginPage from './pages/Authentication/LoginPage';
import Page404 from './pages/Shared/Page404';
import DmeDashboard from './pages/DME_SUPPLIER/DmeDashboard';
import AddOrder from './pages/DME_SUPPLIER/AddOrder';
import OrderPage from './pages/DME_SUPPLIER/OrderPage';
import DoctorPage from './pages/DME_SUPPLIER/DoctorPage';
import AddTasks from './pages/DME_SUPPLIER/AddTasks';
import PatientPage from './pages/DME_SUPPLIER/PatientPage';
import TherapistPage from './pages/DME_SUPPLIER/TherapistPage';
import StaffPage from './pages/DME_SUPPLIER/StaffPage';
import AuthRoute from './services/AuthRoute';
import AddPatient from './pages/DME_SUPPLIER/AddPatient';
import UploadPatientDocuments from './pages/DME_SUPPLIER/UploadPatientDocuments';
import PatientProfile from './pages/DME_SUPPLIER/PatientProfile';
import EditPatient from './pages/DME_SUPPLIER/EditPatient';
import DmeSupplierProfile from './pages/DME_SUPPLIER/DmeSupplierProfile';
import EditDMESupplier from './pages/DME_SUPPLIER/EditDMESupplier';
import UpdatePassword from './pages/Shared/UpdatePassword';
import Settings from './pages/DME_SUPPLIER/Settings';
import EditOrder from './pages/DME_SUPPLIER/EditOrder';
import PatientNotes from './pages/DME_SUPPLIER/PatientNotes';
import UploadOrderDocuments from './pages/DME_SUPPLIER/UploadOrderDocuments';
import SignupPage from './pages/Authentication/SignupPage';
import ForgetPassword from './pages/Shared/ResetPassword/ForgetPassword';
import ResetPassword from './pages/Shared/ResetPassword/ResetPassword';
import CheckCategory from './services/CheckCategory';
import EditTasks from './pages/DME_SUPPLIER/EditTask';
import EditStaffPage from './pages/DME_SUPPLIER/EditStaffPage';
import AllOrderNotes from './pages/Shared/AllOrderNotes';
import EquipmentOrder from './pages/DME_SUPPLIER/EquipmentOrder/EquipmentOrder';
import NewReferral from './pages/DME_SUPPLIER/EquipmentOrder/NewReferral';
import CancelledOrder from './pages/DME_SUPPLIER/EquipmentOrder/CancelledOrder';
import Evaluation from './pages/DME_SUPPLIER/EquipmentOrder/Evaluation';
import EvaluationCompleted from './pages/DME_SUPPLIER/EquipmentOrder/EvaluationCompleted';
import PaperWork from './pages/DME_SUPPLIER/EquipmentOrder/PaperWork';
import PriorAuthStatus from './pages/DME_SUPPLIER/EquipmentOrder/PriorAuthStatus';
import PriorAuthReceived from './pages/DME_SUPPLIER/EquipmentOrder/PriorAuthReceived';
import HoldingRTO from './pages/DME_SUPPLIER/EquipmentOrder/HoldingRTO';
import RTO from './pages/DME_SUPPLIER/EquipmentOrder/RTO';
import Delivered from './pages/DME_SUPPLIER/EquipmentOrder/Delivered';
import Authorization from './pages/DME_SUPPLIER/EquipmentOrder/Authorization';
import OrderRequest from './pages/DME_SUPPLIER/EquipmentOrder/OrderRequest';



// ----------------------------------------------------------------------

export default function Router() {

  const navigate = useNavigate()



  return (
    <Routes>

      <Route path='login' element={<LoginPage />} />
      <Route path='signup' element={<SignupPage />} />
      <Route path='/' element={<Navigate to="/login" />} />

      <Route path='login/forget-password-request' element={<ForgetPassword />} />
      <Route path='forget-password-confirmation/:token' element={<ResetPassword />} />



      {/* --------------------------------------
                DME Suppler Rotes 
        ----------------------------------------*/}
      <Route path='/DME-supplier/dashboard' element={
        <AuthRoute>
          <CheckCategory category={"DME-Supplier"}>
            <DmeDashboardLayout />
          </CheckCategory>
        </AuthRoute>
      }>
        <Route index element={<Navigate to="/DME-supplier/dashboard/app" />} />
        <Route path='app' element={<DmeDashboard />} />
        {/* <Route path='order' element={<OrderPage />} /> */}

        <Route path='equipment-order' element={<EquipmentOrder />}>
          <Route index element={<NewReferral />} />
          <Route path="cancelled-order" element={<CancelledOrder />} />
          <Route path="evaluation" element={<Evaluation />} />
          <Route path="evaluation-completed" element={<EvaluationCompleted />} />
          <Route path="paperWork-in-process" element={<PaperWork />} />
          <Route path="prior-auth-status" element={<PriorAuthStatus />} />
          <Route path="prior-auth-received" element={<PriorAuthReceived />} />
          <Route path="holding-RTO" element={<HoldingRTO />} />
          <Route path="RTO" element={<RTO />} />
          <Route path="delivered" element={<Delivered />} />
          <Route path="authorization-expirations-F/U" element={<Authorization />} />
          <Route path="order-request" element={<OrderRequest />} />
        </Route>



        <Route path='add-order' element={<AddOrder />} />
        <Route path='doctor' element={<DoctorPage />} />
        <Route path='therapist' element={<TherapistPage />} />
        <Route path='patient' element={<PatientPage />} />
        <Route path='add-patient' element={<AddPatient />} />
        <Route path='staff' element={<StaffPage />} />
        <Route path='add-tasks' element={<AddTasks />} />

        <Route path='patient-document/:id' element={<UploadPatientDocuments />} />
        <Route path='order-document/:id' element={<UploadOrderDocuments />} />
        <Route path='edit-tasks/:id' element={<EditTasks />} />
        <Route path='patient-profile/:id' element={<PatientProfile />} />
        <Route path='edit-patient-profile/:id' element={<EditPatient />} />
        <Route path='DME-supplier-profile/:id' element={<DmeSupplierProfile />} />
        <Route path='edit-dme-supplier-profile/:id' element={<EditDMESupplier />} />
        <Route path='edit-staff-profile/:id' element={<EditStaffPage />} />
        <Route path='update-password/:id' element={<UpdatePassword />} />
        <Route path='edit-order/:id' element={<EditOrder />} />
        <Route path='add-patient-note/:id' element={<PatientNotes />} />
        <Route path='settings/:id' element={<Settings />} />
        <Route path='order-note-log/:id' element={<AllOrderNotes />} />
      </Route>
      {/* --------------------------------------
                DME Suppler Rotes END
        ----------------------------------------*/}

      <Route path='*' element={<Page404 />} />

    </Routes>
  )
}
