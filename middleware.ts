import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  // Paths to protect (and all sub-routes)
  const protectedRoutes = ["/account"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    return Response.redirect(new URL(`/sign-in?callbackUrl=${callbackUrl}`, nextUrl));
  }
});

// Matcher to run middleware on all routes except static assets/API routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|brand|lead-magnets).*)"],
};
