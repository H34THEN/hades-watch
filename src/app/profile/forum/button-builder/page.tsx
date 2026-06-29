import Link from "next/link";
import { ForumSignatureBuilder } from "@/components/forums/ForumSignatureBuilder";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { requireAuth, isApprovedUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const metadata = { title: "Button Relay // Old-Web Sigil Builder" };

export default async function ForumButtonBuilderPage() {
  const user = await requireAuth();
  if (!isApprovedUser(user)) redirect("/pending-approval");

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-mono text-2xl tracking-widest uppercase text-primary">
            BUTTON RELAY // OLD-WEB SIGIL BUILDER
          </h1>
          <p className="mt-2 text-muted-foreground">
            Build a tiny Underwatch button for your forum signature without unsafe code.
          </p>
        </div>
        <Link href="/profile/forum" className="font-mono text-xs uppercase text-primary hover:underline">
          ← Forum identity
        </Link>
      </div>

      <TerminalPanel title="forum.button.builder">
        <ForumSignatureBuilder assetType="BUTTON" />
      </TerminalPanel>
    </div>
  );
}
