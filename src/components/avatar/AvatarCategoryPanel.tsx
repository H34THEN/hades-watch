"use client";

import type { AvatarRegistryItem } from "@/lib/avatar/avatar-registry";

interface AvatarCategoryPanelProps {
  category: string;
  title: string;
  items: AvatarRegistryItem[];
  selectedSlug?: string | null;
  onSelect: (item: AvatarRegistryItem) => void;
  emptyMessage?: string;
}

export function AvatarCategoryPanel({
  category,
  title,
  items,
  selectedSlug,
  onSelect,
  emptyMessage = "No layers uploaded for this category yet.",
}: AvatarCategoryPanelProps) {
  if (items.length === 0) {
    return (
      <div className="border border-dashed border-border/50 p-4">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{title}</p>
        <p className="mt-2 font-mono text-xs text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
        {items.map((item) => (
          <div key={item.slug} className="space-y-1">
            <button
              type="button"
              onClick={() => onSelect(item)}
              className={`w-full border p-2 text-left font-mono text-xs ${
                selectedSlug === item.slug ? "border-primary bg-primary/5" : "border-border/50"
              }`}
            >
              {item.name}
              {item.placeholder && (
                <span className="ml-1 text-[9px] text-muted-foreground">· placeholder</span>
              )}
            </button>
            {item.downloadableBase && (
              <a
                href={item.imagePath}
                download
                className="block font-mono text-[9px] text-primary hover:underline"
              >
                Download base
              </a>
            )}
          </div>
        ))}
      </div>
      <p className="font-mono text-[9px] text-muted-foreground">Category: {category}</p>
    </div>
  );
}
