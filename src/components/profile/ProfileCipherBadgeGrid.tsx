"use client";

import { BadgeRecordDisplay } from "@/components/badges/BadgeRecordDisplay";

export interface ProfileCipherBadge {
  slug: string;
  name: string;
  tier: string | null;
  color: string | null;
  assetPath: string | null;
  placeholderText: string | null;
  placeholderColor: string | null;
  cipherSlug: string | null;
  verificationStatus: "Pending" | "Verified" | "Rejected";
  factionName: string | null;
  awardedAt: Date;
}

interface ProfileCipherBadgeGridProps {
  badges: ProfileCipherBadge[];
}

export function ProfileCipherBadgeGrid({ badges }: ProfileCipherBadgeGridProps) {
  if (badges.length === 0) return null;

  return (
    <div className="space-y-4 border-t border-border/40 pt-3">
      <dt className="text-muted-foreground">CIPHER STANDING</dt>
      <dd>
        <p className="mb-2 font-mono text-[10px] tracking-wider text-primary/80 uppercase">
          C1PH3R CR4K3R Chain
        </p>
        <div className="flex flex-wrap gap-3">
          {badges.map((badge) => (
            <BadgeRecordDisplay
              key={badge.slug}
              name={badge.name}
              label={badge.placeholderText ?? badge.name}
              color={badge.placeholderColor ?? badge.color}
              assetPath={badge.assetPath}
              capstone={badge.slug === "c1ph3r-cr4k3r-dead-index-adept"}
              completion={badge.slug !== "c1ph3r-cr4k3r-initiate"}
              status={badge.verificationStatus}
            />
          ))}
        </div>
      </dd>
    </div>
  );
}
