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
  requestGuildAction,
  type ActionResult,
} from "@/lib/actions/guilds";

interface GuildRequestFormProps {
  disabled?: boolean;
  lockedMessage?: string;
}

const visibilityOptions = [
  { value: "PUBLIC", label: "Public" },
  { value: "APPROVED_USERS", label: "Approved Operatives" },
  { value: "INVITE_ONLY", label: "Invite Only" },
] as const;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <CommandButton type="submit" disabled={pending}>
      {pending ? "Filing…" : "Request Guild"}
    </CommandButton>
  );
}

async function submitAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return requestGuildAction(formData);
}

export function GuildRequestForm({
  disabled = false,
  lockedMessage,
}: GuildRequestFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(submitAction, null);

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state, router]);

  if (disabled) {
    return (
      <TerminalPanel title="guilds.request">
        <p className="font-mono text-sm text-muted-foreground">
          {lockedMessage ?? "Guild requests require operative approval."}
        </p>
      </TerminalPanel>
    );
  }

  const error = state && !state.success ? state.error : null;
  const success = state?.success === true;

  return (
    <TerminalPanel title="guilds.request">
      {success && (
        <SystemAlert
          title="Guild Filed"
          message="Your guild request is pending Underwatch review."
          variant="success"
          className="mb-4"
        />
      )}

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="gr-name" className="font-mono text-xs uppercase">
            Guild Name
          </Label>
          <Input id="gr-name" name="name" required maxLength={80} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gr-desc" className="font-mono text-xs uppercase">
            Description
          </Label>
          <textarea
            id="gr-desc"
            name="description"
            required
            rows={3}
            maxLength={5000}
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gr-purpose" className="font-mono text-xs uppercase">
            Purpose
          </Label>
          <textarea
            id="gr-purpose"
            name="purpose"
            required
            rows={3}
            maxLength={5000}
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gr-conduct" className="font-mono text-xs uppercase">
            Conduct Agreement
          </Label>
          <textarea
            id="gr-conduct"
            name="conductAgreement"
            required
            rows={4}
            maxLength={5000}
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 font-mono text-sm"
            placeholder="How your guild handles care, privacy, and nonviolence."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="gr-faction" className="font-mono text-xs uppercase">
              Faction Affinity (optional)
            </Label>
            <Input id="gr-faction" name="factionAffinity" maxLength={64} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gr-glyph" className="font-mono text-xs uppercase">
              Banner Glyph (optional)
            </Label>
            <Input id="gr-glyph" name="bannerGlyph" maxLength={8} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gr-visibility" className="font-mono text-xs uppercase">
            Visibility
          </Label>
          <select
            id="gr-visibility"
            name="visibility"
            defaultValue="APPROVED_USERS"
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 font-mono text-sm"
          >
            {visibilityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gr-rules" className="font-mono text-xs uppercase">
            Rules (optional)
          </Label>
          <textarea
            id="gr-rules"
            name="rules"
            rows={3}
            maxLength={5000}
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 font-mono text-sm"
          />
        </div>

        {error && <SystemAlert title="Request Blocked" message={error} variant="error" />}
        <SubmitButton />
      </form>
    </TerminalPanel>
  );
}
