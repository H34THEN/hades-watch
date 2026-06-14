"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { useTheme } from "@/components/theme/ThemeProvider";
import {
  updateProfileAction,
  updateThemePreferenceAction,
} from "@/lib/actions/profile";
import type { SessionUser } from "@/lib/auth/session";

interface ProfileSettingsFormProps {
  user: SessionUser;
}

export function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
  const router = useRouter();
  const { update } = useSession();
  const { themeId, setThemeId } = useTheme();
  const [name, setName] = useState(user.name ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.set("name", name);

    startTransition(async () => {
      const result = await updateProfileAction(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      await update({ name });
      setSuccess("Profile updated.");
      router.refresh();
    });
  }

  function handleThemeChange(newThemeId: string) {
    setThemeId(newThemeId);
    startTransition(async () => {
      await updateThemePreferenceAction(newThemeId);
      await update({ themeId: newThemeId });
    });
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleProfileSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="profile-name" className="font-mono text-xs tracking-wider uppercase">
            Display Name
          </Label>
          <Input
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
          />
        </div>
        {error && (
          <SystemAlert title="Update Failed" message={error} variant="error" />
        )}
        {success && (
          <SystemAlert title="Profile Synced" message={success} variant="success" />
        )}
        <CommandButton type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Profile"}
        </CommandButton>
      </form>

      <div className="space-y-2 border-t border-border/40 pt-6">
        <Label className="font-mono text-xs tracking-wider uppercase">
          Theme Preference
        </Label>
        <p className="text-xs text-muted-foreground">
          Saved to your operative record when authenticated.
        </p>
        <ThemeSwitcher
          className="w-full"
          onThemeChange={handleThemeChange}
          value={themeId}
        />
      </div>
    </div>
  );
}
