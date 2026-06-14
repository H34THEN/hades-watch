"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { createQuestAction, publishQuestAction } from "@/lib/actions/mmo";

interface AdminMissionPanelProps {
  missions: {
    id: string;
    slug: string;
    title: string;
    status: string;
    faction: { name: string } | null;
  }[];
  factions: { id: string; name: string }[];
}

export function AdminMissionPanel({ missions, factions }: AdminMissionPanelProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createQuestAction(formData);
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
        {missions.map((m) => (
          <div key={m.id} className="flex items-center justify-between border-b border-border/30 py-2">
            <span>
              {m.title} · {m.status}
              {m.faction && <span className="text-muted-foreground"> · {m.faction.name}</span>}
            </span>
            {m.status === "Draft" && (
              <CommandButton
                size="sm"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await publishQuestAction(m.id);
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
        <h3 className="font-mono text-xs tracking-widest uppercase text-muted-foreground">Create Mission</h3>
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase">Title</Label>
          <Input name="title" required className="font-mono" />
        </div>
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase">Description</Label>
          <textarea name="description" required rows={4} className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" />
        </div>
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase">Faction</Label>
          <select name="factionId" className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm">
            <option value="">None</option>
            {factions.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
        {error && <SystemAlert title="Error" message={error} variant="error" />}
        <CommandButton type="submit" disabled={isPending}>Create Draft</CommandButton>
      </form>
    </div>
  );
}
