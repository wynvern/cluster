import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.[0-9a-z]+$/i;

export default async function middleware(req: NextRequest) {
	const url = new URL(req.url);
	const session = await getToken({ req });

	console.log(url.pathname);

	// New exclude system to handle evey single page
	if (
		url.pathname.startsWith("/_next") || // exclude Next.js internals
		url.pathname.startsWith("/api") || //  exclude all API routes
		url.pathname.startsWith("/static") || // exclude static files
		PUBLIC_FILE.test(url.pathname) // exclude all files in the public folder
	) {
		return NextResponse.next();
	}

	if (!session) {
		if (
			!url.pathname.includes("/signin") &&
			!url.pathname.includes("/signup") &&
			!url.pathname.includes("reset-password")
		) {
			return NextResponse.redirect(new URL("/signin", req.url));
		}
	} else {
		if (!session.emailVerified && !url.pathname.includes("/verify-email")) {
			return NextResponse.redirect(new URL("/verify-email", req.url));
		}
		if (session.emailVerified && url.pathname.includes("/verify-email")) {
			return NextResponse.redirect(new URL("/", req.url));
		}
		if (
			session.username &&
			url.pathname.includes("/complete-profile") &&
			session.emailVerified
		) {
			return NextResponse.redirect(new URL("/", req.url));
		}
		if (
			url.pathname.includes("/login") ||
			url.pathname.includes("/signup")
		) {
			return NextResponse.redirect(new URL("/", req.url));
		}
		if (
			!session.username &&
			!url.pathname.includes("/complete-profile") &&
			session.emailVerified
		) {
			return NextResponse.redirect(new URL("/complete-profile", req.url));
		}
	}
}

export const config = {
	matcher: ["/:path*"],
};
