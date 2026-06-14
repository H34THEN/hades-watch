"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { RoleplayDisclaimer } from "@/components/terminal/RoleplayDisclaimer";
import { createDeadDropAction } from "@/lib/actions/phase4";

interface AdminDeadDropPanelProps {
  drops: {
    id: string;
    slug: string;
    codename: string;
    title: string;
    status: string;
    clearanceRole: string | null;
  }[];
}

export function AdminDeadDropPanel({ drops }: AdminDeadDropPanelProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createDeadDropAction(formData);
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
      <RoleplayDisclaimer />
      <div className="space-y-2 font-mono text-xs">
        {drops.map((d) => (
          <div key={d.id} className="border-b border-border/30 py-2">
            {d.codename} · {d.title} · {d.status}
            {d.clearanceRole && <span className="text-muted-foreground"> · {d.clearanceRole}+</span>}
          </div>
        ))}
      </div>

      <form onSubmit={handleCreate} className="space-y-4 border-t border-border/40 pt-6">
        <h3 className="font-mono text-xs tracking-widest uppercase text-muted-foreground">Create Dead Drop</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase">Codename</Label>
            <Input name="codename" required className="font-mono uppercase" />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase">Title</Label>
            <Input name="title" required className="font-mono" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase">Location Hint</Label>
          <Input name="locationHint" className="font-mono" />
        </div>
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase">Message</Label>
          <textarea name="message" required rows={4} className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm font-mono" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase">Clearance Role</Label>
            <select name="clearanceRole" className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm">
              <option value="">All Members</option>
              {["Member", "Gamer", "Expert", "Moderator", "Admin", "Owner"].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase">Expires At</Label>
            <Input name="expiresAt" type="datetime-local" />
          </div>
        </div>
        {error && <SystemAlert title="Error" message={error} variant="error" />}
        <CommandButton type="submit" disabled={isPending}>Create Drop</CommandButton>
      </form>
    </div>
  );
}
