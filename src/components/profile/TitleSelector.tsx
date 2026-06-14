"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateActiveTitleAction } from "@/lib/actions/profile";
import type { EarnedTitle } from "@/lib/dossier";

interface TitleSelectorProps {
  earnedTitles: EarnedTitle[];
  activeTitle: string;
}

export function TitleSelector({ earnedTitles, activeTitle }: TitleSelectorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string | null) {
    if (!value) return;
    const formData = new FormData();
    formData.set("activeTitle", value);
    startTransition(async () => {
      await updateActiveTitleAction(formData);
      router.refresh();
    });
  }

  if (earnedTitles.length === 0) return null;

  return (
    <div className="space-y-2">
      <Label className="font-mono text-xs tracking-wider uppercase">Active Title</Label>
      <Select value={activeTitle} onValueChange={handleChange} disabled={isPending}>
        <SelectTrigger className="font-mono text-sm">
          <SelectValue placeholder="Select title" />
        </SelectTrigger>
        <SelectContent>
          {earnedTitles.map((t) => (
            <SelectItem key={t.id} value={t.label} className="font-mono">
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
