import ConversationHeader from "@/components/Shared/ConversationHeader";
import SendFirstMessage from "@/components/Shared/SendFirstMessage";
import { useGetConversationWith } from "@/lib/queries/conversation.query";
import { useGetUserByIdQuery } from "@/lib/queries/user.query";
import { useNavigate, useParams } from "react-router-dom";

const StartConversationPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { data: conversationData, isLoading } = useGetConversationWith(
    id as string
  );
  const conversation = conversationData?.data;

  const { data } = useGetUserByIdQuery(id as string);
  const otherUser = data?.data;

  if (isLoading) return <div>Loading...</div>;

  if (conversation) navigate(`/conversation/${conversation._id}`);

  return (
    <div className="flex-1 flex flex-col h-svh bg-slate-100">
      <ConversationHeader user={otherUser} />

      <div className="flex-1 grid place-items-center">
        <div>
          <h1 className="text-2xl font-semibold text-center mb-3">
            Start New Conversation
          </h1>
          <p className="text-gray-500 text-center">
            Send a message to start conversation{" "}
            {otherUser && `with ${otherUser?.name}`}
          </p>
        </div>
      </div>

      <SendFirstMessage />
    </div>
  );
};

export default StartConversationPage;
