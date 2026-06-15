"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { submitArticleAction } from "@/lib/actions/archive-items";

export function ArchiveSubmitArticleForm() {
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
          const result = await submitArticleAction(formData);
          if (!result.success) {
            setError(result.error);
            return;
          }
          router.push("/archive/state-of-affairs");
          router.refresh();
        });
      }}
    >
      <div>
        <label className="font-mono text-[10px] uppercase text-muted-foreground">Title *</label>
        <input name="title" required className="mt-1 w-full rounded border border-border/60 bg-background px-3 py-2 font-mono text-sm" />
      </div>
      <div>
        <label className="font-mono text-[10px] uppercase text-muted-foreground">Source URL *</label>
        <input name="sourceUrl" type="url" required className="mt-1 w-full rounded border border-border/60 bg-background px-3 py-2 font-mono text-sm" placeholder="https://..." />
      </div>
      <div>
        <label className="font-mono text-[10px] uppercase text-muted-foreground">Source Name</label>
        <input name="sourceName" className="mt-1 w-full rounded border border-border/60 bg-background px-3 py-2 font-mono text-sm" placeholder="Publisher or organization" />
      </div>
      <div>
        <label className="font-mono text-[10px] uppercase text-muted-foreground">Summary</label>
        <textarea name="summary" rows={3} className="mt-1 w-full rounded border border-border/60 bg-background px-3 py-2 font-mono text-sm" />
      </div>
      <div>
        <label className="font-mono text-[10px] uppercase text-muted-foreground">Tags</label>
        <input name="tags" className="mt-1 w-full rounded border border-border/60 bg-background px-3 py-2 font-mono text-sm" placeholder="privacy, surveillance, EFF" />
      </div>
      {error && <p className="font-mono text-xs text-destructive">{error}</p>}
      <CommandButton type="submit" disabled={isPending}>
        {isPending ? "Filing..." : "Archive Signal"}
      </CommandButton>
    </form>
  );
}
