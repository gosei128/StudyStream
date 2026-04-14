"use client";

import * as React from "react";
import { useSocket } from "@/hooks/use-socket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRoom } from "../context/roomContext";

type ChatMessage = {
  roomName: string;
  text: string;
  at: string;
};

export default function Chat() {
  const { state, lastError, joinRoom, sendMessage, onMessage } = useSocket();
  const { room, setRoom } = useRoom();

  const [roomName, setRoomName] = React.useState(room || "general");
  const [draft, setDraft] = React.useState("");
  const [activeRoom, setActiveRoom] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);

  React.useEffect(() => {
    return onMessage((payload) => {
      setMessages((prev) => [...prev, payload]);
    });
  }, [onMessage]);

  React.useEffect(() => {
    if (room) setRoomName(room);
  }, [room]);

  React.useEffect(() => {
    if (state !== "connected") return;
    if (!room) return;
    setActiveRoom(room);
    setMessages([]);
    joinRoom(room);
  }, [joinRoom, room, state]);

  const handleJoin = () => {
    const nextRoom = roomName.trim();
    if (!nextRoom) return;
    setActiveRoom(nextRoom);
    setMessages([]);
    joinRoom(nextRoom);
    setRoom(nextRoom);
  };

  const handleSend = () => {
    const room = activeRoom;
    const text = draft.trim();
    if (!room || !text) return;
    sendMessage(room, text);
    setDraft("");
  };

  return (
    <section className="flex w-full flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center gap-2">
        {lastError ? (
          <div className="text-sm text-red-500">Error: {lastError}</div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={activeRoom ? "Type a message…" : "Join a room first"}
          className="flex-1 min-w-[240px]"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          disabled={!activeRoom || state !== "connected"}
        />
        <Button
          onClick={handleSend}
          disabled={!activeRoom || state !== "connected"}
        >
          Send
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto rounded-md border p-3">
        {messages.length === 0 ? (
          <div className="text-sm text-muted-foreground">No messages yet.</div>
        ) : (
          messages.map((m, idx) => (
            <div key={`${m.at}-${idx}`} className="text-sm">
              <span className="text-muted-foreground">
                {new Date(m.at).toLocaleTimeString()}{" "}
              </span>
              <span className="font-medium">[{m.roomName}]</span> {m.text}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
