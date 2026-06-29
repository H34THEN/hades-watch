import { Suspense } from "react";
import { LoginForm } from "@/components/forms/LoginForm";
import { PageShell } from "@/components/layout/PageShell";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";

export const metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <PageShell variant="narrow" scanlines>
      <h1 className="mb-2 font-mono text-3xl tracking-widest uppercase">
        Login
      </h1>
      <p className="mb-8 text-muted-foreground">
        Authenticate to access your operator dashboard.
      </p>

      <TerminalPanel title="auth.login">
        <Suspense fallback={<p className="font-mono text-sm">Loading...</p>}>
          <LoginForm />
        </Suspense>
      </TerminalPanel>
    </PageShell>
  );
}
