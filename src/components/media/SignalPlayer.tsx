"use client";

import { CommandButton } from "@/components/terminal/CommandButton";
import { useSignalPlayer } from "@/components/media/SignalPlayerProvider";
import { cn } from "@/lib/utils";

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function SignalPlayer() {
  const {
    isOpen,
    toggleOpen,
    currentTrack,
    isPlaying,
    isLoading,
    empty,
    restricted,
    progress,
    duration,
    volume,
    togglePlay,
    next,
    previous,
    setVolume,
    seek,
    tracks,
    selectTrack,
  } = useSignalPlayer();

  const progressRatio = duration > 0 ? progress / duration : 0;

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={toggleOpen}
        className="fixed right-4 bottom-4 z-50 rounded border border-primary/40 bg-background/80 px-3 py-2 font-mono text-[10px] tracking-widest text-primary uppercase shadow-lg shadow-primary/10 backdrop-blur-md transition hover:border-primary hover:shadow-primary/25"
        aria-label="Open Signal Player"
      >
        Signal Player
      </button>
    );
  }

  return (
    <div
      className={cn(
        "fixed right-4 bottom-4 z-50 w-[min(100vw-2rem,22rem)] rounded border border-primary/30 bg-background/90 p-3 shadow-xl shadow-primary/15 backdrop-blur-md",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded before:bg-gradient-to-br before:from-primary/5 before:to-transparent",
      )}
    >
      <div className="relative flex items-center justify-between gap-2 border-b border-border/40 pb-2">
        <p className="font-mono text-[10px] tracking-[0.25em] text-primary uppercase">
          Signal Player
        </p>
        <button
          type="button"
          onClick={toggleOpen}
          className="font-mono text-[10px] text-muted-foreground hover:text-primary"
        >
          Collapse
        </button>
      </div>

      <div className="relative mt-3 space-y-3">
        {empty && !restricted && (
          <p className="font-mono text-xs text-muted-foreground">
            No broadcasts have been uploaded to the Underwatch.
          </p>
        )}
        {restricted && (
          <p className="font-mono text-xs text-amber-400/90">
            This signal is restricted by clearance.
          </p>
        )}
        {isLoading && (
          <p className="font-mono text-[10px] text-primary/70">Tuning Underwatch signal...</p>
        )}

        {currentTrack ? (
          <div>
            <p className="font-mono text-sm font-semibold text-foreground">{currentTrack.title}</p>
            <p className="font-mono text-[10px] text-muted-foreground">
              {currentTrack.artistName ?? currentTrack.albumArtist ?? "Chthonic Broadcast"}
              {currentTrack.albumTitle ? ` · ${currentTrack.albumTitle}` : ""}
            </p>
          </div>
        ) : (
          <p className="font-mono text-xs text-muted-foreground">No broadcast loaded</p>
        )}

        <div className="space-y-1">
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={progressRatio}
            onChange={(e) => seek(Number(e.target.value))}
            className="h-1 w-full cursor-pointer accent-primary"
            aria-label="Playback progress"
          />
          <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <CommandButton size="sm" variant="outline" onClick={previous}>
            Previous Transmission
          </CommandButton>
          <CommandButton size="sm" onClick={togglePlay} disabled={!currentTrack && tracks.length === 0}>
            {isPlaying ? "Hold Signal" : "Open Signal"}
          </CommandButton>
          <CommandButton size="sm" variant="outline" onClick={next}>
            Next Transmission
          </CommandButton>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-muted-foreground">VOL</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="h-1 flex-1 cursor-pointer accent-primary"
            aria-label="Volume"
          />
        </div>

        {tracks.length > 1 && (
          <div className="max-h-28 overflow-y-auto border-t border-border/30 pt-2">
            {tracks.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTrack(t.id)}
                className={cn(
                  "block w-full truncate py-1 text-left font-mono text-[10px] hover:text-primary",
                  currentTrack?.id === t.id ? "text-primary" : "text-muted-foreground",
                )}
              >
                {t.trackNumber ? `${t.trackNumber}. ` : ""}
                {t.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
