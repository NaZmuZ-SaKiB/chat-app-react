import { useAuthContext } from "@/context/AuthContextProvider";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { usePeerContext } from "@/context/PeerContextProvider";

const AudioCallPage = () => {
  const { id } = useParams(); // id is the receiver ID

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const { authUser } = useAuthContext(); // Get authenticated user
  const { peer } = usePeerContext();

  const role: "caller" | "receiver" =
    authUser?._id === id ? "receiver" : "caller";

  const remoteAudioRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    peer?.on("call", async (call) => {
      try {
        const getUserMedia = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: "user",
          },
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
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    });

    return () => {
      peer?.off("call");
      mediaStream?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, [peer, mediaStream]);

  useEffect(() => {
    if (role === "caller") {
      const call = async () => {
        try {
          const getUserMedia = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true,
          });

          setMediaStream(getUserMedia);

          const call = peer?.call(id as string, getUserMedia);

          call?.on("stream", (remoteStream) => {
            if (remoteAudioRef?.current) {
              remoteAudioRef.current.srcObject = remoteStream;
              remoteAudioRef.current.play().catch((error) => {
                console.error("Autoplay error:", error);
              });
            }
          });

          console.log("Calling...");
        } catch (error) {
          console.error("Error accessing media devices:", error);
        }
      };

      call();

      return () => {
        peer?.off("call");
        mediaStream?.getTracks().forEach((track) => {
          track.stop();
        });
      };
    }
  }, [id, peer, role, mediaStream]);

  return (
    <div className="w-full h-svh grid place-items-center">
      <h1>{role === "caller" ? "Calling..." : "Receiving Call..."}</h1>
      <video ref={remoteAudioRef} playsInline height={500} width={500} />
    </div>
  );
};

export default AudioCallPage;
