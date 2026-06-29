import styles from "@/components/community/community.module.css";

interface Template {
  slug: string;
  title: string;
  recognitionType: string;
  category: string;
  grantedByRole: string;
  description: string;
  flavorText: string | null;
  unlockCondition: string | null;
  optOut: boolean;
  revocable: boolean;
}

export function RecognitionTemplateBoard({ templates }: { templates: Template[] }) {
  return (
    <div className="space-y-8">
      <TerminalPanelIntro />
      <div className={styles.cardGrid}>
        {templates.map((t) => (
          <article key={t.slug} className={styles.card}>
            <p className="font-mono text-[10px] uppercase text-muted-foreground">{t.category}</p>
            <h3 className="mt-1 font-mono text-sm font-semibold uppercase text-primary">{t.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>
            {t.flavorText && <p className="mt-2 text-xs italic text-primary/80">{t.flavorText}</p>}
            <div className="mt-3 font-mono text-[10px] text-muted-foreground">
              <p>Granted by: {t.grantedByRole}</p>
              {t.unlockCondition && <p>Condition: {t.unlockCondition}</p>}
              {t.optOut && <p>Opt-out available</p>}
              {t.revocable && <p>Revocable</p>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function TerminalPanelIntro() {
  return (
    <div className="rounded border border-border/40 p-4">
      <p className="text-sm text-muted-foreground">
        Recognition marks constructive, creative, safe participation. Templates below describe how marks work;
        actual grants are made by Owner, Admin, or Moderators — never seeded as fake player activity.
      </p>
      <p className="mt-2 font-mono text-[10px] text-amber-500/80">
        You may opt out of public recognition display in your profile settings when that relay is wired.
      </p>
    </div>
  );
}
