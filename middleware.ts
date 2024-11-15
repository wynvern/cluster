import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";
import { getMemberRole } from "./lib/db/group/groupMember";

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

	// if the user is trying to access the manage route of a group he is not the owner
	const regex = /(?<=\/group\/)(.+?)(?=\/manage)/;

	if (url.pathname.endsWith("manage")) {
		console.log("manage route");
		const groupname = (url.pathname.match(regex) || [])[0];
		if (groupname) {
			const response = await fetch(
				`${req.nextUrl.origin}/api/middleware/manage-group`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ groupname, userId: session?.id }),
				},
			);
			const { status } = await response.json();

			if (!status) {
				return NextResponse.redirect(new URL(`/group/${groupname}`, req.url));
			}
		}
	}

	const abc = redirection.findIndex(
		(rule) =>
			rule.redirection.condition && url.pathname.startsWith(rule.location),
	);

	if (abc === -1) {
		return NextResponse.next();
	}

	const redirectUrl = new URL(redirection[abc].redirection.to, req.url);
	return NextResponse.redirect(redirectUrl);
}

// TODO: Check if is up to date with all the routes
export const config = {
	matcher: [
		"/",
		"/signin",
		"/signup",
		"/verify-email",
		"/reset-password",
		"/complete-profile",
		"/post/:path*",
		"/group",
		"/group/:path*",
		"/search",
		"/user/:path*",
		"/settings",
		"/settings/:path*",
		"/chat",
		"/chat/:path*",
	],
};
