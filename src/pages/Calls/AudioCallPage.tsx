/* eslint-disable react-hooks/exhaustive-deps */

import { useAuthContext } from "@/context/AuthContextProvider";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { usePeerContext } from "@/context/PeerContextProvider";
import { useGetUserByIdQuery } from "@/lib/queries/user.query";
import { Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSocketContext } from "@/context/SocketContextProvider";

type TStatus = "connecting" | "connected" | "disconnected";

const AudioCallPage = () => {
  const { id } = useParams(); // id is the call receiver ID
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState<TStatus>("connecting");
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const { authUser } = useAuthContext();
  const { socket } = useSocketContext();
  const { peer } = usePeerContext();

  const navigate = useNavigate();

  const role: "caller" | "receiver" =
    authUser?._id === id ? "receiver" : "caller";

  const otherUserId = role === "caller" ? id : searchParams.get("senderId");

  const { data } = useGetUserByIdQuery(otherUserId as string);
  const otherUser = data?.data;

  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  const endCall = () => {
    if (status === "disconnected") return;

    mediaStream?.getTracks().forEach((track) => {
      track.stop();
    });

    peer?.off("call");
    peer?.destroy();
    setStatus("disconnected");

    socket?.emit("end-call", { to: otherUserId });
  };

  useEffect(() => {
    peer?.on("call", async (call) => {
      try {
        const getUserMedia = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

        setMediaStream(getUserMedia);

        call.answer(getUserMedia);

        call?.on("stream", (remoteStream) => {
          if (remoteAudioRef?.current) {
            remoteAudioRef.current.srcObject = remoteStream;
            remoteAudioRef.current.play().catch((error) => {
              console.error("Autoplay error:", error);
            });
          }
        });

        console.log("Answering...");
        setStatus("connected");
      } catch (error) {
        console.error("Error accessing media devices:", error);
        setStatus("disconnected");
      }
    });

    socket?.on("end-call", () => {
      endCall();
    });

    return () => {
      endCall();
    };
  }, [peer]);

  useEffect(() => {
    if (role === "caller") {
      const call = async () => {
        try {
          const getUserMedia = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
          });

          setMediaStream(getUserMedia);

          const call = peer?.call(id as string, getUserMedia);
          console.log("Calling...");

          call?.on("stream", (remoteStream) => {
            if (remoteAudioRef?.current) {
              remoteAudioRef.current.srcObject = remoteStream;
              remoteAudioRef.current.play().catch((error) => {
                console.error("Autoplay error:", error);
              });

              setStatus("connected");
            }
          });
        } catch (error) {
          console.error("Error accessing media devices:", error);
          setStatus("disconnected");
        }
      };

      call();

      return () => {
        endCall();
      };
    }
  }, [id, peer, role]);

  return (
    <div className="w-full h-svh grid place-items-center">
      <div className="flex flex-col items-center">
        <h2 className="font-medium text-lg text-slate-500 mb-5">Audio Call</h2>

        <div className="size-40 bg-slate-200 rounded-full relative mb-3">
          <img src={otherUser?.image} alt={otherUser?.username} />
        </div>

        <h1 className="font-semibold text-2xl text-slate-700 mb-2">
          {otherUser?.name || "Loading..."}
        </h1>

        <p
          className={cn("capitalize text-slate-500 mb-28", {
            "text-green-500": status === "connected",
            "text-red-500": status === "disconnected",
          })}
        >
          {status}
          {status === "connected" && "..."}
        </p>

        <audio ref={remoteAudioRef} playsInline className="hidden" />

        {status !== "disconnected" ? (
          <div className="size-12 flex justify-center items-center rounded-full bg-red-500 cursor-pointer">
            <Phone fill="white" strokeWidth={0} className="size-7 text-white" />
          </div>
        ) : (
          <div
            className="size-12 flex justify-center items-center rounded-full bg-slate-500 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <X className="size-8 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioCallPage;
