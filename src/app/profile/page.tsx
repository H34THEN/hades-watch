import { RoleBadge } from "@/components/badges/RoleBadge";
import { StatusBadge } from "@/components/badges/StatusBadge";
import { ResendVerificationButton } from "@/components/auth/ResendVerificationButton";
import { ProfileSettingsForm } from "@/components/forms/ProfileSettingsForm";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { requireAuth } from "@/lib/auth/session";
import { getThemeById } from "@/lib/themes/registry";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const user = await requireAuth();
  const theme = user.themeId ? getThemeById(user.themeId) : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-2 font-mono text-3xl tracking-widest uppercase">Profile</h1>
      <p className="mb-8 text-muted-foreground">Operative identity and preferences.</p>

      {!user.emailVerified && (
        <SystemAlert
          title="Email Unverified"
          message="Your email is not verified. Some features may be restricted in production."
          variant="warning"
          className="mb-8"
        />
      )}

      <TerminalPanel title="operative.record" className="mb-8">
        <dl className="space-y-4 font-mono text-sm">
          <div className="flex justify-between border-b border-border/40 pb-2">
            <dt className="text-muted-foreground">EMAIL</dt>
            <dd>{user.email}</dd>
          </div>
          <div className="flex justify-between border-b border-border/40 pb-2">
            <dt className="text-muted-foreground">VERIFIED</dt>
            <dd>{user.emailVerified ? user.emailVerified.toLocaleString() : "No"}</dd>
          </div>
          <div className="flex justify-between border-b border-border/40 pb-2">
            <dt className="text-muted-foreground">ROLES</dt>
            <dd className="flex flex-wrap gap-1">
              {user.roles.map((r) => (
                <RoleBadge key={r} role={r} />
              ))}
            </dd>
          </div>
          <div className="flex justify-between border-b border-border/40 pb-2">
            <dt className="text-muted-foreground">STATUS</dt>
            <dd><StatusBadge status="online" /></dd>
          </div>
          <div className="flex justify-between border-b border-border/40 pb-2">
            <dt className="text-muted-foreground">THEME</dt>
            <dd className="text-primary">{theme?.name ?? "Not set"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">ENLISTED</dt>
            <dd>{user.createdAt.toLocaleDateString()}</dd>
          </div>
        </dl>
        {!user.emailVerified && (
          <div className="mt-4">
            <ResendVerificationButton />
          </div>
        )}
      </TerminalPanel>

      <TerminalPanel title="operative.settings">
        <ProfileSettingsForm user={user} />
      </TerminalPanel>
    </div>
  );
}
