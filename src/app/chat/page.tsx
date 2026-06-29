import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { getActiveChatRooms } from "@/lib/chat/queries";

export const metadata = { title: "Chat Rooms" };

export default async function ChatIndexPage() {
  const rooms = await getActiveChatRooms();
  if (rooms.length === 0) {
    return (
      <PageShell variant="dashboard" scanlines>
        <p className="font-mono text-sm text-muted-foreground">No chat rooms seeded yet.</p>
      </PageShell>
    );
  }
  redirect(`/chat/${rooms[0].slug}`);
}
