import { generateSecretToken } from "@/lib/socket";
import React, {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import io, { type Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const socketInstance = io("http://localhost:3002");
		setSocket(socketInstance);

		socketInstance.on("connect", () => {
			console.log("Connected to socket server");
			console.log("Emmiting auth");

			generateSecretToken().then((token) => {
				socketInstance.emit("auth", { token });
			});
		});

		socketInstance.on("notificationMessage", (data) => {
			alert(data.message);
		});

		return () => {
			socketInstance.disconnect();
		};
	}, []);

	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocket = () => {
	return useContext(SocketContext);
};
