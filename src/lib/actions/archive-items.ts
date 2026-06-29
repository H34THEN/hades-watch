"use server";

import { revalidatePath } from "next/cache";
import type {
  ArchiveItemStatus,
  ArchiveItemType,
  CodeForge,
  Prisma,
} from "@/generated/prisma/client";
import { writeAuditLog } from "@/lib/audit";
import {
  isHttpUrl,
  parseDomain,
  parseRepoUrl,
  parseTagsInput,
} from "@/lib/archive/parse-url";
import { requireApprovedAuth } from "@/lib/auth/session";
import { isModerator } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

export type ArchiveSort = "newest" | "discussed" | "az" | "updated";

export type ArchiveForgeFilter = "all" | "github" | "codeberg" | "other";

const PUBLIC_STATUSES: ArchiveItemStatus[] = ["PUBLISHED"];
const MOD_STATUSES: ArchiveItemStatus[] = ["PUBLISHED", "PENDING_REVIEW", "HIDDEN"];

function parseTagsJson(tags: Prisma.JsonValue | null): string[] {
  if (!tags || !Array.isArray(tags)) return [];
  return tags.filter((t): t is string => typeof t === "string");
}

function uniqueSlug(base: string, type: ArchiveItemType): string {
  const prefix = type === "ARTICLE" ? base : `repo-${base}`;
  return prefix.slice(0, 64);
}

async function resolveUniqueSlug(base: string, type: ArchiveItemType): Promise<string> {
  let candidate = uniqueSlug(base, type);
  let n = 2;
  while (await prisma.archiveItem.findUnique({ where: { slug: candidate } })) {
    candidate = `${uniqueSlug(base, type)}-${n}`;
    n += 1;
  }
  return candidate;
}

export async function getArchiveItems(
  type: ArchiveItemType,
  sort: ArchiveSort = "newest",
  options?: {
    includeModeration?: boolean;
    forge?: ArchiveForgeFilter;
    search?: string;
    tag?: string;
  },
) {
  const user = await getSessionUser();
  const canModerate = user ? isModerator(user.roles) : false;
  const statuses =
    options?.includeModeration && canModerate ? MOD_STATUSES : PUBLIC_STATUSES;

  const where: Prisma.ArchiveItemWhereInput = {
    type,
    status: { in: statuses },
  };

  if (type === "CODE_REPO" && options?.forge && options.forge !== "all") {
    if (options.forge === "github") {
      where.forge = "GITHUB";
    } else if (options.forge === "codeberg") {
      where.forge = "CODEBERG";
    } else if (options.forge === "other") {
      where.OR = [{ forge: null }, { forge: { notIn: ["GITHUB", "CODEBERG"] } }];
    }
  }

  const search = options?.search?.trim();
  if (search) {
    const searchOr: Prisma.ArchiveItemWhereInput[] = [
      { title: { contains: search, mode: "insensitive" } },
      { summary: { contains: search, mode: "insensitive" } },
      { repoOwner: { contains: search, mode: "insensitive" } },
      { repoName: { contains: search, mode: "insensitive" } },
      { sourceName: { contains: search, mode: "insensitive" } },
    ];
    if (where.OR) {
      where.AND = [{ OR: where.OR }, { OR: searchOr }];
      delete where.OR;
    } else {
      where.OR = searchOr;
    }
  }

  const items = await prisma.archiveItem.findMany({
    where,
    include: {
      submittedBy: { select: { id: true, name: true, email: true } },
      _count: {
        select: {
          comments: { where: { isHidden: false } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  let mapped = items.map((item) => ({
    ...item,
    tags: parseTagsJson(item.tags),
    commentCount: item._count.comments,
  }));

  if (options?.tag) {
    const tagLower = options.tag.toLowerCase();
    mapped = mapped.filter((item) =>
      item.tags.some((t) => t.toLowerCase() === tagLower),
    );
  }

  if (sort === "discussed") {
    return [...mapped].sort(
      (a, b) =>
        b.commentCount - a.commentCount || b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  if (sort === "az") {
    return [...mapped].sort((a, b) => a.title.localeCompare(b.title));
  }

  if (sort === "updated") {
    return [...mapped].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime() || b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  return mapped;
}

export async function getArchiveItemBySlug(slug: string, sectionType: ArchiveItemType) {
  const user = await getSessionUser();
  const canModerate = user ? isModerator(user.roles) : false;

  const item = await prisma.archiveItem.findUnique({
    where: { slug },
    include: {
      submittedBy: { select: { id: true, name: true, email: true } },
      comments: {
        where: canModerate ? { parentId: null } : { parentId: null, isHidden: false },
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, name: true, email: true } },
        },
      },
      _count: {
        select: {
          comments: { where: canModerate ? {} : { isHidden: false } },
        },
      },
    },
  });

  if (!item || item.type !== sectionType) return null;
  if (!canModerate && !PUBLIC_STATUSES.includes(item.status)) return null;

  return {
    ...item,
    tags: parseTagsJson(item.tags),
    commentCount: item._count.comments,
  };
}

export async function getAllArchiveItemsAdmin() {
  return prisma.archiveItem.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      submittedBy: { select: { name: true, email: true } },
      _count: { select: { comments: true } },
    },
  });
}

export async function submitArticleAction(formData: FormData): Promise<ActionResult> {
  const user = await requireApprovedAuth();

  const title = (formData.get("title") as string)?.trim();
  const sourceUrl = (formData.get("sourceUrl") as string)?.trim();
  const sourceName = (formData.get("sourceName") as string)?.trim() || null;
  const summary = (formData.get("summary") as string)?.trim() || null;
  const tagsRaw = (formData.get("tags") as string) || "";

  if (!title) return { success: false, error: "Title required" };
  if (!sourceUrl || !isHttpUrl(sourceUrl)) {
    return { success: false, error: "Valid http/https URL required" };
  }

  const domain = parseDomain(sourceUrl);
  const slug = await resolveUniqueSlug(slugify(title), "ARTICLE");
  const tags = parseTagsInput(tagsRaw);

  const item = await prisma.archiveItem.create({
    data: {
      slug,
      type: "ARTICLE",
      status: "PUBLISHED",
      title,
      sourceUrl,
      sourceName: sourceName ?? domain,
      domain,
      summary,
      tags,
      submittedById: user.id,
    },
  });

  await writeAuditLog({
    action: "archive.submit.article",
    actorId: user.id,
    targetType: "archive_item",
    targetId: item.id,
  });

  revalidatePath("/archive/state-of-affairs");
  return { success: true };
}

export async function submitRepoAction(formData: FormData): Promise<ActionResult> {
  const user = await requireApprovedAuth();

  const title = (formData.get("title") as string)?.trim();
  const sourceUrl = (formData.get("sourceUrl") as string)?.trim();
  const summary = (formData.get("summary") as string)?.trim() || null;
  const tagsRaw = (formData.get("tags") as string) || "";

  if (!sourceUrl || !isHttpUrl(sourceUrl)) {
    return { success: false, error: "Valid http/https URL required" };
  }

  const parsed = parseRepoUrl(sourceUrl);
  if (!parsed) {
    return { success: false, error: "URL must be a github.com or codeberg.org repository" };
  }

  const displayTitle =
    title || `${parsed.repoOwner}/${parsed.repoName}`;
  const slug = await resolveUniqueSlug(
    slugify(`${parsed.repoOwner}-${parsed.repoName}`),
    "CODE_REPO",
  );
  const tags = parseTagsInput(tagsRaw);

  const item = await prisma.archiveItem.create({
    data: {
      slug,
      type: "CODE_REPO",
      status: "PUBLISHED",
      title: displayTitle,
      sourceUrl,
      sourceName: parsed.forge === "GITHUB" ? "GitHub" : "Codeberg",
      domain: parsed.domain,
      summary,
      tags,
      forge: parsed.forge as CodeForge,
      repoOwner: parsed.repoOwner,
      repoName: parsed.repoName,
      submittedById: user.id,
    },
  });

  await writeAuditLog({
    action: "archive.submit.repo",
    actorId: user.id,
    targetType: "archive_item",
    targetId: item.id,
  });

  revalidatePath("/archive/ghost-in-tech");
  return { success: true };
}

export async function postArchiveCommentAction(
  archiveItemId: string,
  body: string,
): Promise<ActionResult> {
  const user = await requireApprovedAuth();
  const trimmed = body.trim();
  if (!trimmed || trimmed.length < 2) {
    return { success: false, error: "Comment too short" };
  }
  if (trimmed.length > 8000) {
    return { success: false, error: "Comment too long" };
  }

  const item = await prisma.archiveItem.findUnique({ where: { id: archiveItemId } });
  if (!item || item.status !== "PUBLISHED") {
    return { success: false, error: "Signal not found or not open for discussion" };
  }

  await prisma.archiveComment.create({
    data: {
      archiveItemId,
      authorId: user.id,
      body: trimmed,
    },
  });

  await writeAuditLog({
    action: "archive.comment.create",
    actorId: user.id,
    targetType: "archive_item",
    targetId: archiveItemId,
  });

  const sectionPath = item.type === "ARTICLE" ? "/archive/state-of-affairs" : "/archive/ghost-in-tech";
  revalidatePath(sectionPath);
  revalidatePath(`${sectionPath}/${item.slug}`);
  return { success: true };
}

export async function setArchiveItemStatusAction(
  id: string,
  status: ArchiveItemStatus,
): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user || !isModerator(user.roles)) {
    return { success: false, error: "Unauthorized" };
  }

  await prisma.archiveItem.update({ where: { id }, data: { status } });

  await writeAuditLog({
    action: "archive.item.status",
    actorId: user.id,
    targetType: "archive_item",
    targetId: id,
    metadata: { status },
  });

  revalidatePath("/admin/archive");
  revalidatePath("/archive/state-of-affairs");
  revalidatePath("/archive/ghost-in-tech");
  return { success: true };
}

export async function setArchiveCommentHiddenAction(
  id: string,
  isHidden: boolean,
): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user || !isModerator(user.roles)) {
    return { success: false, error: "Unauthorized" };
  }

  await prisma.archiveComment.update({ where: { id }, data: { isHidden } });

  await writeAuditLog({
    action: "archive.comment.hide",
    actorId: user.id,
    targetType: "archive_comment",
    targetId: id,
    metadata: { isHidden },
  });

  revalidatePath("/admin/archive");
  return { success: true };
}

export async function seedArchiveItems(
  prismaClient: Pick<typeof prisma, "archiveItem">,
  items: Array<{
    slug: string;
    type: ArchiveItemType;
    title: string;
    sourceName: string;
    sourceUrl: string;
    summary: string;
    tags: string[];
  }>,
) {
  for (const item of items) {
    const domain = parseDomain(item.sourceUrl);
    await prismaClient.archiveItem.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        sourceName: item.sourceName,
        sourceUrl: item.sourceUrl,
        domain,
        summary: item.summary,
        tags: item.tags,
        type: item.type,
        status: "PUBLISHED",
      },
      create: {
        slug: item.slug,
        type: item.type,
        status: "PUBLISHED",
        title: item.title,
        sourceName: item.sourceName,
        sourceUrl: item.sourceUrl,
        domain,
        summary: item.summary,
        tags: item.tags,
      },
    });
  }
}
