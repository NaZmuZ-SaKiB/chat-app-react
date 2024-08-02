import ChangePasswordForm from "@/components/Forms/ChangePasswordForm";
import UserUpdateForm from "@/components/Forms/UserUpdateForm";
import { useAuthContext } from "@/context/AuthContextProvider";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const MyProfilePage = () => {
  const { authUser } = useAuthContext();

  return (
    <div className="bg-slate-100 flex-1 flex flex-col items-center gap-5 px-3 pb-10 pt-5">
      <Link to={"/"} className="px-1.5 cursor-pointer self-start">
        <ChevronLeft className="size-8" />
      </Link>
      <div className="size-60 p-1 bg-slate-100 rounded-full overflow-hidden border-2 border-sky-500">
        <img
          src={authUser?.image}
          alt={authUser?.username}
          className="rounded-full"
        />
      </div>

      <div className="text-center">
        <h1 className="text-3xl font-semibold uppercase">
          {authUser?.name || "Loading..."}
        </h1>
        <p>{authUser?.email || "Loading..."}</p>
      </div>

      <div className="h-[1px] w-full bg-slate-300"></div>

      <UserUpdateForm />

      <div className="h-[1px] w-full bg-slate-300"></div>

      <ChangePasswordForm />
    </div>
  );
};

export default MyProfilePage;
