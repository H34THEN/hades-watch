import Link from "next/link";
import { CommandButton } from "@/components/terminal/CommandButton";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Pending Approval" };

export default async function PendingApprovalPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.accountStatus === "Approved") {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="mb-2 font-mono text-3xl tracking-widest uppercase">
        Pending Approval
      </h1>
      <p className="mb-8 text-muted-foreground">
        Your operative record is queued for network clearance review.
      </p>

      <TerminalPanel title="access.queue" className="mb-6">
        <SystemAlert
          title="Awaiting Clearance"
          message="Your account has been created but is not yet approved for full network access. An admin will review your registration. If you used out-of-band verification, a mismatch or missing value may require manual review."
          variant="warning"
        />
        <p className="mt-4 font-mono text-sm text-muted-foreground">
          Codename: <span className="text-primary">{session.user.name ?? "—"}</span>
        </p>
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          You can update your dossier at{" "}
          <Link href="/profile" className="text-primary hover:underline">
            /profile
          </Link>{" "}
          while waiting.
        </p>
      </TerminalPanel>

      <Link href="/login">
        <CommandButton variant="outline">Return to Login</CommandButton>
      </Link>
    </div>
  );
}
