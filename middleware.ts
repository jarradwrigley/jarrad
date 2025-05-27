// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { auth } from "@/lib/auth";

// export default auth((req) => {
//   const { nextUrl } = req;
//   const isLoggedIn = !!req.auth;

//   // Don't redirect API routes
//   if (nextUrl.pathname.startsWith("/api")) {
//     return NextResponse.next();
//   }

//   // Public routes that don't require auth
//   const publicRoutes = ["/",  "/login", "/register", "/forgot-password"];
//   const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

//   // If logged in and trying to access home page, redirect to dashboard
//   if (isLoggedIn && nextUrl.pathname === "/") {
//     return NextResponse.redirect(new URL("/dashboard", nextUrl));
//   }

//   // If logged in and trying to access login, redirect to dashboard
//   if (isLoggedIn && nextUrl.pathname === "/login") {
//     return NextResponse.redirect(new URL("/dashboard", nextUrl));
//   }

//   // If not logged in and trying to access protected route, redirect to login
//   if (!isLoggedIn && !isPublicRoute) {
//     return NextResponse.redirect(new URL("/login", nextUrl));
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|images/|assets/|icons/|fonts/|favicon.ico).*)",
//   ],
// };


// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// Define protected routes that require authentication
const protectedRoutes = [
  '/admin',
  '/dashboard',
  '/profile',
  '/settings',
  '/upload',
  '/manage-tours',
  '/manage-content'
]

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/about',
  '/tour-dates',
  '/contact',
  '/blog',
  '/shop',
  '/epk',
  '/login',
  '/register',
  '/forgot-password'
]

// Define admin-only routes
const adminRoutes = [
  '/admin',
  '/manage-tours',
  '/manage-content',
  '/dashboard'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/assets') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Check if the current path is an admin route
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Get token from cookies
  const token = request.cookies.get('auth-token')?.value
  
  // If accessing a protected route without a token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If token exists, verify it
  if (token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'your-secret-key'
      )
      
      const { payload } = await jwtVerify(token, secret)
      
      // Check if token is expired
      if (payload.exp && payload.exp < Date.now() / 1000) {
        // Token expired, clear cookie and redirect to login
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('auth-token')
        return response
      }

      // Check admin access for admin routes
      if (isAdminRoute && payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }

      // Add user info to request headers for use in components
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', payload.userId as string)
      requestHeaders.set('x-user-email', payload.email as string)
      requestHeaders.set('x-user-role', payload.role as string)

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
      
    } catch (error) {
      // Invalid token, clear cookie and redirect to login if accessing protected route
      console.error('Token verification failed:', error)
      
      if (isProtectedRoute) {
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('auth-token')
        return response
      }
    }
  }

  // If user is already logged in and tries to access login page, redirect to dashboard
  if (token && pathname === '/login') {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'your-secret-key'
      )
      await jwtVerify(token, secret)
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch {
      // Invalid token, allow access to login page
      const response = NextResponse.next()
      response.cookies.delete('auth-token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (public assets)
     */
    "/((?!api|_next/static|_next/image|images/|assets/|icons/|fonts/|favicon.ico).*)",
  ],
};