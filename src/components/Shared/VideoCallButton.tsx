import { useAuthContext } from "@/context/AuthContextProvider";
import { useSocketContext } from "@/context/SocketContextProvider";
import { cn } from "@/lib/utils";
import { getCallStatus, setCallStatus } from "@/utils/localstorage";
import { Video } from "lucide-react";

type TProps = {
  otherUserId: string;
  isActive: boolean;
};

const VideoCallButton = ({ otherUserId, isActive }: TProps) => {
  const { socket } = useSocketContext();
  const { authUser } = useAuthContext();

  const handleCallClick = () => {
    if (!isActive) return;
    const callStatus = getCallStatus();
    if (callStatus === "in-call") return;

    if (socket) {
      socket.emit("call", {
        receiverId: otherUserId,
        senderId: authUser?._id.toString(),
        type: "video",
      });

      setCallStatus("in-call");

      window.open(
        `${window.origin}/call-sending/${otherUserId}?type=video`,
        "_blank"
      );
    }
  };

  return (
    <div
      onClick={handleCallClick}
      className={cn("cursor-pointer", {
        "opacity-20": !isActive,
      })}
    >
      <Video className="size-8" fill="#0284c7" strokeWidth={0} />
    </div>
  );
};

export default VideoCallButton;
