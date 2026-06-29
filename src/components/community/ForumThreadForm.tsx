"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import {
  createThreadAction,
  type ActionResult,
} from "@/lib/actions/forums";

interface ForumThreadFormProps {
  categoryId: string;
  disabled?: boolean;
  lockedMessage?: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <CommandButton type="submit" disabled={pending} size="sm">
      {pending ? "Opening…" : "Open Thread"}
    </CommandButton>
  );
}

async function submitAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return createThreadAction(formData);
}

export function ForumThreadForm({
  categoryId,
  disabled = false,
  lockedMessage,
}: ForumThreadFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(submitAction, null);

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state, router]);

  if (disabled) {
    return (
      <TerminalPanel title="forums.new">
        <p className="font-mono text-sm text-muted-foreground">
          {lockedMessage ?? "Thread creation requires operative approval."}
        </p>
      </TerminalPanel>
    );
  }

  const error = state && !state.success ? state.error : null;

  return (
    <TerminalPanel title="forums.new">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="categoryId" value={categoryId} />

        <div className="space-y-2">
          <Label htmlFor="ft-title" className="font-mono text-xs uppercase">
            Thread Title
          </Label>
          <Input id="ft-title" name="title" required maxLength={200} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ft-body" className="font-mono text-xs uppercase">
            Opening Signal
          </Label>
          <textarea
            id="ft-body"
            name="body"
            required
            rows={6}
            maxLength={20000}
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 font-mono text-sm"
            placeholder="Write your thread. No secrets, no doxxing."
          />
        </div>

        {error && <SystemAlert title="Thread Blocked" message={error} variant="error" />}
        <SubmitButton />
      </form>
    </TerminalPanel>
  );
}
