import { createContext, ReactNode, useContext, useState } from "react";

type TCallStatus = "idle" | "in-call";

export const CallContext = createContext<{
  currentCallStatus: TCallStatus;
  setCurrentCallStatus: (status: TCallStatus) => void;
}>({
  currentCallStatus: "idle",
  setCurrentCallStatus: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useCallContext = () => useContext(CallContext);

const CallStatusContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentCallStatus, setCurrentCallStatus] =
    useState<TCallStatus>("idle");
  return (
    <CallContext.Provider value={{ currentCallStatus, setCurrentCallStatus }}>
      {children}
    </CallContext.Provider>
  );
};

export default CallStatusContextProvider;
