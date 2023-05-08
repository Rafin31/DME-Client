// component
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
    title: 'private messages',
    path: '/DME-supplier/dashboard/private-message',
    icon: <Iconify icon="uil:comment-alt-message" />,
  },
  {
    title: 'Equipment order',
    path: '/DME-supplier/dashboard/equipment-order',
    icon: <Iconify icon="icon-park-solid:transaction-order" />,
  },
  {
    title: 'Repair order',
    path: '/DME-supplier/dashboard/repair-order',
    icon: <Iconify icon="mdi:gear" />,
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
    title: 'Client',
    path: '/DME-supplier/dashboard/patient',
    icon: <Iconify icon="mdi:patient" />,
  },

];

export default navConfig;
