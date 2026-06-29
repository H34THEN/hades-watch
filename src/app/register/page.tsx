import { RegisterForm } from "@/components/forms/RegisterForm";
import { PageShell } from "@/components/layout/PageShell";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";

export const metadata = { title: "Register" };

interface RegisterPageProps {
  searchParams: Promise<{ invite?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const inviteCode = params.invite ?? "";

  return (
    <PageShell variant="narrow" scanlines>
      <h1 className="mb-2 font-mono text-3xl tracking-widest uppercase">
        Register
      </h1>
      <p className="mb-8 text-muted-foreground">
        Initialize a new operative account. Valid invite code required.
      </p>

      <TerminalPanel title="auth.register">
        <RegisterForm initialInviteCode={inviteCode} />
      </TerminalPanel>
    </PageShell>
  );
}
