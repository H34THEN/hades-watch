"use client";

import { useState } from "react";
import Link from "next/link";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { validateInviteAction } from "@/lib/actions/invite";
import { inviteCodeSchema } from "@/lib/validations/invite";

export function InviteCodeForm() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    roleGranted: string;
    registerUrl: string;
    emailRestricted: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(null);
    const result = inviteCodeSchema.safeParse({ code });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid invite code");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set("code", code);
    if (email) formData.set("email", email);

    const response = await validateInviteAction(formData);
    setLoading(false);

    if (!response.success) {
      setError(response.message);
      return;
    }

    setSuccess({
      roleGranted: response.roleGranted,
      registerUrl: response.registerUrl,
      emailRestricted: response.emailRestricted,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="invite-code" className="font-mono text-xs tracking-wider uppercase">
          Invite Code
        </Label>
        <Input
          id="invite-code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="DEV-MEMBER-ACCESS"
          className="font-mono tracking-widest uppercase"
          autoComplete="off"
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="invite-email" className="font-mono text-xs tracking-wider uppercase">
          Email (if restricted)
        </Label>
        <Input
          id="invite-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Optional — required for email-restricted invites"
          disabled={loading}
        />
      </div>
      {error && (
        <SystemAlert title="Validation Failed" message={error} variant="error" />
      )}
      {success && (
        <SystemAlert
          title="Invite Valid"
          message={`Clearance level: ${success.roleGranted}. Proceed to registration.`}
          variant="success"
        />
      )}
      <CommandButton type="submit" disabled={loading}>
        {loading ? "Scanning..." : "Validate Code"}
      </CommandButton>
      {success && (
        <Link href={success.registerUrl} className="block">
          <CommandButton type="button" className="w-full">
            Proceed to Registration
          </CommandButton>
        </Link>
      )}
    </form>
  );
}
