import { CommunityNav } from "@/components/community/CommunityNav";
import { CommunitySafetyNotice } from "@/components/community/CommunitySafetyNotice";
import { CommunityShell } from "@/components/community/CommunityShell";
import { ForumCategoryGrid } from "@/components/community/ForumCategoryGrid";
import { getForumCategories } from "@/lib/queries/community";

export const metadata = {
  title: "Forums // Thread Relay",
};

export default async function ForumsPage() {
  const categories = await getForumCategories();

  return (
    <CommunityShell
      title="FORUMS // THREAD RELAY"
      subtitle="Old-web boards for field notes, lore, missions, ciphers, tools, and underworld chatter."
    >
      <CommunityNav active="/community/forums" />
      {categories.length === 0 ? (
        <p className="font-mono text-sm text-muted-foreground">
          No forum channels indexed yet. Run the community signals seed.
        </p>
      ) : (
        <ForumCategoryGrid categories={categories} />
      )}
      <CommunitySafetyNotice />
    </CommunityShell>
  );
}
