"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { createFactionAction } from "@/lib/actions/mmo";

export function AdminFactionForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createFactionAction(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      e.currentTarget.reset();
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t border-border/40 pt-6">
      <h3 className="font-mono text-xs tracking-widest uppercase text-muted-foreground">Create Faction</h3>
      <div className="space-y-2">
        <Label className="font-mono text-xs uppercase">Name</Label>
        <Input name="name" required className="font-mono" />
      </div>
      <div className="space-y-2">
        <Label className="font-mono text-xs uppercase">Description</Label>
        <textarea name="description" rows={3} className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" />
      </div>
      {error && <SystemAlert title="Error" message={error} variant="error" />}
      <CommandButton type="submit" disabled={isPending}>Create</CommandButton>
    </form>
  );
}
