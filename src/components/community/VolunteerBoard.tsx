"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/community/community.module.css";
import {
  submitVolunteerResponseAction,
  type ActionResult,
} from "@/lib/actions/volunteer";
import { VOLUNTEER_LANES } from "@/lib/community/constants";
import type { VolunteerLane } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

interface VolunteerOpportunityRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  lane: VolunteerLane;
  requiredSkills?: string | null;
  difficulty?: string | null;
  estimatedTime?: string | null;
  status: string;
  _count?: { responses: number };
}

interface VolunteerBoardProps {
  opportunities: VolunteerOpportunityRow[];
  canRespond?: boolean;
}

interface VolunteerResponseFormProps {
  opportunityId: string;
  disabled?: boolean;
}

function ResponseSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <CommandButton type="submit" size="sm" disabled={pending}>
      {pending ? "Sending…" : "Signal Interest"}
    </CommandButton>
  );
}

async function submitResponseAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return submitVolunteerResponseAction(formData);
}

export function VolunteerResponseForm({
  opportunityId,
  disabled = false,
}: VolunteerResponseFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(submitResponseAction, null);

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state, router]);

  if (disabled) {
    return (
      <p className="font-mono text-xs text-muted-foreground">
        Operative approval required to respond.
      </p>
    );
  }

  const error = state && !state.success ? state.error : null;

  return (
    <form action={formAction} className="mt-4 space-y-3 border-t border-border/40 pt-4">
      <input type="hidden" name="opportunityId" value={opportunityId} />

      <div className="space-y-2">
        <Label htmlFor={`vr-message-${opportunityId}`} className="font-mono text-xs uppercase">
          Message
        </Label>
        <textarea
          id={`vr-message-${opportunityId}`}
          name="message"
          required
          rows={4}
          maxLength={5000}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 font-mono text-sm"
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`vr-skills-${opportunityId}`} className="font-mono text-xs uppercase">
            Skills (optional)
          </Label>
          <Input id={`vr-skills-${opportunityId}`} name="skills" maxLength={1000} />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor={`vr-availability-${opportunityId}`}
            className="font-mono text-xs uppercase"
          >
            Availability (optional)
          </Label>
          <Input
            id={`vr-availability-${opportunityId}`}
            name="availability"
            maxLength={500}
          />
        </div>
      </div>

      {error && <SystemAlert title="Response Blocked" message={error} variant="error" />}
      <ResponseSubmitButton />
    </form>
  );
}

export function VolunteerBoard({
  opportunities,
  canRespond = true,
}: VolunteerBoardProps) {
  if (opportunities.length === 0) {
    return (
      <TerminalPanel title="volunteer.board">
        <p className="font-mono text-sm text-muted-foreground">
          No open calls posted. The Foundry is quiet for now.
        </p>
      </TerminalPanel>
    );
  }

  return (
    <div className="space-y-4">
      {opportunities.map((opportunity) => (
        <TerminalPanel key={opportunity.id} title={`volunteer.${opportunity.slug}`}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-mono text-xs tracking-wider text-primary uppercase">
                {VOLUNTEER_LANES[opportunity.lane]}
              </p>
              <h3 className="mt-1 font-mono text-sm text-foreground">{opportunity.title}</h3>
            </div>
            <span className={cn(styles.statusChip, styles.statusAccepted)}>
              {opportunity.status.replace("_", " ")}
            </span>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">{opportunity.description}</p>

          <p className={cn(styles.metaRow, "mt-3")}>
            {opportunity.difficulty && <span>{opportunity.difficulty}</span>}
            {opportunity.estimatedTime && <span>{opportunity.estimatedTime}</span>}
            {opportunity._count && (
              <span>
                {opportunity._count.responses} response
                {opportunity._count.responses !== 1 ? "s" : ""}
              </span>
            )}
          </p>

          {opportunity.requiredSkills && (
            <p className="mt-2 font-mono text-[10px] text-muted-foreground">
              Skills: {opportunity.requiredSkills}
            </p>
          )}

          <VolunteerResponseForm
            opportunityId={opportunity.id}
            disabled={!canRespond}
          />
        </TerminalPanel>
      ))}
    </div>
  );
}
