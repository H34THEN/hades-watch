"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { describeUploadHttpError } from "@/lib/media/upload-errors";
import { VISIBILITY_LABELS } from "@/lib/media/visibility";
import type { MediaAlbum } from "@/generated/prisma/client";

interface MediaUploadFormProps {
  albums: MediaAlbum[];
}

async function uploadViaApi(formData: FormData) {
  const response = await fetch("/api/media/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  let payload: { success?: boolean; error?: string; trackId?: string } | null = null;
  try {
    payload = (await response.json()) as { success?: boolean; error?: string; trackId?: string };
  } catch {
    payload = null;
  }

  if (!response.ok || !payload?.success) {
    return {
      success: false as const,
      error: describeUploadHttpError(response.status, payload ?? undefined),
    };
  }

  return { success: true as const, trackId: payload.trackId };
}

export function MediaUploadForm({ albums }: MediaUploadFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const albumId = String(formData.get("albumId") ?? "").trim();
    const newAlbumTitle = String(formData.get("newAlbumTitle") ?? "").trim();
    if (albumId && newAlbumTitle) {
      setError("Choose either an existing album or type a new album name — not both.");
      setSuccess(false);
      return;
    }

    const audio = formData.get("audio");
    if (!(audio instanceof File) || audio.size === 0) {
      setError("Audio file is required.");
      setSuccess(false);
      return;
    }

    startTransition(async () => {
      const result = await uploadViaApi(formData);
      if (!result.success) {
        setError(result.error);
        setSuccess(false);
        return;
      }
      setError(null);
      setSuccess(true);
      form.reset();
      router.refresh();
    });
  }

  return (
    <TerminalPanel title="signal.upload">
      {error && <SystemAlert title="Upload Failed" message={error} variant="error" className="mb-4" />}
      {success && (
        <SystemAlert
          title="Signal Filed"
          message="Track uploaded to the Owner Signal Deck. Open /admin/media to preview or use the Signal Player."
          variant="success"
          className="mb-4"
        />
      )}
      <form ref={formRef} onSubmit={onSubmit} className="space-y-4" encType="multipart/form-data">
        <div>
          <label className="mb-1 block font-mono text-[10px] text-muted-foreground uppercase">
            Audio file (.mp3, .m4a, .wav, .ogg · max 50 MB)
          </label>
          <input
            name="audio"
            type="file"
            accept=".mp3,.m4a,.wav,.ogg,audio/mpeg,audio/*"
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
              placeholder="Salt on the Tongue Fixed"
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

        <div className="rounded border border-border/40 p-4">
          <p className="mb-3 font-mono text-[10px] tracking-widest text-primary/80 uppercase">
            Album (optional)
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-mono text-[10px] text-muted-foreground uppercase">
                Select existing album
              </label>
              <select
                name="albumId"
                defaultValue=""
                className="w-full rounded border border-border/50 bg-background px-2 py-1.5 font-mono text-sm"
              >
                <option value="">No album / unassigned track</option>
                {albums.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block font-mono text-[10px] text-muted-foreground uppercase">
                Or type new album name
              </label>
              <input
                name="newAlbumTitle"
                placeholder="Album One"
                className="w-full rounded border border-border/50 bg-background px-2 py-1.5 font-mono text-sm"
              />
            </div>
          </div>
          <p className="mt-2 font-mono text-[10px] text-muted-foreground">
            Use one option only. Leave both empty for a standalone track.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-mono text-[10px] text-muted-foreground uppercase">
                New album artist (optional)
              </label>
              <input
                name="newAlbumArtistName"
                placeholder="Heathen"
                className="w-full rounded border border-border/50 bg-background px-2 py-1.5 font-mono text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-[10px] text-muted-foreground uppercase">
                Track number
              </label>
              <input
                name="trackNumber"
                type="number"
                min={1}
                placeholder="1"
                className="w-full rounded border border-border/50 bg-background px-2 py-1.5 font-mono text-sm"
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="mb-1 block font-mono text-[10px] text-muted-foreground uppercase">
              New album description (optional)
            </label>
            <input
              name="newAlbumDescription"
              placeholder="Chthonic Broadcast · Suno album"
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
            {isPending ? "Uploading Signal..." : "Upload Signal"}
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
