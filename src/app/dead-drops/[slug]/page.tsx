import { notFound } from "next/navigation";
import Link from "next/link";
import { RoleplayDisclaimer } from "@/components/terminal/RoleplayDisclaimer";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getDeadDropBySlug, viewDeadDropAction } from "@/lib/actions/phase4";
import { requireAuth } from "@/lib/auth/session";

export const metadata = { title: "Dead Drop" };

export default async function DeadDropDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await requireAuth();
  const { slug } = await params;
  const result = await getDeadDropBySlug(slug, user.roles);
  if (!result?.readable) notFound();

  await viewDeadDropAction(slug);

  const { drop } = result;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/dead-drops" className="font-mono text-xs text-muted-foreground hover:text-primary">
        ← Dead Drops
      </Link>
      <RoleplayDisclaimer className="mt-4" />
      <TerminalPanel title={`drop.${drop.slug}`} className="mt-4">
        <h1 className="font-mono text-xl tracking-widest uppercase text-primary">{drop.title}</h1>
        <p className="mt-1 font-mono text-xs text-muted-foreground">{drop.codename} · {drop.locationHint}</p>
        {drop.expiresAt && (
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            Expires {drop.expiresAt.toLocaleString()}
          </p>
        )}
        <div className="mt-6 whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground/80">
          {drop.message}
        </div>
      </TerminalPanel>
    </div>
  );
}
