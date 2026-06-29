import {
  getCommunityHubStats,
  getPendingCommunitySubmissions,
} from "@/lib/queries/community";
import { prisma } from "@/lib/prisma";

async function countPendingCommunitySubmissions() {
  return prisma.communitySubmission.count({ where: { status: "PENDING" } });
}

export async function getCommunityAdminStats() {
  const [
    hubStats,
    pendingSubmissions,
    pendingVolunteerResponses,
    pendingGuilds,
    pendingLore,
    openReports,
  ] = await Promise.all([
    getCommunityHubStats(),
    countPendingCommunitySubmissions(),
    prisma.volunteerResponse.count({ where: { status: "PENDING" } }),
    prisma.guild.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.loreSubmission.count({ where: { status: "SUBMITTED" } }),
    prisma.moderationReport.count({
      where: {
        status: { in: ["Open", "Reviewing"] },
        targetType: { startsWith: "forum_" },
      },
    }),
  ]);

  return {
    ...hubStats,
    pendingSubmissions,
    pendingVolunteerResponses,
    pendingGuilds,
    pendingLore,
    openForumReports: openReports,
  };
}

export async function getCommunityAdminQueue() {
  const [submissions, volunteerResponses, guilds, lore] = await Promise.all([
    getPendingCommunitySubmissions(),
    prisma.volunteerResponse.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        opportunity: { select: { title: true, slug: true, lane: true } },
      },
    }),
    prisma.guild.findMany({
      where: { status: "PENDING_REVIEW" },
      orderBy: { createdAt: "asc" },
      include: {
        founder: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.loreSubmission.findMany({
      where: { status: "SUBMITTED" },
      orderBy: { createdAt: "asc" },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    }),
  ]);

  return {
    submissions,
    volunteerResponses,
    guilds,
    lore,
  };
}
