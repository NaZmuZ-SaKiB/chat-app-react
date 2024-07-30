import { useAuthContext } from "@/context/AuthContextProvider";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { usePeerContext } from "@/context/PeerContextProvider";

const AudioCallPage = () => {
  const { id } = useParams(); // id is the receiver ID

  const { authUser } = useAuthContext(); // Get authenticated user
  const { peer } = usePeerContext();

  const role: "caller" | "receiver" =
    authUser?._id === id ? "receiver" : "caller";

  const remoteAudioRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    peer?.on("call", async (call) => {
      const getUserMedia = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });

      mediaStreamRef.current = getUserMedia;

      call.answer(getUserMedia);

      call?.on("stream", (remoteStream) => {
        if (remoteAudioRef?.current) {
          remoteAudioRef.current.srcObject = remoteStream;
          remoteAudioRef.current.play();
        }
      });

      console.log("Answering...");
    });

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [peer]);

  useEffect(() => {
    if (role === "caller") {
      const call = async () => {
        const getUserMedia = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true,
        });

        mediaStreamRef.current = getUserMedia;

        const call = peer?.call(id as string, getUserMedia);

        call?.on("stream", (remoteStream) => {
          if (remoteAudioRef?.current) {
            remoteAudioRef.current.srcObject = remoteStream;
            remoteAudioRef.current.play();
          }
        });

        console.log("Calling...");
      };

      call();
    }
  }, [id, peer, role]);

  // Cleanup when the component unmounts
  useEffect(() => {
    return () => {
      // Stop the media tracks
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);
  return (
    <div className="w-full h-svh grid place-items-center">
      <h1>{role === "caller" ? "Calling..." : "Receiving Call..."}</h1>
      <video ref={remoteAudioRef} hidden />
    </div>
  );
};

export default AudioCallPage;
