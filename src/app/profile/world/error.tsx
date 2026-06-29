"use client";

import { ProfilePageShell } from "@/components/profile/ProfilePageShell";
import { ProfileWorldErrorPanel } from "@/components/profile/ProfileWorldStatusPanels";

export default function ProfileWorldError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ProfilePageShell
      title="PROFILE WORLD // PUBLIC RELIC"
      subtitle="Something interrupted the Profile World relay."
      fillViewport={false}
    >
      <ProfileWorldErrorPanel
        message="The Profile World preview could not load. You can retry or return to the Relic Zone."
        showRetry={false}
      />
      <button
        type="button"
        onClick={reset}
        className="mt-4 font-mono text-xs uppercase tracking-wider text-primary hover:underline"
      >
        Retry load
      </button>
    </ProfilePageShell>
  );
}
