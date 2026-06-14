import Link from "next/link";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { verifyEmailAction } from "@/lib/actions/email-verification";

export const metadata = { title: "Verify Email" };

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;

  if (!params.token) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <TerminalPanel title="verify.missing">
          <SystemAlert title="Missing Token" message="No verification token provided." variant="warning" />
          <Link href="/profile" className="mt-4 inline-block font-mono text-xs text-primary">← Profile</Link>
        </TerminalPanel>
      </div>
    );
  }

  const result = await verifyEmailAction(params.token);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <TerminalPanel title="verify.email">
        {result.success ? (
          <SystemAlert title="Verified" message="Your email has been verified." variant="success" />
        ) : (
          <SystemAlert title="Failed" message={result.error} variant="error" />
        )}
        <Link href="/profile" className="mt-4 inline-block font-mono text-xs text-primary">← Profile</Link>
      </TerminalPanel>
    </div>
  );
}
