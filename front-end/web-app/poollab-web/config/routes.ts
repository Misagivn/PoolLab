import { IconType } from 'react-icons';
import { 
  FiHome,
  FiTrendingUp,
  FiUsers,
  FiBox,
  FiShoppingCart,
  FiFileText,
  FiMessageSquare,
  FiLogOut
} from 'react-icons/fi';
import { PiMapPinAreaBold } from "react-icons/pi";
import { VscAccount } from "react-icons/vsc";

export interface RouteConfig {
  path: string;
  label: string;
  icon: IconType;
}

export const routes: RouteConfig[] = [
  {
    path: '/manager/dashpage',
    label: 'Trang Chủ',
    icon: FiHome,
  },
  {
    path: '/manager/area',
    label: 'Khu vực',
    icon: PiMapPinAreaBold,
  },
  {
    path: '/manager/staff',
    label: 'Nhân viên',
    icon: FiUsers,
  },
  {
    path: '/manager/tables',
    label: 'Bàn',
    icon: FiBox,
  },
  {
    path: '/manager/products',
    label: 'Hàng hóa',
    icon: FiShoppingCart,
  },
  {
    path: '/manager/orders',
    label: 'Đơn hàng',
    icon: FiFileText,
  },
  {
    path: '/manager/info',
    label: 'Tài khoản',
    icon: VscAccount,
  },
  {
    path: '/',
    label: 'Thoát',
    icon: FiLogOut,
  },
];