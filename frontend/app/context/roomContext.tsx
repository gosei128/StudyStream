"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
  useContext,
  type ReactNode,
} from "react";
type RoomContextType = {
  room: string;
  setRoom: Dispatch<SetStateAction<string>>;
};
const RoomContext = createContext<RoomContextType | null>(null);

const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [room, setRoom] = useState("");
  return (
    <RoomContext.Provider value={{ room, setRoom }}>
      {children}
    </RoomContext.Provider>
  );
};

function useRoom() {
  const ctx = useContext(RoomContext);
  if (!ctx) {
    throw new Error("useRoom must be used within RoomProvider");
  }
  return ctx;
}

export { RoomContext, RoomProvider, useRoom };
