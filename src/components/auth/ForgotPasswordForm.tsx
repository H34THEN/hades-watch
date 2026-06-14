"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { PASSWORD_RESET_GENERIC_MESSAGE, requestPasswordResetAction } from "@/lib/actions/password-reset";

export function ForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [devLink, setDevLink] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await requestPasswordResetAction(formData);
      setMessage(PASSWORD_RESET_GENERIC_MESSAGE);
      if (result.success && result.devLink) setDevLink(result.devLink);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="font-mono text-xs uppercase">Email</Label>
        <Input name="email" type="email" required className="font-mono" />
      </div>
      {message && <SystemAlert title="Request Received" message={message} variant="info" />}
      {devLink && (
        <SystemAlert title="Dev Reset Link" message={`Local dev only: ${devLink}`} variant="warning" />
      )}
      <CommandButton type="submit" disabled={isPending}>Send Reset Link</CommandButton>
      <p className="font-mono text-xs text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline">← Back to login</Link>
      </p>
    </form>
  );
}
