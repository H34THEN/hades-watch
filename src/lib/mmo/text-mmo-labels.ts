export function formatMmoRoomType(type: string): string {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatMmoRoomState(state: string): string {
  return state.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatMmoAccessLevel(level: string): string {
  return level.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatDropType(type: string): string {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatRepeatability(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function roomCtaLabel(slug: string, state: string): string {
  if (state === "locked") return "Relay Locked";
  if (slug === "archive-terminal") return "View Archive";
  if (slug === "dead-drop-terminal") return "Open Terminal";
  return "Enter Room";
}

export function factionSlugToName(slug: string): string {
  const map: Record<string, string> = {
    "chthonic-uprising": "Chthonic Uprising",
    "oracular-circuit": "Oracular Circuit",
    "asclepian-veil": "Asclepian Veil",
    "daedalus-foundry": "Daedalus Foundry",
    "styx-rats": "Styx Rats",
    "myrmidon-grinders": "Myrmidon Grinders",
    "dead-index": "Dead Index",
  };
  return map[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
