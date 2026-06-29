import { CommunityNav } from "@/components/community/CommunityNav";
import { CommunityShell } from "@/components/community/CommunityShell";
import { RecognitionBoard } from "@/components/community/RecognitionBoard";
import { getPublicRecognitions } from "@/lib/queries/community";

export const metadata = {
  title: "Player Recognition // Dead Index Marks",
};

export default async function RecognitionPage() {
  const recognitions = await getPublicRecognitions(40);

  return (
    <CommunityShell
      title="PLAYER RECOGNITION // DEAD INDEX MARKS"
      subtitle="Constructive, creative, safe, and lore-building participation recognized by stewards and the Archivist."
    >
      <CommunityNav active="/community/recognition" />
      <RecognitionBoard recognitions={recognitions} />
    </CommunityShell>
  );
}
