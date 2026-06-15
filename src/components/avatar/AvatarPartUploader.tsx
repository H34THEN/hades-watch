"use client";

import { useRef, useState, useTransition } from "react";
import { uploadAvatarPartAction } from "@/lib/actions/avatar-parts";
import { AVATAR_CATEGORIES } from "@/lib/avatar/avatar-assets";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UPLOAD_CATEGORIES = AVATAR_CATEGORIES.filter(
  (c) => !["gender", "skin-color", "eye-color", "hair-color", "pose"].includes(c.slug),
);

interface AvatarPartUploaderProps {
  onUploaded?: (partId: string, category: string) => void;
}

export function AvatarPartUploader({ onUploaded }: AvatarPartUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState("tops");
  const [visibility, setVisibility] = useState<"PRIVATE" | "SHARED_PENDING">("PRIVATE");
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
        Upload Custom Part · PNG preferred · max 5 MB · no SVG
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label className="text-xs uppercase">Category</Label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full border border-border bg-background/50 p-2 font-mono text-xs"
          >
            {UPLOAD_CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label className="text-xs uppercase">Visibility</Label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as "PRIVATE" | "SHARED_PENDING")}
            className="mt-1 w-full border border-border bg-background/50 p-2 font-mono text-xs"
          >
            <option value="PRIVATE">Private — only you</option>
            <option value="SHARED_PENDING">Shared — pending review</option>
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
    </div>
  );
}
