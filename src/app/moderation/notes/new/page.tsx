"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { createModerationNoteAction } from "@/lib/actions/moderation";

export default function NewModerationNotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createModerationNoteAction(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.push("/moderation/notes");
    });
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-8 font-mono text-2xl tracking-widest uppercase">New Mod Note</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase">Subject User ID</Label>
          <Input name="userId" required defaultValue={searchParams.get("userId") ?? ""} className="font-mono" />
        </div>
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase">Note</Label>
          <textarea name="body" required rows={5} className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" />
        </div>
        {error && <SystemAlert title="Error" message={error} variant="error" />}
        <CommandButton type="submit" disabled={isPending}>Save Note</CommandButton>
      </form>
    </div>
  );
}
