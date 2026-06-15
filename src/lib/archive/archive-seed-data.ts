import type { ArchiveItemType } from "@/generated/prisma/client";

export interface ArchiveSeedItem {
  slug: string;
  type: ArchiveItemType;
  title: string;
  sourceName: string;
  sourceUrl: string;
  summary: string;
  tags: string[];
}

export const STATE_OF_AFFAIRS_SEED_ITEMS: ArchiveSeedItem[] = [
  {
    slug: "eff-rayhunter-detect-cellular-spying",
    type: "ARTICLE",
    title: "Meet Rayhunter, A New Open Source Tool from EFF to Detect Cellular Spying",
    sourceName: "Electronic Frontier Foundation",
    sourceUrl:
      "https://www.eff.org/deeplinks/2025/03/meet-rayhunter-new-open-source-tool-eff-detect-cellular-spying",
    summary:
      "EFF introduces Rayhunter, an open source tool for detecting signs of cellular spying and suspicious base station behavior.",
    tags: ["EFF", "Rayhunter", "Cellular Surveillance", "Privacy", "Open Source", "IMSI Catchers"],
  },
  {
    slug: "eff-rayhunter-what-we-have-found-so-far",
    type: "ARTICLE",
    title: "Rayhunter: What We Have Found So Far",
    sourceName: "Electronic Frontier Foundation",
    sourceUrl: "https://www.eff.org/deeplinks/2025/09/rayhunter-what-we-have-found-so-far",
    summary:
      "A follow-up on Rayhunter findings and what EFF has observed so far in cellular surveillance detection work.",
    tags: ["EFF", "Rayhunter", "Surveillance Research", "Cellular Networks", "Privacy"],
  },
  {
    slug: "eff-section-702-patriot-act-one-pager",
    type: "ARTICLE",
    title: "Section 702 and the Patriot Act: EFF One Pager",
    sourceName: "Electronic Frontier Foundation",
    sourceUrl:
      "https://www.eff.org/files/2025/11/13/2025.11_702_patriot_act_one_pager_-_final_3.pdf",
    summary:
      "A PDF brief from EFF about surveillance authorities, civil liberties, and privacy concerns around Section 702 and Patriot Act-related powers.",
    tags: ["EFF", "Section 702", "Patriot Act", "Surveillance Law", "Civil Liberties", "Privacy"],
  },
];
