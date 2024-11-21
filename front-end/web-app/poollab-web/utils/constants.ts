export const AUTH_ROUTES = {
  STAFF: '/booktable',
  MANAGER: '/manager', 
  SUPER_MANAGER: '/supermanager',
  ADMIN: '/dashboard'
};

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  LOGIN_FAILED: 'Đăng nhập thất bại',
  INVALID_STORE_STAFF: 'Invalid store ID for staff',
  INVALID_STORE_MANAGER: 'Invalid store ID for manager',
  INVALID_COMPANY_SUPER: 'Invalid company ID for super manager',
  INVALID_COMPANY_ADMIN: 'Invalid company ID for admin',
  INVALID_ROLE: 'Invalid role',
  INVALID_TOKEN: 'Invalid token format',
  GENERIC_ERROR: 'Đã xảy ra lỗi trong quá trình đăng nhập'
};