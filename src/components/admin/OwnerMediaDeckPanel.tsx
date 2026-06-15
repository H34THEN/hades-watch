"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CommandButton } from "@/components/terminal/CommandButton";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import {
  deleteMediaTrackAction,
  updateMediaAlbumAction,
  updateMediaTrackAction,
} from "@/lib/actions/media";
import { VISIBILITY_LABELS } from "@/lib/media/visibility";
import type { MediaAlbum, MediaTrack } from "@/generated/prisma/client";

interface OwnerMediaDeckPanelProps {
  albums: (MediaAlbum & { _count: { tracks: number } })[];
  tracks: (MediaTrack & { album: { id: string; title: string; slug: string } | null })[];
  isOwner: boolean;
}

export function OwnerMediaDeckPanel({ albums, tracks, isOwner }: OwnerMediaDeckPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(action: () => Promise<{ success: boolean; error?: string }>) {
    startTransition(async () => {
      const r = await action();
      if (!r.success) setError(r.error ?? "Action failed");
      else setError(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      {error && <SystemAlert title="Signal Deck Error" message={error} variant="error" />}

      {!isOwner && (
        <SystemAlert
          title="Read-Only Deck"
          message="Admin may review broadcasts. Owner clearance required to upload or modify signals."
          variant="warning"
        />
      )}

      <div className="flex flex-wrap gap-3">
        {isOwner && (
          <Link href="/admin/media/upload">
            <CommandButton>Upload Signal</CommandButton>
          </Link>
        )}
      </div>

      <TerminalPanel title="signal.deck.albums">
        {albums.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground">No albums filed yet.</p>
        ) : (
          <div className="space-y-3">
            {albums.map((album) => (
              <div key={album.id} className="rounded border border-border/40 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-sm font-semibold text-primary">{album.title}</p>
                    {album.artistName && (
                      <p className="text-[10px] text-muted-foreground">{album.artistName}</p>
                    )}
                    <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                      {album._count.tracks} tracks · {VISIBILITY_LABELS[album.visibility]} · order{" "}
                      {album.sortOrder}
                    </p>
                  </div>
                </div>
                {isOwner && (
                  <form
                    className="mt-3 grid gap-2 sm:grid-cols-2"
                    action={(fd) => run(() => updateMediaAlbumAction(fd))}
                  >
                    <input type="hidden" name="id" value={album.id} />
                    <input
                      name="title"
                      defaultValue={album.title}
                      className="rounded border border-border/50 bg-background px-2 py-1 font-mono text-xs"
                    />
                    <input
                      name="artistName"
                      defaultValue={album.artistName ?? ""}
                      placeholder="Artist"
                      className="rounded border border-border/50 bg-background px-2 py-1 font-mono text-xs"
                    />
                    <select
                      name="visibility"
                      defaultValue={album.visibility}
                      className="rounded border border-border/50 bg-background px-2 py-1 font-mono text-xs"
                    >
                      {Object.entries(VISIBILITY_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                    <input
                      name="sortOrder"
                      type="number"
                      defaultValue={album.sortOrder}
                      className="rounded border border-border/50 bg-background px-2 py-1 font-mono text-xs"
                    />
                    <textarea
                      name="description"
                      defaultValue={album.description ?? ""}
                      rows={2}
                      className="sm:col-span-2 rounded border border-border/50 bg-background px-2 py-1 font-mono text-xs"
                    />
                    <input name="cover" type="file" accept="image/*" className="font-mono text-[10px]" />
                    <CommandButton type="submit" size="sm" disabled={isPending}>
                      Save Album
                    </CommandButton>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </TerminalPanel>

      <TerminalPanel title="signal.deck.tracks">
        {tracks.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground">No tracks uploaded.</p>
        ) : (
          <div className="space-y-4">
            {tracks.map((track) => (
              <div key={track.id} className="rounded border border-border/40 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-sm font-semibold text-primary">{track.title}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {track.album?.title ?? "Unassigned"} · {track.mimeType ?? "audio"} ·{" "}
                      {VISIBILITY_LABELS[track.visibility]} ·{" "}
                      {track.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <audio controls preload="none" src={`/api/media/audio/${track.id}`} className="h-8 max-w-xs" />
                </div>
                {isOwner && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <form
                      className="grid flex-1 gap-2 sm:grid-cols-2"
                      action={(fd) => run(() => updateMediaTrackAction(fd))}
                    >
                      <input type="hidden" name="id" value={track.id} />
                      <input
                        name="title"
                        defaultValue={track.title}
                        className="rounded border border-border/50 bg-background px-2 py-1 font-mono text-xs"
                      />
                      <input
                        name="artistName"
                        defaultValue={track.artistName ?? ""}
                        className="rounded border border-border/50 bg-background px-2 py-1 font-mono text-xs"
                      />
                      <select
                        name="albumId"
                        defaultValue={track.albumId ?? ""}
                        className="rounded border border-border/50 bg-background px-2 py-1 font-mono text-xs"
                      >
                        <option value="">No album</option>
                        {albums.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.title}
                          </option>
                        ))}
                      </select>
                      <input
                        name="trackNumber"
                        type="number"
                        defaultValue={track.trackNumber ?? ""}
                        className="rounded border border-border/50 bg-background px-2 py-1 font-mono text-xs"
                      />
                      <select
                        name="visibility"
                        defaultValue={track.visibility}
                        className="rounded border border-border/50 bg-background px-2 py-1 font-mono text-xs"
                      >
                        {Object.entries(VISIBILITY_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>
                            {v}
                          </option>
                        ))}
                      </select>
                      <textarea
                        name="description"
                        defaultValue={track.description ?? ""}
                        rows={2}
                        className="sm:col-span-2 rounded border border-border/50 bg-background px-2 py-1 font-mono text-xs"
                      />
                      <CommandButton type="submit" size="sm" disabled={isPending}>
                        Save Track
                      </CommandButton>
                    </form>
                    <CommandButton
                      size="sm"
                      variant="outline"
                      disabled={isPending}
                      onClick={() => {
                        if (confirm(`Delete "${track.title}"? This removes the file from disk.`)) {
                          run(() => deleteMediaTrackAction(track.id));
                        }
                      }}
                    >
                      Delete
                    </CommandButton>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </TerminalPanel>
    </div>
  );
}
