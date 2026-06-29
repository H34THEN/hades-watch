import { PageShell } from "@/components/layout/PageShell";
import Link from "next/link";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { BadgeRecordDisplay } from "@/components/badges/BadgeRecordDisplay";
import { FIRST_CIPHER_SET_INTRO } from "@/lib/ciphers/first-cipher-set";
import { getActiveCiphersForUser } from "@/lib/ciphers/queries";
import { prisma } from "@/lib/prisma";
import { requireApprovedAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ciphers" };

export default async function CiphersPage() {
  const user = await requireApprovedAuth();
  const ciphers = await getActiveCiphersForUser(user.id);

  const badgeSlugs = ciphers
    .map((c) => c.rewardBadgeSlug)
    .filter((s): s is string => !!s);
  const badges = badgeSlugs.length
    ? await prisma.badge.findMany({
        where: { slug: { in: badgeSlugs } },
        select: {
          slug: true,
          name: true,
          assetPath: true,
          placeholderText: true,
          placeholderColor: true,
        },
      })
    : [];
  const badgeBySlug = Object.fromEntries(badges.map((b) => [b.slug, b]));

  return (
    <PageShell variant="wide" scanlines>
      <p className="font-mono text-[10px] tracking-widest text-primary/80 uppercase">
        Ciphers // Dead Index Training Channel
      </p>
      <h1 className="mb-2 font-mono text-3xl tracking-widest uppercase">Ciphers</h1>
      <p className="mb-8 font-mono text-sm text-muted-foreground">
        Decode the signal. Feed the Dead Index. Earn the mark.
      </p>

      <TerminalPanel title="cipher.pack.first_set" className="mb-8 border-primary/20">
        <p className="font-mono text-[10px] tracking-wider text-primary/80 uppercase">
          C1PH3R CR4K3R Initiation
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{FIRST_CIPHER_SET_INTRO}</p>
        <p className="mt-3 font-mono text-[10px] text-muted-foreground">
          Fictional puzzle-game decoding only. No real-world hacking, credentials, or
          target research required.
        </p>
      </TerminalPanel>

      <div className="space-y-4">
        {ciphers.length === 0 ? (
          <TerminalPanel title="cipher.empty">
            <p className="text-sm text-muted-foreground">
              No active cipher relics. Run the first cipher set seed on the server.
            </p>
          </TerminalPanel>
        ) : (
          ciphers.map((c) => {
            const badge = c.rewardBadgeSlug ? badgeBySlug[c.rewardBadgeSlug] : null;
            return (
              <Link key={c.id} href={`/ciphers/${c.slug}`}>
                <TerminalPanel title={`cipher.${c.slug}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-mono text-sm font-semibold uppercase text-primary">
                        {c.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {c.playerBrief ?? c.prompt}
                      </p>
                    </div>
                    <span
                      className={`font-mono text-[10px] uppercase ${
                        c.solved ? "text-emerald-500/90" : "text-amber-400/90"
                      }`}
                    >
                      {c.solved ? "Solved" : "Unsolved"}
                    </span>
                  </div>
                  <div className="mt-3 grid gap-1 font-mono text-[10px] text-muted-foreground sm:grid-cols-2">
                    <p>Difficulty: {c.difficulty}</p>
                    <p>Type: {c.cipherType}</p>
                    <p>Time: {c.estimatedTime}</p>
                    <p>Faction: {c.factionSlug?.replace(/-/g, " ")}</p>
                  </div>
                  {badge && (
                    <div className="mt-4 flex items-center gap-3">
                      <BadgeRecordDisplay
                        name={badge.name}
                        label={badge.placeholderText ?? badge.slug}
                        color={badge.placeholderColor}
                        assetPath={badge.assetPath}
                        capstone={badge.slug === "c1ph3r-cr4k3r-dead-index-adept"}
                        completion={c.solved}
                      />
                      <p className="font-mono text-[10px] text-muted-foreground">
                        Reward: {badge.name}
                      </p>
                    </div>
                  )}
                </TerminalPanel>
              </Link>
            );
          })
        )}
      </div>
    </PageShell>
  );
}
