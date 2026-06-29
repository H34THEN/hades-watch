"use client";

import { useTransition } from "react";
import { completePlayablePromptAction } from "@/lib/actions/expanded-play";
import { CommandButton } from "@/components/terminal/CommandButton";
import styles from "@/components/mmo/text-mmo.module.css";
import type { PromptWithStatus } from "@/lib/queries/expanded-play";

interface PlayPromptCompleteFormProps {
  prompt: PromptWithStatus;
  showBody?: boolean;
  showUrl?: boolean;
  ctaLabel?: string;
  disabled?: boolean;
}

export function PlayPromptCompleteForm({
  prompt,
  showBody = false,
  showUrl = false,
  ctaLabel,
  disabled,
}: PlayPromptCompleteFormProps) {
  const [pending, startTransition] = useTransition();

  const readOnly = [
    "READ_SIGNAL",
    "VISIT_ARCHIVE",
    "VISIT_FACTION_FLOOR",
    "JOIN_DISCUSSION",
    "VISIT_PROFILE_WORLD",
    "READ_NET_NEIGHBOR",
    "OPEN_DEAD_DROP",
    "VISIT_SIGNAL_PLAYER",
    "REST_SIGNAL",
    "MARK_COMPLETE",
    "ATTEMPT_CIPHER",
  ].includes(prompt.actionType);

  const label =
    ctaLabel ??
    (prompt.userPending
      ? "Review Pending"
      : prompt.userCompleted
        ? "Completed"
        : readOnly || prompt.actionType === "REST_SIGNAL"
          ? "Mark Complete"
          : "Submit Relay");

  const isDisabled = disabled || pending || prompt.userCompleted || prompt.userPending;

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await completePlayablePromptAction(prompt.slug, {
        body: (formData.get("body") as string) || undefined,
        url: (formData.get("url") as string) || undefined,
        proofText: (formData.get("proofText") as string) || undefined,
      });
    });
  }

  return (
    <form action={handleSubmit} className="mt-4 space-y-3">
      {showBody && !readOnly && (
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor={`body-${prompt.slug}`}>
            Response
          </label>
          <textarea
            id={`body-${prompt.slug}`}
            name="body"
            className={styles.textarea}
            maxLength={2000}
            placeholder="Safe, fictional, non-targeting response..."
            required={!readOnly}
          />
        </div>
      )}
      {showUrl && (
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor={`url-${prompt.slug}`}>
            URL (optional)
          </label>
          <input id={`url-${prompt.slug}`} name="url" type="url" className={styles.input} />
        </div>
      )}
      <CommandButton type="submit" size="sm" disabled={isDisabled}>
        {pending ? "Relaying..." : label}
      </CommandButton>
    </form>
  );
}
