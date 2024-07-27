import { createContext, ReactNode, useContext, useState } from "react";

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

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
