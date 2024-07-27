import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import AudioCall from "./AudioCall";

type TProps = {
  user: any;
  isActive?: boolean;
};

const ConversationHeader = ({ user, isActive = undefined }: TProps) => {
  return (
    <div className="px-4 py-2 bg-blue-100 flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <Link to={"/"} className="px-1.5 cursor-pointer md:hidden">
          <ChevronLeft className="size-8" />
        </Link>

        <div className="size-10 bg-slate-200 rounded-full relative">
          <img src={user?.image} alt={user?.username} />
          <div className="size-3 grid place-items-center rounded-full bg-white absolute right-0 bottom-0">
            <div
              className={cn("size-2 rounded-full bg-gray-300", {
                "bg-green-500": isActive,
              })}
            ></div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">{user?.name || "Loading..."}</h3>
          <p className="text-xs text-slate-500">
            {isActive === undefined
              ? null
              : isActive
              ? "Active now"
              : "Inactive"}
          </p>
        </div>
      </div>

      <AudioCall otherUserId={`${user?._id}`} isActive={isActive || false} />
    </div>
  );
};

export default ConversationHeader;
