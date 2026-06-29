import Link from "next/link";
import { ForumProfileEditor } from "@/components/forums/ForumProfileEditor";
import { requireAuth, isApprovedUser } from "@/lib/auth/session";
import {
  getForumUserPreference,
  getOrCreateForumProfile,
} from "@/lib/queries/forum-identity";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = { title: "Edit Forum Identity" };

export default async function ForumProfileEditPage() {
  const user = await requireAuth();
  if (!isApprovedUser(user)) redirect("/pending-approval");

  const [profile, prefs, character, dbUser] = await Promise.all([
    getOrCreateForumProfile(user.id),
    getForumUserPreference(user.id),
    prisma.character.findUnique({
      where: { userId: user.id },
      select: {
        callsign: true,
        avatarUrl: true,
        faction: { select: { slug: true, name: true } },
      },
    }),
    prisma.user.findUnique({
      where: { id: user.id },
      select: { activeTitle: true },
    }),
  ]);

  const authorPreview = {
    id: user.id,
    name: user.name,
    email: user.email,
    activeTitle: dbUser?.activeTitle ?? null,
    character,
    forumProfile: profile,
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-mono text-2xl tracking-widest uppercase text-primary">
            FORUM IDENTITY // EDIT
          </h1>
          <p className="mt-2 text-muted-foreground">
            Configure your thread relay mask, signature, and notification preferences.
          </p>
        </div>
        <Link href="/profile/forum" className="font-mono text-xs uppercase text-primary hover:underline">
          ← Back
        </Link>
      </div>

      <ForumProfileEditor
        authorPreview={authorPreview}
        profile={profile}
        preferences={prefs}
      />
    </div>
  );
}
