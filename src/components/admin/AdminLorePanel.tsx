"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { createLoreAction, publishLoreAction } from "@/lib/actions/lore";

interface AdminLorePanelProps {
  entries: {
    id: string;
    slug: string;
    title: string;
    status: string;
    requiredRole: string | null;
    requiredFaction: { name: string } | null;
  }[];
}

export function AdminLorePanel({ entries }: AdminLorePanelProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createLoreAction(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      e.currentTarget.reset();
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 font-mono text-xs">
        {entries.map((e) => (
          <div key={e.id} className="flex items-center justify-between border-b border-border/30 py-2">
            <span>
              {e.title} · {e.status}
              {e.requiredRole && <span className="text-muted-foreground"> · {e.requiredRole}+</span>}
            </span>
            {e.status === "Draft" && (
              <CommandButton
                size="sm"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await publishLoreAction(e.id);
                    router.refresh();
                  })
                }
              >
                Publish
              </CommandButton>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleCreate} className="space-y-4 border-t border-border/40 pt-6">
        <h3 className="font-mono text-xs tracking-widest uppercase text-muted-foreground">Create Lore Entry</h3>
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase">Title</Label>
          <Input name="title" required className="font-mono" />
        </div>
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase">Excerpt</Label>
          <Input name="excerpt" className="font-mono" />
        </div>
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase">Body</Label>
          <textarea name="body" required rows={6} className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" />
        </div>
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase">Required Role</Label>
          <select name="requiredRole" className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm">
            <option value="">None</option>
            {["Member", "Gamer", "Expert", "Moderator", "Admin", "Owner"].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        {error && <SystemAlert title="Error" message={error} variant="error" />}
        <CommandButton type="submit" disabled={isPending}>Create Draft</CommandButton>
      </form>
    </div>
  );
}
