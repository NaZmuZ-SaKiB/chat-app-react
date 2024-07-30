import { useAuthContext } from "@/context/AuthContextProvider";
import { useSocketContext } from "@/context/SocketContextProvider";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Peer from "peerjs";

const AudioCallPage = () => {
  const { id } = useParams(); // id is the receiver ID

  const { authUser } = useAuthContext(); // Get authenticated user
  const { socket } = useSocketContext();

  const [peer, setPeer] = useState<Peer | null>(null);
  const role: "caller" | "receiver" =
    authUser?._id === id ? "receiver" : "caller";

  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const newPeer = new Peer(authUser?._id?.toString());

    newPeer.on("open", (peerId) => {
      console.log("PeerJS connected with ID:", peerId);
      setPeer(newPeer);
    });

    newPeer.on("call", async (call) => {
      const getUserMedia = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
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

    return () => {
      newPeer.destroy();
    };
  }, [id, authUser?._id, socket, role]);

  useEffect(() => {
    if (role === "caller") {
      const call = async () => {
        const getUserMedia = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
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
      <audio ref={remoteAudioRef} controls />
    </div>
  );
};

export default AudioCallPage;
