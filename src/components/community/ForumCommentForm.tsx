"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { CommandButton } from "@/components/terminal/CommandButton";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { ForumQuoteBlock } from "@/components/forums/ForumQuoteBlock";
import { createCommentAction, type ActionResult } from "@/lib/actions/forums";

interface ForumCommentFormProps {
  threadId: string;
  parentCommentId?: string;
  quote?: {
    commentId: string;
    excerpt: string;
    authorCallsign: string;
  } | null;
  onClearQuote?: () => void;
}

function SubmitButton({ hasQuote }: { hasQuote: boolean }) {
  const { pending } = useFormStatus();
  return (
    <CommandButton type="submit" size="sm" disabled={pending}>
      {pending ? "Transmitting…" : hasQuote ? "Post Echo Reply" : "Post Reply"}
    </CommandButton>
  );
}

async function submitAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return createCommentAction(formData);
}

export function ForumCommentForm({
  threadId,
  parentCommentId,
  quote,
  onClearQuote,
}: ForumCommentFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(submitAction, null);

  useEffect(() => {
    if (state?.success) {
      onClearQuote?.();
      router.refresh();
    }
  }, [state, router, onClearQuote]);

  const error = state && !state.success ? state.error : null;

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="threadId" value={threadId} />
      {parentCommentId && (
        <input type="hidden" name="parentCommentId" value={parentCommentId} />
      )}
      {quote && (
        <>
          <input type="hidden" name="quotedCommentId" value={quote.commentId} />
          <ForumQuoteBlock
            quotedAuthor={{
              id: "",
              name: quote.authorCallsign,
              email: "",
              forumProfile: { displayName: quote.authorCallsign },
            }}
            quoteExcerpt={quote.excerpt}
            quotedCommentId={quote.commentId}
          />
          <button
            type="button"
            onClick={onClearQuote}
            className="font-mono text-[10px] uppercase text-muted-foreground hover:text-primary"
          >
            Clear quote
          </button>
        </>
      )}

      <label className="block font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
        {quote ? "Reply with echo" : "Reply to thread"}
      </label>
      <textarea
        name="body"
        required
        rows={4}
        maxLength={10000}
        className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 font-mono text-sm"
        placeholder="Add a signal. Use @callsign to mention. No secrets or private data."
      />

      {error && <SystemAlert title="Reply Blocked" message={error} variant="error" />}
      <SubmitButton hasQuote={!!quote} />
    </form>
  );
}
