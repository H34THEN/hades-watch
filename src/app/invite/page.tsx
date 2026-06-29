import { InviteCodeForm } from "@/components/forms/InviteCodeForm";
import { PageShell } from "@/components/layout/PageShell";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";

export const metadata = { title: "Invite" };

export default function InvitePage() {
  return (
    <PageShell variant="narrow" scanlines>
      <h1 className="mb-2 font-mono text-3xl tracking-widest uppercase">
        Invite Access
      </h1>
      <p className="mb-8 text-muted-foreground">
        Hades Watch is invite-only. Enter your code to proceed to registration.
      </p>

      <TerminalPanel title="invite.validate">
        <InviteCodeForm />
      </TerminalPanel>
    </PageShell>
  );
}
