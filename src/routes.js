import { Navigate, Route, Routes } from 'react-router-dom';

import DmeDashboardLayout from './layouts/dashboard';

import LoginPage from './pages/Authentication/LoginPage';
import Page404 from './pages/Shared/Page404';
import DmeDashboard from './pages/DME_SUPPLIER/DmeDashboard';
import AddOrder from './pages/DME_SUPPLIER/AddOrder';
import DoctorPage from './pages/DME_SUPPLIER/DoctorPage';
import AddTasks from './pages/DME_SUPPLIER/AddTasks';
import PatientPage from './pages/DME_SUPPLIER/PatientPage';
import TherapistPage from './pages/DME_SUPPLIER/TherapistPage';
import StaffPage from './pages/DME_SUPPLIER/StaffPage';
import AuthRoute from './services/AuthRoute';
import AddPatient from './pages/DME_SUPPLIER/AddPatient';
import UploadPatientDocuments from './pages/DME_SUPPLIER/UploadPatientDocuments';
import UserProfile from './pages/DME_SUPPLIER/UserProfile';
import EditUser from './pages/DME_SUPPLIER/EditUser';
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
import { CheckCategory } from './services/CheckCategory';
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
import RepairOrder from './pages/DME_SUPPLIER/RepairOrder/RepairOrder';
import PRR from './pages/DME_SUPPLIER/RepairOrder/PRR';
import Cancelled from './pages/DME_SUPPLIER/RepairOrder/Cancelled';
import PendingRx from './pages/DME_SUPPLIER/RepairOrder/PendingRx';
import PendingAssess from './pages/DME_SUPPLIER/RepairOrder/PendingAssess';
import Workup from './pages/DME_SUPPLIER/RepairOrder/Workup';
import PaStatus from './pages/DME_SUPPLIER/RepairOrder/PaStatus';
import RTOStatus from './pages/DME_SUPPLIER/RepairOrder/RTOStatus';
import PendingParts from './pages/DME_SUPPLIER/RepairOrder/PendingParts';
import PendingScheduling from './pages/DME_SUPPLIER/RepairOrder/PendingScheduling';
import Completed from './pages/DME_SUPPLIER/RepairOrder/Completed';
import VeteranOrder from './pages/DME_SUPPLIER/VeteranOrders/VeteranOrder';
import Equip from './pages/DME_SUPPLIER/VeteranOrders/Equip';
import NewRepair from './pages/DME_SUPPLIER/VeteranOrders/NewRepair';
import RcvdPend from './pages/DME_SUPPLIER/VeteranOrders/RcvdPend';
import EstimateSent from './pages/DME_SUPPLIER/VeteranOrders/EstimateSent';
import PoRecieved from './pages/DME_SUPPLIER/VeteranOrders/PoRecieved';
import PartsOrderedByVAMC from './pages/DME_SUPPLIER/VeteranOrders/PartsOrderedByVAMC';
import PartsOrderedByGCM from './pages/DME_SUPPLIER/VeteranOrders/PartsOrderedByGCM';
import VeteranPendingScheduling from './pages/DME_SUPPLIER/VeteranOrders/VeteranPendingScheduling';
import VeteranCompleted from './pages/DME_SUPPLIER/VeteranOrders/VeteranCompleted';
import VeteranPage from './pages/DME_SUPPLIER/VeteranPage';
import AddVeteran from './pages/DME_SUPPLIER/AddVeteran';
import VAProstheticPage from './pages/DME_SUPPLIER/VAProstheticPage';
import EditVaProstheticPage from './pages/DME_SUPPLIER/EditVaProsthetic';
import OrderHistory from './pages/DME_SUPPLIER/OrderHistory/OrderHistory';
import PrivateMessagePage from './pages/Shared/PrivateMessage/PrivateMessagePage';
import { PrivateMessageContext } from './Context/PrivateMessageContext';
import Chat from './pages/Shared/PrivateMessage/Chat';
import AddDoctor from './pages/DME_SUPPLIER/AddDoctor';
import AddTherapist from './pages/DME_SUPPLIER/AddTherapist';
import DoctorNotes from './pages/DME_SUPPLIER/DoctorNote';
import SelectDME from './pages/Authentication/SelectDME';
import { PatientSignupContext } from './Context/PatientSignupContext';
import AllEquipmentOrder from './pages/DME_SUPPLIER/EquipmentOrder/AllEquipmentOrder';
import AllRepairOrder from './pages/DME_SUPPLIER/RepairOrder/AllRepairOrder';
import AllVeteranOrder from './pages/DME_SUPPLIER/VeteranOrders/AllVeteranOrder';
import PatientStates from './pages/DME_SUPPLIER/PatientStates/PatientStates';
import ClientCurrentOrders from './pages/DME_SUPPLIER/PatientStates/ClientCurrentOrders';
import ClientOrderHistory from './pages/DME_SUPPLIER/PatientStates/ClientOrderHistory';



// ----------------------------------------------------------------------

export default function Router() {


  return (
    <Routes>

      <Route path='login' element={<LoginPage />} />
      <Route path='signup' element={
        <PatientSignupContext>
          <SignupPage />
        </PatientSignupContext>
      } />
      <Route path='signup/patient/selectDme' element={
        <PatientSignupContext>
          <SelectDME />
        </PatientSignupContext>
      } />
      <Route path='/' element={<Navigate to="/login" />} />

      <Route path='login/forget-password-request' element={<ForgetPassword />} />
      <Route path='forget-password-confirmation/:token' element={<ResetPassword />} />



      {/* --------------------------------------
                DME Suppler Rotes 
        ----------------------------------------*/}
      <Route path='/DME-supplier/dashboard' element={
        <AuthRoute>
          <CheckCategory category={"DME-Supplier, DME-Staff"}>
            <DmeDashboardLayout />
          </CheckCategory>
        </AuthRoute>
      }>
        <Route index element={<Navigate to="/DME-supplier/dashboard/app" />} />
        <Route path='app' element={<DmeDashboard />} />


        <Route path='equipment-order' element={<EquipmentOrder />}>
          <Route index element={<AllEquipmentOrder />} />
          <Route path="new-referral-order" element={<NewReferral />} />
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


        <Route path='repair-order' element={<RepairOrder />}>
          <Route index element={<AllRepairOrder />} />
          <Route path="prr-order" element={<PRR />} />
          <Route path="cancelled-order" element={<Cancelled />} />
          <Route path="pending-rx" element={<PendingRx />} />
          <Route path="pending-assess" element={<PendingAssess />} />
          <Route path="workup" element={<Workup />} />
          <Route path="pa-status" element={<PaStatus />} />
          <Route path="rto-status" element={<RTOStatus />} />
          <Route path="pending-parts" element={<PendingParts />} />
          <Route path="pending-schedule" element={<PendingScheduling />} />
          <Route path="completed" element={<Completed />} />
        </Route>


        <Route path='veteran-order' element={<VeteranOrder />}>
          <Route index element={<AllVeteranOrder />} />
          <Route path="equip-order" element={<Equip />} />
          <Route path="new-repair" element={<NewRepair />} />
          <Route path="rcvd-pend-schdling" element={<RcvdPend />} />
          <Route path="estimate-sent" element={<EstimateSent />} />
          <Route path="po-received" element={<PoRecieved />} />
          <Route path="parts-ordered-by-vamc" element={<PartsOrderedByVAMC />} />
          <Route path="parts-ordered-by-gcm" element={<PartsOrderedByGCM />} />
          <Route path="pending-scheduling" element={<VeteranPendingScheduling />} />
          <Route path="completed" element={<VeteranCompleted />} />
        </Route>

        <Route path='patient-states/:id' element={<PatientStates />} >
          <Route index element={<ClientCurrentOrders />} />
          <Route path="order-history" element={<ClientOrderHistory />} />
        </Route>



        <Route path='add-order' element={<AddOrder />} />
        <Route path='doctor' element={<DoctorPage />} />
        <Route path="add-doctor" element={<AddDoctor />} />
        <Route path='therapist' element={<TherapistPage />} />
        <Route path='add-therapist' element={<AddTherapist />} />
        <Route path='patient' element={<PatientPage />} />
        <Route path='add-patient' element={<AddPatient />} />
        <Route path='staff' element={
          <CheckCategory category={"DME-Supplier"}>
            <StaffPage />
          </CheckCategory>

        } />
        <Route path='add-tasks' element={<AddTasks />} />


        <Route path='veteran' element={<VeteranPage />} />
        <Route path='add-veteran' element={<AddVeteran />} />
        <Route path='va-prosthetics-staff' element={<VAProstheticPage />} />


        <Route path='private-message' element={
          <PrivateMessageContext>
            <PrivateMessagePage />
          </PrivateMessageContext>
        } />
        <Route path='private-message/chat/:id' element={
          <PrivateMessageContext>
            <Chat />
          </PrivateMessageContext>
        } />




        <Route path='patient-document/:id' element={<UploadPatientDocuments />} />
        <Route path='order-history/:id' element={<OrderHistory />} />
        <Route path='order-document/:id' element={<UploadOrderDocuments />} />
        <Route path='edit-tasks/:id' element={<EditTasks />} />
        <Route path='user-profile/:id' element={<UserProfile />} />
        <Route path='edit-user-profile/:id' element={<EditUser />} />
        <Route path='DME-supplier-profile/:id' element={<DmeSupplierProfile />} />
        <Route path='edit-dme-supplier-profile/:id' element={<EditDMESupplier />} />
        <Route path='edit-staff-profile/:id' element={<EditStaffPage />} />
        <Route path='update-password/:id' element={<UpdatePassword />} />
        <Route path='edit-order/:id' element={<EditOrder />} />
        <Route path='add-patient-note/:id' element={<PatientNotes />} />
        <Route path='add-doctor-note/:id' element={<DoctorNotes />} />
        <Route path='settings/:id' element={<Settings />} />
        <Route path='order-note-log/:id' element={<AllOrderNotes />} />
        <Route path='edit-va-prosthetics-staff/:id' element={<EditVaProstheticPage />} />
      </Route>
      {/* --------------------------------------
                DME Suppler Rotes END
        ----------------------------------------*/}

      <Route path='*' element={<Page404 />} />

    </Routes>
  )
}
