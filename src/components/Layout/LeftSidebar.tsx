import { LogOut } from "lucide-react";
import Conversations from "../Shared/Conversations";
import SearchBox from "../Shared/SearchBox";
import { useAuthContext } from "@/context/AuthContextProvider";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import SearchResult from "../Shared/SearchResult";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";

const LeftSidebar = () => {
  const { authUser, setAuthUser } = useAuthContext();

  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const handleLogout = () => {
    Cookies.remove("jwt");
    setAuthUser(null);
    localStorage.removeItem("auth-user");
    queryClient.invalidateQueries({
      queryKey: ["me"],
    });
    navigate("/sign-in");
  };
  return (
    <div className="left-sidebar w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chats</h1>

        <div className="flex gap-3">
          <Link
            to={"/my-profile"}
            className="size-10 bg-slate-100 rounded-full border-2 border-sky-300 hover:border-sky-500"
          >
            <img
              src={authUser?.image}
              alt={authUser?.username}
              className="rounded-full"
            />
          </Link>

          <div
            className="size-10 rounded-full grid place-items-center cursor-pointer bg-slate-100 hover:bg-slate-200"
            onClick={handleLogout}
          >
            <LogOut className="size-5 rotate-180" />
          </div>
        </div>
      </div>

      <SearchBox search={search} setSearch={setSearch} />

      {search ? (
        <SearchResult search={search} setSearch={setSearch} />
      ) : (
        <Conversations />
      )}
    </div>
  );
};

export default LeftSidebar;
