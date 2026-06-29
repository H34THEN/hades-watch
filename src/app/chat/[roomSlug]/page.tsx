import { ChatRoomClient } from "@/components/chat/ChatRoomClient";
import { ChatRoomSidebar } from "@/components/chat/ChatRoomSidebar";
import { PageShell } from "@/components/layout/PageShell";
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
      <PageShell variant="dashboard" scanlines>
        <TerminalPanel title="chat.error">
          <p>Room not found.</p>
        </TerminalPanel>
      </PageShell>
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
    <PageShell variant="full" scanlines contentClassName="max-w-none">
      <div className="hw-split-panel">
        <div className="min-w-0">
          <header className="mb-4">
            <h1 className="font-mono text-2xl tracking-widest uppercase md:text-3xl">Chat Relay</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              AIM-era underwatch chatter. HTTPS-protected temporary chat — not end-to-end encrypted.
            </p>
          </header>
          <ChatRoomClient
            rooms={rooms}
            activeRoomSlug={roomSlug}
            defaultAlias={defaultAlias}
            canModerate={isModerator(user.roles)}
          />
        </div>

        <ChatRoomSidebar
          roomName={active.name}
          roomDescription={active.description}
          presence={[]}
          activeRoomSlug={roomSlug}
        />
      </div>
    </PageShell>
  );
}
