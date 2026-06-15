"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { submitMissionProofAction } from "@/lib/actions/missions";
import type { MissionSubmissionField } from "@/lib/missions/types";

interface MissionSubmissionFormProps {
  questSlug: string;
  fields: MissionSubmissionField[];
  disabled?: boolean;
}

export function MissionSubmissionForm({
  questSlug,
  fields,
  disabled = false,
}: MissionSubmissionFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await submitMissionProofAction(questSlug, formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  if (disabled) {
    return (
      <p className="font-mono text-xs text-muted-foreground">
        Mission record filed or under review. Await Underwatch verification.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t border-border/40 pt-6">
      <h3 className="font-mono text-xs tracking-widest text-primary uppercase">
        File Proof Packet
      </h3>
      <p className="font-mono text-[10px] text-muted-foreground">
        Submit summaries only. Never include passwords, recovery codes, private keys, phone
        numbers, home addresses, or other people&apos;s private data.
      </p>
      {fields.map((field) => (
        <div key={field.id} className="space-y-1">
          {field.type === "checkbox" ? (
            <label className="flex items-start gap-2 font-mono text-xs text-foreground/80">
              <input
                type="checkbox"
                name={field.id}
                required={field.required}
                className="mt-0.5"
              />
              <span>{field.label}</span>
            </label>
          ) : (
            <>
              <label htmlFor={field.id} className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                {field.label}
                {field.required ? " *" : ""}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  id={field.id}
                  name={field.id}
                  required={field.required}
                  rows={4}
                  placeholder={field.placeholder}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 font-mono text-xs"
                />
              ) : (
                <input
                  id={field.id}
                  name={field.id}
                  required={field.required}
                  placeholder={field.placeholder}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 font-mono text-xs"
                />
              )}
              {field.helpText && (
                <p className="font-mono text-[10px] text-muted-foreground/80">{field.helpText}</p>
              )}
            </>
          )}
        </div>
      ))}
      {error && <SystemAlert title="Submission blocked" message={error} variant="error" />}
      <CommandButton type="submit" size="sm" disabled={isPending}>
        Submit Field Record
      </CommandButton>
    </form>
  );
}
