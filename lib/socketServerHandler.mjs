import { db } from "./db.js";
const socketToUser = new Map();

const socketHandlers = (io, socket) => {
	console.log("connected");

	socket.on("authenticate", (data) => {
		if (data.session) return false;
		socketToUser.set(socket.id, data.session);
		console.log("authenticated");
	});

	socket.on("joinGroup", (data) => {
		// TODO: Authenticate if the user is present at that group
		socket.join(data);
		console.log("joined", data);
	});

	socket.on("sendMessage", (data) => {
		db.message
			.create({
				data: {
					content: data.content,
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
			})
			.then((newMessage) => {
				io.to(data.chatId).emit("receiveMessage", {
					...data,
					id: newMessage.id,
				});
			});
	});

	socket.on("disconnect", () => {
		socketToUser.delete(socket.id);
	});
};

export default socketHandlers;
