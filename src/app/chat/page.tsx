import { redirect } from "next/navigation";
import { getActiveChatRooms } from "@/lib/chat/queries";

export const metadata = { title: "Chat Rooms" };

export default async function ChatIndexPage() {
  const rooms = await getActiveChatRooms();
  if (rooms.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <p className="font-mono text-sm text-muted-foreground">No chat rooms seeded yet.</p>
      </div>
    );
  }
  redirect(`/chat/${rooms[0].slug}`);
}
