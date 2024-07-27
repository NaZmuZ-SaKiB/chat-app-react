/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import Message from "@/components/Shared/Message";
import { useGetMessagesQuery } from "@/lib/queries/message.query";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import MessagesLoader from "../Loaders/MessagesLoader";
import MessagesInfiniteScroll from "./MessagesInfiniteScroll";
import useListenMessages from "@/hooks/useListenMessages";

const MessageContainer = () => {
  const { id } = useParams(); // Conversation Id

  // Get All Messages
  const { data, isLoading } = useGetMessagesQuery(id as string, 1);

  // Handle Scroll to last message
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleScroll = () => {
    if (messageContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messageContainerRef.current;

      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 150); //150px from bottom
    }
  };

  useEffect(() => {
    if (isAtBottom) {
      // @ts-ignore
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);

  // handle new message
  useListenMessages();

  if (isLoading) {
    return <MessagesLoader />;
  }

  const messages = data?.data?.messages || [];
  const isNext = data?.data?.isNext || false;

  return (
    <div
      className="flex-1 overflow-y-auto p-4 flex flex-col gap-3"
      ref={messageContainerRef}
      onScroll={handleScroll}
    >
      <div className="flex-grow" />

      {!isLoading && isNext && (
        <MessagesInfiniteScroll containerRef={messageContainerRef} />
      )}

      {messages.toReversed().map((message: any, i: number) => (
        <Message
          key={`${message?._id}`}
          message={message}
          ref={i === messages.length - 1 ? lastMessageRef : null}
        />
      ))}
    </div>
  );
};

export default MessageContainer;
