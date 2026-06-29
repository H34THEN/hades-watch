import { redirect } from "next/navigation";
import { RESERVED_CALLSIGNS } from "@/lib/profile/callsign";

export default async function LegacyPublicProfileRedirect({
  params,
}: {
  params: Promise<{ callsign: string }>;
}) {
  const { callsign } = await params;
  const normalized = callsign.toLowerCase().trim();
  if (RESERVED_CALLSIGNS.has(normalized)) {
    redirect("/profile/world");
  }
  redirect(`/profile/world/${encodeURIComponent(normalized)}`);
}
