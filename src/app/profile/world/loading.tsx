import { ProfilePageShell } from "@/components/profile/ProfilePageShell";
import { ProfileWorldLoadingPanel } from "@/components/profile/ProfileWorldStatusPanels";

export default function ProfileWorldLoading() {
  return (
    <ProfilePageShell
      title="PROFILE WORLD // PUBLIC RELIC"
      subtitle="Loading your public signal chamber preview."
      fillViewport={false}
    >
      <ProfileWorldLoadingPanel />
    </ProfilePageShell>
  );
}
