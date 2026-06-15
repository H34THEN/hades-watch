"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import {
  clearChatRoomAction,
  deleteChatMessageAction,
  fetchChatRoomStateAction,
  generateChatAliasAction,
  postChatMessageAction,
  type ChatMessageDto,
} from "@/lib/actions/chat";
import {
  CHAT_POLL_INTERVAL_MS,
  CHAT_PRIVACY_SHORT,
  CHAT_PRIVACY_WARNING,
} from "@/lib/chat/constants";
import { resolveDefaultChatAlias } from "@/lib/chat/aliases";

const ALIAS_STORAGE_KEY = "hades-watch-chat-alias";

export interface ChatRoomOption {
  slug: string;
  name: string;
  description: string | null;
}

interface ChatRoomClientProps {
  rooms: ChatRoomOption[];
  activeRoomSlug: string;
  defaultAlias: string;
  canModerate: boolean;
}

export function ChatRoomClient({
  rooms,
  activeRoomSlug,
  defaultAlias,
  canModerate,
}: ChatRoomClientProps) {
  const [alias, setAlias] = useState(() => {
    if (typeof window === "undefined") return defaultAlias;
    const stored = sessionStorage.getItem(ALIAS_STORAGE_KEY);
    if (stored) return stored;
    return resolveDefaultChatAlias({ preferred: defaultAlias });
  });
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [presence, setPresence] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const refresh = useCallback(async () => {
    const result = await fetchChatRoomStateAction(activeRoomSlug);
    if (result.success && result.data) {
      setMessages(result.data.messages);
      setPresence(result.data.presence);
    }
  }, [activeRoomSlug]);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      const result = await fetchChatRoomStateAction(activeRoomSlug);
      if (cancelled || !result.success || !result.data) return;
      setMessages(result.data.messages);
      setPresence(result.data.presence);
    }

    void poll();
    const id = setInterval(() => void poll(), CHAT_POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [activeRoomSlug]);

  function persistAlias(value: string) {
    setAlias(value);
    sessionStorage.setItem(ALIAS_STORAGE_KEY, value);
  }

  function handleRandomAlias() {
    startTransition(async () => {
      const result = await generateChatAliasAction();
      if (result.success && result.data) {
        persistAlias(result.data.alias);
      }
    });
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await postChatMessageAction(activeRoomSlug, alias, message);
      if (!result.success) {
        setError(result.error);
        return;
      }
      persistAlias(alias);
      setMessage("");
      await refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteChatMessageAction(id);
      if (!result.success) setError(result.error);
      else await refresh();
    });
  }

  function handleClearRoom() {
    if (!confirm("Clear all visible messages in this room?")) return;
    startTransition(async () => {
      const result = await clearChatRoomAction(activeRoomSlug);
      if (!result.success) setError(result.error);
      else await refresh();
    });
  }

  const activeRoom = rooms.find((r) => r.slug === activeRoomSlug);

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <TerminalPanel title="rooms.list" className="h-fit">
        <ul className="space-y-1 font-mono text-xs">
          {rooms.map((room) => (
            <li key={room.slug}>
              <Link
                href={`/chat/${room.slug}`}
                className={`block border px-2 py-1.5 transition-colors ${
                  room.slug === activeRoomSlug
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/40 hover:border-primary/40"
                }`}
              >
                {room.name}
              </Link>
            </li>
          ))}
        </ul>
      </TerminalPanel>

      <div className="space-y-4">
        <TerminalPanel title={`chat.${activeRoomSlug}`}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-mono text-lg tracking-wider uppercase text-primary">
                {activeRoom?.name ?? activeRoomSlug}
              </h2>
              {activeRoom?.description && (
                <p className="text-xs text-muted-foreground">{activeRoom.description}</p>
              )}
            </div>
            {presence.length > 0 && (
              <p className="font-mono text-[10px] text-muted-foreground">
                recent: {presence.slice(0, 8).join(", ")}
                {presence.length > 8 ? "…" : ""}
              </p>
            )}
          </div>

          <SystemAlert
            title="Temporary Chat"
            message={CHAT_PRIVACY_WARNING}
            variant="warning"
            className="mb-4 text-xs"
          />
          <p className="mb-4 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
            {CHAT_PRIVACY_SHORT}
          </p>

          <div
            className="mb-4 h-72 overflow-y-auto border border-border/50 bg-black/40 p-3 font-mono text-xs"
            aria-live="polite"
          >
            {messages.length === 0 ? (
              <p className="text-muted-foreground">Room quiet. Say something non-secret.</p>
            ) : (
              messages.map((m) => (
                <div key={m.id} className="mb-2 border-b border-border/20 pb-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-primary">
                      &lt;{m.alias}&gt;
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(m.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap break-words text-foreground/90">{m.body}</p>
                  {(m.isOwn || canModerate) && (
                    <button
                      type="button"
                      onClick={() => handleDelete(m.id)}
                      className="mt-1 text-[10px] text-destructive hover:underline"
                    >
                      remove
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSend} className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Input
                value={alias}
                onChange={(e) => persistAlias(e.target.value)}
                placeholder="chat alias"
                className="max-w-[200px] font-mono text-xs"
                maxLength={32}
                disabled={isPending}
              />
              <CommandButton type="button" size="sm" variant="outline" onClick={handleRandomAlias} disabled={isPending}>
                Random Alias
              </CommandButton>
            </div>
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="type message…"
                className="font-mono text-xs"
                maxLength={500}
                disabled={isPending}
              />
              <CommandButton type="submit" disabled={isPending || !message.trim()}>
                Send
              </CommandButton>
            </div>
          </form>

          {error && <SystemAlert title="Chat Error" message={error} variant="error" className="mt-3" />}

          {canModerate && (
            <div className="mt-4 border-t border-border/30 pt-3">
              <CommandButton size="sm" variant="outline" onClick={handleClearRoom} disabled={isPending}>
                Clear Room (Mod)
              </CommandButton>
            </div>
          )}
        </TerminalPanel>
      </div>
    </div>
  );
}
