import { generateSecretToken } from "@/lib/socket";
import { useSession } from "next-auth/react";
import React, {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { toast } from "react-toastify";
import io, { type Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const session = useSession();

	useEffect(() => {
		if (!session.data) return;

		const socketInstance = io("http://localhost:3002");

		async function run() {
			setSocket(socketInstance);

			socketInstance.on("connect", async () => {
				console.log("Connected to socket server");
				console.log("Emmiting auth");

				const token = await generateSecretToken();
				console.log(token);
				socketInstance.emit("auth", { token });
			});

			socketInstance.on("notificationMessage", (data) => {
				toast.info(
					`g/${data.message.chat.group.groupname}: ${data.message.content}`,
					{
						autoClose: 4000,
						icon: (
							<div className="rounded-full">
								<img
									src={
										data.message.user.image ||
										"/brand/default-avatar.svg"
									}
									alt="user-message-image"
								/>
							</div>
						),
					}
				);
				console.log(data);
			});
		}

		run();

		return () => {
			socketInstance.disconnect();
		};
	}, [session.data]);

	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocket = () => {
	return useContext(SocketContext);
};
