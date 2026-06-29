"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import {
  reviewCommunitySubmissionFormAction,
  reviewGuildFormAction,
  reviewLoreSubmissionFormAction,
  reviewVolunteerResponseFormAction,
} from "@/lib/actions/community-admin";
import type { ActionResult } from "@/lib/actions/community-builder";

type SubmissionRow = {
  id: string;
  title: string;
  type: string;
  summary: string;
  author: { name: string | null; email: string };
};

type VolunteerRow = {
  id: string;
  message: string;
  user: { name: string | null; email: string };
  opportunity: { title: string };
};

type GuildRow = {
  id: string;
  name: string;
  slug: string;
  founder: { name: string | null; email: string } | null;
};

type LoreRow = {
  id: string;
  title: string;
  tierRequested: string;
  author: { name: string | null; email: string };
};

interface AdminCommunityPanelProps {
  submissions: SubmissionRow[];
  volunteerResponses: VolunteerRow[];
  guilds: GuildRow[];
  lore: LoreRow[];
}

async function reviewSubmission(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return reviewCommunitySubmissionFormAction(formData);
}

async function reviewVolunteer(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return reviewVolunteerResponseFormAction(formData);
}

async function reviewGuild(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return reviewGuildFormAction(formData);
}

async function reviewLore(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return reviewLoreSubmissionFormAction(formData);
}

function ReviewForm({
  action,
  idField,
  idValue,
  options,
}: {
  action: (_prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  idField: string;
  idValue: string;
  options: { value: string; label: string }[];
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, null);

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="mt-2 flex flex-wrap gap-2">
      <input type="hidden" name={idField} value={idValue} />
      <select
        name="status"
        className="rounded border border-input bg-transparent px-2 py-1 font-mono text-xs"
        defaultValue={options[0]?.value}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <input
        name="reviewNote"
        placeholder="Review note"
        className="min-w-[12rem] flex-1 rounded border border-input bg-transparent px-2 py-1 font-mono text-xs"
      />
      <CommandButton type="submit" size="sm">
        Review
      </CommandButton>
      {state && !state.success && (
        <span className="font-mono text-xs text-destructive">{state.error}</span>
      )}
    </form>
  );
}

export function AdminCommunityPanel({
  submissions,
  volunteerResponses,
  guilds,
  lore,
}: AdminCommunityPanelProps) {
  return (
    <div className="space-y-8">
      <TerminalPanel title="admin.community.builder">
        {submissions.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground">No pending builder signals.</p>
        ) : (
          <ul className="space-y-4">
            {submissions.map((s) => (
              <li key={s.id} className="border-b border-border/30 pb-4 font-mono text-xs">
                <p className="text-primary">{s.title}</p>
                <p className="text-muted-foreground">
                  {s.type} · {s.author.name ?? s.author.email}
                </p>
                <p className="mt-1">{s.summary}</p>
                <ReviewForm
                  action={reviewSubmission}
                  idField="submissionId"
                  idValue={s.id}
                  options={[
                    { value: "ACCEPTED", label: "Accept" },
                    { value: "NEEDS_REVISION", label: "Needs revision" },
                    { value: "REJECTED", label: "Reject" },
                    { value: "IMPLEMENTED", label: "Implemented" },
                  ]}
                />
              </li>
            ))}
          </ul>
        )}
      </TerminalPanel>

      <TerminalPanel title="admin.community.volunteer">
        {volunteerResponses.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground">No pending volunteer responses.</p>
        ) : (
          <ul className="space-y-4">
            {volunteerResponses.map((r) => (
              <li key={r.id} className="border-b border-border/30 pb-4 font-mono text-xs">
                <p className="text-primary">{r.opportunity.title}</p>
                <p className="text-muted-foreground">{r.user.name ?? r.user.email}</p>
                <p className="mt-1">{r.message.slice(0, 200)}</p>
                <ReviewForm
                  action={reviewVolunteer}
                  idField="responseId"
                  idValue={r.id}
                  options={[
                    { value: "ACCEPTED", label: "Accept" },
                    { value: "DECLINED", label: "Decline" },
                  ]}
                />
              </li>
            ))}
          </ul>
        )}
      </TerminalPanel>

      <TerminalPanel title="admin.community.guilds">
        {guilds.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground">No pending guild requests.</p>
        ) : (
          <ul className="space-y-4">
            {guilds.map((g) => (
              <li key={g.id} className="border-b border-border/30 pb-4 font-mono text-xs">
                <p className="text-primary">{g.name}</p>
                <p className="text-muted-foreground">
                  {g.slug} · {g.founder ? (g.founder.name ?? g.founder.email) : "Starter guild"}
                </p>
                <ReviewForm
                  action={reviewGuild}
                  idField="guildId"
                  idValue={g.id}
                  options={[
                    { value: "APPROVED", label: "Approve" },
                    { value: "REJECTED", label: "Reject" },
                  ]}
                />
              </li>
            ))}
          </ul>
        )}
      </TerminalPanel>

      <TerminalPanel title="admin.community.lore">
        {lore.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground">No pending lore submissions.</p>
        ) : (
          <ul className="space-y-4">
            {lore.map((l) => (
              <li key={l.id} className="border-b border-border/30 pb-4 font-mono text-xs">
                <p className="text-primary">{l.title}</p>
                <p className="text-muted-foreground">
                  {l.tierRequested} · {l.author.name ?? l.author.email}
                </p>
                <ReviewForm
                  action={reviewLore}
                  idField="submissionId"
                  idValue={l.id}
                  options={[
                    { value: "APPROVED", label: "Approve" },
                    { value: "NEEDS_REVISION", label: "Needs revision" },
                    { value: "REJECTED", label: "Reject" },
                  ]}
                />
              </li>
            ))}
          </ul>
        )}
      </TerminalPanel>
    </div>
  );
}
