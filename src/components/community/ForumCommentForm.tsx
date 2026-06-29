"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { CommandButton } from "@/components/terminal/CommandButton";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import {
  createCommentAction,
  type ActionResult,
} from "@/lib/actions/forums";

interface ForumCommentFormProps {
  threadId: string;
  parentCommentId?: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <CommandButton type="submit" size="sm" disabled={pending}>
      {pending ? "Transmitting…" : "Post Reply"}
    </CommandButton>
  );
}

async function submitAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return createCommentAction(formData);
}

export function ForumCommentForm({ threadId, parentCommentId }: ForumCommentFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(submitAction, null);

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state, router]);

  const error = state && !state.success ? state.error : null;

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="threadId" value={threadId} />
      {parentCommentId && (
        <input type="hidden" name="parentCommentId" value={parentCommentId} />
      )}

      <label className="block font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
        Reply to thread
      </label>
      <textarea
        name="body"
        required
        rows={4}
        maxLength={10000}
        className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 font-mono text-sm"
        placeholder="Add a signal. No secrets or private data."
      />

      {error && <SystemAlert title="Reply Blocked" message={error} variant="error" />}
      <SubmitButton />
    </form>
  );
}
