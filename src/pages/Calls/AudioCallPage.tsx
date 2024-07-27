import { useAuthContext } from "@/context/AuthContextProvider";
import { useSocketContext } from "@/context/SocketContextProvider";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Peer from "peerjs";

const AudioCallPage = () => {
  const { id } = useParams(); // id is the peer ID

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

    newPeer.on("call", (incomingCall) => {
      console.log("Incoming call received");
      if (role === "receiver") {
        navigator.mediaDevices
          .getUserMedia({ video: false, audio: true })
          .then((stream) => {
            incomingCall.answer(stream);

            incomingCall.on("stream", (remoteStream) => {
              if (remoteAudioRef.current) {
                remoteAudioRef.current.autoplay = true;
                remoteAudioRef.current.muted = false;
                remoteAudioRef.current.srcObject = remoteStream;
                remoteAudioRef.current
                  .play()
                  .catch((err) => console.error("Audio play error:", err));
                console.log("Remote stream received", remoteStream);
              }
            });
          })
          .catch((err) => console.error("Failed to get local stream", err));
      }
    });

    return () => {
      newPeer.destroy();
    };
  }, [id, authUser?._id, socket, role]);

  useEffect(() => {
    if (peer && role === "caller") {
      console.log("Initiating call to", id);
      navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then((stream) => {
          const outgoingCall = peer.call(id as string, stream);

          outgoingCall.on("stream", (remoteStream) => {
            if (remoteAudioRef.current) {
              remoteAudioRef.current.autoplay = true;
              remoteAudioRef.current.muted = false;
              remoteAudioRef.current.srcObject = remoteStream;
              remoteAudioRef.current
                .play()
                .catch((err) => console.error("Audio play error:", err));
              console.log("Remote stream received from call", remoteStream);
            }
          });

          outgoingCall.on("error", (err) => console.error("Call error:", err));
        })
        .catch((err) => console.error("Failed to get local stream", err));
    }
  }, [peer, id, role]);

  return (
    <div className="w-full h-svh grid place-items-center">
      <h1>{role === "caller" ? "Calling..." : "Receiving Call..."}</h1>
      <audio ref={remoteAudioRef} controls />
    </div>
  );
};

export default AudioCallPage;
