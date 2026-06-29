import type {
  CommunitySubmissionStatus,
  ForumCommentStatus,
  ForumThreadStatus,
  GuildStatus,
  GuildVisibility,
  LoreSubmissionStatus,
  VolunteerOpportunityStatus,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const authorSelect = {
  id: true,
  name: true,
  email: true,
  character: { select: { callsign: true, archetype: true } },
} as const;

export async function getForumCategories() {
  return prisma.forumCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { threads: { where: { status: "ACTIVE" } } } },
    },
  });
}

export async function getForumCategoryBySlug(slug: string) {
  return prisma.forumCategory.findUnique({
    where: { slug },
    include: {
      _count: { select: { threads: { where: { status: "ACTIVE" } } } },
    },
  });
}

export async function getForumThreads(
  categoryId: string,
  sort: "newest" | "active" | "top" = "active",
) {
  const orderBy =
    sort === "newest"
      ? { createdAt: "desc" as const }
      : sort === "top"
        ? [{ pinned: "desc" as const }, { score: "desc" as const }]
        : [{ pinned: "desc" as const }, { lastActivityAt: "desc" as const }];

  return prisma.forumThread.findMany({
    where: {
      categoryId,
      status: { in: ["ACTIVE", "LOCKED", "ARCHIVED"] satisfies ForumThreadStatus[] },
    },
    orderBy,
    include: {
      author: { select: authorSelect },
      category: { select: { slug: true, name: true } },
      _count: { select: { comments: { where: { status: "ACTIVE" } } } },
    },
  });
}

export async function getForumThreadBySlug(slug: string) {
  return prisma.forumThread.findUnique({
    where: { slug },
    include: {
      category: true,
      author: { select: authorSelect },
      reactions: {
        select: { reactionType: true, userId: true },
      },
    },
  });
}

export async function getForumComments(threadId: string) {
  return prisma.forumComment.findMany({
    where: {
      threadId,
      status: { in: ["ACTIVE"] satisfies ForumCommentStatus[] },
    },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: authorSelect },
      reactions: {
        select: { reactionType: true, userId: true },
      },
    },
  });
}

export async function getUserCommunitySubmissions(userId: string) {
  return prisma.communitySubmission.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPendingCommunitySubmissions() {
  return prisma.communitySubmission.findMany({
    where: { status: "PENDING" satisfies CommunitySubmissionStatus },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: authorSelect },
    },
  });
}

export async function getVolunteerOpportunities(
  status?: VolunteerOpportunityStatus | VolunteerOpportunityStatus[],
) {
  const statuses = status == null ? undefined : Array.isArray(status) ? status : [status];

  return prisma.volunteerOpportunity.findMany({
    where: statuses ? { status: { in: statuses } } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: { select: authorSelect },
      _count: { select: { responses: true } },
    },
  });
}

export async function getVolunteerOpportunityBySlug(slug: string) {
  return prisma.volunteerOpportunity.findUnique({
    where: { slug },
    include: {
      createdBy: { select: authorSelect },
      responses: {
        include: {
          user: { select: authorSelect },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getUserVolunteerResponses(userId: string) {
  return prisma.volunteerResponse.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      opportunity: {
        select: { id: true, title: true, slug: true, lane: true, status: true },
      },
    },
  });
}

export async function getApprovedGuilds(options?: {
  viewerUserId?: string | null;
  viewerIsApproved?: boolean;
}) {
  const viewerIsApproved = options?.viewerIsApproved ?? Boolean(options?.viewerUserId);

  const visibilityFilter: GuildVisibility[] = viewerIsApproved
    ? ["PUBLIC", "APPROVED_USERS"]
    : ["PUBLIC"];

  return prisma.guild.findMany({
    where: {
      status: "APPROVED" satisfies GuildStatus,
      visibility: { in: visibilityFilter },
    },
    orderBy: { createdAt: "desc" },
    include: {
      founder: { select: authorSelect },
      _count: {
        select: {
          memberships: { where: { status: "APPROVED" } },
        },
      },
    },
  });
}

export async function getGuildBySlug(slug: string) {
  return prisma.guild.findUnique({
    where: { slug },
    include: {
      founder: { select: authorSelect },
      memberships: {
        include: {
          user: { select: authorSelect },
        },
        orderBy: [{ status: "asc" }, { createdAt: "asc" }],
      },
      _count: { select: { lorePieces: true } },
    },
  });
}

export async function getUserGuildMemberships(userId: string) {
  return prisma.guildMembership.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      guild: {
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          visibility: true,
          bannerGlyph: true,
        },
      },
    },
  });
}

export async function getPublicRecognitions(limit = 20) {
  return prisma.playerRecognition.findMany({
    where: { isPublic: true, revoked: false },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      recipient: { select: authorSelect },
      grantedBy: { select: authorSelect },
    },
  });
}

export async function getUserRecognitions(userId: string) {
  return prisma.playerRecognition.findMany({
    where: { recipientId: userId, revoked: false },
    orderBy: { createdAt: "desc" },
    include: {
      grantedBy: { select: authorSelect },
    },
  });
}

export async function getRecentLoreSubmissions(authorId: string, limit = 10) {
  return prisma.loreSubmission.findMany({
    where: {
      authorId,
      status: {
        notIn: ["DRAFT"] satisfies LoreSubmissionStatus[],
      },
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      guild: { select: { name: true, slug: true } },
    },
  });
}

export async function getCommunityHubStats() {
  const [
    forumCategories,
    activeThreads,
    pendingSubmissions,
    openVolunteerOps,
    approvedGuilds,
    publicRecognitions,
    loreSubmissions,
  ] = await Promise.all([
    prisma.forumCategory.count({ where: { isActive: true } }),
    prisma.forumThread.count({ where: { status: "ACTIVE" } }),
    prisma.communitySubmission.count({ where: { status: "PENDING" } }),
    prisma.volunteerOpportunity.count({
      where: { status: { in: ["OPEN", "CLAIMED", "IN_PROGRESS"] } },
    }),
    prisma.guild.count({ where: { status: "APPROVED" } }),
    prisma.playerRecognition.count({ where: { isPublic: true, revoked: false } }),
    prisma.loreSubmission.count({
      where: { status: { in: ["SUBMITTED", "APPROVED"] } },
    }),
  ]);

  return {
    forumCategories,
    activeThreads,
    pendingSubmissions,
    openVolunteerOps,
    approvedGuilds,
    publicRecognitions,
    loreSubmissions,
  };
}
