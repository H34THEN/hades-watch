"use client";

import { useState, useTransition } from "react";
import { CommandButton } from "@/components/terminal/CommandButton";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { sendVerificationEmailAction } from "@/lib/actions/email-verification";

export function ResendVerificationButton() {
  const [message, setMessage] = useState<string | null>(null);
  const [devLink, setDevLink] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-2">
      <CommandButton
        size="sm"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            setMessage(null);
            setDevLink(null);
            const result = await sendVerificationEmailAction();
            if (!result.success) {
              setMessage(result.error);
              return;
            }
            setMessage("Verification email sent.");
            if (result.devLink) setDevLink(result.devLink);
          })
        }
      >
        Resend Verification
      </CommandButton>
      {message && <SystemAlert title="Verification" message={message} variant="info" />}
      {devLink && (
        <SystemAlert
          title="Dev Link"
          message={`Local dev only: ${devLink}`}
          variant="warning"
        />
      )}
    </div>
  );
}
