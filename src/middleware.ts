import Nextauth from "./app/pages/api/auth/[..nextauth]";

export default Nextauth.auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== "/login") {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|login).*)"],
};
