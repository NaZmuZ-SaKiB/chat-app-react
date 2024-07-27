import { Toaster } from "sonner";
import LeftSidebar from "./LeftSidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <div className="flex min-h-svh">
        <div className="max-md:hidden w-[350px]">
          <LeftSidebar />
        </div>
        <Outlet />
      </div>
      <Toaster />
    </>
  );
};

export default MainLayout;
