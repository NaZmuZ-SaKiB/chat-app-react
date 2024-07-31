import { useSocketContext } from "@/context/SocketContextProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useListenCalls = () => {
  const { socket } = useSocketContext();

  const navigate = useNavigate();

  useEffect(() => {
    socket?.on(
      "call",
      (data: { senderId: string; type: "aduio" | "video" }) => {
        // navigate(`/call-receiving/${data.senderId}`);
        window.open(
          `${window.origin}/call-receiving/${data.senderId}?type=${data.type}`,
          "_blank"
        );
      }
    );

    return () => {
      socket?.off("call");
    };
  }, [socket, navigate]);
};

export default useListenCalls;
