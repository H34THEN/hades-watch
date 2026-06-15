"use client";

interface SandboxedProfileFrameProps {
  srcDoc: string;
  title?: string;
}

export function SandboxedProfileFrame({ srcDoc, title = "Custom profile zone" }: SandboxedProfileFrameProps) {
  return (
    <iframe
      title={title}
      sandbox="allow-popups allow-popups-to-escape-sandbox"
      srcDoc={srcDoc}
      className="min-h-[240px] w-full border border-border/60 bg-black/40"
      loading="lazy"
    />
  );
}
