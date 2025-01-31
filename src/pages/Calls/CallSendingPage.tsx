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

type TCallStatus = "calling" | "ringing" | "rejected" | "in another call";

const CallSendingPage = () => {
  const { id } = useParams(); // id is the user id
  const [searchParams] = useSearchParams();
  const callType = searchParams.get("type");

  const [callStatus, setStatus] = useState<TCallStatus>("calling");

  const { authUser } = useAuthContext();
  const { socket } = useSocketContext();
  const { setPeer } = usePeerContext();

  const navigate = useNavigate();

  const { data } = useGetUserByIdQuery(id as string);
  const user = data?.data;

  useEffect(() => {
    const handleTabClose = () => {
      socket?.emit("cancel-call", {
        senderId: authUser?._id?.toString(),
        receiverId: user?._id?.toString(),
      });
      setCallStatus("idle");
    };

    window.addEventListener("beforeunload", handleTabClose);

    setCallStatus("in-call");
    if (socket) {
      socket?.on(
        "call-receiving",
        (data: { senderId: string; receiverId: string }) => {
          if (data.receiverId === user?._id?.toString()) {
            setStatus("ringing");
          }
        }
      );

      socket?.on(
        "reject-call",
        (data: { senderId: string; receiverId: string; cause?: string }) => {
          console.log("rejected-call");

          if (data?.cause === "busy") {
            setStatus("in another call");
          } else {
            setStatus("rejected");
          }

          setCallStatus("idle");
        }
      );

      socket?.on(
        "accept-call",
        (data: { senderId: string; receiverId: string; type: string }) => {
          console.log("accepted-call");

          const newPeer = new Peer(authUser?._id?.toString());

          newPeer.on("open", (peerId) => {
            console.log("PeerJS connected with ID:", peerId);
            setPeer(newPeer);
            navigate(`/${data.type}-call/${data.receiverId}`);
          });
        }
      );

      return () => {
        window.removeEventListener("beforeunload", handleTabClose);
        socket?.off("call-receiving");
        socket?.off("reject-call");
        socket?.off("accept-call");
        setCallStatus("idle");
      };
    }
  }, [socket, setPeer]);

  const cancelCall = () => {
    if (socket) {
      socket.emit("cancel-call", {
        senderId: authUser?._id?.toString(),
        receiverId: user?._id?.toString(),
      });
    }

    setCallStatus("idle");

    window.close();
  };

  return (
    <div className="w-full h-svh grid place-items-center">
      <div className="flex flex-col items-center">
        <h2 className="font-medium text-lg text-slate-500 mb-5 capitalize">
          {callType} Call
        </h2>

        <div className="size-40 bg-slate-200 rounded-full relative mb-3">
          <img
            src={user?.image}
            alt={user?.username}
            className="rounded-full"
          />
        </div>

        <h1 className="font-semibold text-2xl text-slate-700 mb-2">
          {user?.name || "Loading..."}
        </h1>

        <p
          className={cn("capitalize text-slate-500 mb-28", {
            "text-green-500": callStatus === "ringing",
            "text-red-500":
              callStatus === "rejected" || callStatus === "in another call",
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
            onClick={() => window.close()}
          >
            <X className="size-8 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CallSendingPage;
