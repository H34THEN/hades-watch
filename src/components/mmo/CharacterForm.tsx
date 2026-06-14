"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommandButton } from "@/components/terminal/CommandButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemAlert } from "@/components/terminal/SystemAlert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { upsertCharacterAction } from "@/lib/actions/mmo";

interface CharacterFormProps {
  initial?: {
    callsign: string;
    pronouns?: string | null;
    bio?: string | null;
    archetype?: string | null;
    factionId?: string | null;
    isPublic: boolean;
  };
  factions: { id: string; name: string }[];
}

export function CharacterForm({ initial, factions }: CharacterFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [factionId, setFactionId] = useState(initial?.factionId ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    if (factionId) formData.set("factionId", factionId);

    startTransition(async () => {
      const result = await upsertCharacterAction(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="font-mono text-xs uppercase">Callsign</Label>
        <Input name="callsign" required defaultValue={initial?.callsign} className="font-mono uppercase" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase">Pronouns</Label>
          <Input name="pronouns" defaultValue={initial?.pronouns ?? ""} placeholder="they/them" />
        </div>
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase">Archetype</Label>
          <Input name="archetype" defaultValue={initial?.archetype ?? ""} placeholder="netrunner" />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="font-mono text-xs uppercase">Bio</Label>
        <textarea
          name="bio"
          rows={4}
          defaultValue={initial?.bio ?? ""}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
        />
      </div>
      <div className="space-y-2">
        <Label className="font-mono text-xs uppercase">Faction</Label>
        <Select value={factionId} onValueChange={(v) => setFactionId(v ?? "")}>
          <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            {factions.map((f) => (
              <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" name="isPublic" id="isPublic" defaultChecked={initial?.isPublic ?? true} className="accent-primary" />
        <Label htmlFor="isPublic" className="font-mono text-xs uppercase">Public profile</Label>
      </div>
      {error && <SystemAlert title="Error" message={error} variant="error" />}
      <CommandButton type="submit" disabled={isPending}>
        {initial ? "Update Character" : "Create Character"}
      </CommandButton>
    </form>
  );
}
