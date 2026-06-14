"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { unlockLoreAction } from "@/lib/actions/lore";

export function UnlockLoreButton({ loreEntryId }: { loreEntryId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <CommandButton
      size="sm"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await unlockLoreAction(loreEntryId);
          router.refresh();
        })
      }
    >
      Unlock Entry
    </CommandButton>
  );
}
