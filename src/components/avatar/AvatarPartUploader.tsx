"use client";

import { useRef, useState, useTransition } from "react";
import type { AvatarPartCategory, AvatarPartVisibility } from "@/generated/prisma/client";
import { uploadAvatarPartAction } from "@/lib/actions/avatar-parts";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CATEGORIES: { value: AvatarPartCategory; label: string }[] = [
  { value: "BODY", label: "Body" },
  { value: "SPECIES_FEATURE", label: "Species Feature" },
  { value: "EYES", label: "Eyes" },
  { value: "HAIR", label: "Hair" },
  { value: "OUTFIT", label: "Outfit" },
  { value: "ACCESSORY", label: "Accessory" },
  { value: "BACKGROUND", label: "Background" },
  { value: "OVERLAY", label: "Overlay" },
];

interface AvatarPartUploaderProps {
  onUploaded?: (partId: string, category: AvatarPartCategory) => void;
}

export function AvatarPartUploader({ onUploaded }: AvatarPartUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<AvatarPartCategory>("OUTFIT");
  const [visibility, setVisibility] = useState<AvatarPartVisibility>("PRIVATE");
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function upload() {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Select a file first.");
      return;
    }
    setError(null);
    const formData = new FormData();
    formData.set("category", category);
    formData.set("visibility", visibility);
    formData.set("label", label);
    formData.set("file", file);
    startTransition(async () => {
      const result = await uploadAvatarPartAction(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      if (result.partId) onUploaded?.(result.partId, category);
      setLabel("");
      if (fileRef.current) fileRef.current.value = "";
    });
  }

  return (
    <div className="space-y-3 border border-border/40 bg-black/20 p-4">
      <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
        Upload Custom Part · PNG/JPEG/WebP/GIF · max 5 MB
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label className="text-xs uppercase">Category</Label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as AvatarPartCategory)}
            className="mt-1 w-full border border-border bg-background/50 p-2 font-mono text-xs"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label className="text-xs uppercase">Visibility</Label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as AvatarPartVisibility)}
            className="mt-1 w-full border border-border bg-background/50 p-2 font-mono text-xs"
          >
            <option value="PRIVATE">Private — only you</option>
            <option value="SHARED">Shared — community usable</option>
          </select>
        </div>
      </div>
      <Input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Part label (optional)"
        maxLength={64}
      />
      <Input ref={fileRef} type="file" accept="image/gif,image/png,image/jpeg,image/webp" disabled={isPending} />
      {error && <p className="font-mono text-xs text-destructive">{error}</p>}
      <CommandButton onClick={upload} disabled={isPending} size="sm">
        {isPending ? "Uploading…" : "Upload Part"}
      </CommandButton>
      <p className="font-mono text-[9px] text-muted-foreground">
        Use official base downloads as templates. Shared parts may be reviewed later.
      </p>
    </div>
  );
}
