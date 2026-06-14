"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemAlert } from "@/components/terminal/SystemAlert";
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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = registerSchema.safeParse({
      email,
      password,
      confirmPassword,
      inviteCode,
      name: name || undefined,
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid registration data");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);
    formData.set("confirmPassword", confirmPassword);
    formData.set("inviteCode", inviteCode);
    if (name) formData.set("name", name);

    const response = await registerUser(formData);
    setLoading(false);

    if (!response.success) {
      setError(response.error);
      return;
    }

    const loginResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (loginResult?.error) {
      router.push("/login");
      return;
    }

    router.push("/dashboard");
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
          placeholder="DEV-MEMBER-ACCESS"
          className="font-mono tracking-widest uppercase"
          autoComplete="off"
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-name" className="font-mono text-xs tracking-wider uppercase">
          Display Name
        </Label>
        <Input
          id="reg-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Operative callsign"
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-email" className="font-mono text-xs tracking-wider uppercase">
          Email
        </Label>
        <Input
          id="reg-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          disabled={loading}
        />
      </div>
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
