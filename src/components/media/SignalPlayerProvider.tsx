"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export interface SignalTrack {
  id: string;
  slug: string;
  title: string;
  artistName: string | null;
  albumTitle: string | null;
  albumArtist: string | null;
  trackNumber: number | null;
  description: string | null;
  mimeType: string | null;
  durationSec: number | null;
  visibility: string;
  streamUrl: string;
}

interface SignalPlayerContextValue {
  tracks: SignalTrack[];
  currentTrack: SignalTrack | null;
  currentIndex: number;
  isOpen: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  progress: number;
  duration: number;
  restricted: boolean;
  empty: boolean;
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  selectTrack: (trackId: string) => void;
  setVolume: (volume: number) => void;
  seek: (ratio: number) => void;
  refreshTracks: () => Promise<SignalTrack[] | undefined>;
}

const SignalPlayerContext = createContext<SignalPlayerContextValue | null>(null);

const OPEN_KEY = "hades.signalPlayer.open";
const VOLUME_KEY = "hades.signalPlayer.volume";
const TRACK_KEY = "hades.signalPlayer.lastTrackId";

function readInitialOpen() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(OPEN_KEY) === "1";
}

function readInitialVolume() {
  if (typeof window === "undefined") return 0.8;
  const savedVolume = localStorage.getItem(VOLUME_KEY);
  if (!savedVolume) return 0.8;
  const v = Number.parseFloat(savedVolume);
  return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0.8;
}

export function SignalPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [tracks, setTracks] = useState<SignalTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(readInitialOpen);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [restricted, setRestricted] = useState(false);
  const [volume, setVolumeState] = useState(readInitialVolume);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack = currentIndex >= 0 ? tracks[currentIndex] : null;

  const refreshTracks = useCallback(async () => {
    try {
      const res = await fetch("/api/media/tracks");
      if (!res.ok) {
        setRestricted(res.status === 403);
        setTracks([]);
        return;
      }
      const data = (await res.json()) as { tracks: SignalTrack[] };
      setTracks(data.tracks);
      setRestricted(false);
      return data.tracks;
    } catch {
      setTracks([]);
    }
  }, []);

  const setOpen = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      localStorage.setItem(OPEN_KEY, open ? "1" : "0");
    },
    [],
  );

  const toggleOpen = useCallback(() => {
    setOpen(!isOpen);
  }, [isOpen, setOpen]);

  useEffect(() => {
    localStorage.setItem(VOLUME_KEY, String(volume));
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!isOpen) return;
    const trackId = currentTrack?.id;
    const audio = audioRef.current;
    if (!trackId || !audio) return;

    setIsLoading(true);
    setProgress(0);
    setDuration(0);
    audio.src = currentTrack.streamUrl;
    audio.load();
    localStorage.setItem(TRACK_KEY, trackId);
  }, [currentTrack?.id, currentTrack?.streamUrl, isOpen]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
    };
    const onTime = () => setProgress(audio.currentTime);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentIndex((i) => (i < tracks.length - 1 ? i + 1 : i));
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    const onError = () => {
      setIsLoading(false);
      setRestricted(true);
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("error", onError);
    };
  }, [tracks.length]);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    void (async () => {
      const loaded = await refreshTracks();
      if (cancelled || !loaded?.length) return;
      const savedId = localStorage.getItem(TRACK_KEY);
      if (savedId) {
        const idx = loaded.findIndex((t) => t.id === savedId);
        if (idx >= 0) setCurrentIndex(idx);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen, refreshTracks]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    void audio.play().catch(() => setRestricted(true));
  }, [currentTrack]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
      return;
    }
    if (!currentTrack && tracks.length > 0) {
      setCurrentIndex(0);
      requestAnimationFrame(() => {
        void audioRef.current?.play().catch(() => setRestricted(true));
      });
      return;
    }
    play();
  }, [isPlaying, pause, play, currentTrack, tracks.length]);

  const selectTrack = useCallback(
    (trackId: string) => {
      const idx = tracks.findIndex((t) => t.id === trackId);
      if (idx >= 0) setCurrentIndex(idx);
    },
    [tracks],
  );

  const next = useCallback(() => {
    if (tracks.length === 0) return;
    setCurrentIndex((i) => (i < tracks.length - 1 ? i + 1 : 0));
  }, [tracks.length]);

  const previous = useCallback(() => {
    if (tracks.length === 0) return;
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    setCurrentIndex((i) => (i > 0 ? i - 1 : tracks.length - 1));
  }, [tracks.length]);

  const seek = useCallback(
    (ratio: number) => {
      const audio = audioRef.current;
      if (!audio || !duration) return;
      audio.currentTime = Math.max(0, Math.min(duration, ratio * duration));
    },
    [duration],
  );

  const value = useMemo<SignalPlayerContextValue>(
    () => ({
      tracks,
      currentTrack,
      currentIndex,
      isOpen,
      isPlaying,
      isLoading,
      volume,
      progress,
      duration,
      restricted,
      empty: tracks.length === 0,
      setOpen,
      toggleOpen,
      play,
      pause,
      togglePlay,
      next,
      previous,
      selectTrack,
      setVolume: setVolumeState,
      seek,
      refreshTracks,
    }),
    [
      tracks,
      currentTrack,
      currentIndex,
      isOpen,
      isPlaying,
      isLoading,
      volume,
      progress,
      duration,
      restricted,
      setOpen,
      toggleOpen,
      play,
      pause,
      togglePlay,
      next,
      previous,
      selectTrack,
      seek,
      refreshTracks,
    ],
  );

  return (
    <SignalPlayerContext.Provider value={value}>
      <audio ref={audioRef} preload="none" />
      {children}
    </SignalPlayerContext.Provider>
  );
}

export function useSignalPlayer() {
  const ctx = useContext(SignalPlayerContext);
  if (!ctx) throw new Error("useSignalPlayer must be used within SignalPlayerProvider");
  return ctx;
}
