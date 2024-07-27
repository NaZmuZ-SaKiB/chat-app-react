import ConversationHeader from "@/components/Shared/ConversationHeader";
import MessageContainer from "@/components/Shared/MessageContainer";
import SendMessage from "@/components/Shared/SendMessage";
import { useSocketContext } from "@/context/SocketContextProvider";
import { useGetUserByConversationIdQuery } from "@/lib/queries/user.query";
import { useParams } from "react-router-dom";

const ConversationPage = () => {
  const { id } = useParams();

  const { onlineUsers } = useSocketContext();

  const { data } = useGetUserByConversationIdQuery(id as string);

  const otherUser = data?.data;

  const isActive = onlineUsers.includes(otherUser?._id?.toString());

  return (
    <div className="flex-1 flex flex-col h-svh bg-slate-100">
      <ConversationHeader user={otherUser} isActive={isActive} />

      <MessageContainer />
      <SendMessage />
    </div>
  );
};

export default ConversationPage;
