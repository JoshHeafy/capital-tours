import { NextResponse, NextRequest } from "next/server";
import verifySession from "./library/auth";

export async function middleware(request: NextRequest) {
  let myToken = request.cookies.get("token")?.value;

  const loginUrl = new URL("/", request.url);
  loginUrl.searchParams.set("from", request.nextUrl.pathname);

  async function checkSession() {
    let logged = await verifySession(myToken);

    if (logged && myToken) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(loginUrl);
    }
  }

  return await checkSession();
}

export const config = {
  matcher: ["/admin"],
};
