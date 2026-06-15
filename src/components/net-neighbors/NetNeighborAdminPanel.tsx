"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { NetNeighborGeneratedBanner } from "@/components/net-neighbors/NetNeighborGeneratedBanner";
import { CommandButton } from "@/components/terminal/CommandButton";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import {
  reviewNetNeighborAction,
  updateNetNeighborOrderAction,
} from "@/lib/actions/net-neighbors";
import type { NetNeighborBannerStyle } from "@/lib/net-neighbors/banner-builder";
import styles from "./net-neighbors.module.css";

interface PendingNeighbor {
  id: string;
  title: string;
  url: string;
  description: string | null;
  tags: string[];
  submitterNote: string | null;
  bannerPath: string | null;
  bannerStyle: NetNeighborBannerStyle | null;
  submittedBy: { id: string; name: string | null; email: string } | null;
}

interface ApprovedNeighbor {
  id: string;
  title: string;
  url: string;
  sortOrder: number;
  bannerPath: string | null;
  bannerStyle: NetNeighborBannerStyle | null;
  submittedBy: { id: string; name: string | null; email: string } | null;
}

interface NetNeighborAdminPanelProps {
  pendingNeighbors: PendingNeighbor[];
  approvedNeighbors: ApprovedNeighbor[];
}

export function NetNeighborAdminPanel({
  pendingNeighbors,
  approvedNeighbors: initialApproved,
}: NetNeighborAdminPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [approved, setApproved] = useState(initialApproved);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  function review(id: string, status: "APPROVED" | "REJECTED" | "HIDDEN") {
    setError(null);
    startTransition(async () => {
      const result = await reviewNetNeighborAction(id, status);
      if (!result.success) setError(result.error);
      else router.refresh();
    });
  }

  function saveOrder(next: ApprovedNeighbor[]) {
    setError(null);
    startTransition(async () => {
      const result = await updateNetNeighborOrderAction(
        next.map((n, i) => ({ id: n.id, sortOrder: i })),
      );
      if (!result.success) {
        setError(result.error);
        setApproved(initialApproved);
      } else {
        router.refresh();
      }
    });
  }

  function handleDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const from = approved.findIndex((n) => n.id === dragId);
    const to = approved.findIndex((n) => n.id === targetId);
    if (from < 0 || to < 0) return;
    const next = [...approved];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setApproved(next);
    setDragId(null);
    setDragOverId(null);
    saveOrder(next);
  }

  return (
    <div className="space-y-8">
      {error && <SystemAlert title="Action Failed" message={error} variant="error" />}

      <div className="space-y-4">
        <h2 className="font-mono text-sm tracking-wider uppercase">Pending Submissions</h2>
        {pendingNeighbors.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending banner submissions.</p>
        ) : (
          pendingNeighbors.map((n) => (
            <div key={n.id} className="border border-border/50 p-4">
              <div className="mb-3 flex flex-wrap items-start gap-4">
                {n.bannerPath ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/api/net-neighbors/banners/${n.id}`}
                    alt=""
                    width={88}
                    height={31}
                    className="border border-border/40"
                    style={{ imageRendering: "pixelated" }}
                  />
                ) : n.bannerStyle ? (
                  <NetNeighborGeneratedBanner style={n.bannerStyle} />
                ) : null}
                <div>
                  <p className="font-mono text-primary">{n.title}</p>
                  <a
                    href={n.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary"
                  >
                    {n.url}
                  </a>
                  {n.description && (
                    <p className="mt-1 text-xs text-muted-foreground">{n.description}</p>
                  )}
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                    by {n.submittedBy?.name ?? n.submittedBy?.email ?? "unknown"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <CommandButton size="sm" disabled={isPending} onClick={() => review(n.id, "APPROVED")}>
                  Approve
                </CommandButton>
                <CommandButton
                  size="sm"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => review(n.id, "REJECTED")}
                >
                  Reject
                </CommandButton>
                <CommandButton
                  size="sm"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => review(n.id, "HIDDEN")}
                >
                  Hide
                </CommandButton>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="space-y-4">
        <h2 className="font-mono text-sm tracking-wider uppercase">
          Approved Wall Order (drag to reorder)
        </h2>
        {approved.length === 0 ? (
          <p className="text-sm text-muted-foreground">No approved banners yet.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {approved.map((n) => (
              <div
                key={n.id}
                draggable
                onDragStart={() => setDragId(n.id)}
                onDragEnd={() => {
                  setDragId(null);
                  setDragOverId(null);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverId(n.id);
                }}
                onDragLeave={() => setDragOverId(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(n.id);
                }}
                className={`${styles.dragCard} border border-border/50 bg-black/40 p-2 ${
                  dragOverId === n.id ? styles.dragOver : ""
                }`}
              >
                {n.bannerPath ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/api/net-neighbors/banners/${n.id}`}
                    alt=""
                    width={88}
                    height={31}
                    style={{ imageRendering: "pixelated" }}
                  />
                ) : n.bannerStyle ? (
                  <NetNeighborGeneratedBanner style={n.bannerStyle} />
                ) : (
                  <span className="font-mono text-[8px]">{n.title}</span>
                )}
                <p className="mt-1 max-w-[88px] truncate font-mono text-[9px] text-muted-foreground">
                  {n.title}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
