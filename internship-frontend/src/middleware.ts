import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("authToken");
    if (!token) {
      return NextResponse.redirect(new URL("/login/admin", request.url));
    }

    const isAccess = await verifyToken(token.value);

    if (!isAccess) {
      return NextResponse.redirect(new URL("/login/admin", request.url));
    }

    if (isAccess !== "Employee" && isAccess !== "Admin") {
      return NextResponse.redirect(new URL("/login/admin", request.url));
    }

    return NextResponse.next();
  }
  if (
    request.nextUrl.pathname.startsWith("/order-history") ||
    request.nextUrl.pathname.startsWith("/cart") ||
    request.nextUrl.pathname.startsWith("/profile")
  ) {
    const loginUrl = new URL("/login", request.url);
    const redirectUrl = encodeURIComponent(request.nextUrl.pathname);
    loginUrl.searchParams.set("redirectUrl", redirectUrl);
    const token = request.cookies.get("authToken");
    if (!token) {
      return NextResponse.redirect(loginUrl);
    }

    const isAccess = await verifyToken(token.value);

    if (!isAccess) {
      return NextResponse.redirect(loginUrl);
    }

    if (isAccess !== "Customer") {
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }
  if (
    request.nextUrl.pathname.startsWith("/product") ||
    request.nextUrl.pathname.startsWith("/category")
  ) {
    const loginUrl = new URL("/login", request.url);
    const redirectUrl = encodeURIComponent(request.nextUrl.pathname);
    loginUrl.searchParams.set("redirectUrl", redirectUrl);
    const token = request.cookies.get("authToken");
    if (!token) {
      return NextResponse.next();
    }

    const isAccess = await verifyToken(token.value);

    if (isAccess !== "Customer") {
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }
}

async function verifyToken(token: string) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/Auth/verify-token?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    //console.log(data);

    if (!data.success) {
      return null;
    }
    return data.data;
  } catch (error) {
    return null;
  }
}
