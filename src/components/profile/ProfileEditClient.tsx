"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ProfileSettingsForm } from "@/components/forms/ProfileSettingsForm";
import { SandboxedProfileFrame } from "@/components/profile/SandboxedProfileFrame";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { updateProfileCallsignAction } from "@/lib/actions/profile-callsign";
import { updateProfileWorldAction, uploadProfileAssetAction } from "@/lib/actions/profile-world";
import {
  buildProfileIframeDocument,
  sanitizeProfileCss,
  sanitizeProfileHtml,
  type RssFeedInput,
} from "@/lib/profile-customization/sanitize";
import type { SessionUser } from "@/lib/auth/session";

export interface ProfileEditInitial {
  callsign: string;
  suggestedCallsign?: string;
  isPublic: boolean;
  html: string;
  css: string;
  rssFeeds: RssFeedInput[];
  tagline: string;
  motto: string;
  favoriteSignal: string;
  backgroundColor: string;
  isEnabled: boolean;
  showRelicZone: boolean;
  showRssZone: boolean;
}

interface ProfileEditClientProps {
  user: SessionUser;
  initial: ProfileEditInitial;
}

function normalizeRssFeeds(feeds?: RssFeedInput[]): RssFeedInput[] {
  const base = Array.isArray(feeds) ? feeds : [];
  if (base.length >= 5) return base.slice(0, 5);
  return [...base, ...Array(5 - base.length).fill({ url: "", title: "" })];
}

function normalizeInitial(initial: ProfileEditInitial): ProfileEditInitial {
  return {
    callsign: initial.callsign ?? "",
    suggestedCallsign: initial.suggestedCallsign ?? "",
    isPublic: initial.isPublic ?? true,
    html: initial.html ?? "",
    css: initial.css ?? "",
    rssFeeds: normalizeRssFeeds(initial.rssFeeds),
    tagline: initial.tagline ?? "",
    motto: initial.motto ?? "",
    favoriteSignal: initial.favoriteSignal ?? "",
    backgroundColor: initial.backgroundColor ?? "",
    isEnabled: initial.isEnabled ?? true,
    showRelicZone: initial.showRelicZone ?? true,
    showRssZone: initial.showRssZone ?? true,
  };
}

export function ProfileEditClient({ user, initial: rawInitial }: ProfileEditClientProps) {
  const initial = normalizeInitial(rawInitial);
  const router = useRouter();
  const [html, setHtml] = useState(initial.html);
  const [css, setCss] = useState(initial.css);
  const [tagline, setTagline] = useState(initial.tagline);
  const [callsign, setCallsign] = useState(initial.callsign);
  const [isPublic, setIsPublic] = useState(initial.isPublic);
  const [callsignError, setCallsignError] = useState<string | null>(null);
  const [motto, setMotto] = useState(initial.motto);
  const [favoriteSignal, setFavoriteSignal] = useState(initial.favoriteSignal);
  const [backgroundColor, setBackgroundColor] = useState(initial.backgroundColor);
  const [isEnabled, setIsEnabled] = useState(initial.isEnabled);
  const [showRelicZone, setShowRelicZone] = useState(initial.showRelicZone);
  const [showRssZone, setShowRssZone] = useState(initial.showRssZone);
  const [rssFeeds, setRssFeeds] = useState(initial.rssFeeds);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const previewDoc = useMemo(
    () =>
      buildProfileIframeDocument({
        sanitizedHtml: sanitizeProfileHtml(html),
        css: sanitizeProfileCss(css),
      }),
    [html, css],
  );

  function saveCallsign(e: React.FormEvent) {
    e.preventDefault();
    setCallsignError(null);
    const formData = new FormData();
    formData.set("callsign", callsign);
    formData.set("isPublic", String(isPublic));
    startTransition(async () => {
      const result = await updateProfileCallsignAction(formData);
      if (!result.success) {
        setCallsignError(result.error);
        return;
      }
      setSuccess("Callsign and visibility saved.");
      router.refresh();
    });
  }

  function saveWorld(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const formData = new FormData();
    formData.set("html", html);
    formData.set("css", css);
    formData.set("tagline", tagline);
    formData.set("motto", motto);
    formData.set("favoriteSignal", favoriteSignal);
    formData.set("backgroundColor", backgroundColor);
    formData.set("isEnabled", String(isEnabled));
    formData.set("showRelicZone", String(showRelicZone));
    formData.set("showRssZone", String(showRssZone));
    formData.set("linksJson", "[]");
    formData.set("buttonsJson", "[]");
    rssFeeds.forEach((feed, i) => {
      formData.set(`rssUrl${i}`, feed?.url ?? "");
      formData.set(`rssTitle${i}`, feed?.title ?? "");
    });
    startTransition(async () => {
      const result = await updateProfileWorldAction(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setSuccess("Profile world saved.");
      router.refresh();
    });
  }

  function uploadAsset(kind: "PORTRAIT" | "BANNER" | "BACKGROUND", file: File) {
    const formData = new FormData();
    formData.set("kind", kind);
    formData.set("file", file);
    startTransition(async () => {
      const result = await uploadProfileAssetAction(formData);
      if (!result.success) setError(result.error);
      else {
        setSuccess(`${kind.toLowerCase()} uploaded.`);
        router.refresh();
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 md:px-8">
      <div>
        <h1 className="font-mono text-3xl tracking-widest uppercase">Edit Profile World</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Custom profile code is sandboxed. Scripts are not allowed. Do not paste secrets, tokens,
          passwords, private keys, recovery codes, addresses, medical records, or private data.
        </p>
      </div>

      <TerminalPanel title="operative.callsign">
        <form onSubmit={saveCallsign} className="space-y-4">
          <p className="font-mono text-[10px] text-muted-foreground">
            Your public profile URL:{" "}
            <span className="text-primary">
              /profile/{callsign || initial.suggestedCallsign?.toLowerCase() || "your-callsign"}
            </span>
          </p>
          {initial.suggestedCallsign && !initial.callsign && (
            <p className="font-mono text-[10px] text-muted-foreground">
              Default derived from your operative codename:{" "}
              <span className="text-primary">{initial.suggestedCallsign}</span>
            </p>
          )}
          <div>
            <Label htmlFor="callsign" className="text-xs uppercase">
              Callsign / Profile Slug
            </Label>
            <Input
              id="callsign"
              value={callsign}
              onChange={(e) => setCallsign(e.target.value)}
              placeholder={initial.suggestedCallsign || "slewfoot"}
              maxLength={32}
              className="mt-1 font-mono"
            />
            <p className="mt-1 font-mono text-[9px] text-muted-foreground">
              Lowercase letters, numbers, hyphens, underscores. Must be unique.
            </p>
          </div>
          <label className="flex items-center gap-2 font-mono text-xs">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Public profile world (approved operatives can view)
          </label>
          {callsignError && <SystemAlert title="Callsign Error" message={callsignError} variant="error" />}
          <CommandButton type="submit" size="sm" disabled={isPending}>
            Save Callsign
          </CommandButton>
        </form>
      </TerminalPanel>

      <TerminalPanel title="operative.settings">
        <ProfileSettingsForm user={user} />
      </TerminalPanel>

      <TerminalPanel title="profile.assets">
        <div className="grid gap-4 sm:grid-cols-3">
          {(["PORTRAIT", "BANNER", "BACKGROUND"] as const).map((kind) => (
            <div key={kind}>
              <Label className="text-xs uppercase">{kind}</Label>
              <Input
                type="file"
                accept="image/gif,image/png,image/jpeg,image/webp"
                disabled={isPending}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadAsset(kind, file);
                }}
              />
            </div>
          ))}
        </div>
      </TerminalPanel>

      <form onSubmit={saveWorld} className="space-y-6">
        <TerminalPanel title="profile.world.fields">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Tagline" maxLength={160} />
            <Input value={motto} onChange={(e) => setMotto(e.target.value)} placeholder="Motto" maxLength={200} />
            <Input
              value={favoriteSignal}
              onChange={(e) => setFavoriteSignal(e.target.value)}
              placeholder="Favorite signal"
              maxLength={120}
            />
            <Input
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              placeholder="Background color (#070b0f)"
              maxLength={32}
            />
          </div>
        </TerminalPanel>

        <TerminalPanel title="relic.zone.editor">
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={10}
            maxLength={20000}
            className="mb-3 w-full border border-border bg-background/50 p-2 font-mono text-xs"
            placeholder="<section>your relic world</section>"
          />
          <textarea
            value={css}
            onChange={(e) => setCss(e.target.value)}
            rows={8}
            maxLength={20000}
            className="mb-3 w-full border border-border bg-background/50 p-2 font-mono text-xs"
            placeholder=".shrine { color: #38f8a8; }"
          />
          <Label className="text-xs uppercase">RSS Feeds (max 5)</Label>
          {rssFeeds.slice(0, 5).map((feed, i) => (
            <div key={i} className="mt-2 grid gap-2 sm:grid-cols-2">
              <Input
                value={feed?.url ?? ""}
                onChange={(e) => {
                  const next = [...rssFeeds];
                  next[i] = { ...next[i], url: e.target.value };
                  setRssFeeds(next);
                }}
                placeholder="https://example.com/feed.xml"
              />
              <Input
                value={feed?.title ?? ""}
                onChange={(e) => {
                  const next = [...rssFeeds];
                  next[i] = { ...next[i], title: e.target.value };
                  setRssFeeds(next);
                }}
                placeholder="Feed title"
              />
            </div>
          ))}
          <div className="mt-4 flex flex-wrap gap-4 font-mono text-xs">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} />
              Enable relic zone
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={showRelicZone} onChange={(e) => setShowRelicZone(e.target.checked)} />
              Show relic zone
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={showRssZone} onChange={(e) => setShowRssZone(e.target.checked)} />
              Show RSS zone
            </label>
          </div>
        </TerminalPanel>

        <TerminalPanel title="relic.preview">
          <SandboxedProfileFrame srcDoc={previewDoc} className="min-h-[320px] w-full" />
        </TerminalPanel>

        {error && <SystemAlert title="Save Failed" message={error} variant="error" />}
        {success && <SystemAlert title="Saved" message={success} variant="success" />}
        <CommandButton type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Save Profile World"}
        </CommandButton>
      </form>
    </div>
  );
}
