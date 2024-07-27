import { useAuthContext } from "@/context/AuthContextProvider";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { authUser } = useAuthContext();

  if (authUser === null) {
    return <Navigate to={"/sign-in"} replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
