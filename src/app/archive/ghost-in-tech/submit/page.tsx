import Link from "next/link";
import { ArchiveNav } from "@/components/archive/ArchiveNav";
import { ArchiveSubmitRepoForm } from "@/components/archive/ArchiveSubmitRepoForm";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { requireApprovedAuth } from "@/lib/auth/session";

export const metadata = { title: "Submit Repo" };

export default async function GhostInTechSubmitPage() {
  await requireApprovedAuth();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <ArchiveNav active="ghost-in-tech" />
      <Link
        href="/archive/ghost-in-tech"
        className="font-mono text-xs text-muted-foreground hover:text-primary"
      >
        ← Ghost in Tech
      </Link>
      <h1 className="mt-4 mb-2 font-mono text-2xl tracking-widest uppercase">Submit a Repo</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        File a GitHub or Codeberg repository in the repo reliquary. Open source field tools, privacy
        projects, self-hosting resources, and underwatch utilities.
      </p>
      <p className="mb-8 rounded border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-sm text-muted-foreground">
        Ghost in Tech indexes tools for learning, privacy, repair, self-hosting, accessibility, and
        defensive research. Do not submit malware, credential theft, evasion guides, doxxing tools,
        or exploit instructions targeting real systems.
      </p>
      <TerminalPanel title="ghost_in_tech.repo.submit">
        <ArchiveSubmitRepoForm />
      </TerminalPanel>
    </div>
  );
}
