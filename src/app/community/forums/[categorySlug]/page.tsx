import Link from "next/link";
import { notFound } from "next/navigation";
import { CommunityNav } from "@/components/community/CommunityNav";
import { CommunityShell } from "@/components/community/CommunityShell";
import { ForumThreadForm } from "@/components/community/ForumThreadForm";
import { ForumThreadList } from "@/components/community/ForumThreadList";
import { CommandButton } from "@/components/terminal/CommandButton";
import { getSessionUser, isApprovedUser } from "@/lib/auth/session";
import { getForumCategoryBySlug, getForumThreads } from "@/lib/queries/community";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  const category = await getForumCategoryBySlug(categorySlug);
  return { title: category ? `${category.name} // Forums` : "Forum Category" };
}

export default async function ForumCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { categorySlug } = await params;
  const { sort: sortParam } = await searchParams;
  const sort =
    sortParam === "newest" || sortParam === "top" ? sortParam : "active";

  const category = await getForumCategoryBySlug(categorySlug);
  if (!category || !category.isActive) notFound();

  const user = await getSessionUser();
  const approved = user ? isApprovedUser(user) : false;
  const threads = await getForumThreads(category.id, sort);

  return (
    <CommunityShell
      title={category.name}
      subtitle={category.description}
    >
      <CommunityNav active="/community/forums" />

      <div className="mb-6 flex flex-wrap items-center gap-2 font-mono text-xs">
        <span className="text-muted-foreground">Sort:</span>
        {(["active", "newest", "top"] as const).map((s) => (
          <Link
            key={s}
            href={`/community/forums/${categorySlug}?sort=${s}`}
            className={
              sort === s
                ? "rounded bg-primary/10 px-2 py-1 text-primary uppercase"
                : "rounded px-2 py-1 text-muted-foreground uppercase hover:text-primary"
            }
          >
            {s}
          </Link>
        ))}
        <Link href="/community/forums" className="ml-auto">
          <CommandButton size="sm" variant="outline">
            All Channels
          </CommandButton>
        </Link>
      </div>

      {category.rules && (
        <p className="mb-6 border-l-2 border-primary/30 pl-3 font-mono text-xs text-muted-foreground">
          {category.rules}
        </p>
      )}

      {approved && (
        <div className="mb-8">
          <ForumThreadForm categoryId={category.id} />
        </div>
      )}

      <ForumThreadList threads={threads} />
    </CommunityShell>
  );
}
