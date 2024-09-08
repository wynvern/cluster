import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";

const excludedPrefixes = [
	"/_next",
	"/api",
	"/static",
	"/brand",
	"/font",
	"/service-worker",
	"/manifest",
	"/external",
	"/login",
	"/favicon",
];

interface RedirectStatement {
	redirection: {
		condition: boolean;
		to: string;
	};
	location: string;
}

export default async function middleware(req: NextRequest) {
	const url = new URL(req.url);
	const session = await getToken({ req });

	if (excludedPrefixes.some((prefix) => url.pathname.startsWith(prefix))) {
		return NextResponse.next();
	}

	// Mini API to handle redirects
	// The route / means any route
	const redirection: RedirectStatement[] = [
		{
			location: "/signin",
			redirection: { condition: Boolean(session), to: "/" },
		},
		{
			location: "/signup",
			redirection: { condition: Boolean(session), to: "/" },
		},
		{
			location: "/verify-email",
			redirection: {
				// @ts-ignore
				condition: !session && !session?.emailVerified,
				to: "/",
			},
		},
		{
			location: "/reset-password",
			redirection: { condition: Boolean(session), to: "/" },
		},
		{
			location: "/complete-profile",
			redirection: {
				condition: Boolean(session) && Boolean(session?.username),
				to: "/",
			},
		},
		{
			location: "/",
			redirection: {
				condition:
					Boolean(session) &&
					!session?.emailVerified &&
					!url.pathname.startsWith("/verify-email"),
				to: "/verify-email",
			},
		},
		{
			location: "/",
			redirection: {
				condition:
					!session &&
					!url.pathname.includes("/signin") &&
					!url.pathname.includes("/signup") &&
					!url.pathname.includes("/reset-password") &&
					!url.pathname.includes("/verify-email"),
				to: "/signin",
			},
		},
		{
			location: "/",
			redirection: {
				condition:
					Boolean(session) &&
					!session?.username &&
					Boolean(session?.emailVerified) &&
					!url.pathname.includes("/complete-profile"),
				to: "/complete-profile",
			},
		},
	];

	const abc = redirection.findIndex(
		(rule) =>
			rule.redirection.condition && url.pathname.startsWith(rule.location)
	);

	if (abc === -1) return NextResponse.next();
	return NextResponse.redirect(
		new URL(redirection[abc].redirection.to, req.url)
	);
}

export const config = {
	matcher: ["/:path*"],
};
