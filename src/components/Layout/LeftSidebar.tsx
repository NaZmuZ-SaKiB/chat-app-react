import { LogOut } from "lucide-react";
import Conversations from "../Shared/Conversations";
import SearchBox from "../Shared/SearchBox";
import { useSignOutMutation } from "@/lib/queries/auth.query";
import { useAuthContext } from "@/context/AuthContextProvider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SearchResult from "../Shared/SearchResult";

const LeftSidebar = () => {
  const { setAuthUser } = useAuthContext();
  const { mutateAsync: signOutFn } = useSignOutMutation();

  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOutFn();
    setAuthUser(null);
    localStorage.removeItem("auth-user");
    navigate("/sign-in");
  };
  return (
    <div className="left-sidebar w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chats</h1>

        <LogOut
          className="size-8 rounded-full cursor-pointer hover:bg-slate-100 p-1.5 rotate-180"
          onClick={handleLogout}
        />
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
