import { join } from "path";

export function absoluteStoredPath(relativePath: string): string {
  if (relativePath.startsWith("storage/")) {
    return join(process.cwd(), relativePath);
  }
  return relativePath;
}
