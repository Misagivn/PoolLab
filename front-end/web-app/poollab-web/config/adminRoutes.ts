import { Icon } from "next/dist/lib/metadata/types/metadata-types";
import { IconType } from "react-icons";
import { FiDollarSign, FiHome, FiLogOut, FiSettings, FiUsers } from "react-icons/fi";
import { VscAccount } from "react-icons/vsc";


export interface SubRouteConfig{
  path: string;
  label: string;
}

export interface RouteConfig{
  path: string;
  label: string;
  icon: IconType;
  subRoutes?:SubRouteConfig[];
}

export const adminRoutes: RouteConfig[] = [
  {
    path: '/dashboard/dashpage',
    label: 'Trang Chủ',
    icon: FiHome,
  },
  {
    path: '/dashboard/members',
    label: 'Thành Viên',
    icon: FiUsers,
  },
  {
    path: '/dashboard/transactions',
    label: 'Giao dịch',
    icon: FiDollarSign,
  },
  {
    path: '/dashboard/config',
    label: 'Cấu Hình',
    icon: FiSettings,
  },
  {
    path: '/dashboard/info',
    label: 'Tài khoản',
    icon: VscAccount,
  },
  {
    path: '/',
    label: 'Thoát',
    icon: FiLogOut,
  },
];