import Link from "next/link";
import { CommandButton } from "@/components/terminal/CommandButton";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";

export const metadata = { title: "Support the Underwatch" };

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <TerminalPanel title="donation.relay">
        <h1 className="font-mono text-2xl tracking-widest uppercase">Support the Underwatch</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The Underwatch donation relay is not live yet. This placeholder marks where future
          support options will appear.
        </p>
        <p className="mt-4 font-mono text-[10px] text-muted-foreground">
          No payment provider is connected. No funds are collected on this page.
        </p>
        <Link href="/" className="mt-8 inline-block">
          <CommandButton size="sm" variant="outline">
            ← Return to Surface
          </CommandButton>
        </Link>
      </TerminalPanel>
    </div>
  );
}
