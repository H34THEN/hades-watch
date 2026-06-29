import Link from "next/link";
import { MmoHubHeader } from "@/components/mmo/MmoHubHeader";
import { MmoHubOperativePanel } from "@/components/mmo/MmoHubOperativePanel";
import {
  MmoHubSafetyNotice,
  MmoHubSupportFooter,
} from "@/components/mmo/MmoHubSafetyNotice";
import { MmoHubSection } from "@/components/mmo/MmoHubSection";
import { MmoHubShell } from "@/components/mmo/MmoHubShell";
import { MmoHubStatusStrip } from "@/components/mmo/MmoHubStatusStrip";
import { MmoNav } from "@/components/mmo/MmoNav";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { CommandButton } from "@/components/terminal/CommandButton";
import { resolveHubModules } from "@/lib/mmo/hub-access";
import { getHubModulesForSection, HUB_SECTIONS } from "@/lib/mmo/hub-modules";
import { getMmoHubContext } from "@/lib/mmo/hub-queries";
import { getUserActiveMissions } from "@/lib/actions/mmo";
import { requireAuth } from "@/lib/auth/session";

export const metadata = {
  title: "Field Ops // Underwatch Command Hub",
  description:
    "Your operative identity, faction work, community signals, and archive traces converge here.",
};

export default async function MmoPage() {
  const user = await requireAuth();
  const [context, activeMissions] = await Promise.all([
    getMmoHubContext(user),
    getUserActiveMissions(user.id),
  ]);

  const sectionModules = HUB_SECTIONS.map((section) => ({
    ...section,
    modules: resolveHubModules(getHubModulesForSection(section.id), user),
  }));

  const forgeSection = sectionModules.find((s) => s.id === "forge");
  if (forgeSection) {
    forgeSection.modules = forgeSection.modules.filter(
      (m) => m.slug !== "avatar-builder",
    );
  }

  return (
    <MmoHubShell>
      <MmoNav active="/mmo" />
      <MmoHubHeader />
      <MmoHubStatusStrip context={context} />
      <MmoHubOperativePanel context={context} />

      {activeMissions.length > 0 && (
        <TerminalPanel title="mission.active" className="mb-8">
          <p className="mb-3 font-mono text-xs text-muted-foreground">
            Open field orders in your operative log.
          </p>
          {activeMissions.map((p) => (
            <Link
              key={p.id}
              href={`/mmo/missions/${p.quest.slug}`}
              className="block border-b border-border/30 py-2 font-mono text-sm text-primary last:border-0 hover:underline"
            >
              {p.quest.title} · {p.status}
            </Link>
          ))}
          <Link href="/mmo/missions" className="mt-4 inline-block">
            <CommandButton size="sm" variant="outline">
              Mission Board
            </CommandButton>
          </Link>
        </TerminalPanel>
      )}

      {!context.isApproved && (
        <TerminalPanel title="clearance.pending" className="mb-8" status="warning">
          <p className="font-mono text-sm text-muted-foreground">
            This relay opens after operative approval. Some modules remain locked until
            Archivist review clears your signal.
          </p>
          <Link href="/pending-approval" className="mt-4 inline-block">
            <CommandButton size="sm" variant="outline">
              Check Clearance Status
            </CommandButton>
          </Link>
        </TerminalPanel>
      )}

      {sectionModules.map((section) => (
        <MmoHubSection
          key={section.id}
          title={section.title}
          subtitle={section.subtitle}
          modules={section.modules}
          context={context}
          wide
        />
      ))}

      <MmoHubSafetyNotice />
      <MmoHubSupportFooter />
    </MmoHubShell>
  );
}
