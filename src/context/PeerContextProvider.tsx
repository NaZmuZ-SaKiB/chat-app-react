import Peer from "peerjs";
import { createContext, ReactNode, useContext, useState } from "react";

type TPeerContext = {
  peer: Peer | null;
  setPeer: (peer: Peer) => void;
};

export const PeerContext = createContext<TPeerContext>({
  peer: null,
  setPeer: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const usePeerContext = () => useContext(PeerContext);

const PeerContextProvider = ({ children }: { children: ReactNode }) => {
  const [peer, setPeer] = useState<Peer | null>(null);

  return (
    <PeerContext.Provider value={{ peer, setPeer }}>
      {children}
    </PeerContext.Provider>
  );
};

export default PeerContextProvider;
