"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { updateSpotifyPlaylistAction } from "@/lib/actions/profile";

interface SpotifyPlaylistFormProps {
  currentUrl: string | null;
}

export function SpotifyPlaylistForm({ currentUrl }: SpotifyPlaylistFormProps) {
  const router = useRouter();
  const [url, setUrl] = useState(currentUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.set("playlistUrl", url);

    startTransition(async () => {
      const result = await updateSpotifyPlaylistAction(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setSuccess(url.trim() ? "Playlist linked to dossier." : "Playlist removed.");
      router.refresh();
    });
  }

  function handleClear() {
    setUrl("");
    setError(null);
    setSuccess(null);
    const formData = new FormData();
    formData.set("playlistUrl", "");
    startTransition(async () => {
      const result = await updateSpotifyPlaylistAction(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setSuccess("Playlist removed.");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="spotify-playlist" className="font-mono text-xs tracking-wider uppercase">
          Spotify Playlist
        </Label>
        <Input
          id="spotify-playlist"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://open.spotify.com/playlist/..."
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          Paste a public Spotify playlist link to display it on your dossier.
        </p>
      </div>
      {error && <SystemAlert title="Link Rejected" message={error} variant="error" />}
      {success && <SystemAlert title="Signal Synced" message={success} variant="success" />}
      <div className="flex flex-wrap gap-2">
        <CommandButton type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Playlist"}
        </CommandButton>
        {currentUrl && (
          <CommandButton type="button" variant="ghost" disabled={isPending} onClick={handleClear}>
            Clear
          </CommandButton>
        )}
      </div>
    </form>
  );
}
