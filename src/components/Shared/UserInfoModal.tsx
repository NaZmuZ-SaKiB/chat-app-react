import { cn } from "@/lib/utils";
import { Info, X } from "lucide-react";
import { useState } from "react";

const UserInfoModal = ({ user }: { user: any }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div onClick={handleOpen}>
        <Info className="size-6 text-sky-600 hover:text-sky-500 cursor-pointer" />
      </div>

      <div
        className={cn(
          "h-svh w-svw absolute z-50 hidden top-0 left-0 bg-black/20",
          {
            flex: open,
          }
        )}
      >
        <div className="flex-1 h-full" onClick={handleClose}></div>
        <div className="h-full w-full max-w-md bg-slate-100 px-3 pt-5 pb-10 flex flex-col items-center gap-5">
          <div
            className="px-1.5 cursor-pointer self-start"
            onClick={handleClose}
          >
            <X className="size-8" />
          </div>
          <div className="size-60 p-1 bg-slate-100 rounded-full overflow-hidden border-2 border-sky-500">
            <img
              src={user?.image}
              alt={user?.username}
              className="rounded-full"
            />
          </div>

          <div className="text-center flex flex-col gap-3">
            <h1 className="text-3xl font-semibold uppercase">
              {user?.name || "Loading..."}
            </h1>
            <p className="text-xl">{user?.username || "Loading..."}</p>
            <p>{user?.email || "Loading..."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoModal;
