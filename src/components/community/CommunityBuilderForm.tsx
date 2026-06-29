"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import {
  submitCommunityBuilderAction,
  type ActionResult,
} from "@/lib/actions/community-builder";
import { COMMUNITY_SUBMISSION_TYPE_LABELS } from "@/lib/community/constants";
import type { CommunitySubmissionType } from "@/generated/prisma/client";

interface CommunityBuilderFormProps {
  disabled?: boolean;
  lockedMessage?: string;
}

const submissionTypes = Object.keys(
  COMMUNITY_SUBMISSION_TYPE_LABELS,
) as CommunitySubmissionType[];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <CommandButton type="submit" disabled={pending}>
      {pending ? "Transmitting…" : "Submit Signal"}
    </CommandButton>
  );
}

async function submitAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return submitCommunityBuilderAction(formData);
}

export function CommunityBuilderForm({
  disabled = false,
  lockedMessage,
}: CommunityBuilderFormProps) {
  const [state, formAction] = useActionState(submitAction, null);

  if (disabled) {
    return (
      <TerminalPanel title="builder.locked">
        <p className="font-mono text-sm text-muted-foreground">
          {lockedMessage ?? "Community builder opens after operative approval."}
        </p>
      </TerminalPanel>
    );
  }

  const error = state && !state.success ? state.error : null;
  const success = state?.success === true;

  return (
    <TerminalPanel title="commons.builder">
      <p className="mb-4 font-mono text-xs text-muted-foreground">
        Suggest missions, lore fragments, accessibility improvements, archive resources, or
        other safe community infrastructure. No secrets or private data.
      </p>

      {success && (
        <SystemAlert
          title="Signal Queued"
          message="Your submission is pending Underwatch review."
          variant="success"
          className="mb-4"
        />
      )}

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cb-type" className="font-mono text-xs uppercase">
            Signal Type
          </Label>
          <select
            id="cb-type"
            name="type"
            required
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 font-mono text-sm"
          >
            {submissionTypes.map((type) => (
              <option key={type} value={type}>
                {COMMUNITY_SUBMISSION_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cb-title" className="font-mono text-xs uppercase">
            Title
          </Label>
          <Input id="cb-title" name="title" required maxLength={120} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cb-summary" className="font-mono text-xs uppercase">
            Summary
          </Label>
          <Input id="cb-summary" name="summary" required maxLength={500} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cb-description" className="font-mono text-xs uppercase">
            Full Description
          </Label>
          <textarea
            id="cb-description"
            name="description"
            required
            rows={6}
            maxLength={10000}
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 font-mono text-sm"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cb-faction" className="font-mono text-xs uppercase">
              Faction Slug (optional)
            </Label>
            <Input id="cb-faction" name="factionSlug" maxLength={64} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cb-system" className="font-mono text-xs uppercase">
              Related System (optional)
            </Label>
            <Input id="cb-system" name="relatedSystem" maxLength={64} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cb-url" className="font-mono text-xs uppercase">
            Related URL (optional)
          </Label>
          <Input id="cb-url" name="relatedUrl" type="url" placeholder="https://" />
        </div>

        <label className="flex items-start gap-2 font-mono text-xs text-foreground/80">
          <input type="checkbox" name="consentNoSecrets" required className="mt-0.5" />
          <span>
            I confirm this submission contains no secrets, credentials, private addresses, or
            harmful content.
          </span>
        </label>

        {error && (
          <SystemAlert title="Submission Blocked" message={error} variant="error" />
        )}
        <SubmitButton />
      </form>
    </TerminalPanel>
  );
}
