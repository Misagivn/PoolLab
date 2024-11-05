// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get token from localStorage (stored in cookies for middleware access)
  const token = request.cookies.get('auth-token')?.value
  
  // Get the current path
  const path = request.nextUrl.pathname
  
  // Public paths that don't need authentication
  const publicPaths = ['/', '/login']
  
  // Check if the current path is public
  const isPublicPath = publicPaths.includes(path)
  
  // If path requires authentication and no token exists
  if (!isPublicPath && !token) {
    // Redirect to login page
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // If we have a token and trying to access login page, redirect to appropriate dashboard
  if (token && isPublicPath) {
    // Get role from cookies
    const role = request.cookies.get('user-role')?.value
    
    // Determine redirect path based on role
    let redirectPath = '/booktable' // default path
    if (role === 'manager') {
      redirectPath = '/manager/dashpage'
    } else if (role === 'admin') {
      redirectPath = '/dashboard'
    }
    
    return NextResponse.redirect(new URL(redirectPath, request.url))
  }
  
  return NextResponse.next()
}

// Configure the paths that should be checked by middleware
export const config = {
  matcher: [
    '/',
    '/login',
    '/booktable',
    '/dashboard',
    '/manager/dashpage',
    // Add other protected routes here
  ]
}