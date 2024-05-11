import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import socketHandlers from "./lib/socketServerHandler.mjs";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
	const httpServer = createServer(handler);

	const io = new Server(httpServer, { addTrailingSlash: false });

	io.on("connect", (socket) => {
		socketHandlers(io, socket);
	});

	io.on("connect_error", (error) => {
		console.error("Connection error:", error);
	});

	httpServer
		.once("error", (err) => {
			console.error(err);
			process.exit(1);
		})
		.listen(port, () => {
			console.log(`> Ready on http://${hostname}:${port}`);
		});
});
