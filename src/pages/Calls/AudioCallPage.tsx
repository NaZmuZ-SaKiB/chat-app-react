/* eslint-disable react-hooks/exhaustive-deps */

import { useAuthContext } from "@/context/AuthContextProvider";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { usePeerContext } from "@/context/PeerContextProvider";
import { useGetUserByIdQuery } from "@/lib/queries/user.query";
import { Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSocketContext } from "@/context/SocketContextProvider";
import { setCallStatus } from "@/utils/localstorage";

type TStatus = "connecting" | "connected" | "disconnected";

const AudioCallPage = () => {
  const { id } = useParams(); // id is the call receiver ID
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState<TStatus>("connecting");
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [callStartTime, setCallStartTime] = useState<number | null>(null);
  const [timer, setTimer] = useState<number>(0);

  const { authUser } = useAuthContext();
  const { socket } = useSocketContext();
  const { peer, setPeer } = usePeerContext();

  // const navigate = useNavigate();

  const role: "caller" | "receiver" =
    authUser?._id === id ? "receiver" : "caller";

  const otherUserId = role === "caller" ? id : searchParams.get("senderId");

  const { data } = useGetUserByIdQuery(otherUserId as string);
  const otherUser = data?.data;

  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const endCall = () => {
    setCallStatus("idle");

    peer?.off("call");
    peer?.removeAllListeners();
    peer?.destroy();

    setPeer(null);

    mediaStream?.getTracks().forEach((track) => {
      track.stop();
    });

    setMediaStream(null);

    if (status === "disconnected") return;

    setStatus("disconnected");
    socket?.emit("end-call", { to: otherUserId });
    window.close();
  };

  // Answer Call
  useEffect(() => {
    const handleTabClose = () => {
      setCallStatus("idle");

      peer?.off("call");
      peer?.removeAllListeners();
      peer?.destroy();

      setPeer(null);

      mediaStream?.getTracks().forEach((track) => {
        track.stop();
      });

      setMediaStream(null);
      socket?.emit("end-call", { to: otherUserId });
      setStatus("disconnected");
    };

    window.addEventListener("beforeunload", handleTabClose);

    if (role === "receiver") {
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
          setCallStartTime(Date.now());
        } catch (error) {
          console.error("Error accessing media devices:", error);
          mediaStream?.getTracks().forEach((track) => {
            track.stop();
          });
          setMediaStream(null);
          setStatus("disconnected");
        }
      });

      return () => {
        peer?.off("call");
        mediaStream?.getTracks().forEach((track) => {
          track.stop();
        });
        setMediaStream(null);
      };
    }

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, [peer]);

  // Send Call
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
              setCallStartTime(Date.now());
            }
          });
        } catch (error) {
          console.error("Error accessing media devices:", error);
          mediaStream?.getTracks().forEach((track) => {
            track.stop();
          });
          setMediaStream(null);
          setStatus("disconnected");
        }
      };

      call();

      return () => {
        peer?.off("call");
        mediaStream?.getTracks().forEach((track) => {
          track.stop();
        });
        setMediaStream(null);
      };
    }
  }, [id, peer, role]);

  // Socket Listener
  useEffect(() => {
    const handleEndCall = () => {
      peer?.off("call");
      peer?.removeAllListeners();
      peer?.destroy();

      setPeer(null);

      mediaStream?.getTracks().forEach((track) => {
        track.stop();
      });

      setMediaStream(null);

      setStatus("disconnected");
    };

    socket?.on("end-call", handleEndCall);

    return () => {
      socket?.off("end-call", handleEndCall);
      mediaStream?.getTracks().forEach((track) => {
        track.stop();
      });
      setMediaStream(null);
    };
  }, [socket, peer]);

  useEffect(() => {
    if (status === "connected") {
      setCallStatus("in-call");
      timerRef.current = setInterval(() => {
        setTimer(Math.floor((Date.now() - (callStartTime || 0)) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [status, callStartTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="w-full h-svh grid place-items-center">
      <div className="flex flex-col items-center">
        <h2 className="font-medium text-lg text-slate-500 mb-5">Audio Call</h2>

        <div className="size-40 bg-slate-200 rounded-full relative mb-3">
          <img
            src={otherUser?.image}
            alt={otherUser?.username}
            className="rounded-full"
          />
        </div>

        <h1 className="font-semibold text-2xl text-slate-700 mb-2">
          {otherUser?.name || "Loading..."}
        </h1>

        <p
          className={cn("capitalize text-slate-500 mb-2", {
            "text-green-500": status === "connected",
            "text-red-500": status === "disconnected",
          })}
        >
          {status}
          {status === "connecting" && "..."}
        </p>

        <p
          className={cn("capitalize text-slate-500 mb-28", {
            "text-slate-50": status === "connecting",
          })}
        >
          {status !== "connecting" ? formatTime(timer) : "00:00"}
        </p>

        <audio ref={remoteAudioRef} playsInline className="hidden" />

        {status !== "disconnected" ? (
          <div
            className="size-12 flex justify-center items-center rounded-full bg-red-500 cursor-pointer"
            onClick={endCall}
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

export default AudioCallPage;
