"use client";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import Drawer from "./Sidebar";
import StudyRoom from "./StudyRoom";
import { RoomProvider, useRoom } from "../context/roomContext";
import Chat from "./Chat";
import { Button } from "@/components/ui/button";
function HomeContent({ children }: { children: React.ReactNode }) {
  const { room } = useRoom();

  return (
    <main className="p-4 w-full">
      {room === "" ? (
        <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
          Select a study room from the drawer to start.
        </div>
      ) : (
        <div className="grid desktop:grid-cols-2 gap-4">
          <StudyRoom roomName={room} />
          <Chat />
        </div>
      )}
      <div>{children}</div>
    </main>
  );
}

export default function Home({ children }: { children: React.ReactNode }) {
  return (
    <RoomProvider>
      <SidebarProvider className="min-h-svh w-full">
        <Drawer />
        <SidebarTrigger />
        <HomeContent>{children}</HomeContent>
      </SidebarProvider>
    </RoomProvider>
  );
}
