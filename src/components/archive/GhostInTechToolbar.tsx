import Link from "next/link";
import type { ArchiveForgeFilter, ArchiveSort } from "@/lib/actions/archive-items";
import { getSignalSubmitPath } from "@/lib/archive/signal-sections";
import styles from "@/components/archive/ghost-in-tech.module.css";

interface GhostInTechToolbarProps {
  sort: ArchiveSort;
  forge: ArchiveForgeFilter;
  query: string;
  tag: string;
  canSubmit: boolean;
  allTags: string[];
}

function buildHref(params: {
  sort?: ArchiveSort;
  forge?: ArchiveForgeFilter;
  q?: string;
  tag?: string;
}): string {
  const sp = new URLSearchParams();
  if (params.sort && params.sort !== "newest") sp.set("sort", params.sort);
  if (params.forge && params.forge !== "all") sp.set("forge", params.forge);
  if (params.q) sp.set("q", params.q);
  if (params.tag) sp.set("tag", params.tag);
  const qs = sp.toString();
  return qs ? `/archive/ghost-in-tech?${qs}` : "/archive/ghost-in-tech";
}

export function GhostInTechToolbar({
  sort,
  forge,
  query,
  tag,
  canSubmit,
  allTags,
}: GhostInTechToolbarProps) {
  const forgeOptions: { value: ArchiveForgeFilter; label: string }[] = [
    { value: "all", label: "All Forges" },
    { value: "github", label: "GitHub" },
    { value: "codeberg", label: "Codeberg" },
    { value: "other", label: "Other" },
  ];

  const sortOptions: { value: ArchiveSort; label: string }[] = [
    { value: "newest", label: "Newest" },
    { value: "discussed", label: "Most Discussed" },
    { value: "az", label: "A-Z" },
    { value: "updated", label: "Recently Updated" },
  ];

  return (
    <div className={styles.toolbar}>
      <form className={styles.toolbarRow} method="get" action="/archive/ghost-in-tech">
        {sort !== "newest" ? <input type="hidden" name="sort" value={sort} /> : null}
        {forge !== "all" ? <input type="hidden" name="forge" value={forge} /> : null}
        {tag ? <input type="hidden" name="tag" value={tag} /> : null}
        <div className={styles.searchForm}>
          <label htmlFor="ghost-in-tech-search" className="sr-only">
            Search repo relics
          </label>
          <input
            id="ghost-in-tech-search"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Search repo relics"
            className={styles.searchInput}
          />
          <button type="submit" className={styles.filterBtn}>
            Search
          </button>
        </div>
        {canSubmit ? (
          <Link href={getSignalSubmitPath("ghost-in-tech")} className={styles.filterBtn}>
            Submit a Repo
          </Link>
        ) : null}
      </form>

      <div className={styles.toolbarRow} role="group" aria-label="Forge filter">
        {forgeOptions.map((opt) => (
          <Link
            key={opt.value}
            href={buildHref({ sort, forge: opt.value, q: query, tag })}
            className={`${styles.filterBtn} ${forge === opt.value ? styles.filterBtnActive : ""}`}
            aria-current={forge === opt.value ? "true" : undefined}
          >
            {opt.label}
          </Link>
        ))}
      </div>

      <div className={styles.toolbarRow} role="group" aria-label="Sort">
        {sortOptions.map((opt) => (
          <Link
            key={opt.value}
            href={buildHref({ sort: opt.value, forge, q: query, tag })}
            className={`${styles.filterBtn} ${sort === opt.value ? styles.filterBtnActive : ""}`}
            aria-current={sort === opt.value ? "true" : undefined}
          >
            {opt.label}
          </Link>
        ))}
      </div>

      {allTags.length > 0 ? (
        <div className={styles.toolbarRow} role="group" aria-label="Tag filter">
          <Link
            href={buildHref({ sort, forge, q: query })}
            className={`${styles.filterBtn} ${!tag ? styles.filterBtnActive : ""}`}
          >
            All Tags
          </Link>
          {allTags.slice(0, 12).map((t) => (
            <Link
              key={t}
              href={buildHref({ sort, forge, q: query, tag: t })}
              className={`${styles.filterBtn} ${tag === t ? styles.filterBtnActive : ""}`}
            >
              {t}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
