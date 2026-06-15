"use client";

interface SandboxedProfileFrameProps {
  srcDoc: string;
  title?: string;
  className?: string;
}

export function SandboxedProfileFrame({
  srcDoc,
  title = "Custom profile zone",
  className,
}: SandboxedProfileFrameProps) {
  return (
    <iframe
      title={title}
      sandbox="allow-popups allow-popups-to-escape-sandbox"
      srcDoc={srcDoc}
      className={className ?? "min-h-[240px] w-full border border-border/60 bg-black/40"}
      loading="lazy"
    />
  );
}
