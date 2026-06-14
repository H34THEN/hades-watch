import { TransmissionCard } from "@/components/transmissions/TransmissionCard";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { getPublishedTransmissions } from "@/lib/actions/announcements";
import { requireAuth } from "@/lib/auth/session";

export const metadata = { title: "Transmissions" };

export default async function TransmissionsPage() {
  const user = await requireAuth();
  const transmissions = await getPublishedTransmissions(user.roles);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-2 font-mono text-3xl tracking-widest uppercase">
        Transmissions
      </h1>
      <p className="mb-8 text-muted-foreground">
        Network broadcasts targeted to your clearance level.
      </p>

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
  );
}
