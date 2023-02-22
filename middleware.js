import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export const middleware = async (req) => {
  // Token will exist if user is logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const { pathname } = req.nextUrl;

  // Allow the req only if the following is true
  // 1) Its a req for next-auth session & provider fetching
  // 2) Token exists
  if (token || pathname.includes("/api/auth")) {
    return NextResponse.next();
  }

  // Redirect users to login page if they do not have a token and they are trying to access a protected route
  if (!token && pathname !== "/login") {
    let url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
};

export const config = { matcher: ["/"] };
