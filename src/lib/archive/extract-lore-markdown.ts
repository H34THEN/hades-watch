import { readFileSync } from "fs";
import { join } from "path";

export const ORIGIN_LORE_FILE = "docs/lore/CHTHONIC_UPRISING_ORIGIN.md";
export const LEADERS_LORE_FILE = "docs/lore/LEADERS_OF_THE_CHTHONIC_UPRISING.md";
export const WORLD_LORE_PACK_FILE = "docs/lore/WORLD_LORE_PACK_001_SURFACE_BREAKS.md";

/** Headings and builder appendices after this are excluded from archive body */
export const ORIGIN_ARCHIVE_END_HEADING = "# 13. Seeds for Future Lore";

export function readMarkdownFile(filePath: string): string {
  const absolute = join(process.cwd(), filePath);
  try {
    return readFileSync(absolute, "utf8");
  } catch {
    throw new Error(`Lore source file missing: ${absolute}`);
  }
}

export function extractMarkdownUntil(
  filePath: string,
  endHeading: string,
  startHeading?: string,
): string {
  const markdown = readMarkdownFile(filePath);
  const start = startHeading ? markdown.indexOf(startHeading) : 0;
  if (startHeading && start === -1) {
    throw new Error(`Markdown section not found: ${startHeading} in ${filePath}`);
  }

  const sliceStart = startHeading ? start : 0;
  const end = markdown.indexOf(endHeading, sliceStart);
  const slice = end === -1 ? markdown.slice(sliceStart) : markdown.slice(sliceStart, end);
  return slice.trim();
}

export function extractLeaderSection(
  sectionHeading: string,
  nextSectionHeading: string,
  filePath: string = LEADERS_LORE_FILE,
): string {
  const markdown = readMarkdownFile(filePath);
  const start = markdown.indexOf(sectionHeading);
  if (start === -1) {
    throw new Error(`Leader section not found: ${sectionHeading} in ${filePath}`);
  }

  const afterHeading = start + sectionHeading.length;
  const end = markdown.indexOf(nextSectionHeading, afterHeading);
  const slice = end === -1 ? markdown.slice(afterHeading) : markdown.slice(afterHeading, end);

  return slice.trim();
}

export function extractOriginArchiveBody(filePath: string = ORIGIN_LORE_FILE): string {
  return extractMarkdownUntil(filePath, ORIGIN_ARCHIVE_END_HEADING);
}

/** World lore entry body: archive card + Dead Index testimony (excludes field notes / seed blocks) */
export function extractWorldLoreEntryBody(
  sectionHeading: string,
  nextSectionHeading: string,
  filePath: string = WORLD_LORE_PACK_FILE,
): string {
  const section = extractMarkdownUntil(filePath, nextSectionHeading, sectionHeading);
  const cardMarker = "## Archive Card Copy";
  const fieldNotesMarker = "## Field Notes";
  const cardStart = section.indexOf(cardMarker);
  if (cardStart === -1) {
    throw new Error(`Archive Card Copy not found in section: ${sectionHeading}`);
  }
  const fieldStart = section.indexOf(fieldNotesMarker, cardStart);
  const slice = section.slice(cardStart, fieldStart === -1 ? undefined : fieldStart);
  return slice.replace(cardMarker, "").replace(/```yaml[\s\S]*?```\s*/g, "").trim();
}
