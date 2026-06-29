"use server";

import { revalidatePath } from "next/cache";
import type {
  ForumCommentStatus,
  ForumReactionType,
  ForumThreadStatus,
} from "@/generated/prisma/client";
import { writeAuditLog } from "@/lib/audit";
import { getApprovedUserForAction, getModeratorUserForAction } from "@/lib/auth/session";
import { tryAwardBadgeBySlug } from "@/lib/community/badges";
import { POSITIVE_REACTION_SCORE } from "@/lib/community/constants";
import { recordReputationEvent } from "@/lib/community/reputation";
import { stripCommunityText } from "@/lib/community/sanitize";
import { createUserNotification } from "@/lib/forums/notifications";
import { buildQuoteExcerpt, parseMentions } from "@/lib/forums/quotes";
import { resolveForumCallsign } from "@/lib/forums/callsign";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { z } from "zod";

export type ActionResult =
  | { success: true; slug?: string }
  | { success: false; error: string };

const threadSchema = z.object({
  categoryId: z.string().min(1),
  title: z.string().min(3).max(200),
  body: z.string().min(10).max(20000),
});

const commentSchema = z.object({
  threadId: z.string().min(1),
  body: z.string().min(1).max(10000),
  parentCommentId: z.string().optional(),
  quotedCommentId: z.string().optional(),
});

const reactionSchema = z.object({
  reactionType: z.enum([
    "SIGNAL_BOOST",
    "USEFUL",
    "LOREFUL",
    "NEEDS_CARE",
    "THANKS",
  ]),
});

const reportSchema = z.object({
  targetType: z.string().min(1).max(64),
  targetId: z.string().min(1).max(128),
  reason: z.string().min(10).max(5000),
});

async function recalculateThreadScore(threadId: string): Promise<void> {
  const reactions = await prisma.forumReaction.findMany({
    where: { threadId },
    select: { reactionType: true },
  });

  const score = reactions.reduce((sum, reaction) => {
    return sum + (POSITIVE_REACTION_SCORE[reaction.reactionType] ?? 0);
  }, 0);

  await prisma.forumThread.update({
    where: { id: threadId },
    data: { score },
  });
}

async function recalculateCommentScore(commentId: string): Promise<void> {
  const reactions = await prisma.forumReaction.findMany({
    where: { commentId },
    select: { reactionType: true },
  });

  const score = reactions.reduce((sum, reaction) => {
    return sum + (POSITIVE_REACTION_SCORE[reaction.reactionType] ?? 0);
  }, 0);

  await prisma.forumComment.update({
    where: { id: commentId },
    data: { score },
  });
}

export async function createThreadAction(formData: FormData): Promise<ActionResult> {
  const auth = await getApprovedUserForAction();
  if ("error" in auth) {
    return { success: false, error: auth.error };
  }

  const parsed = threadSchema.safeParse({
    categoryId: formData.get("categoryId"),
    title: stripCommunityText(String(formData.get("title") ?? ""), 200),
    body: stripCommunityText(String(formData.get("body") ?? ""), 20000),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid thread.",
    };
  }

  const category = await prisma.forumCategory.findFirst({
    where: { id: parsed.data.categoryId, isActive: true },
    select: { id: true, slug: true },
  });
  if (!category) {
    return { success: false, error: "Category not found." };
  }

  const baseSlug = slugify(parsed.data.title) || "thread";
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  const thread = await prisma.forumThread.create({
    data: {
      categoryId: category.id,
      authorId: auth.id,
      title: parsed.data.title,
      slug,
      body: parsed.data.body,
      status: "ACTIVE",
      lastActivityAt: new Date(),
    },
  });

  await recordReputationEvent({
    userId: auth.id,
    category: "COMMUNITY",
    points: 5,
    reason: "Started a forum thread",
    sourceType: "forum_thread",
    sourceId: thread.id,
  });

  await tryAwardBadgeBySlug(auth.id, "first-thread");

  await writeAuditLog({
    action: "forum.thread.create",
    actorId: auth.id,
    targetType: "ForumThread",
    targetId: thread.id,
    metadata: { slug, categorySlug: category.slug },
  });

  revalidatePath("/forums");
  revalidatePath(`/forums/${category.slug}`);
  revalidatePath(`/forums/${category.slug}/${slug}`);
  revalidatePath("/mmo/community");
  return { success: true, slug };
}

export async function createCommentAction(formData: FormData): Promise<ActionResult> {
  const auth = await getApprovedUserForAction();
  if ("error" in auth) {
    return { success: false, error: auth.error };
  }

  const parsed = commentSchema.safeParse({
    threadId: formData.get("threadId"),
    body: stripCommunityText(String(formData.get("body") ?? ""), 10000),
    parentCommentId: formData.get("parentCommentId") || undefined,
    quotedCommentId: formData.get("quotedCommentId") || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid comment.",
    };
  }

  const thread = await prisma.forumThread.findFirst({
    where: {
      id: parsed.data.threadId,
      status: { in: ["ACTIVE", "LOCKED"] },
    },
    include: { category: { select: { slug: true } } },
  });

  if (!thread) {
    return { success: false, error: "Thread not found or locked." };
  }
  if (thread.status === "LOCKED") {
    return { success: false, error: "This thread is locked." };
  }

  if (parsed.data.parentCommentId) {
    const parent = await prisma.forumComment.findFirst({
      where: {
        id: parsed.data.parentCommentId,
        threadId: thread.id,
        status: "ACTIVE",
      },
      select: { id: true },
    });
    if (!parent) {
      return { success: false, error: "Parent comment not found." };
    }
  }

  let quotedCommentId: string | null = null;
  let quotedAuthorId: string | null = null;
  let quoteExcerpt: string | null = null;

  if (parsed.data.quotedCommentId) {
    const quoted = await prisma.forumComment.findFirst({
      where: {
        id: parsed.data.quotedCommentId,
        threadId: thread.id,
        status: "ACTIVE",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            character: { select: { callsign: true } },
            forumProfile: { select: { displayName: true } },
          },
        },
      },
    });
    if (!quoted) {
      return { success: false, error: "Quoted comment not found." };
    }
    quotedCommentId = quoted.id;
    quotedAuthorId = quoted.authorId;
    quoteExcerpt = buildQuoteExcerpt(quoted.body);
  }

  const comment = await prisma.forumComment.create({
    data: {
      threadId: thread.id,
      authorId: auth.id,
      parentCommentId: parsed.data.parentCommentId ?? null,
      quotedCommentId,
      quotedAuthorId,
      quoteExcerpt,
      body: parsed.data.body,
      status: "ACTIVE",
    },
  });

  await prisma.forumThread.update({
    where: { id: thread.id },
    data: {
      commentCount: { increment: 1 },
      lastActivityAt: new Date(),
    },
  });

  await recordReputationEvent({
    userId: auth.id,
    category: "COMMUNITY",
    points: 2,
    reason: "Posted a forum reply",
    sourceType: "forum_comment",
    sourceId: comment.id,
  });

  await tryAwardBadgeBySlug(auth.id, "signal-reply");

  const actorCallsign =
    (
      await prisma.user.findUnique({
        where: { id: auth.id },
        select: {
          name: true,
          email: true,
          character: { select: { callsign: true } },
          forumProfile: { select: { displayName: true } },
        },
      })
    ) ?? null;

  const quoterName = actorCallsign
    ? resolveForumCallsign(actorCallsign)
    : "An operative";

  const threadUrl = `/community/threads/${thread.slug}#comment-${comment.id}`;

  if (quotedAuthorId && quotedAuthorId !== auth.id) {
    await createUserNotification({
      recipientId: quotedAuthorId,
      actorId: auth.id,
      type: "FORUM_QUOTE",
      title: `${quoterName} echoed your signal`,
      body: `In “${thread.title}”: ${quoteExcerpt ?? ""}`.slice(0, 500),
      targetUrl: threadUrl,
      metadata: {
        threadId: thread.id,
        commentId: comment.id,
        quotedCommentId,
      },
    });
  }

  if (parsed.data.parentCommentId) {
    const parent = await prisma.forumComment.findUnique({
      where: { id: parsed.data.parentCommentId },
      select: { authorId: true },
    });
    if (parent && parent.authorId !== auth.id && parent.authorId !== quotedAuthorId) {
      await createUserNotification({
        recipientId: parent.authorId,
        actorId: auth.id,
        type: "FORUM_REPLY",
        title: `${quoterName} replied to your signal`,
        body: `In “${thread.title}”.`,
        targetUrl: threadUrl,
        metadata: { threadId: thread.id, commentId: comment.id },
      });
    }
  }

  const mentions = parseMentions(parsed.data.body);
  if (mentions.length > 0) {
    const mentionedCharacters = await prisma.character.findMany({
      where: {
        callsign: { in: mentions, mode: "insensitive" },
        userId: { not: auth.id },
      },
      select: { userId: true, callsign: true },
    });

    for (const mentioned of mentionedCharacters) {
      if (mentioned.userId === quotedAuthorId) continue;
      await createUserNotification({
        recipientId: mentioned.userId,
        actorId: auth.id,
        type: "FORUM_MENTION",
        title: `${quoterName} mentioned you in a thread`,
        body: `In “${thread.title}”.`,
        targetUrl: threadUrl,
        metadata: { threadId: thread.id, commentId: comment.id },
      });
    }
  }

  await writeAuditLog({
    action: "forum.comment.create",
    actorId: auth.id,
    targetType: "ForumComment",
    targetId: comment.id,
    metadata: { threadId: thread.id },
  });

  revalidatePath("/forums");
  revalidatePath(`/forums/${thread.category.slug}`);
  revalidatePath(`/forums/${thread.category.slug}/${thread.slug}`);
  revalidatePath(`/community/threads/${thread.slug}`);
  revalidatePath("/notifications");
  return { success: true };
}

export async function reactToThreadAction(
  threadId: string,
  reactionType: ForumReactionType,
): Promise<ActionResult> {
  const auth = await getApprovedUserForAction();
  if ("error" in auth) {
    return { success: false, error: auth.error };
  }

  const parsed = reactionSchema.safeParse({ reactionType });
  if (!parsed.success) {
    return { success: false, error: "Invalid reaction." };
  }

  const thread = await prisma.forumThread.findFirst({
    where: { id: threadId, status: "ACTIVE" },
    include: { category: { select: { slug: true } } },
  });
  if (!thread) {
    return { success: false, error: "Thread not found." };
  }

  const existing = await prisma.forumReaction.findUnique({
    where: {
      userId_threadId: { userId: auth.id, threadId },
    },
  });

  if (existing?.reactionType === parsed.data.reactionType) {
    await prisma.forumReaction.delete({ where: { id: existing.id } });
  } else if (existing) {
    await prisma.forumReaction.update({
      where: { id: existing.id },
      data: { reactionType: parsed.data.reactionType },
    });
  } else {
    await prisma.forumReaction.create({
      data: {
        userId: auth.id,
        threadId,
        reactionType: parsed.data.reactionType,
      },
    });
  }

  await recalculateThreadScore(threadId);

  await writeAuditLog({
    action: "forum.reaction",
    actorId: auth.id,
    targetType: "ForumThread",
    targetId: threadId,
    metadata: { reactionType: parsed.data.reactionType },
  });

  revalidatePath(`/forums/${thread.category.slug}/${thread.slug}`);
  return { success: true };
}

export async function reactToCommentAction(
  commentId: string,
  reactionType: ForumReactionType,
): Promise<ActionResult> {
  const auth = await getApprovedUserForAction();
  if ("error" in auth) {
    return { success: false, error: auth.error };
  }

  const parsed = reactionSchema.safeParse({ reactionType });
  if (!parsed.success) {
    return { success: false, error: "Invalid reaction." };
  }

  const comment = await prisma.forumComment.findFirst({
    where: { id: commentId, status: "ACTIVE" },
    include: {
      thread: { include: { category: { select: { slug: true } } } },
    },
  });
  if (!comment) {
    return { success: false, error: "Comment not found." };
  }

  const existing = await prisma.forumReaction.findUnique({
    where: {
      userId_commentId: { userId: auth.id, commentId },
    },
  });

  if (existing?.reactionType === parsed.data.reactionType) {
    await prisma.forumReaction.delete({ where: { id: existing.id } });
  } else if (existing) {
    await prisma.forumReaction.update({
      where: { id: existing.id },
      data: { reactionType: parsed.data.reactionType },
    });
  } else {
    await prisma.forumReaction.create({
      data: {
        userId: auth.id,
        commentId,
        reactionType: parsed.data.reactionType,
      },
    });
  }

  await recalculateCommentScore(commentId);

  await writeAuditLog({
    action: "forum.reaction",
    actorId: auth.id,
    targetType: "ForumComment",
    targetId: commentId,
    metadata: { reactionType: parsed.data.reactionType },
  });

  revalidatePath(
    `/forums/${comment.thread.category.slug}/${comment.thread.slug}`,
  );
  return { success: true };
}

export async function moderateThreadAction(
  threadId: string,
  status: ForumThreadStatus,
  pinned?: boolean,
): Promise<ActionResult> {
  const auth = await getModeratorUserForAction();
  if ("error" in auth) {
    return { success: false, error: auth.error };
  }

  const thread = await prisma.forumThread.findUnique({
    where: { id: threadId },
    include: { category: { select: { slug: true } } },
  });
  if (!thread) {
    return { success: false, error: "Thread not found." };
  }

  await prisma.forumThread.update({
    where: { id: threadId },
    data: {
      status,
      ...(pinned != null ? { pinned } : {}),
    },
  });

  await writeAuditLog({
    action: "forum.thread.moderate",
    actorId: auth.id,
    targetType: "ForumThread",
    targetId: threadId,
    metadata: { status, pinned },
  });

  revalidatePath("/forums");
  revalidatePath(`/forums/${thread.category.slug}`);
  revalidatePath(`/forums/${thread.category.slug}/${thread.slug}`);
  revalidatePath("/moderation");
  return { success: true };
}

export async function moderateCommentAction(
  commentId: string,
  status: ForumCommentStatus,
): Promise<ActionResult> {
  const auth = await getModeratorUserForAction();
  if ("error" in auth) {
    return { success: false, error: auth.error };
  }

  const comment = await prisma.forumComment.findUnique({
    where: { id: commentId },
    include: {
      thread: { include: { category: { select: { slug: true } } } },
    },
  });
  if (!comment) {
    return { success: false, error: "Comment not found." };
  }

  await prisma.forumComment.update({
    where: { id: commentId },
    data: { status },
  });

  await writeAuditLog({
    action: "forum.comment.moderate",
    actorId: auth.id,
    targetType: "ForumComment",
    targetId: commentId,
    metadata: { status },
  });

  revalidatePath(
    `/forums/${comment.thread.category.slug}/${comment.thread.slug}`,
  );
  revalidatePath("/moderation");
  return { success: true };
}

export async function createReportAction(formData: FormData): Promise<ActionResult> {
  const auth = await getApprovedUserForAction();
  if ("error" in auth) {
    return { success: false, error: auth.error };
  }

  const parsed = reportSchema.safeParse({
    targetType: formData.get("targetType"),
    targetId: formData.get("targetId"),
    reason: stripCommunityText(String(formData.get("reason") ?? ""), 5000),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid report.",
    };
  }

  const report = await prisma.moderationReport.create({
    data: {
      targetType: parsed.data.targetType,
      targetId: parsed.data.targetId,
      reason: parsed.data.reason,
      reporterId: auth.id,
      status: "Open",
    },
  });

  await writeAuditLog({
    action: "forum.report.create",
    actorId: auth.id,
    targetType: "ModerationReport",
    targetId: report.id,
    metadata: {
      reportedTargetType: parsed.data.targetType,
      reportedTargetId: parsed.data.targetId,
    },
  });

  revalidatePath("/moderation/reports");
  return { success: true };
}
