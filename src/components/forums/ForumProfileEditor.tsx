"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  updateForumPreferencesAction,
  updateForumProfileAction,
  type ForumIdentityActionResult,
} from "@/lib/actions/forum-identity";
import { ForumAuthorCard, type ForumAuthorView } from "@/components/forums/ForumAuthorCard";
import styles from "@/components/forums/forums.module.css";

interface ForumProfileEditorProps {
  authorPreview: ForumAuthorView;
  profile: {
    displayName: string | null;
    statusLine: string | null;
    signatureText: string | null;
    signatureMode: string;
    forumImageSource: string;
    generatedImageConfig: unknown;
    hoverEffect: string | null;
    stylePreset: string | null;
    showBadges: boolean;
    showReputation: boolean;
    showProfileWorldLink: boolean;
  };
  preferences: {
    hideSignatures: boolean;
    reduceMotion: boolean;
    disableHoverEffects: boolean;
    notifyWhenQuoted: boolean;
    notifyOnDirectReply: boolean;
    notifyOnMention: boolean;
  };
}

async function saveProfile(
  _prev: ForumIdentityActionResult | null,
  formData: FormData,
): Promise<ForumIdentityActionResult> {
  return updateForumProfileAction(formData);
}

async function savePrefs(
  _prev: ForumIdentityActionResult | null,
  formData: FormData,
): Promise<ForumIdentityActionResult> {
  return updateForumPreferencesAction(formData);
}

export function ForumProfileEditor({
  authorPreview,
  profile,
  preferences,
}: ForumProfileEditorProps) {
  const router = useRouter();
  const [profileState, profileAction] = useActionState(saveProfile, null);
  const [prefState, prefAction] = useActionState(savePrefs, null);

  useEffect(() => {
    if (profileState?.success || prefState?.success) router.refresh();
  }, [profileState, prefState, router]);

  const generated = (profile.generatedImageConfig ?? {}) as { glyph?: string; theme?: string };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-mono text-sm uppercase tracking-wider text-primary">Live preview</h2>
        <div className="mt-3 rounded border border-border/50 bg-card/30 p-4">
          <ForumAuthorCard author={authorPreview} showSignatureButton />
        </div>
      </section>

      <form action={profileAction} className="space-y-4" encType="multipart/form-data">
        <div className={styles.identityGrid}>
          <div>
            <Label className="text-xs uppercase">Display name</Label>
            <Input
              name="displayName"
              defaultValue={profile.displayName ?? ""}
              maxLength={48}
              className="mt-1 font-mono text-sm"
            />
          </div>
          <div>
            <Label className="text-xs uppercase">Status line</Label>
            <Input
              name="statusLine"
              defaultValue={profile.statusLine ?? ""}
              maxLength={120}
              className="mt-1 font-mono text-sm"
            />
          </div>
          <div>
            <Label className="text-xs uppercase">Signature text</Label>
            <Input
              name="signatureText"
              defaultValue={profile.signatureText ?? ""}
              maxLength={500}
              className="mt-1 font-mono text-sm"
            />
          </div>
          <div>
            <Label className="text-xs uppercase">Signature display</Label>
            <select
              name="signatureMode"
              defaultValue={profile.signatureMode}
              className="mt-1 w-full border border-border bg-background/50 px-2 py-2 font-mono text-xs"
            >
              <option value="COMPACT">Compact</option>
              <option value="FULL">Full</option>
              <option value="HIDDEN">Hidden</option>
            </select>
          </div>
          <div>
            <Label className="text-xs uppercase">Forum image source</Label>
            <select
              name="forumImageSource"
              defaultValue={profile.forumImageSource}
              className="mt-1 w-full border border-border bg-background/50 px-2 py-2 font-mono text-xs"
            >
              <option value="GENERATED">Generated glyph</option>
              <option value="AVATAR">Current avatar</option>
              <option value="FACTION_ICON">Faction icon</option>
              <option value="UPLOADED">Upload image</option>
            </select>
          </div>
          <div>
            <Label className="text-xs uppercase">Generated glyph</Label>
            <Input
              name="generatedGlyph"
              defaultValue={generated.glyph ?? ""}
              maxLength={3}
              className="mt-1 font-mono text-sm"
            />
          </div>
          <div>
            <Label className="text-xs uppercase">Upload square image</Label>
            <Input name="forumImage" type="file" accept="image/png,image/jpeg,image/webp" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs uppercase">Image alt text</Label>
            <Input name="forumImageAlt" className="mt-1 font-mono text-sm" />
          </div>
        </div>

        <p className={styles.safetyNote}>
          Do not upload private documents, screenshots with personal data, copied art, hate symbols,
          or images meant to impersonate staff/system messages.
        </p>

        {profileState && !profileState.success && (
          <SystemAlert title="Save failed" message={profileState.error} variant="error" />
        )}

        <CommandButton type="submit" size="sm">
          Save forum identity
        </CommandButton>
      </form>

      <form action={prefAction} className="space-y-3">
        <h2 className="font-mono text-sm uppercase tracking-wider text-primary">Preferences</h2>
        {[
          ["hideSignatures", "Hide all signatures while browsing", preferences.hideSignatures],
          ["notifyWhenQuoted", "Notify when quoted", preferences.notifyWhenQuoted],
          ["notifyOnDirectReply", "Notify on direct reply", preferences.notifyOnDirectReply],
          ["notifyOnMention", "Notify on @mention", preferences.notifyOnMention],
          ["reduceMotion", "Reduce motion", preferences.reduceMotion],
        ].map(([name, label, checked]) => (
          <label key={String(name)} className="flex items-center gap-2 font-mono text-xs">
            <input type="checkbox" name={String(name)} value="true" defaultChecked={Boolean(checked)} />
            {String(label)}
          </label>
        ))}

        {prefState && !prefState.success && (
          <SystemAlert title="Preferences failed" message={prefState.error} variant="error" />
        )}

        <CommandButton type="submit" size="sm" variant="secondary">
          Save preferences
        </CommandButton>
      </form>
    </div>
  );
}
