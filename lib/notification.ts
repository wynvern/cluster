"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { db } from "./db";
import * as webPush from "web-push";

webPush.setVapidDetails(
	"mailto:wynvernn@gmail.com",
	process.env.VAPID_PUBLIC_KEY || "",
	process.env.VAPID_PRIVATE_KEY || "",
);

export default async function registerSubscription({
	subscription,
}: {
	subscription: string;
}) {
	const session = await getServerSession(authOptions);
	if (!session?.user.id || !session.user) return false;

	try {
		await db.subscription.create({
			data: {
				subscription: subscription,
				userId: session?.user?.id,
			},
		});
	} catch (e) {
		console.error(e);
		return "error";
	}

	return "ok";
}

// This function creates a notification on the database and sends it to the user's subscriptions
// It sends a socket message to the user's client to update the notifications
export async function sendNotification({
	receiverUserId,
	message,
}: {
	receiverUserId: string;
	message: {
		title: string;
		body: string;
		image?: string;
		url?: string;
	};
}) {
	const subscriptions = await db.subscription.findMany({
		where: {
			userId: receiverUserId,
		},
	});

	const cretedNotification = await db.notification.create({
		data: {
			title: message.title,
			body: message.body,
			userId: receiverUserId,
			image: message.image,
			link: message.url,
		},
		select: {
			viewed: true,
			createdAt: true,
			id: true,
			body: true,
			title: true,
			image: true,
			link: true,
			userId: true,
		},
	});

	for (const sub of subscriptions) {
		const pushSubscription: webPush.PushSubscription =
			sub.subscription as unknown as webPush.PushSubscription; // Cast necessary due to not knowing the type

		webPush.sendNotification(pushSubscription, JSON.stringify(message));
	}

	await sendLiveSocketNotification({
		receiverUserId,
		message: cretedNotification,
	});
}

async function sendLiveSocketNotification({
	receiverUserId,
	message,
}: {
	receiverUserId: string;
	message: any;
}) {
	const io = require("socket.io-client");
	const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "");

	socket.emit("serverForwardNotification", {
		receiverUserId,
		message,
	});
}

export async function dimissNotifications() {
	const session = await getServerSession(authOptions);
	if (!session?.user.id || !session.user) return false;

	await db.notification.updateMany({
		where: {
			userId: session.user.id,
		},
		data: {
			viewed: true,
		},
	});

	return "ok";
}
