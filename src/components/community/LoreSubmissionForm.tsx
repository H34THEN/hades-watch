"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import {
  submitLoreSubmissionAction,
  type ActionResult,
} from "@/lib/actions/lore-submissions";
import { CANON_TIER_LABELS } from "@/lib/community/constants";
import type { CanonTier } from "@/generated/prisma/client";

interface LoreSubmissionFormProps {
  disabled?: boolean;
  lockedMessage?: string;
  guildOptions?: { id: string; name: string }[];
}

const tierOptions = Object.keys(CANON_TIER_LABELS) as CanonTier[];

async function submitAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return submitLoreSubmissionAction(formData);
}

export function LoreSubmissionForm({
  disabled = false,
  lockedMessage,
  guildOptions = [],
}: LoreSubmissionFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(submitAction, null);

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state, router]);

  if (disabled) {
    return (
      <TerminalPanel title="lore.submit">
        <p className="font-mono text-sm text-muted-foreground">
          {lockedMessage ?? "Lore submissions require operative approval."}
        </p>
      </TerminalPanel>
    );
  }

  const error = state && !state.success ? state.error : null;
  const success = state?.success === true;

  return (
    <TerminalPanel title="lore.submit">
      {success && (
        <SystemAlert
          title="Lore Filed"
          message="Your lore piece has been saved for archivist review."
          variant="success"
          className="mb-4"
        />
      )}

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ls-title" className="font-mono text-xs uppercase">
            Title
          </Label>
          <Input id="ls-title" name="title" required maxLength={200} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ls-tier" className="font-mono text-xs uppercase">
            Canon Tier Requested
          </Label>
          <select
            id="ls-tier"
            name="tierRequested"
            defaultValue="CHARACTER"
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 font-mono text-sm"
          >
            {tierOptions.map((tier) => (
              <option key={tier} value={tier}>
                {CANON_TIER_LABELS[tier]}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ls-body" className="font-mono text-xs uppercase">
            Lore Body
          </Label>
          <textarea
            id="ls-body"
            name="body"
            required
            rows={10}
            minLength={50}
            maxLength={50000}
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 font-mono text-sm"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ls-callsign" className="font-mono text-xs uppercase">
              Character Callsign (optional)
            </Label>
            <Input id="ls-callsign" name="characterCallsign" maxLength={32} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ls-faction" className="font-mono text-xs uppercase">
              Faction Slug (optional)
            </Label>
            <Input id="ls-faction" name="factionSlug" maxLength={64} />
          </div>
        </div>

        {guildOptions.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="ls-guild" className="font-mono text-xs uppercase">
              Guild (optional)
            </Label>
            <select
              id="ls-guild"
              name="guildId"
              defaultValue=""
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 font-mono text-sm"
            >
              <option value="">None</option>
              {guildOptions.map((guild) => (
                <option key={guild.id} value={guild.id}>
                  {guild.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="ls-warnings" className="font-mono text-xs uppercase">
            Content Warnings (optional)
          </Label>
          <Input id="ls-warnings" name="contentWarnings" maxLength={500} />
        </div>

        {error && <SystemAlert title="Submission Blocked" message={error} variant="error" />}

        <div className="flex flex-wrap gap-2">
          <CommandButton type="submit">Save Draft</CommandButton>
          <CommandButton type="submit" name="action" value="submit" variant="outline">
            Submit for Review
          </CommandButton>
        </div>
      </form>
    </TerminalPanel>
  );
}
