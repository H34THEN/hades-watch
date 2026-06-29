import { prisma } from "@/lib/prisma";
import type {
  ArchivistActionFeedItem,
  ArchivistFeedStats,
} from "@/lib/admin/archivist-action-feed";

function actorLabel(name: string | null | undefined, email: string): string {
  return name ?? email.split("@")[0] ?? "Unknown";
}

export async function getArchivistActionFeed(): Promise<{
  items: ArchivistActionFeedItem[];
  stats: ArchivistFeedStats;
}> {
  const items: ArchivistActionFeedItem[] = [];

  const [
    netNeighbors,
    archivePending,
    mmoSubmissions,
    playSubmissions,
    modReports,
    communitySubs,
    volunteerResponses,
    guildsPending,
    loreSubmissions,
    avatarForgePending,
    factionRequests,
  ] = await Promise.all([
    prisma.netNeighbor.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      take: 50,
      include: { submittedBy: { select: { name: true, email: true } } },
    }),
    prisma.archiveItem.findMany({
      where: { status: "PENDING_REVIEW" },
      orderBy: { createdAt: "asc" },
      take: 50,
      include: { submittedBy: { select: { name: true, email: true } } },
    }),
    prisma.mmoDeadDropSubmission.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      take: 50,
      include: {
        deadDrop: { select: { title: true, slug: true } },
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.mmoPlayableSubmission.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      take: 50,
      include: {
        prompt: { select: { title: true, slug: true, functionSlug: true } },
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.moderationReport.findMany({
      where: { status: { in: ["Open", "Reviewing"] } },
      orderBy: { createdAt: "asc" },
      take: 50,
      include: { reporter: { select: { name: true, email: true } } },
    }),
    prisma.communitySubmission.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      take: 30,
      include: { author: { select: { name: true, email: true } } },
    }),
    prisma.volunteerResponse.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      take: 30,
      include: {
        user: { select: { name: true, email: true } },
        opportunity: { select: { title: true, slug: true } },
      },
    }),
    prisma.guild.findMany({
      where: { status: "PENDING_REVIEW" },
      orderBy: { createdAt: "asc" },
      take: 20,
      include: { founder: { select: { name: true, email: true } } },
    }),
    prisma.loreSubmission.findMany({
      where: { status: "SUBMITTED" },
      orderBy: { createdAt: "asc" },
      take: 20,
      include: { author: { select: { name: true, email: true } } },
    }),
    prisma.avatarForgeAccessRequest.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      take: 20,
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.factionMembership.findMany({
      where: { status: "Pending" },
      orderBy: { createdAt: "asc" },
      take: 20,
      include: {
        user: { select: { name: true, email: true } },
        faction: { select: { name: true, slug: true } },
      },
    }),
  ]);

  for (const n of netNeighbors) {
    items.push({
      id: `net_neighbor:${n.id}`,
      sourceType: "net_neighbor",
      sourceId: n.id,
      title: n.title,
      summary: n.description?.slice(0, 160) ?? n.url,
      status: "pending",
      priority: "normal",
      category: "Net Neighbors",
      createdAt: n.createdAt,
      actorName: n.submittedBy
        ? actorLabel(n.submittedBy.name, n.submittedBy.email)
        : undefined,
      targetUrl: "/admin/net-neighbors",
      actions: [
        { action: "approve", label: "Approve" },
        { action: "reject", label: "Reject", dangerous: true },
        { action: "open", label: "Open Review" },
      ],
    });
  }

  for (const a of archivePending) {
    items.push({
      id: `archive_item:${a.id}`,
      sourceType: "archive_item",
      sourceId: a.id,
      title: a.title,
      summary: a.summary?.slice(0, 160) ?? `${a.type} submission pending review`,
      status: "needs_review",
      priority: "normal",
      category: a.type === "CODE_REPO" ? "Ghost in Tech" : "State of Affairs",
      createdAt: a.createdAt,
      actorName: a.submittedBy
        ? actorLabel(a.submittedBy.name, a.submittedBy.email)
        : undefined,
      targetUrl: "/admin/archive",
      actions: [
        { action: "approve", label: "Publish" },
        { action: "reject", label: "Remove", dangerous: true },
        { action: "open", label: "Open Archive Admin" },
      ],
    });
  }

  for (const s of mmoSubmissions) {
    items.push({
      id: `mmo_dead_drop_submission:${s.id}`,
      sourceType: "mmo_dead_drop_submission",
      sourceId: s.id,
      title: s.deadDrop.title,
      summary: s.summary?.slice(0, 160) ?? s.body?.slice(0, 160) ?? "Dead Drop submission pending review",
      status: "pending",
      priority: "normal",
      category: "Dead Drops",
      createdAt: s.createdAt,
      actorName: actorLabel(s.user.name, s.user.email),
      targetUrl: "/admin/mmo-submissions",
      actions: [
        { action: "approve", label: "Approve" },
        { action: "reject", label: "Reject", dangerous: true },
        { action: "request_revision", label: "Request Revision", requiresNote: true },
        { action: "open", label: "Open MMO Submissions" },
      ],
    });
  }

  for (const s of playSubmissions) {
    items.push({
      id: `play_submission:${s.id}`,
      sourceType: "play_submission",
      sourceId: s.id,
      title: s.prompt.title,
      summary: s.body?.slice(0, 160) ?? `${s.prompt.functionSlug} submission pending review`,
      status: "pending",
      priority: "normal",
      category: "Expanded Play",
      createdAt: s.createdAt,
      actorName: actorLabel(s.user.name, s.user.email),
      targetUrl: "/mmo/play",
      actions: [
        { action: "approve", label: "Approve" },
        { action: "reject", label: "Reject", dangerous: true },
        { action: "request_revision", label: "Request Revision", requiresNote: true },
        { action: "open", label: "Open Play Hub" },
      ],
    });
  }

  for (const r of modReports) {
    items.push({
      id: `moderation_report:${r.id}`,
      sourceType: "moderation_report",
      sourceId: r.id,
      title: `${r.targetType} report`,
      summary: r.reason?.slice(0, 160) ?? "Moderation report requires attention",
      status: r.status === "Reviewing" ? "needs_review" : "flagged",
      priority: "high",
      category: "Moderation",
      createdAt: r.createdAt,
      actorName: r.reporter ? actorLabel(r.reporter.name, r.reporter.email) : undefined,
      targetUrl: `/moderation/reports/${r.id}`,
      actions: [{ action: "open", label: "Open Report" }],
    });
  }

  for (const c of communitySubs) {
    items.push({
      id: `community_submission:${c.id}`,
      sourceType: "community_submission",
      sourceId: c.id,
      title: c.title,
      summary: c.description?.slice(0, 160) ?? "Community builder submission",
      status: "pending",
      priority: "normal",
      category: "Community Builder",
      createdAt: c.createdAt,
      actorName: actorLabel(c.author.name, c.author.email),
      targetUrl: "/admin/community",
      actions: [
        { action: "approve", label: "Approve" },
        { action: "reject", label: "Reject", dangerous: true },
        { action: "open", label: "Open Community Admin" },
      ],
    });
  }

  for (const v of volunteerResponses) {
    items.push({
      id: `volunteer_response:${v.id}`,
      sourceType: "volunteer_response",
      sourceId: v.id,
      title: v.opportunity.title,
      summary: v.message?.slice(0, 160) ?? "Volunteer response pending review",
      status: "pending",
      priority: "normal",
      category: "Volunteer",
      createdAt: v.createdAt,
      actorName: actorLabel(v.user.name, v.user.email),
      targetUrl: "/admin/community",
      actions: [
        { action: "approve", label: "Approve" },
        { action: "reject", label: "Reject", dangerous: true },
        { action: "open", label: "Open Community Admin" },
      ],
    });
  }

  for (const g of guildsPending) {
    items.push({
      id: `guild:${g.id}`,
      sourceType: "guild",
      sourceId: g.id,
      title: g.name,
      summary: g.description?.slice(0, 160) ?? "Guild pending review",
      status: "pending",
      priority: "normal",
      category: "Guilds",
      createdAt: g.createdAt,
      actorName: g.founder ? actorLabel(g.founder.name, g.founder.email) : undefined,
      targetUrl: "/admin/community",
      actions: [{ action: "open", label: "Open Community Admin" }],
    });
  }

  for (const l of loreSubmissions) {
    items.push({
      id: `lore_submission:${l.id}`,
      sourceType: "lore_submission",
      sourceId: l.id,
      title: l.title,
      summary: l.body?.slice(0, 160) ?? "Lore submission awaiting Archivist review",
      status: "needs_review",
      priority: "normal",
      category: "Lore",
      createdAt: l.createdAt,
      actorName: actorLabel(l.author.name, l.author.email),
      targetUrl: "/admin/community",
      actions: [{ action: "open", label: "Open Community Admin" }],
    });
  }

  for (const a of avatarForgePending) {
    items.push({
      id: `avatar_forge_access:${a.id}`,
      sourceType: "avatar_forge_access",
      sourceId: a.id,
      title: "Avatar Forge access request",
      summary: "Pending avatar forge access review",
      status: "pending",
      priority: "normal",
      category: "Avatar Forge",
      createdAt: a.createdAt,
      actorName: actorLabel(a.user.name, a.user.email),
      targetUrl: "/admin/avatar-forge-access",
      actions: [
        { action: "approve", label: "Approve" },
        { action: "reject", label: "Reject", dangerous: true },
        { action: "open", label: "Open Forge Admin" },
      ],
    });
  }

  for (const f of factionRequests) {
    items.push({
      id: `faction_membership:${f.id}`,
      sourceType: "faction_membership",
      sourceId: f.id,
      title: `${f.faction.name} join request`,
      summary: "Faction join request pending admin review",
      status: "pending",
      priority: "normal",
      category: "Factions",
      createdAt: f.createdAt,
      actorName: actorLabel(f.user.name, f.user.email),
      targetUrl: "/admin/faction-requests",
      actions: [{ action: "open", label: "Open Faction Requests" }],
    });
  }

  items.sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
    const pd = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (pd !== 0) return pd;
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  const stats: ArchivistFeedStats = {
    total: items.length,
    urgent: items.filter((i) => i.priority === "urgent").length,
    netNeighbors: netNeighbors.length,
    archive: archivePending.length,
    mmoDeadDrops: mmoSubmissions.length,
    moderation: modReports.length,
    community:
      communitySubs.length + volunteerResponses.length + guildsPending.length + loreSubmissions.length,
    media: 0,
    other: avatarForgePending.length + factionRequests.length,
  };

  return { items, stats };
}
