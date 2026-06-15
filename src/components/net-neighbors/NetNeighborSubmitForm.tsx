"use client";

import { useState, useTransition } from "react";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { submitNetNeighborAction } from "@/lib/actions/net-neighbors";

export function NetNeighborSubmitForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await submitNetNeighborAction(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setSuccess("Submission received. Pending moderator review.");
      e.currentTarget.reset();
    });
  }

  return (
    <TerminalPanel title="net_neighbors.submit" className="mt-8">
      <p className="mb-4 text-sm text-muted-foreground">
        Submit a favorite site with an 88×31-style banner. Links open in a new tab and leave Hades Watch.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nn-title" className="font-mono text-xs uppercase">Site Title</Label>
          <Input id="nn-title" name="title" required maxLength={80} disabled={isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nn-url" className="font-mono text-xs uppercase">URL</Label>
          <Input id="nn-url" name="url" type="url" required placeholder="https://" disabled={isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nn-desc" className="font-mono text-xs uppercase">Short Description</Label>
          <Input id="nn-desc" name="description" maxLength={500} disabled={isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nn-tags" className="font-mono text-xs uppercase">Tags (comma-separated)</Label>
          <Input id="nn-tags" name="tags" placeholder="webcomic, tools, art" disabled={isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nn-note" className="font-mono text-xs uppercase">Why this belongs here</Label>
          <Input id="nn-note" name="submitterNote" maxLength={500} disabled={isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nn-banner" className="font-mono text-xs uppercase">Banner Image (GIF/PNG/JPG, max 512KB)</Label>
          <Input id="nn-banner" name="banner" type="file" accept="image/gif,image/png,image/jpeg,image/webp" required disabled={isPending} />
        </div>
        {error && <SystemAlert title="Submit Failed" message={error} variant="error" />}
        {success && <SystemAlert title="Queued" message={success} variant="success" />}
        <CommandButton type="submit" disabled={isPending}>
          {isPending ? "Submitting…" : "Submit Net Neighbor"}
        </CommandButton>
      </form>
    </TerminalPanel>
  );
}
