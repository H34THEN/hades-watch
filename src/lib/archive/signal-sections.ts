import type { ArchiveItemType } from "@/generated/prisma/client";

export interface ArchiveSignalSection {
  slug: string;
  itemType: ArchiveItemType;
  title: string;
  subtitle: string;
  description: string;
  terminalLabel: string;
  submitLabel: string;
  emptyMessage: string;
}

export const STATE_OF_AFFAIRS_SECTION: ArchiveSignalSection = {
  slug: "state-of-affairs",
  itemType: "ARTICLE",
  title: "State of Affairs",
  subtitle: "Surface Signals · Public-Interest Dispatches",
  description:
    "Track public-interest signals, surveillance news, civil liberties threats, tech industry shifts, and digital rights dispatches filed from the surface.",
  terminalLabel: "archive.state_of_affairs",
  submitLabel: "Archive Signal",
  emptyMessage: "No surface signals indexed yet. Underwatch is listening.",
};

export const GHOST_IN_TECH_SECTION: ArchiveSignalSection = {
  slug: "ghost-in-tech",
  itemType: "CODE_REPO",
  title: "Ghost in Tech",
  subtitle: "REPO RELIQUARY // OPEN SOURCE RELICS",
  description:
    "Repo relics, open-source tools, privacy projects, and useful code recovered from the surface web.",
  terminalLabel: "archive.ghost_in_tech",
  submitLabel: "Submit a Repo",
  emptyMessage: "No repo relics have surfaced from the Ghost in Tech archive yet.",
};

export const ARCHIVE_SIGNAL_SECTIONS: ArchiveSignalSection[] = [
  STATE_OF_AFFAIRS_SECTION,
  GHOST_IN_TECH_SECTION,
];

const BY_SLUG = new Map(ARCHIVE_SIGNAL_SECTIONS.map((s) => [s.slug, s]));

export function getSignalSectionBySlug(slug: string): ArchiveSignalSection | undefined {
  return BY_SLUG.get(slug);
}

export function getSignalSectionPath(slug: string): string {
  return `/archive/${slug}`;
}

export function getSignalItemPath(sectionSlug: string, itemSlug: string): string {
  return `/archive/${sectionSlug}/${itemSlug}`;
}

export function getSignalSubmitPath(sectionSlug: string): string {
  return `/archive/${sectionSlug}/submit`;
}
