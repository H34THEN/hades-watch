import Link from "next/link";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { CHAT_PRIVACY_SHORT } from "@/lib/chat/constants";

interface ChatRoomSidebarProps {
  roomName: string;
  roomDescription: string | null;
  presence: string[];
  activeRoomSlug: string;
}

export function ChatRoomSidebar({
  roomName,
  roomDescription,
  presence,
  activeRoomSlug,
}: ChatRoomSidebarProps) {
  return (
    <aside className="min-w-0 space-y-4">
      <TerminalPanel title="relay.room">
        <h2 className="font-mono text-sm font-semibold uppercase text-primary">{roomName}</h2>
        {roomDescription && (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{roomDescription}</p>
        )}
        <p className="mt-3 font-mono text-[10px] text-muted-foreground">Slug: {activeRoomSlug}</p>
      </TerminalPanel>

      <TerminalPanel title="relay.presence">
        {presence.length === 0 ? (
          <p className="font-mono text-xs text-muted-foreground">No aliases visible.</p>
        ) : (
          <ul className="space-y-1 font-mono text-xs">
            {presence.map((alias) => (
              <li key={alias} className="text-primary/90">
                {alias}
              </li>
            ))}
          </ul>
        )}
      </TerminalPanel>

      <TerminalPanel title="relay.safety">
        <p className="text-xs leading-relaxed text-muted-foreground">{CHAT_PRIVACY_SHORT}</p>
        <ul className="mt-3 space-y-1 font-mono text-[10px] text-muted-foreground">
          <li>· No private data or doxxing</li>
          <li>· Report unsafe messages via moderation</li>
          <li>· HTTPS relay — not E2E encrypted</li>
        </ul>
      </TerminalPanel>

      <TerminalPanel title="relay.related">
        <ul className="space-y-1 font-mono text-xs">
          <li>
            <Link href="/dead-drops" className="text-primary hover:underline">
              Field Care Dead Drops
            </Link>
          </li>
          <li>
            <Link href="/mmo" className="text-primary hover:underline">
              MMO Hub
            </Link>
          </li>
          <li>
            <Link href="/community/forums" className="text-primary hover:underline">
              Forums
            </Link>
          </li>
        </ul>
      </TerminalPanel>
    </aside>
  );
}
