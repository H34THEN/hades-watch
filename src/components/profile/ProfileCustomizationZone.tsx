import { SandboxedProfileFrame } from "@/components/profile/SandboxedProfileFrame";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { buildProfileIframeDocument } from "@/lib/profile-customization/sanitize";

interface ProfileCustomizationZoneProps {
  html: string;
  css: string;
  rssHtml?: string;
}

export function ProfileCustomizationZone({ html, css, rssHtml = "" }: ProfileCustomizationZoneProps) {
  const srcDoc = buildProfileIframeDocument({ sanitizedHtml: html, css, rssHtml });

  return (
    <TerminalPanel title="profile.relic_zone" className="mb-8">
      <p className="mb-3 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
        MySpace Relic Zone · sandboxed iframe · no scripts
      </p>
      <SandboxedProfileFrame srcDoc={srcDoc} />
    </TerminalPanel>
  );
}

export function ProfileCustomizationPlaceholder() {
  return (
    <TerminalPanel title="profile.relic_zone" className="mb-8">
      <p className="font-mono text-sm text-muted-foreground">
        This profile has not opened a custom signal window yet.
      </p>
    </TerminalPanel>
  );
}
