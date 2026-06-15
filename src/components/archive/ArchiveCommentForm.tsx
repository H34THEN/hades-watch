"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { postArchiveCommentAction } from "@/lib/actions/archive-items";

export function ArchiveCommentForm({ archiveItemId }: { archiveItemId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          const result = await postArchiveCommentAction(archiveItemId, body);
          if (!result.success) {
            setError(result.error);
            return;
          }
          setBody("");
          router.refresh();
        });
      }}
    >
      <label className="block font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
        Discuss in the Underwatch
      </label>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        required
        className="w-full rounded border border-border/60 bg-background px-3 py-2 font-mono text-sm"
        placeholder="Open discussion. Surface signal analysis, field notes, threat context..."
      />
      {error && <p className="font-mono text-xs text-destructive">{error}</p>}
      <CommandButton type="submit" size="sm" disabled={isPending}>
        {isPending ? "Transmitting..." : "Post Comment"}
      </CommandButton>
    </form>
  );
}
