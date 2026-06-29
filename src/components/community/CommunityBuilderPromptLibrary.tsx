import styles from "@/components/community/community.module.css";

interface Prompt {
  slug: string;
  title: string;
  category: string;
  suggestedRoute: string | null;
  playerPrompt: string;
  reviewRequired: boolean;
  safetyNote: string | null;
  rewardSuggestions: string | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  forum_topic: "Forum Topics",
  mission_idea: "Mission Ideas",
  cipher_idea: "Cipher Ideas",
  lore_fragment: "Lore Fragments",
  avatar_asset_idea: "Avatar Asset Ideas",
  badge_idea: "Badge Ideas",
  accessibility_note: "Accessibility Notes",
  archive_resource: "Archive Resources",
  net_neighbor: "Net Neighbors",
  event_idea: "Event Ideas",
  profile_world_theme: "Profile World Themes",
  signal_player_idea: "Signal Player Ideas",
};

export function CommunityBuilderPromptLibrary({ prompts }: { prompts: Prompt[] }) {
  const byCategory = prompts.reduce<Record<string, Prompt[]>>((acc, p) => {
    (acc[p.category] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div className="mt-8 space-y-8">
      <p className="font-mono text-xs text-muted-foreground">
        Starter prompts from the Underwatch commons. Submit through the form above when approved.
      </p>
      {Object.entries(byCategory).map(([category, items]) => (
        <section key={category}>
          <h2 className="mb-4 font-mono text-sm uppercase tracking-wider text-primary">
            {CATEGORY_LABELS[category] ?? category.replace(/_/g, " ")}
          </h2>
          <div className={styles.cardGrid}>
            {items.map((p) => (
              <article key={p.slug} className={styles.card}>
                <h3 className="font-mono text-xs font-semibold uppercase">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.playerPrompt}</p>
                {p.rewardSuggestions && (
                  <p className="mt-2 font-mono text-[10px] text-primary/80">Rewards: {p.rewardSuggestions}</p>
                )}
                {p.safetyNote && (
                  <p className="mt-2 font-mono text-[10px] text-amber-500/80">{p.safetyNote}</p>
                )}
                {p.reviewRequired && (
                  <span className="mt-2 inline-block font-mono text-[10px] uppercase text-muted-foreground">
                    Review required
                  </span>
                )}
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
