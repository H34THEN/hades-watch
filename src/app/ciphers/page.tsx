import Link from "next/link";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { RoleplayDisclaimer } from "@/components/terminal/RoleplayDisclaimer";
import { getCiphers } from "@/lib/actions/phase4";
import { requireAuth } from "@/lib/auth/session";

export const metadata = { title: "Ciphers" };

export default async function CiphersPage() {
  await requireAuth();
  const ciphers = await getCiphers();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-4 font-mono text-3xl tracking-widest uppercase">Ciphers</h1>
      <RoleplayDisclaimer className="mb-8" />
      <div className="space-y-4">
        {ciphers.length === 0 ? (
          <TerminalPanel title="cipher.empty">
            <p className="text-sm text-muted-foreground">No active cipher puzzles.</p>
          </TerminalPanel>
        ) : (
          ciphers.map((c) => (
            <Link key={c.id} href={`/ciphers/${c.slug}`}>
              <TerminalPanel title={`cipher.${c.difficulty.toLowerCase()}`}>
                <h3 className="font-mono text-sm font-semibold uppercase text-primary">{c.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-foreground/80">{c.prompt}</p>
              </TerminalPanel>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
