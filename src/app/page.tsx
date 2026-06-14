import Link from "next/link";
import { RoleBadge } from "@/components/badges/RoleBadge";
import { StatusBadge } from "@/components/badges/StatusBadge";
import { CommandButton } from "@/components/terminal/CommandButton";
import { GlitchText } from "@/components/terminal/GlitchText";
import { LoreBlock } from "@/components/terminal/LoreBlock";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <section className="mb-16 text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <StatusBadge status="online" />
          <RoleBadge role="Guest" />
        </div>
        <GlitchText
          as="h1"
          className="mb-4 text-4xl font-bold tracking-widest uppercase md:text-6xl"
        >
          Hades Watch
        </GlitchText>
        <p className="mx-auto max-w-2xl font-mono text-sm leading-relaxed text-muted-foreground md:text-base">
          A forbidden terminal on a hidden network. Field command system,
          gothic archive, and cyberpunk community platform — invite-only
          access.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/invite">
            <CommandButton>Enter Invite Code</CommandButton>
          </Link>
          <Link href="/login">
            <CommandButton prefix="$" variant="outline">
              Login
            </CommandButton>
          </Link>
        </div>
      </section>

      <section className="mb-16 grid gap-6 md:grid-cols-2">
        <TerminalPanel title="system.status" status="online">
          <pre className="text-xs leading-relaxed text-primary/80">
            {`> NODE: hades-watch-primary
> UPTIME: ████████░░ 82%
> CHANNELS: 8 themes active
> ACCESS: invite-only
> THREAT LEVEL: elevated`}
          </pre>
        </TerminalPanel>
        <TerminalPanel title="network.brief" status="warning">
          <LoreBlock title="Archive Fragment" epoch="Cycle 0">
            The watchers do not sleep. They log. Every unauthorized ping
            echoes through the underworld ops layer before dissolving into
            null signal.
          </LoreBlock>
        </TerminalPanel>
      </section>

      <SystemAlert
        title="Foundation Online"
        message="This is scaffolding. Auth, invites, and admin tools are planned for Phase 2."
        variant="info"
      />
    </div>
  );
}
