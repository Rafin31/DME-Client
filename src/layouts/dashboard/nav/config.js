// component
import { MdOutlineBorderColor } from 'react-icons/md'
import { BiPlusMedical } from 'react-icons/bi'
import { TbPhysotherapist } from 'react-icons/tb'
// import { BiPlusMedical } from 'react-icons/bi'
// import { BiPlusMedical } from 'react-icons/bi'
import SvgColor from '../../../components/svg-color';
import Iconify from "../../../components/iconify"


// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/DME-supplier/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'order',
    path: '/DME-supplier/dashboard/order',
    icon: <Iconify icon="icon-park-solid:transaction-order" />,
  },
  {
    title: 'doctor',
    path: '/DME-supplier/dashboard/doctor',
    icon: <Iconify icon="fluent:doctor-12-filled" />,
  },
  {
    title: 'Therapist',
    path: '/DME-supplier/dashboard/therapist',
    icon: <Iconify icon="tabler:physotherapist" />,
  },
  {
    title: 'Patient',
    path: '/DME-supplier/dashboard/patient',
    icon: <Iconify icon="mdi:patient" />,
  },
  {
    title: 'Staff',
    path: '/DME-supplier/dashboard/staff',
    icon: <Iconify icon="medical-icon:care-staff-area" />,
  },
];

export default navConfig;
