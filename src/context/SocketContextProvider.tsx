import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";
import { useAuthContext } from "./AuthContextProvider";
import { getCallStatus } from "@/utils/localstorage";

type TContext = {
  socket: Socket | null;
  onlineUsers: any[];
};

export const SocketContext = createContext<TContext>({
  socket: null,
  onlineUsers: [],
});

// eslint-disable-next-line react-refresh/only-export-components
export const useSocketContext = () => useContext(SocketContext);

const SocketContextProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      const newSocket = io(import.meta.env.VITE_BASE_API_URL as string, {
        query: {
          userId: authUser._id.toString(),
        },
        transports: ["websocket"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 10,
      });

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      newSocket.on("connect", () => {
        console.log("Socket connected");
      });

      newSocket.on("connect_error", (err) => {
        console.error("Socket connect error:", err);
      });

      newSocket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, getCallStatus()]);
  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
