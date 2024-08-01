/* eslint-disable react-hooks/exhaustive-deps */
import { useGetUserByIdQuery } from "@/lib/queries/user.query";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export const AuthContext = createContext<{
  authUser: any;
  setAuthUser: any;
}>({
  authUser: null,
  setAuthUser: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => useContext(AuthContext);

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<any | null>(
    JSON.parse(localStorage.getItem("auth-user") || "null")
  );

  const { data } = useGetUserByIdQuery(authUser?._id?.toString() || "");

  useEffect(() => {
    if (data?.data) {
      localStorage.setItem("auth-user", JSON.stringify(data?.data));
      setAuthUser(data?.data);
    }
  }, [data]);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
