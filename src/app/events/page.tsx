import { EventCard } from "@/components/events/EventCard";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { getPublishedEvents } from "@/lib/actions/events";
import { requireAuth } from "@/lib/auth/session";

export const metadata = { title: "Events" };

export default async function EventsPage() {
  const user = await requireAuth();
  const events = await getPublishedEvents(user.roles);

  const upcoming = events.filter((e) => e.startsAt >= new Date());
  const past = events.filter((e) => e.startsAt < new Date());

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="mb-2 font-mono text-3xl tracking-widest uppercase">
        Event Calendar
      </h1>
      <p className="mb-8 text-muted-foreground">
        Community operations, briefings, and campaign sessions.
      </p>

      <section className="mb-12">
        <h2 className="mb-4 font-mono text-sm tracking-widest text-primary uppercase">
          Upcoming
        </h2>
        {upcoming.length === 0 ? (
          <SystemAlert
            title="No Upcoming Events"
            message="No events scheduled for your clearance level."
            variant="info"
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((ev) => (
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
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="mb-4 font-mono text-sm tracking-widest text-muted-foreground uppercase">
            Past Events
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((ev) => (
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
        </section>
      )}
    </div>
  );
}
