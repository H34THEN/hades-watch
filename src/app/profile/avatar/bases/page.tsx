import Link from "next/link";
import { AvatarAssetDownloadCard } from "@/components/avatar/AvatarAssetDownloadCard";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { AVATAR_OFFICIAL_DOWNLOADS } from "@/lib/avatar/avatar-assets";
import { getSessionUser, isApprovedUser } from "@/lib/auth/session";

export const metadata = { title: "Avatar Base Assets" };

export default async function AvatarBasesPage() {
  const user = await getSessionUser();
  if (!user || !isApprovedUser(user)) {
    return (
      <AccessDenied
        title="Approval Required"
        message="Base asset library requires approved operative clearance."
      />
    );
  }

  const byCategory = AVATAR_OFFICIAL_DOWNLOADS.reduce<Record<string, typeof AVATAR_OFFICIAL_DOWNLOADS>>(
    (acc, asset) => {
      const cat = asset.category ?? "OTHER";
      acc[cat] = acc[cat] ?? [];
      acc[cat].push(asset);
      return acc;
    },
    {},
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-3xl tracking-widest uppercase">Base Asset Library</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Download official Hades Watch avatar bases. Edit them in your art tool, then upload custom
            derivatives in the Avatar Builder. Replace files in{" "}
            <code className="text-primary">public/avatar-assets/</code> to update official parts.
          </p>
        </div>
        <Link href="/profile/avatar">
          <CommandButton size="sm" variant="outline">
            ← Avatar Builder
          </CommandButton>
        </Link>
      </div>

      <div className="space-y-6">
        {Object.entries(byCategory).map(([category, assets]) => (
          <TerminalPanel key={category} title={`bases.${category.toLowerCase()}`}>
            <div className="grid gap-2 sm:grid-cols-2">
              {assets.map((asset) => (
                <AvatarAssetDownloadCard key={asset.slug} asset={asset} />
              ))}
            </div>
          </TerminalPanel>
        ))}
      </div>
    </div>
  );
}
