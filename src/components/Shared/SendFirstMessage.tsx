import { useStartConversationMutation } from "@/lib/queries/conversation.query";
import { useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, SendHorizontal } from "lucide-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const SendFirstMessage = () => {
  const { id } = useParams();

  const [message, setMessage] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutateAsync: startConversation, isPending } =
    useStartConversationMutation();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault();

    const data = {
      id,
      message,
    };

    try {
      const result = await startConversation(data as any);
      setMessage("");
      if (!result?.success) {
        toast.error(result?.message || "Could not send message");

        navigate("/");
      } else {
        queryClient.invalidateQueries({
          queryKey: ["sidebar"],
        });
        navigate(`/conversation/${result?.data?._id}`);
      }
    } catch (error: any) {
      toast.error(error?.message || "Could not send message");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === "Enter" && e.shiftKey) {
      adjustTextareaHeight();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "28px";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <div className="p-4">
      <form className="flex items-center gap-3" onSubmit={handleSubmit}>
        <div className="w-full px-3 py-2 bg-white rounded-2xl flex items-center gap-3">
          <textarea
            ref={textareaRef}
            value={message}
            placeholder="Type a message..."
            className="w-full bg-transparent max-h-40 h-7 overflow-y-auto resize-none outline-none border-none"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="submit"
            className="outline-none disabled:opacity-50"
            disabled={isPending}
          >
            {isPending ? (
              <LoaderCircle className="size-7 animate-spin text-gray-500" />
            ) : (
              <SendHorizontal className="size-7 text-gray-500" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendFirstMessage;
