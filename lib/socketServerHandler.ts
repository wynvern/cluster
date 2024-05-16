import type { Server, Socket } from "socket.io";
import { db } from "./db";
import { compressImage } from "./image";
import { put } from "@vercel/blob";
import { sendNotification } from "./notification.js";

interface MessageData {
	content: string;
	chatId: string;
	userId: string;
	media?: string[];
}

interface Group {
	id: string;
}

interface User {
	userId: string;
}

const socketToUser = new Map<string, string>();

const socketHandlers = (io: Server, socket: Socket) => {
	socket.on("authenticate", (data: { session: string }) => {
		if (data.session) return false;
		socketToUser.set(socket.id, data.session);
	});

	socket.on("joinGroup", (data: string) => {
		// TODO: Authenticate if the user is present at that group
		socket.join(data);
	});

	socket.on("sendMessage", (data: MessageData) => {
		createMessage(data).then((newMessage) => {
			io.to(data.chatId).emit("receiveMessage", {
				...data,
				id: newMessage?.id,
			});
		});
	});

	socket.on("disconnect", () => {
		socketToUser.delete(socket.id);
	});
};

export default socketHandlers;

async function createMessage(data: MessageData) {
	const mediaUrl: string[] = [];

	const newMessage = await db.message.create({
		data: {
			content: data.content,
			media: mediaUrl,
			chat: {
				connect: {
					id: data.chatId,
				},
			},
			user: {
				connect: {
					id: data.userId,
				},
			},
		},
		select: {
			id: true,
			content: true,
			createdAt: true,
			chatId: true,
			userId: true,
			user: {
				select: {
					id: true,
					username: true,
					image: true,
				},
			},
		},
	});

	if (data.media) {
		for (const media of data.media) {
			if (!media) return;
			const buffer = Buffer.from(media, "base64");
			const processedImage = await compressImage(buffer);

			const blob = await put(
				`message_media/${newMessage.id}`,
				processedImage,
				{
					access: "public",
					contentType: "image/png",
				}
			);

			mediaUrl.push(blob.url);
		}
	}

	await db.message.update({
		where: {
			id: newMessage.id,
		},
		data: {
			media: mediaUrl,
		},
	});

	return newMessage;
}

async function sendMessageNotifications(group: Group) {
	const users: User[] = await db.groupMember.findMany({
		where: {
			groupId: group.id,
		},
		select: {
			userId: true,
		},
	});

	console.log(users);
}
