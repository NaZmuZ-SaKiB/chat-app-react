import { useAuthContext } from "@/context/AuthContextProvider";
import { cn } from "@/lib/utils";
import getFormattedDate from "@/utils/getFormattedDate";
import { forwardRef } from "react";

const Message = forwardRef(({ message }: { message: any }, ref: any) => {
  const { authUser } = useAuthContext();
  const myMessage = message?.sender?.toString() === authUser?._id?.toString();

  const date = getFormattedDate(message?.createdAt);

  return (
    <div
      className={cn("max-w-sm self-start", {
        "self-end": myMessage,
      })}
      ref={ref}
    >
      <div
        className={cn("bg-white shadow-sm px-3 py-1.5 rounded-2xl", {
          "bg-blue-600 text-white": myMessage,
          shake: message?.shake,
          "opacity-50": message?.sending,
        })}
      >
        <p className="whitespace-pre-wrap break-words">{message?.message}</p>
      </div>
      <p
        className={cn("text-[10px] mt-1 text-slate-500 ml-2", {
          "text-right ml-0 mr-2": myMessage,
        })}
      >
        {date}
      </p>
    </div>
  );
});

export default Message;
