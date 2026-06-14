import { InviteCodeForm } from "@/components/forms/InviteCodeForm";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";

export const metadata = { title: "Invite" };

export default function InvitePage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-2 font-mono text-3xl tracking-widest uppercase">
        Invite Access
      </h1>
      <p className="mb-8 text-muted-foreground">
        Hades Watch is invite-only. Enter your code to proceed to registration.
      </p>

      <TerminalPanel title="invite.validate">
        <InviteCodeForm />
      </TerminalPanel>
    </div>
  );
}
