import { useAuthContext } from "@/context/AuthContextProvider";
import { useSendMessageMutation } from "@/lib/queries/message.query";
import { useQueryClient } from "@tanstack/react-query";
import { SendHorizontal } from "lucide-react";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const SendMessage = () => {
  const [message, setMessage] = useState("");

  const { authUser } = useAuthContext();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { id } = useParams();

  const queryClient = useQueryClient();

  const { mutateAsync: sendMessage, isPending } = useSendMessageMutation();

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault();

    if (isPending) return;

    const data = {
      id,
      message: { message },
    };

    const newMessage = {
      _id: Math.random().toString(),
      message,
      sender: authUser?._id,
      createdAt: new Date().toISOString(),
      sending: true,
    };

    // Optimistic update
    queryClient.setQueryData(["messages", id], (oldData: any) => ({
      ...oldData,
      data: {
        ...oldData?.data,
        messages: [newMessage, ...(oldData?.data?.messages || [])],
      },
    }));

    setMessage("");

    try {
      const result = await sendMessage(data);

      const prevData: any = queryClient.getQueryData(["messages", id]);
      const filteredData = {
        ...prevData,
        data: {
          ...prevData?.data,
          messages: prevData?.data?.messages?.filter(
            (msg: any) => msg._id !== newMessage._id
          ),
        },
      };

      if (!result?.success) {
        // reseting cached data
        queryClient.setQueryData(["messages", id], () => filteredData);

        toast.error(result?.message || "Could not send message");
      } else {
        queryClient.setQueryData(["messages", id], () => ({
          ...filteredData,
          data: {
            ...filteredData?.data,
            messages: [result?.data, ...(filteredData?.data?.messages || [])],
          },
        }));
      }
    } catch (error: any) {
      queryClient.invalidateQueries({
        queryKey: ["messages", id],
      });

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
      <form onSubmit={handleSubmit}>
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
            <SendHorizontal className="size-7 text-gray-500" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendMessage;
