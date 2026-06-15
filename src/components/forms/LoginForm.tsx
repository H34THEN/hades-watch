"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { loginSchema } from "@/lib/validations/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "auth_required"
      ? "Authentication required to access that sector."
      : null,
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid credentials");
      return;
    }

    setLoading(true);
    setError(null);

    const response = await signIn("credentials", {
      email: result.data.email,
      password: result.data.password,
      redirect: false,
    });

    setLoading(false);

    if (response?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="font-mono text-xs tracking-wider uppercase">
          Email or Codename
        </Label>
        <Input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email or operative codename"
          autoComplete="username"
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="font-mono text-xs tracking-wider uppercase">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          disabled={loading}
        />
      </div>
      {error && (
        <SystemAlert title="Authentication Failed" message={error} variant="error" />
      )}
      <CommandButton type="submit" disabled={loading}>
        {loading ? "Authenticating..." : "Authenticate"}
      </CommandButton>
      <p className="text-center font-mono text-xs text-muted-foreground">
        <Link href="/forgot-password" className="text-primary hover:underline">
          Forgot password?
        </Link>
      </p>
      <p className="text-center text-sm text-muted-foreground">
        Need an invite?{" "}
        <Link href="/invite" className="text-primary hover:underline">
          Enter code
        </Link>{" "}
        or{" "}
        <Link href="/register" className="text-primary hover:underline">
          Register
        </Link>
      </p>
    </form>
  );
}
