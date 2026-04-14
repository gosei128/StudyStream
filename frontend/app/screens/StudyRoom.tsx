"use client";

type StudyRoomProps = {
  roomName: string;
};

export default function StudyRoom({ roomName }: StudyRoomProps) {
  return (
    <section className="mb-4 rounded-md border p-4">
      <h2 className="text-lg font-semibold ">#{roomName}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        You are now viewing the {roomName} study room.
      </p>
    </section>
  );
}
