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
  archiveAnnouncementAction,
  createAnnouncementAction,
  publishAnnouncementAction,
  unpublishAnnouncementAction,
  updateAnnouncementAction,
} from "@/lib/actions/announcements";
import type { AnnouncementStatus, RoleName, TransmissionPriority } from "@/generated/prisma/client";

interface AnnouncementRow {
  id: string;
  title: string;
  body: string;
  status: AnnouncementStatus;
  priority: TransmissionPriority;
  pinned: boolean;
  audienceRole: RoleName | null;
  publishedAt: Date | null;
  author: { name: string | null; email: string } | null;
}

interface AdminAnnouncementPanelProps {
  announcements: AnnouncementRow[];
}

const ROLES: (RoleName | "")[] = ["", "Member", "Gamer", "Expert", "Moderator", "Admin", "Owner"];
const PRIORITIES: TransmissionPriority[] = ["Low", "Normal", "High", "Critical"];

export function AdminAnnouncementPanel({ announcements }: AdminAnnouncementPanelProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [priority, setPriority] = useState<TransmissionPriority>("Normal");
  const [audienceRole, setAudienceRole] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const editing = announcements.find((a) => a.id === editingId);

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("priority", priority);
    if (audienceRole.trim()) formData.set("audienceRole", audienceRole.trim());

    startTransition(async () => {
      const result = editingId
        ? await updateAnnouncementAction(formData)
        : await createAnnouncementAction(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setEditingId(null);
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
        {editingId && <input type="hidden" name="id" value={editingId} />}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label className="font-mono text-xs uppercase">Title</Label>
            <Input name="title" required defaultValue={editing?.title} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label className="font-mono text-xs uppercase">Body</Label>
            <textarea
              name="body"
              required
              rows={4}
              defaultValue={editing?.body}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase">Priority</Label>
            <Select value={editing?.priority ?? priority} onValueChange={(v) => v && setPriority(v as TransmissionPriority)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase">Audience Role</Label>
            <Select value={editing?.audienceRole ?? audienceRole} onValueChange={(v) => setAudienceRole(v ?? "")}>
              <SelectTrigger><SelectValue placeholder="All roles" /></SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r || "all"} value={r || " "}>{r || "All roles"}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="pinned" id="pinned" defaultChecked={editing?.pinned} className="accent-primary" />
            <Label htmlFor="pinned" className="font-mono text-xs uppercase">Pin transmission</Label>
          </div>
        </div>
        <div className="flex gap-2">
          <CommandButton type="submit" disabled={isPending}>
            {editingId ? "Update" : "Create Draft"}
          </CommandButton>
          {editingId && (
            <CommandButton type="button" variant="outline" onClick={() => setEditingId(null)}>
              Cancel
            </CommandButton>
          )}
        </div>
      </form>

      {error && <SystemAlert title="Error" message={error} variant="error" />}

      <div className="overflow-x-auto font-mono text-xs">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-2">Title</th>
              <th className="p-2">Status</th>
              <th className="p-2">Priority</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((a) => (
              <tr key={a.id} className="border-b border-border/40">
                <td className="p-2">
                  {a.title}
                  {a.pinned && <span className="ml-1 text-primary">📌</span>}
                </td>
                <td className="p-2">{a.status}</td>
                <td className="p-2">{a.priority}</td>
                <td className="p-2 space-x-2">
                  <button type="button" onClick={() => setEditingId(a.id)} className="text-primary hover:underline">Edit</button>
                  {a.status === "Draft" && (
                    <button type="button" onClick={() => handleAction(publishAnnouncementAction, a.id)} className="text-primary hover:underline">Publish</button>
                  )}
                  {a.status === "Published" && (
                    <button type="button" onClick={() => handleAction(unpublishAnnouncementAction, a.id)} className="text-muted-foreground hover:underline">Unpublish</button>
                  )}
                  {a.status !== "Archived" && (
                    <button type="button" onClick={() => handleAction(archiveAnnouncementAction, a.id)} className="text-destructive hover:underline">Archive</button>
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
