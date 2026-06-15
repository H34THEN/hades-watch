"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { NetNeighborBannerBuilder } from "@/components/net-neighbors/NetNeighborBannerBuilder";
import { submitNetNeighborAction } from "@/lib/actions/net-neighbors";
import styles from "./net-neighbors.module.css";

interface NetNeighborSubmitFormProps {
  canSubmit: boolean;
  lockedMessage?: string;
}

export function NetNeighborSubmitForm({
  canSubmit,
  lockedMessage,
}: NetNeighborSubmitFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [useBuilder, setUseBuilder] = useState(false);

  if (!canSubmit) {
    return (
      <div className={`${styles.hudFrame} p-6`}>
        <h2 className="font-mono text-sm tracking-wider uppercase text-primary">
          Submit Locked
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          {lockedMessage ?? "Net Neighbor submissions open after operative approval."}
        </p>
        {lockedMessage?.includes("Sign in") && (
          <Link href="/login" className="mt-4 inline-block">
            <CommandButton size="sm">Sign In</CommandButton>
          </Link>
        )}
      </div>
    );
  }

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
      setSuccess(
        "Signal received. Your Net Neighbor submission is pending Underwatch review.",
      );
      e.currentTarget.reset();
      setUseBuilder(false);
    });
  }

  return (
    <div className={`${styles.hudFrame} p-6`}>
      <h2 className="font-mono text-sm tracking-wider uppercase text-primary">
        Submit a Neighbor
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Submit a favorite site with an 88×31-style banner or forge one below. Links open in a
        new tab and leave Hades Watch.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nn-title" className="font-mono text-xs uppercase">
            Site Title
          </Label>
          <Input id="nn-title" name="title" required maxLength={80} disabled={isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nn-url" className="font-mono text-xs uppercase">
            URL
          </Label>
          <Input
            id="nn-url"
            name="url"
            type="url"
            required
            placeholder="https://"
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nn-desc" className="font-mono text-xs uppercase">
            Short Description
          </Label>
          <Input id="nn-desc" name="description" maxLength={500} disabled={isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nn-tags" className="font-mono text-xs uppercase">
            Tags (comma-separated)
          </Label>
          <Input
            id="nn-tags"
            name="tags"
            placeholder="webcomic, tools, art"
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nn-note" className="font-mono text-xs uppercase">
            Why this belongs here
          </Label>
          <Input id="nn-note" name="submitterNote" maxLength={500} disabled={isPending} />
        </div>

        <NetNeighborBannerBuilder enabled={useBuilder} onEnabledChange={setUseBuilder} />

        {!useBuilder && (
          <div className="space-y-2">
            <Label htmlFor="nn-banner" className="font-mono text-xs uppercase">
              Banner Image (GIF/PNG/JPG/WEBP, max 2 MB)
            </Label>
            <Input
              id="nn-banner"
              name="banner"
              type="file"
              accept="image/gif,image/png,image/jpeg,image/webp"
              disabled={isPending}
            />
          </div>
        )}

        {error && <SystemAlert title="Submit Failed" message={error} variant="error" />}
        {success && <SystemAlert title="Queued" message={success} variant="success" />}
        <CommandButton type="submit" disabled={isPending}>
          {isPending ? "Submitting…" : "Submit Net Neighbor"}
        </CommandButton>
      </form>
    </div>
  );
}
