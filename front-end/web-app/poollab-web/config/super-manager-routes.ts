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
import { RiBilliardsLine } from "react-icons/ri";
import { MdEmojiEvents, MdOutlineFeedback } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";
import { LiaSalesforce } from "react-icons/lia";

export interface SubRouteConfig {
  path: string;
  label: string;
}

export interface RouteConfig {
  path: string;
  label: string;
  icon: IconType;
  subRoutes?: SubRouteConfig[];
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
    subRoutes: [
      {
        path: '/supermanager/stores/arealist',
        label: 'Cơ sở',
      },
      {
        path: '/supermanager/stores/stafflist',
        label: 'Nhân viên',
      },
    ],
  },
  {
    path: '/supermanager/staff',
    label: 'Quản lý nhân viên',
    icon: FiUsers,
    subRoutes: [
      {
        path: '/supermanager/staff/list',
        label: 'Danh sách nhân viên',
      },
      {
        path: '/supermanager/staff/management',
        label: 'Quản lý nhân viên',
      },
    ],
  },
  {
    path: '/supermanager/reports',
    label: 'Báo cáo',
    icon: FiTrendingUp,
  },
  {
    path: '/supermanager/course',
    label: 'Khóa học',
    icon: RiBilliardsLine,
  },
  {
    path: '/supermanager/events',
    label: 'Sự kiện',
    icon: MdEmojiEvents,
  },
  {
    path: '/supermanager/vouchers',
    label: 'Khuyến mãi',
    icon: LiaSalesforce,
  },
  {
    path: '/supermanager/feedbacks',
    label: 'Đánh giá',
    icon: MdOutlineFeedback,
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