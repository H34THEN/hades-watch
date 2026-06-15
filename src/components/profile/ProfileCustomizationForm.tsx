"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { SandboxedProfileFrame } from "@/components/profile/SandboxedProfileFrame";
import { updateProfileCustomizationAction } from "@/lib/actions/profile-customization";
import { buildProfileIframeDocument, sanitizeProfileHtml, sanitizeProfileCss } from "@/lib/profile-customization/sanitize";

export interface ProfileCustomizationRecord {
  html: string;
  css: string;
  rssFeeds: { url: string; title?: string }[];
  isEnabled: boolean;
}

interface ProfileCustomizationFormProps {
  initial: ProfileCustomizationRecord | null;
}

export function ProfileCustomizationForm({ initial }: ProfileCustomizationFormProps) {
  const router = useRouter();
  const [html, setHtml] = useState(initial?.html ?? "");
  const [css, setCss] = useState(initial?.css ?? "");
  const [isEnabled, setIsEnabled] = useState(initial?.isEnabled ?? true);
  const [rssFeeds, setRssFeeds] = useState(
    initial?.rssFeeds?.length
      ? [...initial.rssFeeds, ...Array(Math.max(0, 5 - initial.rssFeeds.length)).fill({ url: "", title: "" })]
      : [{ url: "", title: "" }, { url: "", title: "" }, { url: "", title: "" }, { url: "", title: "" }, { url: "", title: "" }],
  );
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const formData = new FormData();
    formData.set("html", html);
    formData.set("css", css);
    formData.set("isEnabled", String(isEnabled));
    rssFeeds.forEach((feed, i) => {
      formData.set(`rssUrl${i}`, feed.url);
      formData.set(`rssTitle${i}`, feed.title ?? "");
    });

    startTransition(async () => {
      const result = await updateProfileCustomizationAction(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setSuccess("Relic zone saved.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6 border-t border-border/40 pt-6">
      <div>
        <Label className="font-mono text-xs tracking-wider uppercase">MySpace Relic Zone</Label>
        <p className="mt-1 text-xs text-muted-foreground">
          Custom profile code is sandboxed. Scripts are not allowed. Do not paste secrets, tokens,
          passwords, or private data.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="profile-html" className="font-mono text-xs uppercase">Custom HTML</Label>
          <textarea
            id="profile-html"
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={8}
            maxLength={10000}
            className="w-full border border-border bg-background/50 p-2 font-mono text-xs"
            disabled={isPending}
            placeholder="<p>welcome to my underworld page</p>"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-css" className="font-mono text-xs uppercase">Custom CSS (iframe only)</Label>
          <textarea
            id="profile-css"
            value={css}
            onChange={(e) => setCss(e.target.value)}
            rows={6}
            maxLength={10000}
            className="w-full border border-border bg-background/50 p-2 font-mono text-xs"
            disabled={isPending}
            placeholder=".glow { color: #38f8a8; }"
          />
        </div>

        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase">RSS Feeds (max 3)</Label>
          {rssFeeds.map((feed, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-2">
              <Input
                value={feed.url}
                onChange={(e) => {
                  const next = [...rssFeeds];
                  next[i] = { ...next[i], url: e.target.value };
                  setRssFeeds(next);
                }}
                placeholder="https://example.com/feed.xml"
                disabled={isPending}
              />
              <Input
                value={feed.title ?? ""}
                onChange={(e) => {
                  const next = [...rssFeeds];
                  next[i] = { ...next[i], title: e.target.value };
                  setRssFeeds(next);
                }}
                placeholder="Feed title (optional)"
                disabled={isPending}
              />
            </div>
          ))}
        </div>

        <label className="flex items-center gap-2 font-mono text-xs">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => setIsEnabled(e.target.checked)}
            disabled={isPending}
          />
          Show relic zone on dossier
        </label>

        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase">Live Preview</Label>
          <SandboxedProfileFrame srcDoc={previewDoc} title="Profile customization preview" />
        </div>

        {error && <SystemAlert title="Save Failed" message={error} variant="error" />}
        {success && <SystemAlert title="Saved" message={success} variant="success" />}

        <CommandButton type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Save Relic Zone"}
        </CommandButton>
      </form>
    </div>
  );
}
