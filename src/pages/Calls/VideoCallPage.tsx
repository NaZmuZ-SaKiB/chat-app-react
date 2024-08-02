/* eslint-disable react-hooks/exhaustive-deps */

import { useAuthContext } from "@/context/AuthContextProvider";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { usePeerContext } from "@/context/PeerContextProvider";
import { Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSocketContext } from "@/context/SocketContextProvider";
import { setCallStatus } from "@/utils/localstorage";

type TStatus = "connecting" | "connected" | "disconnected";

const VideoCallPage = () => {
  const { id } = useParams(); // id is the call receiver ID
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState<TStatus>("connecting");
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const { authUser } = useAuthContext();
  const { socket } = useSocketContext();
  const { peer, setPeer } = usePeerContext();

  const role: "caller" | "receiver" =
    authUser?._id === id ? "receiver" : "caller";

  const otherUserId = role === "caller" ? id : searchParams.get("senderId");

  //   const { data } = useGetUserByIdQuery(otherUserId as string);
  //   const otherUser = data?.data;

  const smallVideoRef = useRef<HTMLVideoElement>(null);
  const bigVideoRef = useRef<HTMLVideoElement>(null);

  const endCall = () => {
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
            video: {
              facingMode: "user",
              frameRate: { ideal: 20, max: 30 },
            },
          });

          bigVideoRef.current!.srcObject = getUserMedia;
          bigVideoRef.current!.play().catch(() => {});

          setMediaStream(getUserMedia);

          call.answer(getUserMedia);

          call?.on("stream", (remoteStream) => {
            if (bigVideoRef?.current) {
              bigVideoRef.current.srcObject = remoteStream;
              bigVideoRef.current.play().catch(() => {});

              smallVideoRef.current!.srcObject = getUserMedia;
              smallVideoRef.current!.play().catch(() => {});
            }
          });

          console.log("Answering...");
          setStatus("connected");
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
            video: {
              facingMode: "user",
              frameRate: { ideal: 20, max: 30 },
            },
          });

          bigVideoRef.current!.srcObject = getUserMedia;
          bigVideoRef.current!.play().catch(() => {});

          setMediaStream(getUserMedia);

          const call = peer?.call(id as string, getUserMedia);
          console.log("Calling...");

          call?.on("stream", (remoteStream) => {
            if (bigVideoRef?.current) {
              bigVideoRef.current.srcObject = remoteStream;
              bigVideoRef.current.play().catch(() => {});

              smallVideoRef.current!.srcObject = getUserMedia;
              smallVideoRef.current!.play().catch(() => {});

              setStatus("connected");
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

      bigVideoRef.current!.srcObject = null;
      smallVideoRef.current!.srcObject = null;

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

  return (
    <div className="w-full h-svh grid place-items-center">
      <div className="h-svh bg-white aspect-[9/16] relative">
        <video
          ref={bigVideoRef}
          playsInline
          className="absolute left-0 top-0 w-full h-full z-10"
        />

        <video
          ref={smallVideoRef}
          playsInline
          muted
          className={cn("absolute right-2 top-2 w-[100px] aspect-[9/16] z-20", {
            hidden: status !== "connected",
          })}
        />

        {status !== "connected" && (
          <div className="bg-black/50 absolute h-full w-full top-0 left-0 z-30 flex flex-col items-center justify-center">
            <p
              className={cn("capitalize text-white", {
                "text-red-500": status === "disconnected",
              })}
            >
              {status}
              {status === "connecting" && "..."}
            </p>
          </div>
        )}

        <div className="absolute w-full bottom-2 left-0 p-2 z-30">
          <div className="bg-black/50 rounded-full p-2 inline-flex justify-center">
            {status !== "disconnected" ? (
              <div
                className="size-12 flex justify-center items-center rounded-full bg-red-500 cursor-pointer"
                onClick={endCall}
              >
                <Phone
                  fill="white"
                  strokeWidth={0}
                  className="size-7 text-white"
                />
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
      </div>
    </div>
  );
};

export default VideoCallPage;
