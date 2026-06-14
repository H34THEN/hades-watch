import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { SystemAlert } from "@/components/terminal/SystemAlert";

export const metadata = { title: "Reset Password" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;

  if (!params.token) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <TerminalPanel title="auth.reset.invalid">
          <SystemAlert title="Invalid Link" message="Reset token missing or invalid." variant="error" />
        </TerminalPanel>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-8 font-mono text-2xl tracking-widest uppercase">Reset Password</h1>
      <TerminalPanel title="auth.reset.confirm">
        <ResetPasswordForm token={params.token} />
      </TerminalPanel>
    </div>
  );
}
