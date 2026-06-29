"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import {
  markDeadDropRememberedAction,
  submitMmoDeadDropAction,
} from "@/lib/actions/text-mmo";
import styles from "@/components/mmo/text-mmo.module.css";

interface MmoDeadDropFormProps {
  dropSlug: string;
  submissionType: string;
  options?: Array<{ id: string; label: string }>;
  isApproved: boolean;
  completed: boolean;
  pending: boolean;
}

export function MmoDeadDropForm({
  dropSlug,
  submissionType,
  options,
  isApproved,
  completed,
  pending,
}: MmoDeadDropFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (completed) {
    return (
      <SystemAlert title="Drop sealed" message="You have already completed this Dead Drop." variant="success" />
    );
  }

  if (pending) {
    return (
      <SystemAlert
        title="Review pending"
        message="Your submission is sealed in black wax and awaiting steward review."
        variant="warning"
      />
    );
  }

  if (!isApproved) {
    return (
      <SystemAlert
        title="Approval required"
        message="Dead Drop submissions open after operative approval."
        variant="warning"
      />
    );
  }

  function submit(formData: FormData) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await submitMmoDeadDropAction(dropSlug, formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setSuccess(result.message ?? "Drop completed.");
      router.refresh();
    });
  }

  function markRemembered() {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await markDeadDropRememberedAction(dropSlug);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setSuccess(result.message ?? "Fragment remembered.");
      router.refresh();
    });
  }

  if (submissionType === "no_submission_read_only") {
    return (
      <div>
        <CommandButton disabled={isPending} onClick={markRemembered}>
          Mark Remembered
        </CommandButton>
        {error && <SystemAlert title="Error" message={error} variant="error" />}
        {success && <SystemAlert title="Remembered" message={success} variant="success" />}
      </div>
    );
  }

  return (
    <form
      className="mt-4"
      onSubmit={(e) => {
        e.preventDefault();
        submit(new FormData(e.currentTarget));
      }}
    >
      {submissionType === "short_text" && (
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="body">
            Field response (max 280)
          </label>
          <textarea id="body" name="body" className={styles.textarea} maxLength={280} required />
        </div>
      )}

      {submissionType === "long_text" && (
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="body">
            Field response (max 2000)
          </label>
          <textarea id="body" name="body" className={styles.textarea} maxLength={2000} required />
        </div>
      )}

      {submissionType === "url_plus_summary" && (
        <>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="url">
              Resource URL (http/https only)
            </label>
            <input id="url" name="url" type="url" className={styles.input} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="summary">
              Summary
            </label>
            <textarea id="summary" name="summary" className={styles.textarea} maxLength={280} required />
          </div>
        </>
      )}

      {submissionType === "multiple_choice" && options && (
        <fieldset className={styles.formGroup}>
          <legend className={styles.formLabel}>Choose one</legend>
          {options.map((opt) => (
            <label key={opt.id} className="flex items-center gap-2 py-1 text-sm">
              <input type="radio" name="selectedOption" value={opt.id} required />
              {opt.label}
            </label>
          ))}
        </fieldset>
      )}

      {submissionType === "cipher_answer" && (
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="answer">
            Cipher answer
          </label>
          <input id="answer" name="answer" type="text" className={styles.input} required autoComplete="off" />
        </div>
      )}

      <CommandButton type="submit" disabled={isPending}>
        Submit Response
      </CommandButton>

      {error && <SystemAlert title="Submission blocked" message={error} variant="error" />}
      {success && <SystemAlert title="Drop sealed" message={success} variant="success" />}
    </form>
  );
}
