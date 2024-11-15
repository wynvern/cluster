import { getMemberRoleByGroupname } from "@/lib/db/group/groupMember";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const body = await req.json();
	const { userId, groupname } = body;

	const role = await getMemberRoleByGroupname({ groupname, userId });

	return NextResponse.json({
		status: role === "owner",
	});
}
