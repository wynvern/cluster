import { generateSecretToken } from "@/lib/socket";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
   const router = useRouter()

   useEffect(() => {
      if (!session.data) return;

      const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || "");

      async function run() {
         setSocket(socketInstance);

         socketInstance.on("connect", async () => {
            const token = await generateSecretToken();

            socketInstance.emit("auth", { token });
         });

         const handleBeforeUnload = () => {
            socketInstance.disconnect();
         };

         window.addEventListener("beforeunload", handleBeforeUnload);

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
                  onClick: () => {
                     router.push(`/chat/${data.message.chat.group.id}`)
                  }
               }
            );
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
