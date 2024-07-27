import { useSocketContext } from "@/context/SocketContextProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useListenCalls = () => {
  const { socket } = useSocketContext();

  const navigate = useNavigate();

  useEffect(() => {
    socket?.on("call", (data: { senderId: string }) => {
      navigate(`/call-receiving/${data.senderId}`);
    });

    return () => {
      socket?.off("call");
    };
  }, [socket, navigate]);
};

export default useListenCalls;
