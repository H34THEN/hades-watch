import Link from "next/link";
import { ArchiveNav } from "@/components/archive/ArchiveNav";
import { ArchiveRepoCard } from "@/components/archive/ArchiveRepoCard";
import { GhostInTechStats } from "@/components/archive/GhostInTechStats";
import { GhostInTechToolbar } from "@/components/archive/GhostInTechToolbar";
import {
  getArchiveItems,
  type ArchiveForgeFilter,
  type ArchiveSort,
} from "@/lib/actions/archive-items";
import { GHOST_IN_TECH_SECTION } from "@/lib/archive/signal-sections";
import { getSessionUser, isApprovedUser, requireAuth } from "@/lib/auth/session";
import { isModerator } from "@/lib/auth/roles";
import { getSignalSubmitPath } from "@/lib/archive/signal-sections";
import styles from "@/components/archive/ghost-in-tech.module.css";

interface GhostInTechLibraryProps {
  sort: ArchiveSort;
  forge: ArchiveForgeFilter;
  query: string;
  tag: string;
}

export async function GhostInTechLibrary({ sort, forge, query, tag }: GhostInTechLibraryProps) {
  await requireAuth();
  const user = await getSessionUser();
  const canSubmit = user ? isApprovedUser(user) : false;
  const canModerate = user ? isModerator(user.roles) : false;

  const [items, allItems] = await Promise.all([
    getArchiveItems(GHOST_IN_TECH_SECTION.itemType, sort, {
      includeModeration: canModerate,
      forge,
      search: query || undefined,
      tag: tag || undefined,
    }),
    getArchiveItems(GHOST_IN_TECH_SECTION.itemType, "newest", {
      includeModeration: canModerate,
    }),
  ]);

  const githubCount = allItems.filter((i) => i.forge === "GITHUB").length;
  const codebergCount = allItems.filter((i) => i.forge === "CODEBERG").length;
  const discussedCount = allItems.filter((i) => i.commentCount > 0).length;

  const tagSet = new Set<string>();
  for (const item of allItems) {
    for (const t of item.tags) tagSet.add(t);
  }
  const allTags = [...tagSet].sort((a, b) => a.localeCompare(b));

  const section = GHOST_IN_TECH_SECTION;

  return (
    <div className={styles.ghostInTechShell}>
      <div className={styles.ghostInTechInner}>
        <ArchiveNav active={section.slug} />

        <header className={styles.header}>
          <p className={styles.eyebrow}>REPO RELIQUARY // OPEN SOURCE RELICS</p>
          <h1 className={styles.title}>{section.title.toUpperCase()}</h1>
          <p className={styles.description}>{section.description}</p>
          <p className={styles.safetyNotice}>
            Ghost in Tech indexes tools for learning, privacy, repair, self-hosting,
            accessibility, and defensive research. Do not submit malware, credential theft,
            evasion guides, doxxing tools, or exploit instructions targeting real systems.
          </p>
        </header>

        <GhostInTechStats
          totalCount={allItems.length}
          githubCount={githubCount}
          codebergCount={codebergCount}
          discussedCount={discussedCount}
        />

        <GhostInTechToolbar
          sort={sort}
          forge={forge}
          query={query}
          tag={tag}
          canSubmit={canSubmit}
          allTags={allTags}
        />

        <div className={styles.repoGrid}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <p>{section.emptyMessage}</p>
              {canSubmit ? (
                <p className="mt-4">
                  <Link href={getSignalSubmitPath(section.slug)} className={styles.filterBtn}>
                    Submit a Repo
                  </Link>
                </p>
              ) : null}
            </div>
          ) : (
            items.map((item) => (
              <ArchiveRepoCard
                key={item.id}
                item={{
                  slug: item.slug,
                  title: item.title,
                  sourceName: item.sourceName,
                  sourceUrl: item.sourceUrl,
                  domain: item.domain,
                  summary: item.summary,
                  tags: item.tags,
                  createdAt: item.createdAt,
                  updatedAt: item.updatedAt,
                  commentCount: item.commentCount,
                  status: item.status,
                  submittedBy: item.submittedBy,
                  forge: item.forge,
                  repoOwner: item.repoOwner,
                  repoName: item.repoName,
                }}
                section={section}
                showModeration={canModerate}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
