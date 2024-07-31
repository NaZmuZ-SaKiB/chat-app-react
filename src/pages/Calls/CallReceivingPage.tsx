import { useAuthContext } from "@/context/AuthContextProvider";
import { useCallContext } from "@/context/CallStatusContextProvider";
import { usePeerContext } from "@/context/PeerContextProvider";
import { useSocketContext } from "@/context/SocketContextProvider";
import { useGetUserByIdQuery } from "@/lib/queries/user.query";
import { cn } from "@/lib/utils";
import { Phone, X } from "lucide-react";
import Peer from "peerjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const CallReceivingPage = () => {
  const { id } = useParams(); // id is the sender user id
  const [searchParams] = useSearchParams();
  const callType = searchParams.get("type");

  const [status, setStatus] = useState<"incoming" | "connecting">("incoming");

  const { authUser } = useAuthContext();
  const { socket } = useSocketContext();
  const { setPeer } = usePeerContext();
  const { setCurrentCallStatus } = useCallContext();

  const navigate = useNavigate();

  const { data } = useGetUserByIdQuery(id as string);
  const user = data?.data;

  useEffect(() => {
    if (!socket || !authUser) return;

    socket?.emit("call-receiving", {
      senderId: id,
      receiverId: authUser?._id?.toString(),
    });

    socket?.on(
      "cancel-call",
      (data: { senderId: string; receiverId: string }) => {
        if (data.receiverId === authUser?._id?.toString()) {
          setCurrentCallStatus("idle");
          navigate(-1);
        }
      }
    );

    return () => {
      socket?.off("cancel-call");
    };
  }, [socket, id, authUser, navigate, callType, setCurrentCallStatus]);

  const rejectCall = () => {
    if (socket) {
      socket.emit("reject-call", {
        senderId: id,
        receiverId: authUser?._id?.toString(),
      });
    }

    setCurrentCallStatus("idle");

    navigate(-1);
  };

  const acceptCall = () => {
    if (status === "connecting") return;

    setStatus("connecting");

    const newPeer = new Peer(authUser?._id?.toString());

    newPeer.on("open", (peerId) => {
      console.log("PeerJS connected with ID:", peerId);
      setPeer(newPeer);

      if (socket) {
        socket.emit("accept-call", {
          senderId: id,
          receiverId: authUser?._id?.toString(),
          type: callType,
        });
      }
      navigate(`/${callType}-call/${authUser?._id}?senderId=${id}`);
    });
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

        <p className={"capitalize text-slate-500 mb-28"}>{status}...</p>

        <div className="flex items-center gap-20">
          <div
            className="size-12 flex justify-center items-center rounded-full bg-red-500 cursor-pointer"
            onClick={rejectCall}
          >
            <X className="size-8 text-white" />
          </div>

          <div
            className="size-12 flex justify-center items-center rounded-full bg-green-500 cursor-pointer"
            onClick={acceptCall}
          >
            <Phone
              fill="white"
              strokeWidth={0}
              className={cn("size-7 text-white", {
                "opacity-50 cursor-not-allowed pointer-events-none":
                  status === "connecting",
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallReceivingPage;
