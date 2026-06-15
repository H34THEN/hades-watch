"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { submitRepoAction } from "@/lib/actions/archive-items";

export function ArchiveSubmitRepoForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
          const result = await submitRepoAction(formData);
          if (!result.success) {
            setError(result.error);
            return;
          }
          router.push("/archive/ghost-in-tech");
          router.refresh();
        });
      }}
    >
      <div>
        <label className="font-mono text-[10px] uppercase text-muted-foreground">Repo URL *</label>
        <input
          name="sourceUrl"
          type="url"
          required
          className="mt-1 w-full rounded border border-border/60 bg-background px-3 py-2 font-mono text-sm"
          placeholder="https://github.com/org/repo or https://codeberg.org/user/repo"
        />
      </div>
      <div>
        <label className="font-mono text-[10px] uppercase text-muted-foreground">Display Title</label>
        <input name="title" className="mt-1 w-full rounded border border-border/60 bg-background px-3 py-2 font-mono text-sm" placeholder="Optional — derived from owner/repo if blank" />
      </div>
      <div>
        <label className="font-mono text-[10px] uppercase text-muted-foreground">Blurb</label>
        <textarea name="summary" rows={3} className="mt-1 w-full rounded border border-border/60 bg-background px-3 py-2 font-mono text-sm" placeholder="What is this tool for? Why file it in the reliquary?" />
      </div>
      <div>
        <label className="font-mono text-[10px] uppercase text-muted-foreground">Tags</label>
        <input name="tags" className="mt-1 w-full rounded border border-border/60 bg-background px-3 py-2 font-mono text-sm" placeholder="privacy, self-hosting, hardware" />
      </div>
      {error && <p className="font-mono text-xs text-destructive">{error}</p>}
      <CommandButton type="submit" disabled={isPending}>
        {isPending ? "Filing..." : "Submit Repo Signal"}
      </CommandButton>
    </form>
  );
}
