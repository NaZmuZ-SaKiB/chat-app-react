/* eslint-disable react-hooks/exhaustive-deps */

import { useSocketContext } from "@/context/SocketContextProvider";
import { useSeenMessageMutation } from "@/lib/queries/message.query";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const useListenMessages = () => {
  const { id } = useParams(); // Conversation Id

  // Handle Seen Message
  const { mutateAsync: seenMessageFn } = useSeenMessageMutation();

  const seenMessage = async (messageId: string) => {
    await seenMessageFn(messageId);
    queryClient.invalidateQueries({ queryKey: ["sidebar"] });
  };

  // Handle New Message
  const queryClient = useQueryClient();

  const { socket } = useSocketContext();

  useEffect(() => {
    const handleNewMessage = (newMessage: any) => {
      if (newMessage?.conversation?.toString() === id) {
        newMessage.shake = true;

        seenMessage(newMessage?._id?.toString());

        queryClient.setQueryData(["messages", id], (oldData: any) => ({
          ...oldData,
          data: {
            ...oldData?.data,
            messages: [newMessage, ...(oldData?.data?.messages || [])],
          },
        }));
      }
    };

    socket?.on("newMessage", handleNewMessage);

    return () => {
      socket?.off("newMessage", handleNewMessage);
    };
  }, [socket, id]);
};

export default useListenMessages;
