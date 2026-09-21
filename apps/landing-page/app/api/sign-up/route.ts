import { createClerkClient, verifyToken } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const roles = ["client", "freelancer"];

type SignupRole = (typeof roles)[number];

const isSignupRole = (value: string | null): value is SignupRole =>
  roles.some((role) => role === value);

function redirectToError(request: NextRequest, reason: string) {
  const errorUrl = new URL("/error", request.url);

  errorUrl.searchParams.set("reason", reason);

  return NextResponse.redirect(errorUrl);
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const role = request.nextUrl.searchParams.get("role");

  const secretKey = process.env.CLERK_SECRET_KEY;

  if (!role || !token) {
    return redirectToError(request, "Missing key signup details");
  }

  if (!isSignupRole(role)) {
    return redirectToError(request, "invalid_role");
  }

  if (!secretKey) {
    console.error("CLERK_SECRET_KEY is not configured");
    return redirectToError(request, "authentication_unavailable");
  }

  try {
    const claims = await verifyToken(token, {
      secretKey,
    });

    const clerk = createClerkClient({ secretKey });

    const user = await clerk.users.getUser(claims.sub);

    if (user.unsafeMetadata.role !== role) {
      return redirectToError(request, "role_mismatch");
    }
  } catch (error) {
    console.error("Clerk signup verification failed.", error);
    return redirectToError(request, "invalid_or_expired_token");
  }

  try {
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/signup`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Types": "application/json",
        },
        body: JSON.stringify({ role }),
        cache: "no-store",
      },
    );

    if (!backendResponse.ok) {
      console.error(
        `Backend signup failed with status ${backendResponse.status}`,
      );
      return redirectToError(request, "backend_signup_failed");
    }

    const dashboardUrl =
      role === "client"
        ? process.env.CLIENT_DASHBOARD
        : process.env.FREELANCER_DASHBOARD;

    return NextResponse.redirect(new URL("/profile/edit", dashboardUrl), 303);
  } catch (error) {
    console.error(`Backend signup forwarding  failed, ${error}`);
    return redirectToError(request, "backend_signup_failed");
  }
}
