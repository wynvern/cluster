"use server";

import { NextResponse } from "next/server";

export async function GET(req: Request) {
	return NextResponse.json({ publicVAPID: process.env.VAPID_PUBLIC_KEY });
}
