import Link from "next/link";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { BadgeRecordDisplay } from "@/components/badges/BadgeRecordDisplay";
import { CipherSolveForm } from "@/components/ciphers/CipherSolveForm";
import type { getCipherDetailForUser } from "@/lib/ciphers/queries";

type CipherDetail = NonNullable<Awaited<ReturnType<typeof getCipherDetailForUser>>>;

interface CipherDetailViewProps {
  cipher: CipherDetail;
}

function formatFaction(slug: string | null | undefined): string | null {
  if (!slug) return null;
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function CipherDetailView({ cipher }: CipherDetailViewProps) {
  return (
    <div className="space-y-6">
      <TerminalPanel title={`cipher.${cipher.slug}`}>
        <h1 className="font-mono text-xl uppercase text-primary">{cipher.title}</h1>
        <div className="mt-3 grid gap-1 font-mono text-[10px] text-muted-foreground sm:grid-cols-2">
          <p>Difficulty: {cipher.difficulty}</p>
          <p>Type: {cipher.cipherType}</p>
          <p>Estimated: {cipher.estimatedTime}</p>
          <p>Primary: {formatFaction(cipher.factionSlug)}</p>
          {cipher.secondaryFactionSlug && (
            <p className="sm:col-span-2">
              Secondary: {formatFaction(cipher.secondaryFactionSlug)}
            </p>
          )}
          <p className="sm:col-span-2">
            Status: {cipher.solved ? "Solved" : "Unsolved"}
          </p>
        </div>
        {cipher.badge && (
          <div className="mt-4 flex items-center gap-3">
            <BadgeRecordDisplay
              name={cipher.badge.name}
              label={cipher.badge.placeholderText ?? cipher.badge.slug}
              color={cipher.badge.placeholderColor}
              assetPath={cipher.badge.assetPath}
              capstone={cipher.badge.slug === "c1ph3r-cr4k3r-dead-index-adept"}
              completion={cipher.solved}
            />
            <p className="font-mono text-[10px] text-muted-foreground">
              Reward badge: {cipher.badge.name}
            </p>
          </div>
        )}
      </TerminalPanel>

      <TerminalPanel title="cipher.player_brief">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
          {cipher.playerBrief}
        </p>
      </TerminalPanel>

      <TerminalPanel title="cipher.relic_text">
        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-primary/90">
          {cipher.puzzleText}
        </pre>
      </TerminalPanel>

      <TerminalPanel title="cipher.hints">
        <div className="space-y-2 font-mono text-xs text-muted-foreground">
          {cipher.hint1 && (
            <details className="rounded border border-border/30 p-3">
              <summary className="cursor-pointer text-primary/90">Hint 1</summary>
              <p className="mt-2 text-foreground/80">{cipher.hint1}</p>
            </details>
          )}
          {cipher.hint2 && (
            <details className="rounded border border-border/30 p-3">
              <summary className="cursor-pointer text-primary/90">Hint 2</summary>
              <p className="mt-2 text-foreground/80">{cipher.hint2}</p>
            </details>
          )}
          {cipher.finalHint && (
            <details className="rounded border border-border/30 p-3">
              <summary className="cursor-pointer text-primary/90">Final Hint</summary>
              <p className="mt-2 text-foreground/80">{cipher.finalHint}</p>
            </details>
          )}
        </div>
      </TerminalPanel>

      {cipher.solved && cipher.explanation && (
        <TerminalPanel title="cipher.explanation">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
            {cipher.explanation}
          </p>
        </TerminalPanel>
      )}

      {cipher.solved && cipher.loreUnlockText && (
        <TerminalPanel title="cipher.lore_unlock">
          <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-muted-foreground">
            {cipher.loreUnlockText}
          </p>
        </TerminalPanel>
      )}

      <TerminalPanel title="cipher.submit">
        <CipherSolveForm
          slug={cipher.slug}
          submissionPrompt={cipher.submissionPrompt}
          failureMessage={cipher.failureMessage}
          successMessage={cipher.successMessage}
          alreadySolved={cipher.solved}
          badge={cipher.badge}
        />
      </TerminalPanel>

      <Link href="/ciphers" className="font-mono text-xs text-muted-foreground hover:text-primary">
        ← Return to Ciphers
      </Link>
    </div>
  );
}
