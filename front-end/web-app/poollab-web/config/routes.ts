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
    path: '/manager/drinks',
    label: 'Đồ uống',
    icon: FiShoppingCart,
  },
  {
    path: '/manager/orders',
    label: 'Đơn hàng',
    icon: FiFileText,
  },
  {
    path: '/manager/info',
    label: 'Thông tin',
    icon: FiMessageSquare,
  },
  {
    path: '/',
    label: 'Thoát',
    icon: FiLogOut,
  },
];