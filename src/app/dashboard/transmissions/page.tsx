import { TransmissionCard } from "@/components/transmissions/TransmissionCard";
import { TransmissionsConsoleSidebar } from "@/components/transmissions/TransmissionsConsoleSidebar";
import { PageShell } from "@/components/layout/PageShell";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { getPublishedTransmissions } from "@/lib/actions/announcements";
import { requireAuth } from "@/lib/auth/session";

export const metadata = { title: "Transmissions" };

export default async function TransmissionsPage() {
  const user = await requireAuth();
  const transmissions = await getPublishedTransmissions(user.roles);
  const pinned = transmissions.filter((t) => t.pinned);
  const featured = pinned[0] ?? transmissions[0] ?? null;

  return (
    <PageShell variant="split" scanlines>
      <div className="min-w-0">
        <header className="mb-8">
          <h1 className="mb-2 font-mono text-3xl tracking-widest uppercase">Transmissions</h1>
          <p className="hw-readable-wide text-muted-foreground">
            Network broadcasts targeted to your clearance level.
          </p>
        </header>

        {transmissions.length === 0 ? (
          <SystemAlert
            title="No Active Transmissions"
            message="No broadcasts are currently targeted to your operative clearance."
            variant="info"
          />
        ) : (
          <div className="space-y-6">
            {transmissions.map((t) => (
              <TransmissionCard
                key={t.id}
                title={t.title}
                body={t.body}
                priority={t.priority}
                pinned={t.pinned}
                publishedAt={t.publishedAt}
                authorName={t.author?.name ?? t.author?.email}
                audienceRole={t.audienceRole}
              />
            ))}
          </div>
        )}
      </div>

      <TransmissionsConsoleSidebar
        count={transmissions.length}
        pinnedCount={pinned.length}
        featured={
          featured
            ? {
                title: featured.title,
                body: featured.body,
                priority: featured.priority,
                pinned: featured.pinned,
              }
            : null
        }
      />
    </PageShell>
  );
}
