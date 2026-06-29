import Link from "next/link";
import { AvatarForgeAccessPanel } from "@/components/avatar/AvatarForgeAccessPanel";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { isAvatarForgeConfigured } from "@/lib/avatar-forge/config";
import { getAvatarForgeAccessForUser } from "@/lib/queries/avatar-forge-access";
import { getSessionUser, isApprovedUser } from "@/lib/auth/session";

export const metadata = { title: "Avatar Forge Access" };

export default async function AvatarForgeAccessPage() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <AccessDenied
        title="Authentication Required"
        message="Sign in to request Avatar Forge GPT access."
      />
    );
  }
  if (!isApprovedUser(user)) {
    return (
      <AccessDenied
        title="Approval Required"
        message="Avatar Forge requests open after operative approval."
      />
    );
  }

  const access = await getAvatarForgeAccessForUser(user.id);

  return (
    <div className="w-full max-w-none px-[clamp(1rem,2vw,2rem)] py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-3xl tracking-widest uppercase">Avatar Forge Access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Request the private Hades Watch Avatar Forge GPT relay for compatible layer generation.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/profile/avatar">
            <CommandButton size="sm" variant="outline">
              ← Avatar Builder
            </CommandButton>
          </Link>
          <Link href="/profile/world">
            <CommandButton size="sm" variant="outline">
              Profile World
            </CommandButton>
          </Link>
        </div>
      </div>

      <TerminalPanel title="avatar.forge.relay">
        <AvatarForgeAccessPanel access={access} forgeConfigured={isAvatarForgeConfigured()} />
      </TerminalPanel>
    </div>
  );
}
