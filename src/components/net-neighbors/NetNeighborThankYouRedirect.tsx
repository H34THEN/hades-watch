"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";

const RETURN_SECONDS = 5;

export function NetNeighborThankYouRedirect() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(RETURN_SECONDS);

  useEffect(() => {
    if (seconds <= 0) {
      router.push("/net-neighbors");
      return;
    }
    const timer = window.setTimeout(() => {
      setSeconds((s) => s - 1);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [seconds, router]);

  return (
    <div className="mt-8 space-y-4">
      <p className="font-mono text-sm text-primary">
        {seconds > 0
          ? `Returning to the Net Neighbor wall in ${seconds}…`
          : "Returning now…"}
      </p>
      <p className="font-mono text-[10px] text-muted-foreground uppercase">
        Return timer: {Math.max(seconds, 0)} seconds
      </p>
      <Link href="/net-neighbors">
        <CommandButton size="sm">Return to Net Neighbors</CommandButton>
      </Link>
    </div>
  );
}
