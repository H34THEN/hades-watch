import { NetNeighborButton } from "@/components/net-neighbors/NetNeighborButton";
import { parseForumSignatureConfig } from "@/lib/forums/signature-builder";
import { signatureAssetImageUrl } from "@/lib/forums/identity-display";
import styles from "./forums.module.css";

export interface ForumSignatureAssetView {
  id: string;
  imagePath: string | null;
  safeConfig: unknown;
  altText: string | null;
  textPrimary: string | null;
}

interface ForumSignatureButtonProps {
  asset: ForumSignatureAssetView;
  compact?: boolean;
}

export function ForumSignatureButton({ asset, compact }: ForumSignatureButtonProps) {
  const config = parseForumSignatureConfig(asset.safeConfig);
  const imageUrl = signatureAssetImageUrl(asset.id, asset.imagePath);

  if (imageUrl) {
    const w = config?.width ?? 88;
    const h = config?.height ?? 31;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={asset.altText ?? asset.textPrimary ?? "Forum signature"}
        width={w}
        height={h}
        className={compact ? styles.signatureButtonCompact : styles.signatureButton}
      />
    );
  }

  if (config) {
    return (
      <NetNeighborButton
        title={asset.altText ?? asset.textPrimary ?? "Forum signature"}
        bannerStyle={config}
        className={compact ? styles.signatureButtonCompact : styles.signatureButton}
      />
    );
  }

  return null;
}
