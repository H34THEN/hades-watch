"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { CommandButton } from "@/components/terminal/CommandButton";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/community/community.module.css";
import {
  joinGuildAction,
  type ActionResult,
} from "@/lib/actions/guilds";
import { cn } from "@/lib/utils";

type GuildMember = {
  id: string;
  role: string;
  status: string;
  user: {
    character?: { callsign: string | null } | null;
    name: string | null;
    email: string;
  };
};

type GuildFounder = {
  character?: { callsign: string | null } | null;
  name: string | null;
  email: string;
};

interface GuildDetailViewProps {
  guild: {
    id: string;
    slug: string;
    name: string;
    description: string;
    purpose: string;
    conductAgreement: string;
    factionAffinity?: string | null;
    bannerGlyph?: string | null;
    rules?: string | null;
    visibility: string;
    founder: GuildFounder | null;
    isStarterGuild?: boolean;
    publicMotto?: string | null;
    guildType?: string | null;
    joinPolicy?: string | null;
    foundingHook?: string | null;
    suggestedActivities?: string | null;
    starterRoles?: unknown;
    memberships: GuildMember[];
    _count?: { lorePieces: number };
  };
  currentUserId?: string | null;
  membershipStatus?: string | null;
  canJoin?: boolean;
}

function memberCallsign(member: GuildMember["user"]): string {
  return (
    member.character?.callsign ??
    member.name ??
    member.email.split("@")[0] ??
    "operative"
  );
}

function JoinSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <CommandButton type="submit" size="sm" disabled={pending}>
      {pending ? "Requesting…" : "Request to Join"}
    </CommandButton>
  );
}

async function joinAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return joinGuildAction(formData);
}

function GuildJoinForm({
  guildId,
  disabled,
}: {
  guildId: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(joinAction, null);

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state, router]);

  if (disabled) return null;

  const error = state && !state.success ? state.error : null;

  return (
    <form action={formAction} className="mt-4 space-y-3 border-t border-border/40 pt-4">
      <input type="hidden" name="guildId" value={guildId} />
      <label className="block font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
        Join message (optional)
      </label>
      <textarea
        name="message"
        rows={3}
        maxLength={2000}
        className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 font-mono text-sm"
      />
      {error && <SystemAlert title="Join Blocked" message={error} variant="error" />}
      <JoinSubmitButton />
    </form>
  );
}

export function GuildDetailView({
  guild,
  currentUserId,
  membershipStatus,
  canJoin = true,
}: GuildDetailViewProps) {
  const approvedMembers = guild.memberships.filter(
    (membership) => membership.status === "APPROVED",
  );
  const isMember = membershipStatus === "APPROVED";
  const isPending = membershipStatus === "PENDING";

  return (
    <div className="space-y-6">
      <TerminalPanel title={`guild.${guild.slug}`}>
        <div className="flex flex-wrap items-start gap-3">
          {guild.bannerGlyph && (
            <span className="font-mono text-3xl text-primary" aria-hidden>
              {guild.bannerGlyph}
            </span>
          )}
          <div>
            <h1 className="font-mono text-lg tracking-wide text-primary uppercase">
              {guild.name}
            </h1>
            <p className={cn(styles.metaRow, "mt-2")}>
              {guild.isStarterGuild && <span>Starter guild</span>}
              {guild.guildType && <span>{guild.guildType}</span>}
              {guild.factionAffinity && <span>{guild.factionAffinity}</span>}
              <span>{guild.visibility.replace("_", " ")}</span>
              {guild._count && <span>{guild._count.lorePieces} lore pieces</span>}
            </p>
            {guild.publicMotto && (
              <p className="mt-2 font-mono text-xs text-primary/90">{guild.publicMotto}</p>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-4 text-sm text-muted-foreground">
          <div>
            <h2 className="font-mono text-xs tracking-wider text-primary uppercase">
              Description
            </h2>
            <p className="mt-1 whitespace-pre-wrap">{guild.description}</p>
          </div>
          <div>
            <h2 className="font-mono text-xs tracking-wider text-primary uppercase">
              Purpose
            </h2>
            <p className="mt-1 whitespace-pre-wrap">{guild.purpose}</p>
          </div>
          <div>
            <h2 className="font-mono text-xs tracking-wider text-primary uppercase">
              Conduct Agreement
            </h2>
            <p className="mt-1 whitespace-pre-wrap">{guild.conductAgreement}</p>
          </div>
          {guild.rules && (
            <div>
              <h2 className="font-mono text-xs tracking-wider text-primary uppercase">
                Rules
              </h2>
              <p className="mt-1 whitespace-pre-wrap">{guild.rules}</p>
            </div>
          )}
        </div>

        {currentUserId && !isMember && !isPending && (
          <GuildJoinForm guildId={guild.id} disabled={!canJoin} />
        )}

        {isPending && (
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            Your join request is pending steward review.
          </p>
        )}

        {isMember && (
          <p className="mt-4 font-mono text-xs text-primary">
            You are a member of this guild.
          </p>
        )}
      </TerminalPanel>

      <TerminalPanel title="guild.roster">
        {approvedMembers.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground">No approved members yet.</p>
        ) : (
          <ul className="space-y-2">
            {approvedMembers.map((membership) => (
              <li
                key={membership.id}
                className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs"
              >
                <span className="text-foreground">{memberCallsign(membership.user)}</span>
                <span className="text-muted-foreground">{membership.role}</span>
              </li>
            ))}
          </ul>
        )}
      </TerminalPanel>
    </div>
  );
}
