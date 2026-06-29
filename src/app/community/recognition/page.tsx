import { CommunityNav } from "@/components/community/CommunityNav";
import { CommunityShell } from "@/components/community/CommunityShell";
import { RecognitionBoard } from "@/components/community/RecognitionBoard";
import { RecognitionTemplateBoard } from "@/components/community/RecognitionTemplateBoard";
import { getPublicRecognitions } from "@/lib/queries/community";
import { getRecognitionTemplates } from "@/lib/queries/rewards";

export const metadata = {
  title: "Player Recognition // Dead Index Marks",
};

export default async function RecognitionPage() {
  const [recognitions, templates] = await Promise.all([
    getPublicRecognitions(40),
    getRecognitionTemplates(),
  ]);

  return (
    <CommunityShell
      title="PLAYER RECOGNITION // DEAD INDEX MARKS"
      subtitle="Constructive, creative, safe, and lore-building participation recognized by stewards and the Archivist."
    >
      <CommunityNav active="/community/recognition" />
      <RecognitionTemplateBoard templates={templates} />
      {recognitions.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 font-mono text-sm uppercase tracking-wider text-primary">Recent Marks</h2>
          <RecognitionBoard recognitions={recognitions} />
        </div>
      )}
    </CommunityShell>
  );
}
