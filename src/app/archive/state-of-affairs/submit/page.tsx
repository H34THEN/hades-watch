import Link from "next/link";
import { ArchiveNav } from "@/components/archive/ArchiveNav";
import { ArchiveSubmitArticleForm } from "@/components/archive/ArchiveSubmitArticleForm";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { requireApprovedAuth } from "@/lib/auth/session";

export const metadata = { title: "Archive Signal" };

export default async function StateOfAffairsSubmitPage() {
  await requireApprovedAuth();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <ArchiveNav active="state-of-affairs" />
      <Link
        href="/archive/state-of-affairs"
        className="font-mono text-xs text-muted-foreground hover:text-primary"
      >
        ← State of Affairs
      </Link>
      <h1 className="mt-4 mb-2 font-mono text-2xl tracking-widest uppercase">Archive Signal</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        File a public-interest dispatch from the surface. Privacy, civil liberties, surveillance, and
        digital rights signals welcome.
      </p>
      <TerminalPanel title="surface.signal.submit">
        <ArchiveSubmitArticleForm />
      </TerminalPanel>
    </div>
  );
}
