"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import styles from "@/components/community/community.module.css";
import {
  reactToCommentAction,
  reactToThreadAction,
} from "@/lib/actions/forums";
import type { ForumReactionType } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

const REACTION_LABELS: Record<ForumReactionType, string> = {
  SIGNAL_BOOST: "Boost",
  USEFUL: "Useful",
  LOREFUL: "Loreful",
  NEEDS_CARE: "Needs Care",
  THANKS: "Thanks",
};

const REACTION_TYPES: ForumReactionType[] = [
  "SIGNAL_BOOST",
  "USEFUL",
  "LOREFUL",
  "NEEDS_CARE",
  "THANKS",
];

interface ForumReactionButtonsProps {
  targetType: "thread" | "comment";
  targetId: string;
  reactions: { reactionType: string; userId: string }[];
  currentUserId?: string | null;
}

export function ForumReactionButtons({
  targetType,
  targetId,
  reactions,
  currentUserId,
}: ForumReactionButtonsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const userReaction = currentUserId
    ? reactions.find((reaction) => reaction.userId === currentUserId)?.reactionType
    : undefined;

  function handleReact(reactionType: ForumReactionType) {
    if (!currentUserId) return;

    startTransition(async () => {
      const result =
        targetType === "thread"
          ? await reactToThreadAction(targetId, reactionType)
          : await reactToCommentAction(targetId, reactionType);

      if (result.success) {
        router.refresh();
      }
    });
  }

  const counts = REACTION_TYPES.reduce<Partial<Record<ForumReactionType, number>>>(
    (acc, type) => {
      acc[type] = reactions.filter((reaction) => reaction.reactionType === type).length;
      return acc;
    },
    {},
  );

  return (
    <div className={styles.reactionBar} aria-label="Signal reactions">
      {REACTION_TYPES.map((type) => {
        const count = counts[type] ?? 0;
        const active = userReaction === type;
        return (
          <button
            key={type}
            type="button"
            disabled={!currentUserId || isPending}
            onClick={() => handleReact(type)}
            className={cn(
              styles.reactionButton,
              active && styles.reactionButtonActive,
              !currentUserId && "cursor-not-allowed opacity-60",
            )}
            title={currentUserId ? REACTION_LABELS[type] : "Sign in to react"}
          >
            {REACTION_LABELS[type]}
            {count > 0 ? ` (${count})` : ""}
          </button>
        );
      })}
    </div>
  );
}
