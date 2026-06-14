"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { submitCipherAnswerAction } from "@/lib/actions/phase4";

interface CipherSolveFormProps {
  slug: string;
  alreadySolved: boolean;
}

export function CipherSolveForm({ slug, alreadySolved }: CipherSolveFormProps) {
  const router = useRouter();
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [solved, setSolved] = useState(alreadySolved);
  const [isPending, startTransition] = useTransition();

  if (solved) {
    return (
      <SystemAlert title="Cipher Cleared" message="You have solved this puzzle." variant="success" />
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await submitCipherAnswerAction(slug, answer);
      if (!result.success) {
        setError(result.error ?? "Incorrect");
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
      <Input
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Enter answer"
        className="font-mono"
        required
      />
      {error && <SystemAlert title="Incorrect" message={error} variant="error" />}
      <CommandButton type="submit" disabled={isPending}>Submit Answer</CommandButton>
    </form>
  );
}
