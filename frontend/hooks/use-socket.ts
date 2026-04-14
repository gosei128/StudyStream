/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { io, type Socket } from "socket.io-client";

export type SocketConnectionState = "connecting" | "connected" | "disconnected";

export type ServerToClientEvents = {
  message: (payload: { roomName: string; text: string; at: string }) => void;
  error: (payload: { message: string }) => void;
};

export type ClientToServerEvents = {
  joinRoom: (roomName: string) => void;
  sendMessage: (payload: { roomName: string; text: string }) => void;
};

type UseSocketArgs = {
  url?: string;
};

export function useSocket(args: UseSocketArgs = {}) {
  const url =
    args.url ??
    (process.env.NEXT_PUBLIC_BACKEND_URL as string | undefined) ??
    "http://localhost:8000";

  const socketRef = React.useRef<
    Socket<ServerToClientEvents, ClientToServerEvents> | undefined
  >(undefined);
  const [state, setState] = React.useState<SocketConnectionState>(
    "disconnected",
  );
  const [lastError, setLastError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setState("connecting");
    setLastError(null);

    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(url, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 250,
      reconnectionDelayMax: 2000,
    });

    socketRef.current = socket;

    const onConnect = () => setState("connected");
    const onDisconnect = () => setState("disconnected");
    const onError = (payload: { message: string }) => {
      setLastError(payload.message);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("error", onError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("error", onError);
      socket.disconnect();
      socketRef.current = undefined;
      setState("disconnected");
    };
  }, [url]);

  const joinRoom = React.useCallback((roomName: string) => {
    socketRef.current?.emit("joinRoom", roomName);
  }, []);

  const sendMessage = React.useCallback((roomName: string, text: string) => {
    socketRef.current?.emit("sendMessage", { roomName, text });
  }, []);

  const onMessage = React.useCallback(
    (handler: (payload: { roomName: string; text: string; at: string }) => void) => {
      const socket = socketRef.current;
      if (!socket) return () => {};
      socket.on("message", handler);
      return () => socket.off("message", handler);
    },
    [],
  );

  return {
    socket: socketRef.current,
    state,
    lastError,
    joinRoom,
    sendMessage,
    onMessage,
  };
}

