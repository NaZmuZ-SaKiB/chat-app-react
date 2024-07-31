import { useAuthContext } from "@/context/AuthContextProvider";
import { useSocketContext } from "@/context/SocketContextProvider";
import { cn } from "@/lib/utils";
import { Phone } from "lucide-react";
// import { useNavigate } from "react-router-dom";

type TProps = {
  otherUserId: string;
  isActive: boolean;
};

const AudioCall = ({ otherUserId, isActive }: TProps) => {
  const { socket } = useSocketContext();
  const { authUser } = useAuthContext();

  // const navigate = useNavigate();

  const handleCallClick = () => {
    if (!isActive) return;

    if (socket) {
      socket.emit("call", {
        receiverId: otherUserId,
        senderId: authUser?._id.toString(),
      });

      // navigate(`/call-sending/${otherUserId}`);
      window.open(`${window.origin}/call-sending/${otherUserId}`, "_blank");
    }
  };

  return (
    <div
      onClick={handleCallClick}
      className={cn("cursor-pointer", {
        "opacity-20": !isActive,
      })}
    >
      <Phone className="size-6" fill="black" strokeWidth={0} />
    </div>
  );
};

export default AudioCall;
