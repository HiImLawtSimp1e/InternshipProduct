import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/dashboard") {
    const token = request.cookies.get("authToken");
    if (!token) {
      return NextResponse.redirect(new URL("/login/admin", request.url));
    }

    const isAccess = await verifyToken(token.value);

    if (!isAccess) {
      return NextResponse.redirect(new URL("/login/admin", request.url));
    }

    if (isAccess !== "Employee" && isAccess !== "Admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }
  if (
    request.nextUrl.pathname === "/order-history" ||
    request.nextUrl.pathname === "/cart" ||
    request.nextUrl.pathname === "/profile"
  ) {
    const token = request.cookies.get("authToken");
    if (!token) {
      return NextResponse.rewrite(new URL("/login", request.url));
    }

    const isAccess = await verifyToken(token.value);

    if (!isAccess) {
      return NextResponse.rewrite(new URL("/login", request.url));
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
    console.log(data);

    if (!data.success) {
      return null;
    }
    return data.data;
  } catch (error) {
    return null;
  }
}
