import type { Server, Socket } from "socket.io";
import { db } from "./db";
import { compressImage } from "./image";
import { put } from "@vercel/blob";
import { sendNotification } from "./notification";

interface MessageData {
	content: string;
	chatId: string;
	userId: string;
	media?: string[];
}

const socketToUser: [] = {};

const socketHandlers = (io: Server, socket: Socket) => {
	socket.on(
		"authenticate",
		(data: {
			token: {
				id: string;
				email: string;
				image: string;
				emailVerified: Date;
			};
		}) => {
			socketToUser[socket.id] = data.token;
		}
	);

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

	sendMessageNotifications(data.chatId);

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

		await db.message.update({
			where: {
				id: newMessage.id,
			},
			data: {
				media: mediaUrl,
			},
		});
	}

	return newMessage;
}

async function sendMessageNotifications(chatId: string) {
	const group = await db.group.findFirst({
		where: {
			GroupChat: {
				id: chatId,
			},
		},
	});

	if (!group) return;

	const users: unknown[] = await db.groupMember.findMany({
		where: {
			groupId: group.id,
		},
		select: {
			id: true,
		},
	});

	console.log(socketToUser.values());

	const userNotInChat = users.filter(
		(user) =>
			![...socketToUser.values()].includes((user as { id: string }).id)
	);
	for (const userSub in userNotInChat) {
		console.log(userSub);

		/* await sendNotification({
			message: { title: "abc", body: "def" },
			receiverUserId: userSub,
		}); */
	}
}
