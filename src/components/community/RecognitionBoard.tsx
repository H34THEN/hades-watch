import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import styles from "@/components/community/community.module.css";
import { cn } from "@/lib/utils";

type RecognitionAuthor = {
  character?: { callsign: string | null } | null;
  name: string | null;
  email: string;
};

interface RecognitionRow {
  id: string;
  type: string;
  category: string;
  title: string;
  body?: string | null;
  createdAt: Date;
  recipient: RecognitionAuthor;
  grantedBy: RecognitionAuthor;
}

interface RecognitionBoardProps {
  recognitions: RecognitionRow[];
}

function authorCallsign(author: RecognitionAuthor): string {
  return (
    author.character?.callsign ??
    author.name ??
    author.email.split("@")[0] ??
    "operative"
  );
}

export function RecognitionBoard({ recognitions }: RecognitionBoardProps) {
  if (recognitions.length === 0) {
    return (
      <TerminalPanel title="recognition.board">
        <p className="font-mono text-sm text-muted-foreground">
          No public recognitions posted yet.
        </p>
      </TerminalPanel>
    );
  }

  return (
    <TerminalPanel title="recognition.board">
      <ul className="space-y-4">
        {recognitions.map((recognition) => (
          <li
            key={recognition.id}
            className="rounded-lg border border-border/50 bg-card/30 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-mono text-xs tracking-wider text-primary uppercase">
                  {recognition.category.replace(/_/g, " ")}
                </p>
                <h3 className="mt-1 font-mono text-sm text-foreground">
                  {recognition.title}
                </h3>
              </div>
              <span className={cn(styles.statusChip, styles.statusAccepted)}>
                {recognition.type.replace(/_/g, " ")}
              </span>
            </div>

            {recognition.body && (
              <p className="mt-2 text-sm text-muted-foreground">{recognition.body}</p>
            )}

            <p className={cn(styles.metaRow, "mt-3")}>
              <span>To {authorCallsign(recognition.recipient)}</span>
              <span>From {authorCallsign(recognition.grantedBy)}</span>
              <span>{recognition.createdAt.toLocaleDateString()}</span>
            </p>
          </li>
        ))}
      </ul>
    </TerminalPanel>
  );
}
