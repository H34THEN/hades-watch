import type { AvatarAssetOption } from "@/lib/avatar/avatar-assets";

interface AvatarAssetDownloadCardProps {
  asset: AvatarAssetOption;
}

export function AvatarAssetDownloadCard({ asset }: AvatarAssetDownloadCardProps) {
  const downloadHref = asset.downloadPath ?? asset.imagePath;
  return (
    <div className="flex items-center justify-between gap-3 border border-border/50 bg-black/30 p-3">
      <div className="min-w-0">
        <p className="font-mono text-xs text-primary">{asset.label}</p>
        <p className="truncate font-mono text-[10px] text-muted-foreground">{asset.slug}</p>
        {asset.category && (
          <p className="font-mono text-[9px] text-muted-foreground/70 uppercase">{asset.category}</p>
        )}
      </div>
      <a
        href={downloadHref}
        download
        className="shrink-0 border border-primary/40 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-primary hover:bg-primary/10"
      >
        Download
      </a>
    </div>
  );
}
