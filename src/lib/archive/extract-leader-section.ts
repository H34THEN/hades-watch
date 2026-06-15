import { readFileSync } from "fs";
import { join } from "path";

export const LEADERS_LORE_FILE = "docs/lore/LEADERS_OF_THE_CHTHONIC_UPRISING.md";

export function extractLeaderSection(
  sectionHeading: string,
  nextSectionHeading: string,
  filePath: string = LEADERS_LORE_FILE,
): string {
  const markdown = readFileSync(join(process.cwd(), filePath), "utf8");
  const start = markdown.indexOf(sectionHeading);
  if (start === -1) {
    throw new Error(`Leader section not found: ${sectionHeading}`);
  }

  const afterHeading = start + sectionHeading.length;
  const end = markdown.indexOf(nextSectionHeading, afterHeading);
  const slice = end === -1 ? markdown.slice(afterHeading) : markdown.slice(afterHeading, end);

  return slice.trim();
}
