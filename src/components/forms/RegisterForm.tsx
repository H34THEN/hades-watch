"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { getInviteRegistrationHint } from "@/lib/actions/invite-registration";
import { registerUser } from "@/lib/actions/auth";
import { registerSchema } from "@/lib/validations/auth";

interface RegisterFormProps {
  initialInviteCode?: string;
}

export function RegisterForm({ initialInviteCode = "" }: RegisterFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState(initialInviteCode);
  const [name, setName] = useState("");
  const [verificationValue, setVerificationValue] = useState("");
  const [verificationHint, setVerificationHint] = useState<{
    methodLabel: string | null;
    customLabel: string | null;
    hasVerification: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialInviteCode.length >= 8) {
      void refreshVerificationHint(initialInviteCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial invite only
  }, []);

  async function refreshVerificationHint(code: string) {
    if (code.length < 8) {
      setVerificationHint(null);
      setVerificationValue("");
      return;
    }
    const hint = await getInviteRegistrationHint(code);
    if (hint?.hasVerification) {
      setVerificationHint({
        hasVerification: true,
        methodLabel: hint.methodLabel,
        customLabel: hint.customLabel,
      });
    } else {
      setVerificationHint(null);
      setVerificationValue("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = registerSchema.safeParse({
      email: email || undefined,
      password,
      confirmPassword,
      inviteCode,
      name,
      verificationValue: verificationValue || undefined,
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid registration data");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    if (email) formData.set("email", email);
    formData.set("password", password);
    formData.set("confirmPassword", confirmPassword);
    formData.set("inviteCode", inviteCode);
    formData.set("name", name);
    if (verificationValue) formData.set("verificationValue", verificationValue);

    const response = await registerUser(formData);
    setLoading(false);

    if (!response.success) {
      setError(response.error);
      return;
    }

    const loginId = email || name;
    const loginResult = await signIn("credentials", {
      email: loginId,
      password,
      redirect: false,
    });

    if (loginResult?.error) {
      router.push("/login");
      return;
    }

    router.push(response.redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reg-invite" className="font-mono text-xs tracking-wider uppercase">
          Invite Code
        </Label>
        <Input
          id="reg-invite"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
          onBlur={(e) => void refreshVerificationHint(e.target.value)}
          placeholder="INVITE-CODE"
          className="font-mono tracking-widest uppercase"
          autoComplete="off"
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-name" className="font-mono text-xs tracking-wider uppercase">
          Operative Codename
        </Label>
        <Input
          id="reg-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Field callsign"
          required
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-email" className="font-mono text-xs tracking-wider uppercase">
          Email (optional)
        </Label>
        <Input
          id="reg-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Optional — omit for no-email beta access"
          autoComplete="email"
          disabled={loading}
        />
        <p className="text-xs text-muted-foreground">
          Email is not required. You may log in with your codename if no email is set.
        </p>
      </div>
      {verificationHint?.hasVerification && (
        <div className="space-y-2 rounded border border-primary/30 bg-primary/5 p-4">
          <Label htmlFor="reg-verification" className="font-mono text-xs tracking-wider uppercase">
            Out-of-Band Verification
          </Label>
          <p className="text-xs text-muted-foreground">
            This invite is bound to a trusted-channel verification value. Enter the safety
            number or public key fingerprint you confirmed with your inviter (
            {verificationHint.customLabel ?? verificationHint.methodLabel}).
          </p>
          <Input
            id="reg-verification"
            value={verificationValue}
            onChange={(e) => setVerificationValue(e.target.value)}
            placeholder="Safety number or fingerprint"
            className="font-mono text-sm"
            autoComplete="off"
            disabled={loading}
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="reg-password" className="font-mono text-xs tracking-wider uppercase">
          Password
        </Label>
        <Input
          id="reg-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-confirm" className="font-mono text-xs tracking-wider uppercase">
          Confirm Password
        </Label>
        <Input
          id="reg-confirm"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          disabled={loading}
        />
      </div>
      {error && (
        <SystemAlert title="Registration Failed" message={error} variant="error" />
      )}
      <CommandButton type="submit" disabled={loading}>
        {loading ? "Initializing..." : "Initialize Account"}
      </CommandButton>
      <p className="text-center text-sm text-muted-foreground">
        Already registered?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
