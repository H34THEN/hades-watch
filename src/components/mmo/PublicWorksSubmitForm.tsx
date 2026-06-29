"use client";

import { useTransition } from "react";
import { submitPublicWorksTaskAction } from "@/lib/actions/expanded-play";
import { CommandButton } from "@/components/terminal/CommandButton";
import styles from "@/components/mmo/text-mmo.module.css";

export function PublicWorksSubmitForm({ taskSlug }: { taskSlug: string }) {
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await submitPublicWorksTaskAction(taskSlug, {
        body: formData.get("body") as string,
        url: (formData.get("url") as string) || undefined,
      });
    });
  }

  return (
    <form action={handleSubmit} className="mt-4 space-y-3">
      <div className={styles.formGroup}>
        <label className={styles.formLabel} htmlFor="pw-body">
          Completion Note
        </label>
        <textarea
          id="pw-body"
          name="body"
          className={styles.textarea}
          required
          maxLength={2000}
          placeholder="What you did, without private data or exploit details..."
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel} htmlFor="pw-url">
          Reference URL (optional)
        </label>
        <input id="pw-url" name="url" type="url" className={styles.input} />
      </div>
      <CommandButton type="submit" size="sm" disabled={pending}>
        {pending ? "Submitting..." : "Submit for Review"}
      </CommandButton>
    </form>
  );
}
