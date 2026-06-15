"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { uploadMediaTrackAction } from "@/lib/actions/media";
import { VISIBILITY_LABELS } from "@/lib/media/visibility";
import type { MediaAlbum } from "@/generated/prisma/client";

interface MediaUploadFormProps {
  albums: MediaAlbum[];
}

export function MediaUploadForm({ albums }: MediaUploadFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createAlbum, setCreateAlbum] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await uploadMediaTrackAction(formData);
      if (!result.success) {
        setError(result.error);
        setSuccess(false);
      } else {
        setError(null);
        setSuccess(true);
        router.refresh();
        e.currentTarget.reset();
      }
    });
  }

  return (
    <TerminalPanel title="signal.upload">
      {error && <SystemAlert title="Upload Failed" message={error} variant="error" className="mb-4" />}
      {success && (
        <SystemAlert
          title="Signal Filed"
          message="Track uploaded to the Owner Signal Deck."
          variant="success"
          className="mb-4"
        />
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block font-mono text-[10px] text-muted-foreground uppercase">
            Audio file (.mp3, .m4a, .wav, .ogg · max 50 MB)
          </label>
          <input
            name="audio"
            type="file"
            accept=".mp3,.m4a,.wav,.ogg,audio/*"
            required
            className="font-mono text-xs"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block font-mono text-[10px] text-muted-foreground uppercase">
              Title
            </label>
            <input
              name="title"
              required
              className="w-full rounded border border-border/50 bg-background px-2 py-1.5 font-mono text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] text-muted-foreground uppercase">
              Artist / display name
            </label>
            <input
              name="artistName"
              placeholder="Heathen / Slewfoot"
              className="w-full rounded border border-border/50 bg-background px-2 py-1.5 font-mono text-sm"
            />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block font-mono text-[10px] text-muted-foreground uppercase">
              Album
            </label>
            {!createAlbum ? (
              <select
                name="albumId"
                className="w-full rounded border border-border/50 bg-background px-2 py-1.5 font-mono text-sm"
              >
                <option value="">No album</option>
                {albums.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name="newAlbumTitle"
                placeholder="New album title"
                className="w-full rounded border border-border/50 bg-background px-2 py-1.5 font-mono text-sm"
              />
            )}
            <button
              type="button"
              onClick={() => setCreateAlbum((v) => !v)}
              className="mt-1 font-mono text-[10px] text-primary hover:underline"
            >
              {createAlbum ? "Select existing album" : "Create new album inline"}
            </button>
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] text-muted-foreground uppercase">
              Track number
            </label>
            <input
              name="trackNumber"
              type="number"
              min={1}
              className="w-full rounded border border-border/50 bg-background px-2 py-1.5 font-mono text-sm"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block font-mono text-[10px] text-muted-foreground uppercase">
            Lore note / description
          </label>
          <textarea
            name="description"
            rows={3}
            className="w-full rounded border border-border/50 bg-background px-2 py-1.5 font-mono text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block font-mono text-[10px] text-muted-foreground uppercase">
            Visibility
          </label>
          <select
            name="visibility"
            defaultValue="APPROVED_USERS"
            className="w-full rounded border border-border/50 bg-background px-2 py-1.5 font-mono text-sm"
          >
            {Object.entries(VISIBILITY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-3">
          <CommandButton type="submit" disabled={isPending}>
            Upload Signal
          </CommandButton>
          <Link href="/admin/media">
            <CommandButton type="button" variant="outline">
              Back to Deck
            </CommandButton>
          </Link>
        </div>
      </form>
    </TerminalPanel>
  );
}
