import { useAuthContext } from "@/context/AuthContextProvider";
import { usePeerContext } from "@/context/PeerContextProvider";
import { useSocketContext } from "@/context/SocketContextProvider";
import { useGetUserByIdQuery } from "@/lib/queries/user.query";
import { cn } from "@/lib/utils";
import { Phone, X } from "lucide-react";
import Peer from "peerjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

type TCallStatus = "calling" | "ringing" | "rejected";

const CallSendingPage = () => {
  const { id } = useParams(); // id is the user id
  const [searchParams] = useSearchParams();
  const callType = searchParams.get("type");

  const [callStatus, setCallStatus] = useState<TCallStatus>("calling");

  const { authUser } = useAuthContext();
  const { socket } = useSocketContext();
  const { setPeer } = usePeerContext();

  const navigate = useNavigate();

  const { data } = useGetUserByIdQuery(id as string);
  const user = data?.data;

  useEffect(() => {
    if (!socket) return;

    socket?.on(
      "call-receiving",
      (data: { senderId: string; receiverId: string }) => {
        if (data.receiverId === user?._id?.toString()) {
          setCallStatus("ringing");
        }
      }
    );

    socket?.on(
      "reject-call",
      (data: { senderId: string; receiverId: string }) => {
        if (data.receiverId === user?._id?.toString()) {
          setCallStatus("rejected");
        }
      }
    );

    socket?.on(
      "accept-call",
      (data: { senderId: string; receiverId: string; type: string }) => {
        if (data.receiverId === user?._id?.toString()) {
          const newPeer = new Peer(authUser?._id?.toString());

          newPeer.on("open", (peerId) => {
            console.log("PeerJS connected with ID:", peerId);
            setPeer(newPeer);
            navigate(`/${data.type}-call/${data.receiverId}`);
          });
        }
      }
    );

    return () => {
      socket?.off("call-receiving");
      socket?.off("reject-call");
      socket?.off("accept-call");
    };
  }, [socket, setCallStatus, user, navigate, authUser, setPeer]);

  const cancelCall = () => {
    if (socket) {
      socket.emit("cancel-call", {
        senderId: authUser?._id?.toString(),
        receiverId: user?._id?.toString(),
      });
    }

    navigate(-1);
  };

  return (
    <div className="w-full h-svh grid place-items-center">
      <div className="flex flex-col items-center">
        <h2 className="font-medium text-lg text-slate-500 mb-5 capitalize">
          {callType} Call
        </h2>

        <div className="size-40 bg-slate-200 rounded-full relative mb-3">
          <img src={user?.image} alt={user?.username} />
        </div>

        <h1 className="font-semibold text-2xl text-slate-700 mb-2">
          {user?.name || "Loading..."}
        </h1>

        <p
          className={cn("capitalize text-slate-500 mb-28", {
            "text-green-500": callStatus === "ringing",
            "text-red-500": callStatus === "rejected",
          })}
        >
          {callStatus}
          {callStatus !== "rejected" && "..."}
        </p>

        {callStatus !== "rejected" ? (
          <div
            className="size-12 flex justify-center items-center rounded-full bg-red-500 cursor-pointer"
            onClick={cancelCall}
          >
            <Phone fill="white" strokeWidth={0} className="size-7 text-white" />
          </div>
        ) : (
          <div
            className="size-12 flex justify-center items-center rounded-full bg-slate-500 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <X className="size-8 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CallSendingPage;
