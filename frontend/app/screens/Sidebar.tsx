"use client";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRoom } from "../context/roomContext";
const Drawer = () => {
  const rooms = ["WebDev", "DSA", "Great Books"];
  const { room, setRoom } = useRoom();
  return (
    <Sidebar className="h-full" variant="floating">
      <SidebarHeader>
        <h1>StudyStream</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <h3>Study Rooms</h3>
          </SidebarGroupLabel>
          {rooms.map((roomName) => (
            <Button
              key={roomName}
              variant={room === roomName ? "default" : "outline"}
              className="m-1 justify-start"
              onClick={() => setRoom(roomName)}
            >
              #{roomName}
            </Button>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Login</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>
                <Button className="w-full" variant={"outline"}>Logout</Button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default Drawer;
