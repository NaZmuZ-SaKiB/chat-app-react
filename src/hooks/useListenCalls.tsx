import { useAuthContext } from "@/context/AuthContextProvider";
import { useSocketContext } from "@/context/SocketContextProvider";
import { getCallStatus } from "@/utils/localstorage";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useListenCalls = () => {
  const { socket } = useSocketContext();
  const { authUser } = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    socket?.on(
      "call",
      (data: { senderId: string; type: "aduio" | "video" }) => {
        const callStatus = getCallStatus();
        if (callStatus === "idle") {
          window.open(
            `${window.origin}/call-receiving/${data.senderId}?type=${data.type}`,
            "_blank"
          );
        } else {
          console.log("in-call, rejecting call");
          socket.emit("reject-call", {
            senderId: data.senderId,
            receiverId: authUser?._id?.toString(),
            cause: "busy",
          });
        }
      }
    );

    return () => {
      socket?.off("call");
    };
  }, [socket, navigate, authUser]);
};

export default useListenCalls;
