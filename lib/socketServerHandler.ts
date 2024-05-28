import type { Server, Socket } from "socket.io";
import { db } from "./db";
import { compressImage } from "./image";
import { put } from "@vercel/blob";
import { sendNotification } from "./notification";
import { postBlob } from "./blob";

interface MessageData {
	content: string;
	chatId: string;
	userId: string;
	media?: string[];
}

interface User {
	name: string;
	email: string;
	image: string | null;
	id: string;
	emailVerified: string;
	username: string;
	banner: string | null;
}

const socketToUser: Record<string, string> = {};

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
			media: true,
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

	sendMessageNotifications(data.chatId, {
		content: data.content,
		senderName: newMessage.user.username || "",
	});

	if (data.media) {
		for (const media of data.media) {
			if (!media) return;
			const buffer = Buffer.from(media, "base64");
			const processedImage = await compressImage(buffer);

			const blob = await postBlob(
				processedImage.toString("base64"),
				"image"
			);

			mediaUrl.push(blob.url);
		}

		await db.message.update({
			where: {
				id: newMessage.id,
			},
			data: {
				media: mediaUrl,
			},
		});

		console.log(mediaUrl);
		return { ...newMessage, media: mediaUrl };
	}
	return newMessage;
}

async function sendMessageNotifications(
	chatId: string,
	message: { senderName: string; content: string }
) {
	const group = await db.group.findFirst({
		where: {
			GroupChat: {
				id: chatId,
			},
		},
	});

	if (!group) return;

	const users = await db.groupMember.findMany({
		where: {
			groupId: group.id,
		},
		select: {
			user: {
				select: {
					id: true,
				},
			},
		},
	});

	const userNotInChat = users.filter((user) => {
		return !Object.values(socketToUser).some(
			(socketUser) => socketUser === user.user.id
		);
	});

	for (const user of userNotInChat) {
		await sendNotification({
			message: {
				title: `Mensagem em ${group.groupname}`,
				body: `${message.senderName}: ${message.content}`,
			},
			receiverUserId: user.user.id,
		});
	}
}

export default async function socketHandlers(io: Server, socket: Socket) {
	socket.on("authenticate", (data: { token: User }) => {
		socketToUser[socket.id] = data.token.id;
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
		delete socketToUser[socket.id];
	});
}
