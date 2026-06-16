"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { BadgeRecordDisplay } from "@/components/badges/BadgeRecordDisplay";
import { submitCipherAnswerAction } from "@/lib/actions/ciphers";

interface CipherSolveFormProps {
  slug: string;
  submissionPrompt: string | null;
  failureMessage: string | null;
  successMessage: string | null;
  alreadySolved: boolean;
  badge?: {
    name: string;
    slug: string;
    tier: string | null;
    assetPath: string | null;
    placeholderText: string | null;
    placeholderColor: string | null;
  } | null;
}

export function CipherSolveForm({
  slug,
  submissionPrompt,
  failureMessage,
  successMessage,
  alreadySolved,
  badge,
}: CipherSolveFormProps) {
  const router = useRouter();
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [solved, setSolved] = useState(alreadySolved);
  const [isPending, startTransition] = useTransition();

  if (solved) {
    return (
      <div className="space-y-4">
        <SystemAlert
          title="Signal Crack Confirmed"
          message={successMessage ?? "Cipher cleared. Badge record updated."}
          variant="success"
        />
        {badge && (
          <div className="flex items-center gap-4">
            <BadgeRecordDisplay
              name={badge.name}
              label={badge.placeholderText ?? badge.slug}
              color={badge.placeholderColor}
              assetPath={badge.assetPath}
              capstone={badge.slug === "c1ph3r-cr4k3r-dead-index-adept"}
              completion
              status="Verified"
            />
            <p className="font-mono text-[10px] text-muted-foreground">
              Badge unlocked: {badge.name}
              {badge.tier ? ` · ${badge.tier}` : ""}
            </p>
          </div>
        )}
        <Link href="/ciphers">
          <CommandButton size="sm">Return to Ciphers</CommandButton>
        </Link>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await submitCipherAnswerAction(slug, answer);
      if (!result.success) {
        setError(result.error ?? failureMessage ?? "Incorrect answer.");
        return;
      }
      if (result.solved) {
        setSolved(true);
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3 border-t border-border/40 pt-6">
      <Label htmlFor="cipher-answer" className="font-mono text-xs uppercase">
        {submissionPrompt ?? "Submit answer key"}
      </Label>
      <Input
        id="cipher-answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Enter answer"
        className="font-mono"
        required
        disabled={isPending}
      />
      {error && <SystemAlert title="Signal Rejected" message={error} variant="error" />}
      <CommandButton type="submit" disabled={isPending}>
        {isPending ? "Checking…" : "Submit Answer"}
      </CommandButton>
    </form>
  );
}
