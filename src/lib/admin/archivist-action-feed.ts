export type ArchivistFeedStatus =
  | "pending"
  | "needs_review"
  | "flagged"
  | "approved"
  | "rejected"
  | "completed";

export type ArchivistFeedPriority = "low" | "normal" | "high" | "urgent";

export type ArchivistQuickActionType =
  | "approve"
  | "reject"
  | "request_revision"
  | "mark_safe"
  | "hide"
  | "feature"
  | "grant_reward"
  | "archive"
  | "open";

export interface ArchivistQuickAction {
  action: ArchivistQuickActionType;
  label: string;
  requiresNote?: boolean;
  dangerous?: boolean;
}

export interface ArchivistActionFeedItem {
  id: string;
  sourceType: string;
  sourceId: string;
  title: string;
  summary: string;
  status: ArchivistFeedStatus;
  priority: ArchivistFeedPriority;
  category: string;
  createdAt: Date;
  actorName?: string;
  targetUrl?: string;
  actions: ArchivistQuickAction[];
}

export interface ArchivistFeedStats {
  total: number;
  urgent: number;
  netNeighbors: number;
  archive: number;
  mmoDeadDrops: number;
  moderation: number;
  community: number;
  media: number;
  other: number;
}

export function archivistFeedItemKey(sourceType: string, sourceId: string): string {
  return `${sourceType}:${sourceId}`;
}
