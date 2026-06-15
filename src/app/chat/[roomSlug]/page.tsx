import { ChatRoomClient } from "@/components/chat/ChatRoomClient";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getActiveChatRooms } from "@/lib/chat/queries";
import { resolveDefaultChatAlias } from "@/lib/chat/aliases";
import { isModerator } from "@/lib/auth/roles";
import { requireApprovedAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Chat Room" };

export default async function ChatRoomPage({
  params,
}: {
  params: Promise<{ roomSlug: string }>;
}) {
  const { roomSlug } = await params;
  const user = await requireApprovedAuth();
  const rooms = await getActiveChatRooms();
  const active = rooms.find((r) => r.slug === roomSlug);

  if (!active) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <TerminalPanel title="chat.error">
          <p>Room not found.</p>
        </TerminalPanel>
      </div>
    );
  }

  const character = await prisma.character.findUnique({
    where: { userId: user.id },
    select: { callsign: true },
  });

  const defaultAlias = resolveDefaultChatAlias({
    displayName: user.name,
    callsign: character?.callsign,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="mb-2 font-mono text-3xl tracking-widest uppercase">Chat Rooms</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        AIM-era underwatch chatter. HTTPS-protected temporary chat — not end-to-end encrypted.
      </p>
      <ChatRoomClient
        rooms={rooms}
        activeRoomSlug={roomSlug}
        defaultAlias={defaultAlias}
        canModerate={isModerator(user.roles)}
      />
    </div>
  );
}
