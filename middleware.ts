// // import { NextResponse } from "next/server";
// // import type { NextRequest } from "next/server";
// // import { auth } from "@/lib/auth";

// // export default auth((req) => {
// //   const { nextUrl } = req;
// //   const isLoggedIn = !!req.auth;

// //   // Don't redirect API routes
// //   if (nextUrl.pathname.startsWith("/api")) {
// //     return NextResponse.next();
// //   }

// //   // Public routes that don't require auth
// //   const publicRoutes = ["/",  "/login", "/register", "/forgot-password"];
// //   const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

// //   // If logged in and trying to access home page, redirect to dashboard
// //   if (isLoggedIn && nextUrl.pathname === "/") {
// //     return NextResponse.redirect(new URL("/dashboard", nextUrl));
// //   }

// //   // If logged in and trying to access login, redirect to dashboard
// //   if (isLoggedIn && nextUrl.pathname === "/login") {
// //     return NextResponse.redirect(new URL("/dashboard", nextUrl));
// //   }

// //   // If not logged in and trying to access protected route, redirect to login
// //   if (!isLoggedIn && !isPublicRoute) {
// //     return NextResponse.redirect(new URL("/login", nextUrl));
// //   }

// //   return NextResponse.next();
// // });

// // export const config = {
// //   matcher: [
// //     "/((?!api|_next/static|_next/image|images/|assets/|icons/|fonts/|favicon.ico).*)",
// //   ],
// // };

// import { getToken } from "next-auth/jwt";
// import { NextRequest, NextResponse } from "next/server";

// const protectedRoutes = [
//   "/admin",
//   "/dashboard",
//   "/profile",
//   "/settings",
//   "/upload",
//   "/manage-tours",
//   "/manage-content",
//   "/admin/dashboard",
// ];

// const publicRoutes = [
//   "/",
//   "/about",
//   "/tour-dates",
//   "/contact",
//   "/blog",
//   "/shop",
//   "/epk",
//   "/login",
//   "/register",
//   "/forgot-password",
// ];

// type SessionUser = {
//   roles: string[];
//   [key: string]: any;
// };

// type Session = {
//   user?: SessionUser;
//   [key: string]: any;
// };

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   const session = (await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET,
//   })) as Session;

//   // Skip internal/static paths
//   if (
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/api") ||
//     pathname.startsWith("/assets") ||
//     pathname.includes(".")
//   ) {
//     return NextResponse.next();
//   }

//   const isProtectedRoute = protectedRoutes.some((route) =>
//     pathname.startsWith(route)
//   );

//   // Redirect unauthenticated users trying to access protected routes
//   if (isProtectedRoute && !session) {
//     const loginUrl = new URL("/login", request.url);
//     loginUrl.searchParams.set("redirect", pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//   // Redirect authenticated users away from login page
//   if (session && pathname === "/login") {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   if (pathname === "/admin") {
//     if (!session ) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     } 
    
//     if (session && !session.roles?.includes("admin")) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//   }

//   // if (pathname.startsWith("/admin") ) {
//   //   if (!session || !session?.roles.includes("admin")) {
//   //     return NextResponse.redirect(new URL("/login", request.url));
//   //   }
//   // }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|images/|assets/|icons/|fonts/|favicon.ico).*)",
//   ],
// };


import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/admin",
  "/dashboard",
  "/profile",
  "/settings",
  "/upload",
  "/manage-tours",
  "/manage-content",
];

const publicRoutes = [
  "/",
  "/about",
  "/tour-dates",
  "/contact",
  "/blog",
  "/shop",
  "/epk",
  "/login",
  "/register",
  "/forgot-password",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal/static paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    pathname.includes(".") // Skip files with extensions
  ) {
    return NextResponse.next();
  }

  try {
    // Get the token/session
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    console.log("Middleware - Path:", pathname);
    console.log("Middleware - Token exists:", !!token);
    console.log("Middleware - User roles:", token?.roles || "No roles");

    const isLoggedIn = !!token;
    // Ensure userRoles is always an array
    const userRoles = Array.isArray(token?.roles) ? token.roles : [];

    // Handle admin routes specifically
    if (pathname.startsWith("/admin")) {
      if (!isLoggedIn) {
        console.log("Admin route - Not logged in, redirecting to login");
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (!userRoles.includes("admin")) {
        console.log("Admin route - Not admin, redirecting to home");
        console.log("Admin route - User roles:", userRoles);
        return NextResponse.redirect(new URL("/", request.url));
      }

      console.log("Admin route - Access granted");
      return NextResponse.next();
    }

    // Check if current path is a protected route
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // Redirect unauthenticated users trying to access protected routes
    if (isProtectedRoute && !isLoggedIn) {
      console.log("Protected route - Not logged in, redirecting to login");
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users away from login page
    if (isLoggedIn && pathname === "/login") {
      console.log("Logged in user accessing login, redirecting to home");
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // If there's an error getting the token, treat as unauthenticated
    const isProtectedRoute =
      protectedRoutes.some((route) => pathname.startsWith(route)) ||
      pathname.startsWith("/admin");

    if (isProtectedRoute) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};