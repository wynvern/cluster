"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { db } from "./db";
import * as webPush from "web-push";

webPush.setVapidDetails(
	"mailto:wynvernn@gmail.com",
	process.env.VAPID_PUBLIC_KEY || "",
	process.env.VAPID_PRIVATE_KEY || ""
);

export default async function registerSubscription({
	subscription,
}: {
	subscription: string;
}) {
	const session = await getServerSession(authOptions);
	if (!session?.user) return false;

	await db.subscription.create({
		data: {
			subscription: subscription,
			userId: session?.user?.id,
		},
	});

	console.log("subscription registered");
	return "ok";
}

export async function sendNotification({
	receiverUserId,
	message,
}: {
	receiverUserId: string;
	message: {
		title: string;
		body: string;
	};
}) {
	const subscriptions = await db.subscription.findMany({
		where: {
			userId: receiverUserId,
		},
	});

	await db.notification.create({
		data: {
			title: message.title,
			body: message.body,
			userId: receiverUserId,
		},
	});

	for (const sub of subscriptions) {
		console.log(sub.subscription);
		const pushSubscription: webPush.PushSubscription =
			sub.subscription as unknown as webPush.PushSubscription;

		webPush.sendNotification(pushSubscription, JSON.stringify(message));
	}
}
