import Link from "next/link";
import { ForumAuthorCard } from "@/components/forums/ForumAuthorCard";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { CommandButton } from "@/components/terminal/CommandButton";
import { requireAuth, isApprovedUser } from "@/lib/auth/session";
import { getOrCreateForumProfile } from "@/lib/queries/forum-identity";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = { title: "Forum Identity // Thread Relay Mask" };

export default async function ForumProfilePage() {
  const user = await requireAuth();
  if (!isApprovedUser(user)) redirect("/pending-approval");

  const [profile, character, dbUser] = await Promise.all([
    getOrCreateForumProfile(user.id),
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
      <div>
        <h1 className="font-mono text-2xl tracking-widest uppercase text-primary">
          FORUM IDENTITY // THREAD RELAY MASK
        </h1>
        <p className="mt-2 text-muted-foreground">
          Choose how your operative appears in the Underwatch thread relay.
        </p>
      </div>

      <TerminalPanel title="forum.identity.preview">
        <ForumAuthorCard author={authorPreview} showSignatureButton />
      </TerminalPanel>

      <div className="flex flex-wrap gap-2">
        <Link href="/profile/forum/edit">
          <CommandButton size="sm">Edit identity</CommandButton>
        </Link>
        <Link href="/profile/forum/button-builder">
          <CommandButton size="sm" variant="secondary">
            Button builder
          </CommandButton>
        </Link>
        <Link href="/profile/forum/banner-builder">
          <CommandButton size="sm" variant="secondary">
            Banner builder
          </CommandButton>
        </Link>
        <Link href="/notifications">
          <CommandButton size="sm" variant="secondary">
            Notifications
          </CommandButton>
        </Link>
      </div>
    </div>
  );
}
