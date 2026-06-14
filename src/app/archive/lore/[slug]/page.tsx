import { notFound } from "next/navigation";
import Link from "next/link";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getLoreBySlug } from "@/lib/actions/lore";
import { requireAuth } from "@/lib/auth/session";

export const metadata = { title: "Lore Entry" };

export default async function LoreDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await requireAuth();
  const { slug } = await params;
  const result = await getLoreBySlug(slug, user.id, user.roles);
  if (!result?.canRead) notFound();

  const { entry } = result;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/archive/lore" className="font-mono text-xs text-muted-foreground hover:text-primary">
        ← Archive
      </Link>
      <TerminalPanel title={`lore.${entry.slug}`} className="mt-4">
        <h1 className="font-mono text-xl tracking-widest uppercase text-primary">{entry.title}</h1>
        <div className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
          {entry.body}
        </div>
      </TerminalPanel>
    </div>
  );
}
