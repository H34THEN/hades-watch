import { Suspense } from "react";
import { LoginForm } from "@/components/forms/LoginForm";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";

export const metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
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
    </div>
  );
}
