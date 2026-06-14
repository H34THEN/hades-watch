import Link from "next/link";
import { notFound } from "next/navigation";
import { CipherSolveForm } from "@/components/ciphers/CipherSolveForm";
import { RoleplayDisclaimer } from "@/components/terminal/RoleplayDisclaimer";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getCipherBySlug, getUserCipherSolve } from "@/lib/actions/phase4";
import { requireAuth } from "@/lib/auth/session";

export const metadata = { title: "Cipher" };

export default async function CipherDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await requireAuth();
  const { slug } = await params;
  const cipher = await getCipherBySlug(slug);
  if (!cipher || cipher.status !== "Active") notFound();

  const solve = await getUserCipherSolve(user.id, cipher.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/ciphers" className="font-mono text-xs text-muted-foreground hover:text-primary">
        ← Ciphers
      </Link>
      <RoleplayDisclaimer className="mt-4" />
      <TerminalPanel title={`cipher.${cipher.slug}`} className="mt-4">
        <h1 className="font-mono text-xl uppercase text-primary">{cipher.title}</h1>
        <p className="mt-2 font-mono text-[10px] text-muted-foreground">{cipher.difficulty}</p>
        <p className="mt-4 text-sm leading-relaxed">{cipher.prompt}</p>
        {cipher.hint && (
          <p className="mt-4 font-mono text-xs text-muted-foreground">Hint: {cipher.hint}</p>
        )}
        <CipherSolveForm slug={slug} alreadySolved={!!solve} />
      </TerminalPanel>
    </div>
  );
}
