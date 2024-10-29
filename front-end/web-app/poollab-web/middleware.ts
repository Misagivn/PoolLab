import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Lấy token từ localStorage
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;
  const path = request.nextUrl.pathname;

  // Cho phép truy cập public routes mà không cần authentication
  const publicRoutes = ['/login'];
  if (publicRoutes.includes(path)) {
    // Nếu đã login, redirect về trang tương ứng với role
    if (token && role) {
      switch (role) {
        case 'staff':
          return NextResponse.redirect(new URL('/booktable', request.url));
        case 'manager':
          return NextResponse.redirect(new URL('/table', request.url));
        case 'supermanager':
        case 'admin':
          return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  // Kiểm tra authentication cho protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Kiểm tra authorization dựa trên role
  if (path.startsWith('/booktable')) {
    if (role !== 'staff') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Chỉ áp dụng middleware cho các route cần thiết
export const config = {
  matcher: [
    '/booktable/:path*',
    '/table/:path*',
    '/dashboard/:path*',
    '/login'
  ]
};
