"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import {
  requestAvatarForgeAccessAction,
  unlockAvatarForgeLinkAction,
} from "@/lib/actions/avatar-forge-access";
import type { AvatarForgeAccessView } from "@/lib/queries/avatar-forge-access";

interface AvatarForgeAccessPanelProps {
  access: AvatarForgeAccessView;
  forgeConfigured: boolean;
}

export function AvatarForgeAccessPanel({ access, forgeConfigured }: AvatarForgeAccessPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [forgeUrl, setForgeUrl] = useState<string | null>(null);

  function requestAccess() {
    setError(null);
    startTransition(async () => {
      const result = await requestAvatarForgeAccessAction();
      if (!result.success) setError(result.error);
      else router.refresh();
    });
  }

  function unlock() {
    setError(null);
    startTransition(async () => {
      const result = await unlockAvatarForgeLinkAction(code);
      if (!result.success) {
        setError(result.error);
        return;
      }
      if (result.url) setForgeUrl(result.url);
      router.refresh();
    });
  }

  function revealAgain() {
    setError(null);
    startTransition(async () => {
      const result = await unlockAvatarForgeLinkAction();
      if (!result.success) setError(result.error);
      else if (result.url) setForgeUrl(result.url);
    });
  }

  if (!forgeConfigured) {
    return (
      <SystemAlert
        title="Relay Offline"
        message="Avatar Forge relay is not configured on this server. Archivists must set AVATAR_FORGE_GPT_URL."
        variant="warning"
      />
    );
  }

  return (
    <div className="space-y-4 font-mono text-sm">
      <p className="text-muted-foreground">
        Request access to the Hades Watch Avatar Forge GPT for generating compatible avatar parts
        and outfit layers. The private relay link is gated behind Archivist approval and an unlock
        code.
      </p>

      {access.status === "none" && (
        <div className="space-y-3">
          <p>No forge access request on file.</p>
          <CommandButton onClick={requestAccess} disabled={isPending}>
            Request Avatar Forge Access
          </CommandButton>
        </div>
      )}

      {access.status === "pending" && (
        <SystemAlert
          title="Pending Review"
          message="Your Avatar Forge access request is pending Archivist review."
          variant="warning"
        />
      )}

      {access.status === "rejected" && (
        <SystemAlert
          title="Request Rejected"
          message={access.reviewNote ?? "Your Avatar Forge access request was rejected."}
          variant="error"
        />
      )}

      {access.status === "revoked" && (
        <SystemAlert
          title="Access Revoked"
          message={access.reviewNote ?? "Forge access was revoked. Contact an Archivist."}
          variant="error"
        />
      )}

      {access.status === "approved" && !access.unlocked && !forgeUrl && (
        <div className="space-y-3">
          <p>Access approved. Enter your unlock code to reveal the Avatar Forge link.</p>
          {access.codeExpiresAt && (
            <p className="text-[10px] text-muted-foreground">
              Code expires: {new Date(access.codeExpiresAt).toLocaleString()}
            </p>
          )}
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Unlock code"
            className="max-w-xs font-mono uppercase"
            autoComplete="off"
          />
          <CommandButton onClick={unlock} disabled={isPending || !code.trim()}>
            Unlock Avatar Forge Link
          </CommandButton>
        </div>
      )}

      {(access.unlocked || forgeUrl) && (
        <div className="space-y-3">
          <SystemAlert
            title="Relay Unlocked"
            message="Avatar Forge relay unlocked. Open the GPT in a new tab."
            variant="success"
          />
          {forgeUrl ? (
            <a href={forgeUrl} target="_blank" rel="noopener noreferrer">
              <CommandButton>Open Hades Watch Avatar Forge GPT</CommandButton>
            </a>
          ) : (
            <CommandButton onClick={revealAgain} disabled={isPending}>
              Reveal Avatar Forge Link
            </CommandButton>
          )}
        </div>
      )}

      {error && <SystemAlert title="Error" message={error} variant="error" />}

      <p className="text-[10px] text-muted-foreground">
        Prompt reference:{" "}
        <Link href="/profile/avatar/bases" className="text-primary hover:underline">
          Base Library
        </Link>
        {" · "}
        See repo docs: <code>docs/AVATAR_PROMPT_REFERENCE.md</code>
      </p>
    </div>
  );
}
