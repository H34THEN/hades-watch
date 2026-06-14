import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { CommandButton } from "@/components/terminal/CommandButton";
import { cn } from "@/lib/utils";

interface EventCardProps {
  title: string;
  description: string;
  eventType: string;
  startsAt: Date;
  endsAt: Date | null;
  location: string | null;
  virtualUrl: string | null;
  jitsiRoomName: string | null;
  audienceRole?: string | null;
  cancelled?: boolean;
}

export function EventCard({
  title,
  description,
  eventType,
  startsAt,
  endsAt,
  location,
  virtualUrl,
  jitsiRoomName,
  audienceRole,
  cancelled,
}: EventCardProps) {
  const isPast = endsAt ? endsAt < new Date() : startsAt < new Date();

  return (
    <TerminalPanel
      title={`event.${eventType}`}
      status={cancelled ? "offline" : isPast ? "warning" : "online"}
      className={cn(cancelled && "opacity-60")}
    >
      <div className="mb-2 flex flex-wrap gap-2">
        <Badge variant="outline" className="font-mono text-[10px] tracking-widest uppercase">
          {eventType}
        </Badge>
        {audienceRole && (
          <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground">
            {audienceRole.toUpperCase()}
          </Badge>
        )}
        {cancelled && (
          <Badge variant="outline" className="font-mono text-[10px] text-destructive">
            CANCELLED
          </Badge>
        )}
      </div>
      <h3 className="mb-2 font-mono text-sm font-semibold tracking-wider uppercase">
        {title}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-foreground/80 line-clamp-3">
        {description}
      </p>
      <dl className="mb-4 space-y-1 font-mono text-xs text-muted-foreground">
        <div className="flex justify-between">
          <dt>STARTS</dt>
          <dd>{startsAt.toLocaleString()}</dd>
        </div>
        {endsAt && (
          <div className="flex justify-between">
            <dt>ENDS</dt>
            <dd>{endsAt.toLocaleString()}</dd>
          </div>
        )}
        {location && (
          <div className="flex justify-between">
            <dt>LOCATION</dt>
            <dd>{location}</dd>
          </div>
        )}
        {jitsiRoomName && (
          <div className="flex justify-between">
            <dt>ROOM</dt>
            <dd className="text-primary">{jitsiRoomName}</dd>
          </div>
        )}
      </dl>
      {virtualUrl && !cancelled && (
        <Link href={virtualUrl} target="_blank" rel="noopener noreferrer">
          <CommandButton size="sm">Join Meeting</CommandButton>
        </Link>
      )}
    </TerminalPanel>
  );
}
