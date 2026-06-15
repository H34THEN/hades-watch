import "dotenv/config";
import { existsSync, statSync } from "fs";
import { basename } from "path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import { resolveAlbumForUpload } from "../../src/lib/media/album-resolve";
import {
  ALLOWED_AUDIO_EXTENSIONS,
  MAX_AUDIO_BYTES,
} from "../../src/lib/media/constants";
import { copyAudioFileFromPath, slugifyMediaTitle } from "../../src/lib/media/storage";
import type { MediaVisibility } from "../../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function usage() {
  console.log(`Usage:
  npm run media:import-track -- <file-path> --title "Track Title" [options]

Options:
  --title <string>        Required track title
  --album <string>        Album title (created if missing)
  --artist <string>       Track artist / display name
  --album-artist <string> Album artist when creating a new album
  --track <number>        Track number
  --visibility <enum>     PRIVATE | APPROVED_USERS | PUBLIC | HIDDEN (default APPROVED_USERS)
  --description <string>  Lore note

Example:
  npm run media:import-track -- "/path/to/song.mp3" --title "Salt on the Tongue Fixed" --album "Album One" --artist "Heathen" --track 1 --visibility APPROVED_USERS
`);
}

function parseArgs(argv: string[]) {
  const positional: string[] = [];
  const flags: Record<string, string> = {};

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) {
        flags[key] = "true";
      } else {
        flags[key] = next;
        i++;
      }
    } else {
      positional.push(arg);
    }
  }

  return { positional, flags };
}

function validateSourceFile(filePath: string) {
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const ext = basename(filePath).toLowerCase().match(/\.[a-z0-9]+$/)?.[0];
  if (!ext || !ALLOWED_AUDIO_EXTENSIONS.has(ext)) {
    throw new Error(`Unsupported extension. Use .mp3, .m4a, .wav, or .ogg`);
  }
  const { size } = statSync(filePath);
  if (size > MAX_AUDIO_BYTES) {
    throw new Error(`File exceeds ${MAX_AUDIO_BYTES} byte limit`);
  }
}

async function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2));
  const filePath = positional[0];
  const title = flags.title?.trim();

  if (!filePath || !title) {
    usage();
    process.exit(1);
  }

  validateSourceFile(filePath);

  const visibility = (flags.visibility?.toUpperCase() ?? "APPROVED_USERS") as MediaVisibility;
  const allowed = new Set(["PRIVATE", "APPROVED_USERS", "PUBLIC", "HIDDEN"]);
  if (!allowed.has(visibility)) {
    throw new Error(`Invalid visibility: ${flags.visibility}`);
  }

  const owner = await prisma.user.findFirst({
    where: { userRoles: { some: { role: { name: "Owner" } } } },
    select: { id: true, email: true },
  });
  if (!owner) {
    throw new Error("No Owner user found. Import requires an Owner account for uploadedById.");
  }

  let albumId: string | null = null;
  if (flags.album?.trim()) {
    const resolved = await resolveAlbumForUpload({
      albumId: null,
      newAlbumTitle: flags.album.trim(),
      newAlbumArtistName: flags["album-artist"]?.trim() || flags.artist?.trim() || null,
      visibility,
      createdById: owner.id,
    });
    if (!resolved.ok) throw new Error(resolved.error);
    albumId = resolved.albumId;
  }

  const trackNumber = flags.track ? Number.parseInt(flags.track, 10) : null;
  const { filePath: storedPath, mimeType } = await copyAudioFileFromPath(filePath, title);
  const slug = slugifyMediaTitle(title);

  const track = await prisma.mediaTrack.create({
    data: {
      slug,
      title,
      artistName: flags.artist?.trim() || null,
      albumId,
      trackNumber: Number.isFinite(trackNumber) ? trackNumber : null,
      description: flags.description?.trim() || null,
      filePath: storedPath,
      mimeType,
      visibility,
      uploadedById: owner.id,
    },
  });

  console.log("✓ Media track imported");
  console.log(`  id: ${track.id}`);
  console.log(`  slug: ${track.slug}`);
  console.log(`  title: ${track.title}`);
  console.log(`  file: ${storedPath}`);
  console.log(`  stream: /api/media/audio/${track.id}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
