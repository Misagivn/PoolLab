import { IconType } from 'react-icons';
import { 
  FiHome,
  FiTrendingUp,
  FiUsers,
  FiSettings,
  FiFileText,
  FiLogOut,
  FiDatabase
} from 'react-icons/fi';
import { MdBusinessCenter } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";

export interface RouteConfig {
  path: string;
  label: string;
  icon: IconType;
}

export const superManagerRoutes: RouteConfig[] = [
  {
    path: '/supermanager/dashpage',
    label: 'Trang Chủ',
    icon: FiHome,
  },
  {
    path: '/supermanager/stores',
    label: 'Quản lý cơ sở',
    icon: FiDatabase,
  },
  {
    path: '/supermanager/staff',
    label: 'Quản lý nhân viên',
    icon: FiUsers,
  },
  {
    path: '/supermanager/reports',
    label: 'Báo cáo',
    icon: FiTrendingUp,
  },
  {
    path: '/supermanager/mentors',
    label: 'Huấn Luyện Viên',
    icon: FiSettings,
  },
  {
    path: '/supermanager/events',
    label: 'Sự kiện',
    icon: FiSettings,
  },
  {
    path: '/supermanager/vouchers',
    label: 'Khuyến mãi',
    icon: FiSettings,
  },
  {
    path: '/supermanager/feedbacks',
    label: 'Đánh giá',
    icon: FiSettings,
  },
  {
    path: '/supermanager/info',
    label: 'Tài khoản',
    icon: VscAccount,
  },
  {
    path: '/',
    label: 'Thoát',
    icon: FiLogOut,
  },
];