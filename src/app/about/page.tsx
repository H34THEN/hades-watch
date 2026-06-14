import { LoreBlock } from "@/components/terminal/LoreBlock";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-2 font-mono text-3xl tracking-widest uppercase">
        About
      </h1>
      <p className="mb-8 text-muted-foreground">
        Hades Watch is a cyberpunk/gothic/ops-themed community platform built
        for invite-based onboarding and role-aware operations.
      </p>

      <div className="space-y-6">
        <TerminalPanel title="mission.directive">
          <p className="text-sm leading-relaxed text-foreground/80">
            Provide a secure, atmospheric home for operators, moderators, and
            members — with theme-driven identity, audit-ready admin tooling, and
            a lore archive that grows with the community.
          </p>
        </TerminalPanel>

        <LoreBlock title="Origin Signal" epoch="Pre-Launch">
          Before the surface web learned to forget, a subnet persisted beneath
          the outage maps. Hades Watch is its public-facing airlock — heavily
          logged, lightly trusted.
        </LoreBlock>

        <LoreBlock title="Access Protocol">
          Registration requires a valid invite code. Roles determine dashboard
          visibility, moderation scope, and future admin capabilities.
        </LoreBlock>
      </div>
    </div>
  );
}
