import { notFound } from "next/navigation";
import { CipherDetailView } from "@/components/ciphers/CipherDetailView";
import { getCipherDetailForUser } from "@/lib/ciphers/queries";
import { requireApprovedAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Cipher" };

export default async function CipherDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await requireApprovedAuth();
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug).trim();
  const cipher = await getCipherDetailForUser(slug, user.id);
  if (!cipher) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <CipherDetailView cipher={cipher} />
    </div>
  );
}
