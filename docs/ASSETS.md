# Hades Watch Asset Guide

Placeholder folders:

- `public/assets/logo`
- `public/assets/icons`
- `public/assets/backgrounds`
- `public/assets/textures`
- `public/assets/audio`
- `public/assets/video`
- `public/assets/avatars`
- `public/assets/documents`
- `public/assets/lore`

Use original, licensed, or self-created assets only. Do not commit copyrighted media.

## Naming Pattern

```txt
theme-name.asset-type.variant.extension
```

Examples:

```txt
ghost-in-the-machine.svg                    # logo
ghost-in-the-machine-favicon.svg            # favicon
ghost-in-the-machine.webp                   # background
ghost-in-the-machine-grain.png              # texture
ghost-in-the-machine-ambient.mp4            # background video
ghost-in-the-machine-alert.mp3              # alert sound
```

## Theme Registry Paths

The theme registry in `src/lib/themes/registry.ts` references these paths as placeholders. The `AssetPlaceholder` component renders them in the UI until real files are added.

## Database

The `Asset` Prisma model (`prisma/schema.prisma`) is ready for future asset management with `key`, `type`, `path`, and optional `themeId`.
