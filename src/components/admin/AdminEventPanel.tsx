"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import {
  addJitsiToEventAction,
  archiveEventAction,
  cancelEventAction,
  createEventAction,
  publishEventAction,
} from "@/lib/actions/events";
import type { EventStatus, RoleName } from "@/generated/prisma/client";

interface EventRow {
  id: string;
  title: string;
  description: string;
  eventType: string;
  status: EventStatus;
  startsAt: Date;
  endsAt: Date | null;
  location: string | null;
  virtualUrl: string | null;
  jitsiRoomName: string | null;
  audienceRole: RoleName | null;
}

interface AdminEventPanelProps {
  events: EventRow[];
}

const ROLES: (RoleName | "")[] = ["", "Member", "Gamer", "Expert", "Moderator", "Admin", "Owner"];
const EVENT_TYPES = ["general", "briefing", "council", "campaign", "social", "training"];

export function AdminEventPanel({ events }: AdminEventPanelProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [eventType, setEventType] = useState("general");
  const [audienceRole, setAudienceRole] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("eventType", eventType);
    if (audienceRole.trim()) formData.set("audienceRole", audienceRole.trim());

    startTransition(async () => {
      const result = await createEventAction(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      (e.target as HTMLFormElement).reset();
      router.refresh();
    });
  }

  function handleAction(action: (id: string) => Promise<{ success: boolean; error?: string }>, id: string) {
    startTransition(async () => {
      const result = await action(id);
      if (!result.success) setError(result.error ?? "Action failed");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleCreate} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label className="font-mono text-xs uppercase">Title</Label>
            <Input name="title" required />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label className="font-mono text-xs uppercase">Description</Label>
            <textarea
              name="description"
              required
              rows={3}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase">Event Type</Label>
            <Select value={eventType} onValueChange={(v) => v && setEventType(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase">Audience Role</Label>
            <Select value={audienceRole} onValueChange={(v) => setAudienceRole(v ?? "")}>
              <SelectTrigger><SelectValue placeholder="All roles" /></SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r || "all"} value={r || " "}>{r || "All roles"}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase">Starts At</Label>
            <Input name="startsAt" type="datetime-local" required />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase">Ends At</Label>
            <Input name="endsAt" type="datetime-local" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label className="font-mono text-xs uppercase">Location</Label>
            <Input name="location" placeholder="Physical or virtual location label" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="generateJitsi" id="generateJitsi" className="accent-primary" />
            <Label htmlFor="generateJitsi" className="font-mono text-xs uppercase">
              Generate Jitsi room
            </Label>
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase">Jitsi Prefix</Label>
            <Input name="jitsiPrefix" placeholder="briefing" />
          </div>
        </div>
        <CommandButton type="submit" disabled={isPending}>Create Draft Event</CommandButton>
      </form>

      {error && <SystemAlert title="Error" message={error} variant="error" />}

      <p className="font-mono text-[10px] text-muted-foreground">
        Jitsi rooms are not private by default. Anyone with the URL can join.
      </p>

      <div className="overflow-x-auto font-mono text-xs">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-2">Title</th>
              <th className="p-2">Type</th>
              <th className="p-2">Status</th>
              <th className="p-2">Starts</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.id} className="border-b border-border/40">
                <td className="p-2">{ev.title}</td>
                <td className="p-2">{ev.eventType}</td>
                <td className="p-2">{ev.status}</td>
                <td className="p-2">{ev.startsAt.toLocaleString()}</td>
                <td className="p-2 space-x-2">
                  {ev.status === "Draft" && (
                    <button type="button" onClick={() => handleAction(publishEventAction, ev.id)} className="text-primary hover:underline">Publish</button>
                  )}
                  {ev.status === "Published" && (
                    <button type="button" onClick={() => handleAction(cancelEventAction, ev.id)} className="text-destructive hover:underline">Cancel</button>
                  )}
                  {!ev.jitsiRoomName && ev.status !== "Archived" && (
                    <button type="button" onClick={() => startTransition(async () => { await addJitsiToEventAction(ev.id, ev.eventType); router.refresh(); })} className="text-primary hover:underline">+Jitsi</button>
                  )}
                  {ev.virtualUrl && (
                    <a href={ev.virtualUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Room</a>
                  )}
                  {ev.status !== "Archived" && ev.status !== "Cancelled" && (
                    <button type="button" onClick={() => handleAction(archiveEventAction, ev.id)} className="text-muted-foreground hover:underline">Archive</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
