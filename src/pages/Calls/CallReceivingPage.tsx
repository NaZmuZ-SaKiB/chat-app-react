/* eslint-disable react-hooks/exhaustive-deps */
import { useAuthContext } from "@/context/AuthContextProvider";
import { usePeerContext } from "@/context/PeerContextProvider";
import { useSocketContext } from "@/context/SocketContextProvider";
import { useGetUserByIdQuery } from "@/lib/queries/user.query";
import { cn } from "@/lib/utils";
import { setCallStatus } from "@/utils/localstorage";
import { Phone, X } from "lucide-react";
import Peer from "peerjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import Ringtone from "@/assets/audio/ringtone.mp3";

const CallReceivingPage = () => {
  const { id } = useParams(); // id is the sender user id
  const [searchParams] = useSearchParams();
  const callType = searchParams.get("type");

  const [status, setStatus] = useState<"incoming" | "connecting">("incoming");

  const { authUser } = useAuthContext();
  const { socket } = useSocketContext();
  const { setPeer } = usePeerContext();

  const navigate = useNavigate();

  const { data } = useGetUserByIdQuery(id as string);
  const user = data?.data;

  useEffect(() => {
    setCallStatus("in-call");

    if (!socket || !authUser) return;

    socket?.emit("call-receiving", {
      senderId: id,
      receiverId: authUser?._id?.toString(),
    });

    socket?.on(
      "cancel-call",
      (data: { senderId: string; receiverId: string }) => {
        if (data.receiverId === authUser?._id?.toString()) {
          setCallStatus("idle");
          window.close();
        }
      }
    );

    return () => {
      socket?.off("cancel-call");
      setCallStatus("idle");
    };
  }, [socket, id, authUser, navigate, callType]);

  const rejectCall = () => {
    if (socket) {
      console.log("call reject triggered");
      socket.emit("reject-call", {
        senderId: id,
        receiverId: authUser?._id?.toString(),
      });

      setCallStatus("idle");
      window.close();
    }
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
