"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { adminGrantRewardAction, adminRevokeRewardAction } from "@/lib/actions/admin-rewards";
import { GRANT_REASONS } from "@/lib/rewards/grant-constants";

const GRANT_TYPES = [
  "badge",
  "loot",
  "avatar_unlock",
  "title",
  "profile_cosmetic",
  "reputation",
  "lore_unlock",
  "recognition",
] as const;

interface UserOption {
  id: string;
  label: string;
}

interface AdminRewardGrantFormProps {
  users: UserOption[];
  defaultRecipientId?: string;
}

export function AdminRewardGrantForm({ users, defaultRecipientId }: AdminRewardGrantFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [grantType, setGrantType] = useState<string>("badge");

  function submit(formData: FormData, revoke = false) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = revoke
        ? await adminRevokeRewardAction(formData)
        : await adminGrantRewardAction(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setSuccess(revoke ? "Reward revoked." : "Reward granted.");
      router.refresh();
    });
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        submit(new FormData(e.currentTarget), false);
      }}
    >
      <div>
        <label className="mb-1 block font-mono text-xs uppercase text-muted-foreground">Recipient</label>
        <select
          name="recipientId"
          defaultValue={defaultRecipientId}
          required
          className="w-full border border-border bg-background px-3 py-2 font-mono text-sm"
        >
          <option value="">Select operative…</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block font-mono text-xs uppercase text-muted-foreground">Grant type</label>
          <select
            name="grantType"
            value={grantType}
            onChange={(e) => setGrantType(e.target.value)}
            className="w-full border border-border bg-background px-3 py-2 font-mono text-sm"
          >
            {GRANT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block font-mono text-xs uppercase text-muted-foreground">Reward slug</label>
          <input
            name="grantSlug"
            required
            placeholder="e.g. first-descent"
            className="w-full border border-border bg-background px-3 py-2 font-mono text-sm"
          />
        </div>
      </div>

      {grantType === "reputation" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block font-mono text-xs uppercase text-muted-foreground">Category</label>
            <select name="reputationCategory" className="w-full border border-border bg-background px-3 py-2 font-mono text-sm">
              {["COMMUNITY", "LORE", "MISSIONS", "CIPHERS", "ARCHIVE", "FORGE", "GUILDS", "ACCESSIBILITY", "FACTION", "RECOGNITION"].map(
                (c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ),
              )}
            </select>
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs uppercase text-muted-foreground">Points</label>
            <input
              name="reputationPoints"
              type="number"
              min={1}
              max={100}
              defaultValue={10}
              className="w-full border border-border bg-background px-3 py-2 font-mono text-sm"
            />
          </div>
        </div>
      )}

      <div>
        <label className="mb-1 block font-mono text-xs uppercase text-muted-foreground">Reason</label>
        <select name="reason" required className="w-full border border-border bg-background px-3 py-2 font-mono text-sm">
          {GRANT_REASONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block font-mono text-xs uppercase text-muted-foreground">Admin note (optional)</label>
        <textarea
          name="adminNote"
          maxLength={500}
          className="min-h-[4rem] w-full border border-border bg-background px-3 py-2 font-mono text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <CommandButton type="submit" disabled={isPending}>
          Grant Reward
        </CommandButton>
        <CommandButton
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => {
            const form = document.querySelector("form");
            if (form) submit(new FormData(form), true);
          }}
        >
          Revoke Reward
        </CommandButton>
      </div>

      {error && <SystemAlert title="Blocked" message={error} variant="error" />}
      {success && <SystemAlert title="Recorded" message={success} variant="success" />}
    </form>
  );
}
