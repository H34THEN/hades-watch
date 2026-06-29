import Link from "next/link";
import { EventCard } from "@/components/events/EventCard";
import { PageShell } from "@/components/layout/PageShell";
import { CommandButton } from "@/components/terminal/CommandButton";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { getUpcomingEvents } from "@/lib/actions/events";
import { requireAuth } from "@/lib/auth/session";

export const metadata = { title: "Dashboard Events" };

export default async function DashboardEventsPage() {
  const user = await requireAuth();
  const events = await getUpcomingEvents(user.roles, 10);

  return (
    <PageShell variant="dashboard" scanlines>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-3xl tracking-widest uppercase">
            Upcoming Events
          </h1>
          <p className="text-muted-foreground">
            Scheduled operations visible to your clearance.
          </p>
        </div>
        <Link href="/events">
          <CommandButton size="sm">Full Calendar</CommandButton>
        </Link>
      </div>

      {events.length === 0 ? (
        <SystemAlert
          title="No Upcoming Events"
          message="No published events are scheduled for your clearance level."
          variant="info"
        />
      ) : (
        <div className="hw-dashboard-grid">
          {events.map((ev) => (
            <EventCard
              key={ev.id}
              title={ev.title}
              description={ev.description}
              eventType={ev.eventType}
              startsAt={ev.startsAt}
              endsAt={ev.endsAt}
              location={ev.location}
              virtualUrl={ev.virtualUrl}
              jitsiRoomName={ev.jitsiRoomName}
              audienceRole={ev.audienceRole}
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}
