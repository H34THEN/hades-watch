"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { isRedirectError } from "next/dist/client/components/redirect-error";
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
  const [isPending, startTransition] = useTransition();
  const [useBuilder, setUseBuilder] = useState(false);
  const submittingRef = useRef(false);

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
          <Link href="/login?callbackUrl=/net-neighbors/submit" className="mt-4 inline-block">
            <CommandButton size="sm">Sign In</CommandButton>
          </Link>
        )}
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current || isPending) return;

    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    submittingRef.current = true;

    startTransition(async () => {
      try {
        const result = await submitNetNeighborAction(formData);
        if (result && !result.success) {
          setError(result.error);
        }
      } catch (err) {
        if (isRedirectError(err)) {
          throw err;
        }
        setError("Submission failed. Please try again.");
      } finally {
        submittingRef.current = false;
      }
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
        <CommandButton type="submit" disabled={isPending}>
          {isPending ? "Submitting…" : "Submit Signal"}
        </CommandButton>
      </form>
    </div>
  );
}
