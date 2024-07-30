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

  useEffect(() => {
    peer?.on("call", async (call) => {
      const getUserMedia = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });

      call.answer(getUserMedia);

      call?.on("stream", (remoteStream) => {
        if (remoteAudioRef?.current) {
          remoteAudioRef.current.srcObject = remoteStream;
          remoteAudioRef.current.play();
        }
      });

      console.log("Answering...");
    });
  }, [peer]);

  useEffect(() => {
    if (role === "caller") {
      const call = async () => {
        const getUserMedia = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true,
        });

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

  return (
    <div className="w-full h-svh grid place-items-center">
      <h1>{role === "caller" ? "Calling..." : "Receiving Call..."}</h1>
      <video ref={remoteAudioRef} height={500} width={500} />
    </div>
  );
};

export default AudioCallPage;
