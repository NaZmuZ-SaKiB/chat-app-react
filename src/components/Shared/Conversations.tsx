import { useAuthContext } from "@/context/AuthContextProvider";
import { useSocketContext } from "@/context/SocketContextProvider";
import { useGetSidebarConversationsQuery } from "@/lib/queries/conversation.query";
import { useSeenMessageMutation } from "@/lib/queries/message.query";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import NotificationSound from "@/assets/audio/notification.mp3";
import ConversationsLoader from "../Loaders/ConversationsLoader";

const Conversations = () => {
  const { id } = useParams();

  const { data, isLoading } = useGetSidebarConversationsQuery();
  const conversations = (data?.data as any[]) || [];

  const { authUser } = useAuthContext();

  const { socket, onlineUsers } = useSocketContext();

  const queryClient = useQueryClient();

  const { mutateAsync: seenMessageFn } = useSeenMessageMutation();

  const seenMessage = async (messageId: string) => {
    await seenMessageFn(messageId);
    queryClient.invalidateQueries({ queryKey: ["sidebar"] });
  };

  useEffect(() => {
    const handleNewMessage = () => {
      const sound = new Audio(NotificationSound);
      sound.play().catch(() => {});

      queryClient.invalidateQueries({
        queryKey: ["sidebar"],
      });
    };

    socket?.on("newMessage", handleNewMessage);

    return () => {
      socket?.off("newMessage", handleNewMessage);
    };
  }, [socket, queryClient]);

  if (isLoading) return <ConversationsLoader />;

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((item: any) => {
        const isActiveLink = id === item?._id?.toString();

        const isActiveUser = onlineUsers.includes(
          item?.users?.[0]?._id?.toString()
        );

        const seen = item?.lastMessage?.seenBy?.includes(
          authUser?._id?.toString()
        );

        const sentByMe =
          item?.lastMessage?.sender?.toString() === authUser?._id?.toString();

        return (
          <Link
            to={`/conversation/${item._id}`}
            key={`${item._id}`}
            className={cn(
              "p-2 rounded flex gap-2 items-center overflow-hidden",
              {
                "bg-slate-50": isActiveLink,
              }
            )}
            onClick={() => seenMessage(item?.lastMessage?._id?.toString())}
          >
            <div className="size-14 bg-slate-200 rounded-full relative shrink-0">
              <img
                src={item?.users?.[0]?.image}
                alt={item?.users?.[0]?.username}
              />
              <div className="size-5 grid place-items-center rounded-full bg-white absolute right-0 bottom-0">
                <div
                  className={cn("size-3.5 rounded-full bg-gray-300", {
                    "bg-green-500": isActiveUser,
                  })}
                ></div>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <h3
                className={cn("text-lg truncate", {
                  "font-semibold": !seen,
                })}
              >
                {item?.users?.[0].name}
              </h3>
              <p
                className={cn("truncate text-sm text-slate-500", {
                  "text-slate-900 font-semibold": !seen,
                })}
              >
                {!sentByMe
                  ? item?.users?.[0]?.name?.split(" ")[0] + ": "
                  : "You: "}
                {item?.lastMessage?.message}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Conversations;
