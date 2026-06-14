"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { resetPasswordAction } from "@/lib/actions/password-reset";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("token", token);
    startTransition(async () => {
      const result = await resetPasswordAction(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.push("/login?reset=success");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="font-mono text-xs uppercase">New Password</Label>
        <Input name="password" type="password" required minLength={8} />
      </div>
      <div className="space-y-2">
        <Label className="font-mono text-xs uppercase">Confirm Password</Label>
        <Input name="confirmPassword" type="password" required minLength={8} />
      </div>
      {error && <SystemAlert title="Error" message={error} variant="error" />}
      <CommandButton type="submit" disabled={isPending}>Reset Password</CommandButton>
      <p className="font-mono text-xs text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline">← Back to login</Link>
      </p>
    </form>
  );
}
