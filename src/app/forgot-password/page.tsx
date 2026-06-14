import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-8 font-mono text-2xl tracking-widest uppercase">Forgot Password</h1>
      <TerminalPanel title="auth.reset.request">
        <ForgotPasswordForm />
      </TerminalPanel>
    </div>
  );
}
