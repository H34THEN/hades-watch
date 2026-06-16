# Hades Watch Avatar Prompts — Index

This folder contains **canonical image-generation prompts** for the Hades Watch modular avatar builder and Avatar Forge GPT workflow.

## Purpose

These Markdown files help contributors and approved operatives generate **compatible avatar layers**:

- base bodies (species × presentation)
- clothing overlays (tops, pants, outerwear, shoes)
- species features (horns, ears, tails, wings, markings)
- hair, face, eyes, emotions
- accessories and faction flair
- fictional props and tech gear (cosmetic only)
- backgrounds

## Start Here

| Document | Contents |
|---|---|
| [../AVATAR_PROMPT_REFERENCE.md](../AVATAR_PROMPT_REFERENCE.md) | User-facing reference: rules, universal clauses, naming, asset paths, Forge access |
| [../HADES_WATCH_NANO_BANANA_2_AVATAR_PROMPT_SYSTEM.md](../HADES_WATCH_NANO_BANANA_2_AVATAR_PROMPT_SYSTEM.md) | Full species/base/hair/face prompt architecture |
| [../AVATAR_ASSET_DIRECTORY.md](../AVATAR_ASSET_DIRECTORY.md) | Where to save finished PNG layers |
| [../AVATAR_FORGE_GPT_ACCESS.md](../AVATAR_FORGE_GPT_ACCESS.md) | Request / approval / unlock-code flow |

## Faction & Set Prompt Files (copy-paste ready)

Each file below contains full **Prompt** and **Negative Prompt** blocks per item.

| File | Set |
|---|---|
| [ORACULAR_CIRCUIT_OUTFIT_PROMPTS.md](./ORACULAR_CIRCUIT_OUTFIT_PROMPTS.md) | Oracular Circuit tops, pants, jackets, visor, gloves, satchel |
| [ASCLEPIAN_VEIL_OUTFIT_PROMPTS.md](./ASCLEPIAN_VEIL_OUTFIT_PROMPTS.md) | Asclepian Veil clinicwear layers |
| [CHTHONIC_UPRISING_LEADERSHIP_OUTFIT_PROMPTS.md](./CHTHONIC_UPRISING_LEADERSHIP_OUTFIT_PROMPTS.md) | Chthonic Uprising leadership outfit spread |
| [DAEDALUS_FOUNDRY_OUTFIT_PROMPTS.md](./DAEDALUS_FOUNDRY_OUTFIT_PROMPTS.md) | Daedalus Foundry forge-worker layers |
| [MYRMIDON_GRINDERS_OUTFIT_PROMPTS.md](./MYRMIDON_GRINDERS_OUTFIT_PROMPTS.md) | Myrmidon Grinders gatewatch layers |
| [STYX_RATS_OUTFIT_PROMPTS.md](./STYX_RATS_OUTFIT_PROMPTS.md) | Styx Rats street-signal layers |
| [HADES_WATCH_SAFE_TECH_GEAR_ACCESSORY_UNLOCK_PROMPTS.md](./HADES_WATCH_SAFE_TECH_GEAR_ACCESSORY_UNLOCK_PROMPTS.md) | Safe cosmetic tech accessories (10 unlock prompts) |

## Avatar Forge GPT Access

The private **Hades Watch Avatar Forge GPT** invite link is **not stored in these docs**.

Approved operatives request access at `/profile/avatar/forge`. Owner approval and a server-verified unlock code are required before the link is returned.

See [../AVATAR_FORGE_GPT_ACCESS.md](../AVATAR_FORGE_GPT_ACCESS.md).

## Workflow Summary

1. Read [AVATAR_PROMPT_REFERENCE.md](../AVATAR_PROMPT_REFERENCE.md) technical rules.
2. Download an approved base from `/profile/avatar/bases` if generating overlays.
3. Copy the prompt block for the layer you need from the relevant file above.
4. Generate at **1024×1024**, transparent PNG when possible.
5. Name the file in **lowercase kebab-case** and save to the correct `public/avatar-assets/` folder.
6. Run `npm run assets:registry` (maintainers) to refresh the builder registry.

## Safety

All prompts are for **fictional avatar cosmetics**. Do not generate real weapons, malware iconography, real logos, tactical gear, or operational instructions.
