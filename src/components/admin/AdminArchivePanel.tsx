"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CommandButton } from "@/components/terminal/CommandButton";
import {
  setArchiveCommentHiddenAction,
  setArchiveItemStatusAction,
} from "@/lib/actions/archive-items";
import type { ArchiveItemStatus } from "@/generated/prisma/client";

interface AdminArchiveItem {
  id: string;
  slug: string;
  type: string;
  status: ArchiveItemStatus;
  title: string;
  sourceUrl: string;
  createdAt: Date;
  submittedBy: { name: string | null; email: string } | null;
  _count: { comments: number };
}

export function AdminArchivePanel({ items }: { items: AdminArchiveItem[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function updateStatus(id: string, status: ArchiveItemStatus) {
    startTransition(async () => {
      await setArchiveItemStatusAction(id, status);
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="font-mono text-sm text-muted-foreground">No archive items filed.</p>
      ) : (
        items.map((item) => {
          const section =
            item.type === "ARTICLE" ? "/archive/state-of-affairs" : "/archive/ghost-in-tech";
          return (
            <div key={item.id} className="rounded border border-border/40 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-[10px] uppercase text-muted-foreground">
                    {item.type} · {item.status}
                  </p>
                  <p className="font-mono text-sm font-semibold text-primary">{item.title}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {item.submittedBy?.email ?? "system"} · {item._count.comments} comments
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  <Link href={`${section}/${item.slug}`}>
                    <CommandButton size="sm" variant="outline">
                      Open
                    </CommandButton>
                  </Link>
                  <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <CommandButton size="sm" variant="outline">
                      Source
                    </CommandButton>
                  </a>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {(["PUBLISHED", "HIDDEN", "REMOVED", "PENDING_REVIEW"] as ArchiveItemStatus[]).map(
                  (status) => (
                    <CommandButton
                      key={status}
                      size="sm"
                      variant={item.status === status ? "default" : "outline"}
                      disabled={isPending || item.status === status}
                      onClick={() => updateStatus(item.id, status)}
                    >
                      {status}
                    </CommandButton>
                  ),
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export function AdminArchiveCommentToggle({
  commentId,
  isHidden,
}: {
  commentId: string;
  isHidden: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <CommandButton
      size="sm"
      variant="outline"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await setArchiveCommentHiddenAction(commentId, !isHidden);
          router.refresh();
        })
      }
    >
      {isHidden ? "Unhide" : "Hide"}
    </CommandButton>
  );
}
