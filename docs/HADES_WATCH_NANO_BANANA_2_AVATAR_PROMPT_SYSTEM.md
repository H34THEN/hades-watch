---
title: "HADES WATCH NANO BANANA 2 AVATAR PROMPT SYSTEM"
slug: "hades-watch-nano-banana-2-avatar-prompt-system"
category: "avatar-architecture"
status: "foundation-draft"
format: "markdown"
---

# HADES WATCH NANO BANANA 2 AVATAR PROMPT SYSTEM

## 1. Purpose

This guide defines a complete Nano Banana 2 prompt architecture for generating Hades Watch avatar assets.

The system is built for a modular avatar builder that can generate:

- base bodies
- species variants
- gender and presentation variants
- hair layers
- face and emotion layers
- horns, ears, tails, wings, markings, and aura layers
- clothing layers
- faction gear
- fictional props and tech gear
- profile backgrounds
- badges and icons
- item sheets for batch asset production

The style is a modernized evolution of early 2000s Gaia Online avatar culture: collectible, charming, readable, modular, expressive, and game-ready, but larger, more polished, more realistic in proportion, less scrawny, and compatible with a serious cyberpunk gothic fantasy world.

Hades Watch assets should feel like they belong inside a cyberpunk Greek-underworld resistance dossier system: mythic, stylish, practical, strange, readable, and built for a community that fights through care, signal, repair, memory, morale, and refusal.

Every prompt below is complete and standalone. No prompt requires piecing together a separate master clause, technical clause, or negative prompt.

---

## 2. Avatar-Builder Technical Constraints

- Canvas should be square, preferably 1024x1024.
- Avatar or asset should be centered.
- Full-body avatars should fit head-to-feet with comfortable margins.
- Background should be transparent whenever possible.
- If transparency is not possible, use a flat neutral light gray or dark gray background.
- Generated assets should be easy to cut into transparent PNG layers.
- Avoid complex lighting.
- Avoid large cast shadows.
- Avoid cropped limbs.
- Avoid bulky poses that block clothing layers.
- Avoid props attached permanently to the base body.
- Avoid hair on base bodies unless generating a hair layer.
- Avoid detailed outfits on base bodies unless generating clothing layers.
- Base bodies should use a simple neutral underlayer or bodysuit.
- Separate assets should align to the same base pose and proportions.
- Cosmetic props are visual only.
- Use "Fictional Props & Tech Gear," not weapons, in avatar-builder language.

---

## 3. Visual Style Guide

Hades Watch avatar assets should combine:

- cyberpunk gothic fantasy
- Greek underworld resistance
- techno-dystopian civic collapse
- myth-tech ornament
- avatar-builder readability
- modular game asset logic
- modern Gaia Online charm
- grounded semi-stylized anatomy
- expressive but not cartoonish faces
- clean silhouette
- soft cel shading
- polished line art
- wearable layers and collectible cosmetics

The base avatar body should be full-body humanoid, realistic in proportion, not a scrawny paper doll, not a weird skinny doll, not hypersexualized, not exaggerated anime anatomy, healthy and balanced, natural in limb thickness, believable in torso and hips, softly athletic or grounded, readable at small size, and compatible with layered clothes and accessories.

Default pose:

- relaxed natural 3/4 pose
- body turned slightly toward viewer
- head gently facing viewer
- arms relaxed and slightly away from torso
- hands visible and relaxed
- one leg relaxed slightly forward or to the side
- stable grounded stance
- full body visible from head to feet
- no extreme perspective
- no dramatic action pose

---

## 4. Species Prompt Guide

## Tiefling

### Visual Identity

Tieflings are underworld-blooded technogoth avatars with subtle infernal resonance. They should feel elegant, rebellious, and mythic without becoming generic fantasy demons.

### Anatomy Notes

- humanoid body
- curved horns
- pointed ears
- optional slim tail
- ember-like markings
- subtle underworld glow
- grounded natural proportions

### Palette

charcoal, smoky plum, ember red, antique gold, bone, ash gray

### Faction Affinity

Styx Rats, Oracular Circuit, Chthonic Uprising.

### Complete Base Body Prompt

```txt
Create a full-body Hades Watch avatar base for a Tiefling character on a 1024x1024 square canvas. The avatar must be centered, head-to-feet visible, with comfortable margins, and placed on a transparent background. If transparency is not possible, use a flat neutral gray background. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, realistic natural proportions, elegant but grounded anatomy, underworld technomythic details, no extreme perspective, no oversexualization, no scrawny doll anatomy, game-ready modular asset design.

The character is a Tiefling humanoid with natural balanced proportions, soft athletic tone, believable torso and hips, natural limb thickness, and relaxed grounded posture. Use a relaxed natural 3/4 pose with the body turned slightly toward the viewer, head gently facing forward, arms relaxed and slightly away from the torso, hands visible, one leg relaxed slightly forward, feet visible, no action pose. The body should wear only a simple neutral fitted avatar underlayer or bodysuit for layer compatibility.

Tiefling features: curved horns, pointed ears, subtle ember-like underworld markings on skin, optional faint infernal glow, charcoal and smoky plum undertones, restrained antique gold accents in the markings only. Do not add hair, clothing, shoes, jewelry, large props, wings, or background scenery. The base must be clean and ready for modular avatar layering.

Negative prompt: extra characters, cropped limbs, missing hands, missing feet, warped anatomy, scrawny doll body, exaggerated skinny limbs, unrealistic proportions, extreme perspective, action pose, bulky clothing, detailed outfit, props attached to base body, hair, background clutter, text, watermark, logo, signature, photorealistic uncanny face, oversexualized body, gore, violence, weapons, messy artifacts, asymmetrical unintended clothing, AI artifacting, fused fingers, distorted hands, wrong number of fingers.
```

### Complete Species Asset Prompt

```txt
Create a transparent PNG-style modular avatar asset sheet for Hades Watch Tiefling species features on a 1024x1024 square canvas. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, realistic proportions, game-ready modular asset design. Background must be transparent or plain neutral gray if transparency is not possible.

Generate separate layer-ready Tiefling features aligned to a relaxed neutral 3/4 avatar pose: one pair of curved ember horns, one pair of pointed ears, one slim tail, and one set of subtle ember-like underworld skin markings. The items should be spaced apart clearly with no overlap, no character body attached, no clothing, no hair, no background scenery. The horns should be charcoal with smoky plum shadows and ember red glow lines. The ears should be natural and pointed with subtle ash-gray shading. The tail should be slim, elegant, and slightly curved for 3/4 alignment. The markings should be usable as an overlay layer, with delicate ember red and antique gold linework.

Negative prompt: full character body, clothing, hair, weapons, gore, extra text, watermark, logo, cluttered sheet, overlapping items, malformed horns, melted tail, inconsistent perspective, photorealism, harsh shadows, AI artifacting, fused shapes, unusable layer edges.
```

---

## Nymph

### Visual Identity

Nymphs are underworld-grown organic avatars shaped by moss, signal gardens, rooftop ecology, and mythic resilience. They should feel alive, luminous, and grounded, not fragile or decorative.

### Anatomy Notes

- pointed ears
- organic vine-like markings
- subtle floral or moss growth
- luminous skin accents
- natural proportions

### Palette

deep moss, petal pink, soft ivory, antique gold, deep teal, charcoal

### Faction Affinity

Asclepian Veil, Daedalus Foundry, Styx Rats.

### Complete Base Body Prompt

```txt
Create a full-body Hades Watch avatar base for a Nymph character on a 1024x1024 square canvas. The avatar must be centered, head-to-feet visible, with comfortable margins, and placed on a transparent background. If transparency is not possible, use a flat neutral gray background. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, realistic natural proportions, elegant but grounded anatomy, underworld technomythic details, no extreme perspective, no oversexualization, no scrawny doll anatomy, game-ready modular asset design.

The character is a Nymph humanoid with healthy balanced proportions, natural limb thickness, believable torso and hips, soft athletic tone, and a relaxed grounded 3/4 pose. The body is turned slightly toward the viewer, head gently facing forward, arms relaxed and slightly away from the torso, hands visible, one leg relaxed slightly forward, feet visible. The body should wear only a simple neutral fitted avatar underlayer or bodysuit for layer compatibility.

Nymph features: pointed leaf-like ears, subtle organic vine-like markings along the skin, luminous soft accents, tiny moss or blossom details kept flat and layer-friendly. Use deep moss, soft ivory, deep teal, petal pink, and antique gold accents. Do not add hair, detailed clothing, shoes, jewelry, large plant masses, props, or background scenery. Keep the base clean for modular layering.

Negative prompt: extra characters, cropped limbs, missing hands, missing feet, warped anatomy, scrawny doll body, exaggerated skinny limbs, unrealistic proportions, extreme perspective, action pose, bulky clothing, detailed outfit, props attached to base body, hair, background clutter, text, watermark, logo, signature, photorealistic uncanny face, oversexualized body, gore, violence, weapons, messy artifacts, asymmetrical unintended clothing, AI artifacting, fused fingers, distorted hands, wrong number of fingers.
```

### Complete Species Asset Prompt

```txt
Create a transparent PNG-style modular avatar asset sheet for Hades Watch Nymph species features on a 1024x1024 square canvas. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, natural proportions, game-ready modular asset design. Background must be transparent or plain neutral gray if transparency is not possible.

Generate separate layer-ready Nymph features aligned to a relaxed neutral 3/4 avatar pose: one pair of pointed leaf-like ears, one set of delicate vine markings for arms and torso, one set of small blossom accents, one moss-freckle overlay, and one subtle luminous skin accent overlay. Space each asset clearly with no overlap, no body, no hair, no clothing, and no scenery. Use deep moss, petal pink, soft ivory, antique gold, deep teal, and charcoal shadows. Keep the assets thin, readable, and easy to layer over a base avatar.

Negative prompt: full character body, bulky plant armor, giant vines, tangled unreadable growth, clothing, hair, weapons, gore, text, watermark, logo, clutter, overlapping assets, photorealism, harsh shadows, unusable edges, AI artifacting.
```

---

## Gorgon

### Visual Identity

Gorgons are elegant, dangerous, calm, and underworld-reptilian. They are not monsters. They are avatars with controlled serpent symbolism, stone undertones, and sacred machine poise.

### Anatomy Notes

- serpent hair or serpent crown as layer
- scale markings along temples and limbs
- golden reptile eyes
- stone-gray undertones
- natural proportions

### Palette

obsidian, basilisk green, stone gray, antique gold, smoke, bronze

### Faction Affinity

Oracular Circuit, Asclepian Veil, Chthonic Uprising.

### Complete Base Body Prompt

```txt
Create a full-body Hades Watch avatar base for a Gorgon character on a 1024x1024 square canvas. The avatar must be centered, head-to-feet visible, with comfortable margins, and placed on a transparent background. If transparency is not possible, use a flat neutral gray background. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, realistic natural proportions, elegant but grounded anatomy, underworld technomythic details, no extreme perspective, no oversexualization, no scrawny doll anatomy, game-ready modular asset design.

The character is a Gorgon humanoid with healthy balanced proportions, natural limb thickness, believable torso and hips, elegant posture, and calm presence. Use a relaxed natural 3/4 pose with the body turned slightly toward viewer, head gently facing forward, arms relaxed and slightly away from torso, hands visible, one leg relaxed slightly forward, feet visible. The body should wear only a simple neutral fitted avatar underlayer or bodysuit.

Gorgon features on the base should be subtle and layer-friendly: stone-gray undertones, faint scale markings along temples and limbs, golden reptile eyes if visible, basilisk green and bronze accents in the markings. Do not add serpent hair to the base body. Do not add clothing, shoes, jewelry, weapons, props, or background scenery. Keep the base clean for modular layering.

Negative prompt: extra characters, cropped limbs, missing hands, missing feet, warped anatomy, scrawny doll body, exaggerated skinny limbs, unrealistic proportions, extreme perspective, action pose, bulky clothing, detailed outfit, props attached to base body, hair, serpent hair attached to base, background clutter, text, watermark, logo, signature, photorealistic uncanny face, oversexualized body, gore, violence, weapons, messy artifacts, AI artifacting, fused fingers, distorted hands, wrong number of fingers.
```

### Complete Species Asset Prompt

```txt
Create a transparent PNG-style modular avatar asset sheet for Hades Watch Gorgon species features on a 1024x1024 square canvas. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, elegant underworld myth-tech design, game-ready modular asset design. Background must be transparent or plain neutral gray if transparency is not possible.

Generate separate layer-ready Gorgon features aligned to a relaxed neutral 3/4 avatar pose: one serpent crown hair layer with small elegant serpents, one subtler serpent hair layer, one pair of pointed ears with scale details, one set of scale markings for temples and limbs, and one golden reptile eye overlay. The serpent hair should be controlled, symmetrical enough for avatar readability, and not too wide for clothing compatibility. Use obsidian, basilisk green, stone gray, antique gold, smoke, and bronze. No full body, no clothing, no scenery.

Negative prompt: horror monster face, full snake body, giant fangs, gore, weapons, full character body, cluttered sheet, overlapping assets, malformed snakes, too many tiny unreadable serpents, photorealism, AI artifacting, unusable layer edges, watermark, text.
```

---

## Automaton

### Visual Identity

Automatons are elegant synthetic avatars with sacred machine bodies, porcelain shell plating, gold circuitry, black joints, and underworld machine glow. They should feel dignified, not robotic horror.

### Anatomy Notes

- humanoid synthetic body
- porcelain or bone shell plating
- visible gold circuitry
- black mechanical joints
- glowing eyes
- realistic natural proportions

### Palette

porcelain, antique gold, bronze, gunmetal, eclipse black, lumen gold

### Faction Affinity

Daedalus Foundry, Oracular Circuit, Chthonic Uprising.

### Complete Base Body Prompt

```txt
Create a full-body Hades Watch avatar base for an Automaton character on a 1024x1024 square canvas. The avatar must be centered, head-to-feet visible, with comfortable margins, and placed on a transparent background. If transparency is not possible, use a flat neutral gray background. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, realistic natural proportions, elegant but grounded anatomy, underworld technomythic details, no extreme perspective, no oversexualization, no scrawny doll anatomy, game-ready modular asset design.

The character is an elegant humanoid Automaton with healthy balanced body proportions, natural limb thickness, believable torso and hips, and a calm neutral 3/4 pose. The body is turned slightly toward the viewer, head gently facing forward, arms relaxed and slightly away from torso, hands visible, one leg relaxed slightly forward, feet visible. The body should be a clean base form with minimal synthetic underlayer styling, suitable for clothing and accessory layering.

Automaton features: porcelain or bone-colored shell plating, black mechanical joints, subtle antique gold circuitry, bronze seam accents, glowing eyes, sacred machine aesthetic, and restrained lumen-gold lines. Keep the body elegant and readable, not bulky. Do not add hair, clothing, shoes, large props, wings, weapons, or background scenery. Keep it clean for modular layering.

Negative prompt: extra characters, cropped limbs, missing hands, missing feet, warped anatomy, scrawny doll body, exaggerated skinny limbs, unrealistic proportions, extreme perspective, action pose, bulky armor, detailed outfit, props attached to base body, hair, background clutter, text, watermark, logo, signature, photorealistic uncanny face, oversexualized body, gore, violence, weapons, messy artifacts, AI artifacting, fused fingers, distorted hands, wrong number of fingers, horror robot.
```

### Complete Species Asset Prompt

```txt
Create a transparent PNG-style modular avatar asset sheet for Hades Watch Automaton species features on a 1024x1024 square canvas. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, sacred machine aesthetic, game-ready modular asset design. Background must be transparent or plain neutral gray if transparency is not possible.

Generate separate layer-ready Automaton features aligned to a relaxed neutral 3/4 avatar pose: porcelain shell face plates, shoulder shell panels, forearm panels, shin panels, gold circuit seam overlays, black joint accents, glowing eye overlays, and a small lumen core chest accent. Space each asset clearly with no full body, no clothing, no background scenery. Use porcelain, antique gold, bronze, gunmetal, eclipse black, and lumen gold. The assets must be elegant, readable, and easy to layer onto the Automaton base body.

Negative prompt: full robot character, bulky combat armor, weapons, horror robot, exposed gore, messy wires, random cables, corporate robot logo, clutter, overlapping assets, photorealism, hard shadows, unusable layer edges, AI artifacting, watermark, text.
```

---

## Wraithborn

### Visual Identity

Wraithborn are underworld spirit avatars with translucent edges, smoky aura, spectral markings, pale glowing eyes, and mist-like extremity effects. They should feel haunted and beautiful, not horror monsters.

### Anatomy Notes

- humanoid body
- ghostly translucent edges
- smoky aura
- pale glowing eyes
- spectral markings
- optional mist-like extremities
- grounded proportions

### Palette

void black, smoke gray, pale wraith, rune violet, mist veil, spectral teal

### Faction Affinity

Chthonic Uprising, Oracular Circuit, Styx Rats.

### Complete Base Body Prompt

```txt
Create a full-body Hades Watch avatar base for a Wraithborn character on a 1024x1024 square canvas. The avatar must be centered, head-to-feet visible, with comfortable margins, and placed on a transparent background. If transparency is not possible, use a flat neutral gray background. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, realistic natural proportions, elegant but grounded anatomy, underworld technomythic details, no extreme perspective, no oversexualization, no scrawny doll anatomy, game-ready modular asset design.

The character is a Wraithborn humanoid with natural balanced proportions, soft athletic tone, believable torso and hips, natural limb thickness, and a relaxed grounded 3/4 pose. The body is turned slightly toward the viewer, head gently facing forward, arms relaxed and slightly away from torso, hands visible, one leg relaxed slightly forward, feet visible. The body wears only a simple neutral fitted avatar underlayer or bodysuit.

Wraithborn features: ghostly translucent edge treatment, pale glowing eyes, faint spectral markings, subtle smoky aura kept close to the body, rune violet and spectral teal accents, void black and smoke gray undertones. Keep the body readable and layer-compatible. Do not add hair, clothing, large aura clouds, props, weapons, or background scenery. Keep the base clean for modular layering.

Negative prompt: extra characters, cropped limbs, missing hands, missing feet, warped anatomy, scrawny doll body, exaggerated skinny limbs, unrealistic proportions, extreme perspective, action pose, bulky clothing, detailed outfit, props attached to base body, hair, background clutter, text, watermark, logo, signature, photorealistic uncanny face, oversexualized body, horror monster, gore, violence, weapons, messy artifacts, AI artifacting, fused fingers, distorted hands, wrong number of fingers.
```

### Complete Species Asset Prompt

```txt
Create a transparent PNG-style modular avatar asset sheet for Hades Watch Wraithborn species features on a 1024x1024 square canvas. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, spectral underworld technomythic design, game-ready modular asset design. Background must be transparent or plain neutral gray if transparency is not possible.

Generate separate layer-ready Wraithborn features aligned to a relaxed neutral 3/4 avatar pose: close-body smoky aura layer, translucent edge overlay, pale glowing eye overlay, spectral rune markings for arms and face, mist-like hand and foot edge effects, and a faint back mist veil. Space each asset clearly with no full body, no clothing, no hair, no scenery. Use void black, smoke gray, pale wraith, rune violet, mist veil, and spectral teal. Keep the aura controlled and easy to layer without hiding clothing.

Negative prompt: horror ghost, skull face, gore, weapons, huge cloud aura, full character body, clutter, overlapping assets, photorealism, harsh shadows, unusable edges, random mist blobs, AI artifacting, watermark, text.
```

---

## 5. Gender / Presentation Guide

Use these presentation values when generating bases:

- female-presenting
- male-presenting
- nonbinary
- androgynous
- custom-unspecified

### Complete Presentation Variant Prompt

```txt
Create a full-body Hades Watch avatar base for a [PRESENTATION] humanoid character on a 1024x1024 square canvas. The avatar must be centered, head-to-feet visible, with comfortable margins, and placed on a transparent background. If transparency is not possible, use a flat neutral gray background. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, realistic natural proportions, elegant but grounded anatomy, underworld technomythic details, no extreme perspective, no oversexualization, no scrawny doll anatomy, game-ready modular asset design.

Presentation: [female-presenting / male-presenting / nonbinary / androgynous / custom-unspecified]. The body should have healthy balanced proportions, natural limb thickness, believable torso and hips, grounded posture, and soft athletic tone. Avoid exaggerated curves, exaggerated muscles, tiny waist, oversized chest, scrawny limbs, or doll-like anatomy. Use a relaxed natural 3/4 pose with the body turned slightly toward the viewer, head gently facing forward, arms relaxed and slightly away from the torso, hands visible, one leg relaxed slightly forward, feet visible. The body should wear a simple neutral fitted avatar underlayer or bodysuit for layer compatibility. Do not add hair, detailed clothing, shoes, accessories, props, or background scenery.

Negative prompt: extra characters, cropped limbs, missing hands, missing feet, warped anatomy, scrawny doll body, exaggerated skinny limbs, unrealistic proportions, extreme perspective, action pose, bulky clothing, detailed outfit, props attached to base body, hair, background clutter, text, watermark, logo, signature, photorealistic uncanny face, oversexualized body, gore, violence, weapons, messy artifacts, AI artifacting, fused fingers, distorted hands, wrong number of fingers.
```

---

## 6. Faction Visual Guide and Complete Prompts

## The Asclepian Veil

Theme: healing, harm reduction, care, field stabilization, medical literacy, privacy as medicine.  
Palette: medical green, soft gold, black clinic glass, bone white, surgical silver, pomegranate emergency red.

### Complete Base Outfit Prompt

```txt
Create a modular clothing layer for a Hades Watch avatar builder: Asclepian Veil base outfit, aligned to a relaxed neutral 3/4 full-body avatar pose on a 1024x1024 square canvas. The clothing must be centered, full body, and placed on a transparent background. If transparency is not possible, use a flat neutral gray background. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, realistic natural proportions, layer-friendly asset design.

Generate only the clothing layer, no body, no head, no hair, no hands, no face, no shoes unless part of the outfit set. The outfit should be a black clinic field coat with soft medical green glow seams, bone-white inner layer, sterile silver closures, small field medic pouches, protective veil fabric elements, and subtle serpent/rod motifs. It should feel like forbidden care, harm reduction, and underworld medical privacy. The clothing should align to a neutral 3/4 avatar body and not obscure the hands or feet.

Negative prompt: full character body, face, hair, weapons, gore, real medical logos, red cross logo, angel imagery, bulky armor, cropped clothing, background scene, text, watermark, photorealism, AI artifacting, unusable layer edges.
```

### Complete Accessory Prompt

```txt
Create a modular accessory layer for a Hades Watch avatar builder: Asclepian Veil care accessories, on a 1024x1024 square canvas with transparent background. Use cyberpunk gothic fantasy avatar-builder style, polished semi-stylized realism, clean line art, soft cel shading, readable icons, and layer-friendly spacing.

Generate separate Asclepian Veil accessories arranged clearly with spacing: a privacy veil scarf, small field medic pouch, serpent-and-fiberoptic charm, black clinic data tablet, soft green diagnostic bracelet, and emergency pomegranate tag. These are cosmetic avatar accessories only. Use medical green, soft gold, bone white, surgical silver, black clinic glass, and restrained pomegranate red. No body, no face, no hands, no background scene.

Negative prompt: real medical logos, red cross logo, gore, syringes as focal point, weapons, tactical combat gear, cluttered sheet, overlapping items, text, watermark, photorealism, AI artifacting.
```

### Complete Badge Prompt

```txt
Create a Hades Watch profile item badge for The Asclepian Veil on a 1024x1024 square canvas. The badge must be a rounded-corner square that fills the canvas, with transparent background outside the rounded square. Use cyberpunk gothic fantasy, Greek underworld care network, black clinic glass, medical green, bone white, surgical silver, soft gold, and pomegranate red accents. The central symbol is a serpent wrapped around a fiber-optic rod behind a protective veil. The badge should feel like care as infrastructure, privacy as medicine, and field stabilization. Include no extra text unless the item name is specifically requested. No gore, no real medical logos, no red cross, no weapons, no photorealism, no watermark.
```

### Complete Background Prompt

```txt
Create a Hades Watch avatar background layer for The Asclepian Veil on a 1024x1024 square canvas. The background should be a black clinic underworld care chamber, but it must not interfere with a centered full-body avatar silhouette. Use soft medical green glow, black clinic glass, bone-white privacy screens, subtle serpent/rod motifs, pomegranate emergency lights, and cyberpunk gothic Greek-underworld details. Keep the center area visually calm for avatar readability. No characters, no gore, no real medical logos, no messy equipment, no weapons, no text, no watermark, no photorealism.
```

### Complete Faction Flair Prompt

```txt
Create a modular Hades Watch faction flair effect for The Asclepian Veil on a 1024x1024 square canvas with transparent background. The effect should be layer-friendly and centered around a full-body avatar without covering the face or torso. Use soft green diagnostic glow, a faint protective veil arc, tiny pomegranate emergency sparks, and a subtle serpent pulse-line motif. The effect should communicate care, privacy, calm, and field stabilization. No body, no character, no clothing, no background scene, no gore, no weapons, no real medical logos, no text, no watermark.
```

---

## The Oracular Circuit

Theme: privacy, cryptography, signal analysis, digital defense, prophetic machines.  
Palette: electric blue, violet, black terminal, signal cyan, static white, prophecy blue.

### Complete Base Outfit Prompt

```txt
Create a modular clothing layer for a Hades Watch avatar builder: Oracular Circuit base outfit, aligned to a relaxed neutral 3/4 full-body avatar pose on a 1024x1024 square canvas. The clothing must be centered and placed on a transparent background. If transparency is not possible, use a flat neutral gray background. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, realistic natural proportions, layer-friendly asset design.

Generate only the clothing layer, no body, no head, no hair, no face, no hands, no background scene. The outfit should be a black terminal-fabric signal jacket with violet panels, electric blue circuit sigils, encrypted veil trim, subtle oracle-eye fasteners, and clean cyberpunk prophetic-machine geometry. It should feel like privacy, cryptography, defensive digital hygiene, and machine prophecy broken open. Keep it layer-friendly and avoid bulky silhouettes.

Negative prompt: full character body, hacker hoodie cliché, Matrix cosplay, real company logos, malware symbols, weapons, skull hacking symbols, photorealism, background clutter, text, watermark, AI artifacting, unusable layer edges.
```

### Complete Accessory Prompt

```txt
Create a modular accessory layer for a Hades Watch avatar builder: Oracular Circuit signal accessories, on a 1024x1024 square canvas with transparent background. Use cyberpunk gothic fantasy avatar-builder style, polished semi-stylized realism, clean line art, soft cel shading, readable icons, and layer-friendly spacing.

Generate separate Oracular Circuit accessories arranged clearly: encrypted veil collar, oracle-eye pendant, signal earpiece, black-glass wrist terminal, cipher key charm, and glitch halo fragment. Use electric blue, violet, signal cyan, black terminal surfaces, and static white. These are cosmetic digital defense and prophecy motifs only. No body, no face, no background scene.

Negative prompt: illegal hacking imagery, malware symbols, skull-and-crossbones, real company logos, weapons, clutter, overlapping items, text, watermark, photorealism, AI artifacting.
```

### Complete Badge Prompt

```txt
Create a Hades Watch profile item badge for The Oracular Circuit on a 1024x1024 square canvas. The badge must be a rounded-corner square that fills the canvas, with transparent background outside the rounded square. Use cyberpunk gothic fantasy, Greek underworld signal prophecy, black terminal glass, oracle violet, electric blue, signal cyan, static white, and prophecy blue. The central symbol is a cracked oracle eye surrounded by concentric signal rings and small cipher glyphs. The badge should feel like privacy, cryptography, digital defense, and no algorithm is divine. Include no extra text unless the item name is specifically requested. No malware symbols, no real hacking instructions, no weapons, no photorealism, no watermark.
```

### Complete Background Prompt

```txt
Create a Hades Watch avatar background layer for The Oracular Circuit on a 1024x1024 square canvas. The background should be an underworld signal terminal chamber with black glass consoles, violet haze, cyan circuit sigils, a cracked oracle-eye machine, and subtle Greek underworld data glyphs. Keep the central area calm and readable for a full-body avatar silhouette. No characters, no real company logos, no malware symbols, no weapons, no excessive glitch clutter, no text, no watermark, no photorealism.
```

### Complete Faction Flair Prompt

```txt
Create a modular Hades Watch faction flair effect for The Oracular Circuit on a 1024x1024 square canvas with transparent background. The effect should be layer-friendly and centered around a full-body avatar without covering the face or torso. Use violet signal rings, cyan encrypted glyphs, a faint cracked oracle-eye shimmer, and small black-glass static fragments. The effect should communicate privacy, prophecy-breaking, digital defense, and signal discipline. No body, no character, no clothing, no background scene, no malware symbols, no weapons, no text, no watermark.
```

---

## The Myrmidon Grinders

Theme: community defense, logistics, accessibility, de-escalation, readiness, mutual aid.  
Palette: amber warning lights, matte black, worn utility fabric, furnace bronze, concrete ash, reflective silver.

### Complete Base Outfit Prompt

```txt
Create a modular clothing layer for a Hades Watch avatar builder: Myrmidon Grinders base outfit, aligned to a relaxed neutral 3/4 full-body avatar pose on a 1024x1024 square canvas. The clothing must be centered and placed on a transparent background. If transparency is not possible, use a flat neutral gray background. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, realistic natural proportions, layer-friendly asset design.

Generate only the clothing layer, no body, no head, no hair, no face, no hands, no background scene. The outfit should be worn utility gear for nonviolent community safety: matte black jacket, furnace bronze reinforced seams, amber reflective straps, accessibility pouches, route-map patches, civic safety harness, and gatewatch motifs. It should feel like logistics, preparedness, de-escalation, mutual aid distribution, and community care under pressure. It must not look military or police.

Negative prompt: military uniform, police uniform, combat armor, weapons, tactical assault gear, aggression, full character body, face, hair, background scene, text, watermark, photorealism, AI artifacting, unusable layer edges.
```

### Complete Accessory Prompt

```txt
Create a modular accessory layer for a Hades Watch avatar builder: Myrmidon Grinders logistics accessories, on a 1024x1024 square canvas with transparent background. Use cyberpunk gothic fantasy avatar-builder style, polished semi-stylized realism, clean line art, soft cel shading, readable icons, and layer-friendly spacing.

Generate separate Myrmidon Grinders accessories arranged clearly: reflective safety sash, route-map wrist slate, supply pouch, accessibility support tag, buddy-system cord, and small gatewatch charm. Use amber warning lights, matte black, furnace bronze, concrete ash, and reflective silver. These are cosmetic nonviolent readiness and logistics accessories only. No body, no face, no background scene.

Negative prompt: weapons, police badge, military insignia, combat gear, intimidation symbols, riot imagery, clutter, overlapping items, text, watermark, photorealism, AI artifacting.
```

### Complete Badge Prompt

```txt
Create a Hades Watch profile item badge for The Myrmidon Grinders on a 1024x1024 square canvas. The badge must be a rounded-corner square that fills the canvas, with transparent background outside the rounded square. Use cyberpunk gothic fantasy, Greek underworld logistics symbolism, furnace bronze, hazard amber, matte black, concrete ash, and reflective silver. The central symbol is an underworld gate with route lines, accessibility marks, and a steady support-grid motif. The badge should feel like preparedness, community logistics, de-escalation, and strength without cruelty. Include no extra text unless the item name is specifically requested. No weapons, no police badge, no military insignia, no photorealism, no watermark.
```

### Complete Background Prompt

```txt
Create a Hades Watch avatar background layer for The Myrmidon Grinders on a 1024x1024 square canvas. The background should be a nonviolent community safety and logistics checkpoint in an underworld transit corridor, with supply crates, route maps, amber warning lights, gatewatch symbols, accessibility signage, and calm civic readiness atmosphere. Keep the center area visually clear for a full-body avatar silhouette. No police imagery, no military imagery, no weapons, no confrontation, no crowd violence, no text, no watermark, no photorealism.
```

### Complete Faction Flair Prompt

```txt
Create a modular Hades Watch faction flair effect for The Myrmidon Grinders on a 1024x1024 square canvas with transparent background. The effect should be layer-friendly and centered around a full-body avatar without covering the face or torso. Use amber route lines, bronze gate arcs, reflective safety strips, concrete ash dust, and subtle contact-tree nodes. The effect should communicate logistics, preparedness, accessibility, nonviolent support, and community care under pressure. No body, no character, no clothing, no background scene, no weapons, no police imagery, no text, no watermark.
```

---

## The Daedalus Foundry

Theme: repair, tools, fabrication, invention, self-hosting, accessibility tech.  
Palette: brass, gunmetal, workshop light, forge orange, blueprint blue, black iron.

### Complete Base Outfit Prompt

```txt
Create a modular clothing layer for a Hades Watch avatar builder: Daedalus Foundry base outfit, aligned to a relaxed neutral 3/4 full-body avatar pose on a 1024x1024 square canvas. The clothing must be centered and placed on a transparent background. If transparency is not possible, use a flat neutral gray background. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, realistic natural proportions, layer-friendly asset design.

Generate only the clothing layer, no body, no head, no hair, no face, no hands, no background scene. The outfit should be maker-lab underworld gear: black iron work jacket, brass fasteners, blueprint-blue lining, forge-orange stitch marks, tool-belt silhouette, circuit-forge details, accessibility tech patches, and labyrinth engineering motifs. It should feel like repair, self-hosting, documentation, and building exits. Keep the shape readable and layer-compatible.

Negative prompt: full character body, face, hair, weapons, weapon tools, traps, giant fantasy hammer, steampunk cliché goggles, corporate engineering logo, background clutter, text, watermark, photorealism, AI artifacting, unusable layer edges.
```

### Complete Accessory Prompt

```txt
Create a modular accessory layer for a Hades Watch avatar builder: Daedalus Foundry repair accessories, on a 1024x1024 square canvas with transparent background. Use cyberpunk gothic fantasy avatar-builder style, polished semi-stylized realism, clean line art, soft cel shading, readable icons, and layer-friendly spacing.

Generate separate Daedalus Foundry accessories arranged clearly: compact repair toolkit, blueprint tablet, brass key charm, accessibility tech badge, mesh-node device, and labyrinth schematic patch. Use brass, gunmetal, forge orange, blueprint blue, workshop light, and black iron. These are cosmetic repair, documentation, and infrastructure items only. No body, no face, no background scene.

Negative prompt: weapons, traps, destructive devices, giant hammer, steampunk cliché, corporate logos, clutter, overlapping items, text, watermark, photorealism, AI artifacting.
```

### Complete Badge Prompt

```txt
Create a Hades Watch profile item badge for The Daedalus Foundry on a 1024x1024 square canvas. The badge must be a rounded-corner square that fills the canvas, with transparent background outside the rounded square. Use cyberpunk gothic fantasy, Greek underworld maker-lab symbolism, forge orange, blueprint blue, brass, gunmetal, and black iron. The central symbol is a mechanical wing folded into a labyrinth with a hidden key and small forge spark. The badge should feel like repair, invention, access, documentation, and liberatory infrastructure. Include no extra text unless the item name is specifically requested. No weapons, no traps, no corporate engineering logo, no photorealism, no watermark.
```

### Complete Background Prompt

```txt
Create a Hades Watch avatar background layer for The Daedalus Foundry on a 1024x1024 square canvas. The background should be an underworld maker workshop with blueprint holograms, repair benches, soft forge light, brass tools, mesh-node parts, accessibility devices, and labyrinth engineering diagrams. Keep the center area clear for a full-body avatar silhouette. No weapons, no traps, no destructive devices, no corporate logos, no clutter that hides the avatar, no text, no watermark, no photorealism.
```

### Complete Faction Flair Prompt

```txt
Create a modular Hades Watch faction flair effect for The Daedalus Foundry on a 1024x1024 square canvas with transparent background. The effect should be layer-friendly and centered around a full-body avatar without covering the face or torso. Use forge-orange sparks, blueprint-blue schematic lines, brass labyrinth arcs, small mesh-node glows, and a hidden key motif. The effect should communicate repair, invention, accessibility, and building exits. No body, no character, no clothing, no background scene, no weapons, no traps, no text, no watermark.
```

---

## The Styx Rats

Theme: morale, art, zines, culture jamming, music, stickers, net-neighbor energy.  
Palette: neon pink, acid green, grime black, chrome scratch, bruise purple, warm amber.

### Complete Base Outfit Prompt

```txt
Create a modular clothing layer for a Hades Watch avatar builder: Styx Rats base outfit, aligned to a relaxed neutral 3/4 full-body avatar pose on a 1024x1024 square canvas. The clothing must be centered and placed on a transparent background. If transparency is not possible, use a flat neutral gray background. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, realistic natural proportions, layer-friendly asset design.

Generate only the clothing layer, no body, no head, no hair, no face, no hands, no background scene. The outfit should be underworld punk morale gear: black patchwork jacket, neon pink and acid green accents, stickerbomb panels, zine-paper patches, scratched chrome details, grime-black fabric, and small broken halo or rat-tail motifs. It should feel like harmless culture jamming, morale, art, music, community humor, and resistance storytelling. Keep it readable and not too bulky.

Negative prompt: full character body, face, hair, weapons, vandalism instructions, clown styling, Harley Quinn copy, real political caricatures, threatening symbols, background scene, text, watermark, photorealism, AI artifacting, unusable layer edges.
```

### Complete Accessory Prompt

```txt
Create a modular accessory layer for a Hades Watch avatar builder: Styx Rats morale accessories, on a 1024x1024 square canvas with transparent background. Use cyberpunk gothic fantasy avatar-builder style, polished semi-stylized realism, clean line art, soft cel shading, readable icons, and layer-friendly spacing.

Generate separate Styx Rats accessories arranged clearly: zine bundle, sticker sheet, music player charm, neon patch, tiny rat-tail charm, harmless paste-up art roll, and broken halo pin. Use neon pink, acid green, grime black, chrome scratch, bruise purple, and warm amber. These are cosmetic morale and creative resistance items only. No body, no face, no background scene.

Negative prompt: vandalism instructions, threats, weapons, clown styling, real political caricatures, copyrighted characters, clutter, overlapping items, text, watermark, photorealism, AI artifacting.
```

### Complete Badge Prompt

```txt
Create a Hades Watch profile item badge for The Styx Rats on a 1024x1024 square canvas. The badge must be a rounded-corner square that fills the canvas, with transparent background outside the rounded square. Use cyberpunk gothic fantasy, Greek underworld punk morale symbolism, neon pink, acid green, grime black, chrome scratch, and bruise purple. The central symbol is a ghostly sticker mark with a rat-tail flourish, zine-paper texture, and broken neon halo. The badge should feel like joy as sabotage, harmless creative morale, public storytelling, and underworld humor. Include no extra text unless the item name is specifically requested. No weapons, no threatening symbols, no real political caricatures, no photorealism, no watermark.
```

### Complete Background Prompt

```txt
Create a Hades Watch avatar background layer for The Styx Rats on a 1024x1024 square canvas. The background should be a harmless underworld zine wall and music corner with neon pink, acid green, grime black, stickerbomb textures, poster fragments, zine shelves, and playful cyberpunk Greek-underworld symbols. Keep the center area clear for a full-body avatar silhouette. No illegal vandalism scene, no threats, no weapons, no real political caricatures, no copyrighted characters, no text-heavy clutter, no watermark, no photorealism.
```

### Complete Faction Flair Prompt

```txt
Create a modular Hades Watch faction flair effect for The Styx Rats on a 1024x1024 square canvas with transparent background. The effect should be layer-friendly and centered around a full-body avatar without covering the face or torso. Use neon pink morale sparks, acid green sticker fragments, soft zine-paper flutter, small rat-tail signal lines, and a broken halo glow. The effect should communicate creative morale, music, humor, and harmless culture jamming. No body, no character, no clothing, no background scene, no weapons, no threats, no text, no watermark.
```

---

## Chthonic Uprising

Theme: alliance mark, Archivist signal, Dead Index memory, underworld resistance.  
Palette: pomegranate red, bone white, black, antique gold, ghost white, ultraviolet.

### Complete Base Outfit Prompt

```txt
Create a modular clothing layer for a Hades Watch avatar builder: Chthonic Uprising alliance outfit, aligned to a relaxed neutral 3/4 full-body avatar pose on a 1024x1024 square canvas. The clothing must be centered and placed on a transparent background. If transparency is not possible, use a flat neutral gray background. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, realistic natural proportions, layer-friendly asset design.

Generate only the clothing layer, no body, no head, no hair, no face, no hands, no background scene. The outfit should be an underworld resistance alliance layer: black longline jacket or mantle, pomegranate red lining, bone-white stitchwork, antique gold dead-index glyphs, subtle broken laurel marks, and hidden pocket details. It should feel like memory as resistance, archive culture, and collective underworld solidarity. Keep it modular and readable.

Negative prompt: full character body, face, hair, royal crown, throne imagery, military uniform, weapons, gore, real political symbols, background scene, text, watermark, photorealism, AI artifacting, unusable layer edges.
```

### Complete Accessory Prompt

```txt
Create a modular accessory layer for a Hades Watch avatar builder: Chthonic Uprising alliance accessories, on a 1024x1024 square canvas with transparent background. Use cyberpunk gothic fantasy avatar-builder style, polished semi-stylized realism, clean line art, soft cel shading, readable icons, and layer-friendly spacing.

Generate separate Chthonic Uprising accessories arranged clearly: black pomegranate charm, bone-white archive tag, antique gold broken laurel pin, ghost-white dead index glyph, small Underwatch signal token, and pomegranate-red scarf strip. These are cosmetic alliance identity items only. No body, no face, no background scene.

Negative prompt: royal crown, throne, military insignia, weapons, real political symbols, gore, clutter, overlapping items, text, watermark, photorealism, AI artifacting.
```

### Complete Badge Prompt

```txt
Create a Hades Watch profile item badge for The Chthonic Uprising on a 1024x1024 square canvas. The badge must be a rounded-corner square that fills the canvas, with transparent background outside the rounded square. Use cyberpunk gothic fantasy, Greek underworld archive-resistance symbolism, pomegranate red, bone white, black, antique gold, ghost white, and ultraviolet accents. The central symbol is a black pomegranate split open over a circuit labyrinth, with five glowing seeds and a broken laurel behind it. The badge should feel like memory as resistance, alliance solidarity, and the Dead Index. Include no extra text unless the item name is specifically requested. No royal crown, no military insignia, no weapons, no photorealism, no watermark.
```

### Complete Background Prompt

```txt
Create a Hades Watch avatar background layer for The Chthonic Uprising on a 1024x1024 square canvas. The background should be a Dead Index archive chamber with black pomegranate symbols, bone-white record tags, antique gold circuit labyrinths, ghost-white signal fragments, ultraviolet memory glow, and underworld civic ruins. Keep the center clear for a full-body avatar silhouette. No throne, no royal palace, no weapons, no gore, no real political symbols, no text-heavy clutter, no watermark, no photorealism.
```

### Complete Faction Flair Prompt

```txt
Create a modular Hades Watch faction flair effect for The Chthonic Uprising on a 1024x1024 square canvas with transparent background. The effect should be layer-friendly and centered around a full-body avatar without covering the face or torso. Use pomegranate red signal sparks, bone-white archive glyphs, antique gold broken laurel arcs, ghost-white memory shards, and a subtle circuit-labyrinth aura. The effect should communicate alliance solidarity, memory as resistance, and the Dead Index. No body, no character, no clothing, no background scene, no crown, no weapons, no text, no watermark.
```

---

## 7. Complete Base Body Prompt Templates

## Default 3/4 Base Body Prompt

```txt
Create a full-body Hades Watch avatar base for a [SPECIES] [PRESENTATION] character on a 1024x1024 square canvas. The avatar must be centered, head-to-feet visible, with comfortable margins, and placed on a transparent background. If transparency is not possible, use a flat neutral gray background. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, realistic natural proportions, elegant but grounded anatomy, underworld technomythic details, no extreme perspective, no oversexualization, no scrawny doll anatomy, game-ready modular asset design.

Use a relaxed natural 3/4 pose with the body turned slightly toward the viewer, head gently facing forward, arms relaxed and slightly away from the torso, hands visible and relaxed, one leg relaxed slightly forward or to the side, stable grounded stance, full body visible from head to feet. The body should have healthy balanced proportions, natural limb thickness, believable torso and hips, soft athletic tone, and consistent avatar-builder alignment. The body should wear only a simple neutral fitted underlayer or bodysuit. Include only essential [SPECIES] traits that belong on the base body and keep them layer-friendly. Do not include hair, detailed clothing, shoes, jewelry, props, wings, bulky details, or background scenery.

Negative prompt: extra characters, cropped limbs, missing hands, missing feet, warped anatomy, scrawny doll body, exaggerated skinny limbs, unrealistic proportions, extreme perspective, action pose, bulky clothing, detailed outfit, props attached to base body, hair, background clutter, text, watermark, logo, signature, photorealistic uncanny face, oversexualized body, gore, violence, weapons, messy artifacts, AI artifacting, fused fingers, distorted hands, wrong number of fingers.
```

## Front-Facing Paper-Doll Base Prompt

```txt
Create a full-body Hades Watch avatar base for a [SPECIES] [PRESENTATION] character on a 1024x1024 square canvas. The avatar must be centered, head-to-feet visible, symmetrical, with comfortable margins, and placed on a transparent background. If transparency is not possible, use a flat neutral gray background. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, realistic natural proportions, elegant but grounded anatomy, underworld technomythic details, no oversexualization, no scrawny doll anatomy, game-ready modular asset design.

Use a front-facing neutral paper-doll pose for maximum clothing compatibility: head facing forward, shoulders level, arms relaxed slightly away from torso, hands visible, legs straight but natural, feet visible and evenly placed. The body should have healthy balanced proportions, natural limb thickness, believable torso and hips, soft athletic tone, and consistent avatar-builder alignment. The body should wear only a simple neutral fitted underlayer or bodysuit. Include only essential [SPECIES] traits that belong on the base body and keep them layer-friendly. Do not include hair, detailed clothing, shoes, jewelry, props, wings, bulky details, or background scenery.

Negative prompt: extra characters, cropped limbs, missing hands, missing feet, warped anatomy, scrawny doll body, exaggerated skinny limbs, unrealistic proportions, extreme perspective, action pose, bulky clothing, detailed outfit, props attached to base body, hair, background clutter, text, watermark, logo, signature, photorealistic uncanny face, oversexualized body, gore, violence, weapons, messy artifacts, AI artifacting, fused fingers, distorted hands, wrong number of fingers.
```

---

## 8. Complete Species Feature Prompt Templates

## Horn Layer Prompt

```txt
Create a modular horn layer asset for a Hades Watch avatar builder on a 1024x1024 square canvas with transparent background. The horns must align to a relaxed neutral 3/4 humanoid avatar head pose. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, realistic natural proportions, underworld technomythic detail, and game-ready modular asset design.

Generate only the horn layer, no head, no face, no hair, no body, no clothing, no background scene. The horns should be [HORN STYLE], shaped for [SPECIES], with clean edges, readable silhouette, and correct 3/4 perspective. Use [COLOR PALETTE]. The asset should be easy to cut out and layer above hair or behind hair depending on avatar builder order.

Negative prompt: full character, face, hair, body, clothing, background clutter, weapons, gore, oversized horns that break the canvas, malformed horns, inconsistent perspective, text, watermark, logo, photorealism, harsh shadows, AI artifacting, fused shapes.
```

## Ear Layer Prompt

```txt
Create a modular ear layer asset for a Hades Watch avatar builder on a 1024x1024 square canvas with transparent background. The ears must align to a relaxed neutral 3/4 humanoid avatar head pose. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, realistic natural proportions, underworld technomythic detail, and game-ready modular asset design.

Generate only the ear layer, no head, no face, no hair, no body, no clothing, no background scene. The ears should be [EAR STYLE] for [SPECIES], with clean edges, readable shape, and correct 3/4 perspective. Use [COLOR PALETTE]. The asset should be easy to cut out and layer behind or above hair.

Negative prompt: full character, face, hair, body, clothing, background clutter, weapons, gore, malformed ears, mismatched ears, inconsistent perspective, text, watermark, logo, photorealism, harsh shadows, AI artifacting, fused shapes.
```

## Tail Layer Prompt

```txt
Create a modular tail layer asset for a Hades Watch avatar builder on a 1024x1024 square canvas with transparent background. The tail must align to a relaxed neutral 3/4 full-body humanoid avatar pose. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, realistic natural proportions, underworld technomythic detail, and game-ready modular asset design.

Generate only the tail layer, no body, no clothing, no head, no hair, no background scene. The tail should be [TAIL STYLE] for [SPECIES], positioned to layer behind the avatar body and clothing. It should curve naturally without covering the torso or legs. Use [COLOR PALETTE]. Keep the tail elegant, readable, and easy to isolate.

Negative prompt: full character, body, clothing, background clutter, weapons, gore, oversized tail, messy tail, malformed tail, inconsistent perspective, text, watermark, logo, photorealism, harsh shadows, AI artifacting.
```

## Wing Layer Prompt

```txt
Create a modular wing layer asset for a Hades Watch avatar builder on a 1024x1024 square canvas with transparent background. The wings must align to a relaxed neutral 3/4 full-body humanoid avatar pose. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, realistic natural proportions, underworld technomythic detail, and game-ready modular asset design.

Generate only the wing layer, no body, no clothing, no head, no hair, no background scene. The wings should be [WING STYLE], positioned behind the avatar body, symmetrical enough for readability, and not so large that they break the canvas or block the avatar silhouette. Use [COLOR PALETTE]. These wings are cosmetic only and should feel mythic, occult, or cyberpunk, not combat-focused.

Negative prompt: full character, body, clothing, background clutter, weapons, gore, giant wings cropped by canvas, malformed wings, inconsistent perspective, excessive detail, text, watermark, logo, photorealism, harsh shadows, AI artifacting.
```

## Markings Layer Prompt

```txt
Create a modular markings overlay layer for a Hades Watch avatar builder on a 1024x1024 square canvas with transparent background. The markings must align to a relaxed neutral 3/4 full-body humanoid avatar pose. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, underworld technomythic detail, and game-ready modular asset design.

Generate only the markings overlay, no full body, no clothing, no hair, no face, no background scene. The markings should be [MARKING STYLE] for [SPECIES], designed to fit arms, face, torso, or legs as specified. Use [COLOR PALETTE]. Keep the markings clear, layer-friendly, not too dense, and easy to overlay onto the base body.

Negative prompt: full character, clothing, background clutter, weapons, gore, unreadable tattoo clutter, random symbols, real extremist symbols, text, watermark, logo, photorealism, harsh shadows, AI artifacting, unusable layer edges.
```

---

## 9. Complete Clothing Layer Prompt Templates

## Top Layer Prompt

```txt
Create a modular top clothing layer for a Hades Watch avatar builder on a 1024x1024 square canvas with transparent background. The top must align to a relaxed neutral 3/4 full-body humanoid avatar pose. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, realistic natural proportions, cyberpunk gothic underworld detail, and game-ready modular asset design.

Generate only the top clothing layer, no body, no face, no hair, no hands, no background scene. The item is [TOP NAME], a [FACTION OR STYLE] top with [DETAILS]. It should fit naturally over the avatar torso, leave the neck and hands clear, and not block other layers. Use [COLOR PALETTE]. Keep the shape readable, not bulky, and aligned to the default 3/4 pose.

Negative prompt: full character, body, face, hair, background clutter, cropped clothing, weapons, gore, real logos, text, watermark, logo, photorealism, harsh shadows, AI artifacting, unusable layer edges.
```

## Pants Layer Prompt

```txt
Create a modular pants clothing layer for a Hades Watch avatar builder on a 1024x1024 square canvas with transparent background. The pants must align to a relaxed neutral 3/4 full-body humanoid avatar pose. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, realistic natural proportions, cyberpunk gothic underworld detail, and game-ready modular asset design.

Generate only the pants layer, no body, no face, no hair, no shoes unless attached by design, no background scene. The item is [PANTS NAME], a [FACTION OR STYLE] pants layer with [DETAILS]. It should fit the avatar hips and legs naturally, keep feet clear for shoe layers, and not block other layers. Use [COLOR PALETTE]. Keep the shape readable and aligned to the default 3/4 pose.

Negative prompt: full character, body, face, hair, background clutter, cropped clothing, weapons, gore, real logos, text, watermark, logo, photorealism, harsh shadows, AI artifacting, unusable layer edges.
```

## Outerwear Layer Prompt

```txt
Create a modular outerwear clothing layer for a Hades Watch avatar builder on a 1024x1024 square canvas with transparent background. The outerwear must align to a relaxed neutral 3/4 full-body humanoid avatar pose. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, realistic natural proportions, cyberpunk gothic underworld detail, and game-ready modular asset design.

Generate only the outerwear layer, no body, no face, no hair, no background scene. The item is [OUTERWEAR NAME], a [FACTION OR STYLE] jacket, coat, cloak, mantle, or harness with [DETAILS]. It should layer over tops while keeping hands and legs readable. Avoid oversized shapes that block the base body. Use [COLOR PALETTE]. Keep the shape aligned to the default 3/4 pose.

Negative prompt: full character, body, face, hair, background clutter, cropped clothing, weapons, gore, real logos, text, watermark, logo, photorealism, harsh shadows, AI artifacting, unusable layer edges, bulky unreadable silhouette.
```

## Shoes Layer Prompt

```txt
Create a modular shoe layer for a Hades Watch avatar builder on a 1024x1024 square canvas with transparent background. The shoes must align to a relaxed neutral 3/4 full-body humanoid avatar pose. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, cyberpunk gothic underworld detail, and game-ready modular asset design.

Generate only the shoes, no body, no legs unless required as minimal alignment guide, no clothing, no background scene. The item is [SHOE NAME], a [FACTION OR STYLE] shoe layer with [DETAILS]. The shoes should align to the default avatar feet, preserve clear left and right foot orientation, and fit naturally. Use [COLOR PALETTE]. Keep the shape readable and not too detailed.

Negative prompt: full character, background clutter, cropped shoes, weapons, gore, real logos, text, watermark, logo, photorealism, harsh shadows, malformed shoes, wrong perspective, AI artifacting, unusable layer edges.
```

---

## 10. Complete Hair Layer Prompt Templates

## Short Hair Prompt

```txt
Create a modular short hair layer for a Hades Watch avatar builder on a 1024x1024 square canvas with transparent background. The hair must align to a relaxed neutral 3/4 humanoid avatar head pose. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, grounded anatomy, and game-ready modular asset design.

Generate only the hair layer, no face, no head, no body, no clothing, no background scene. The hair is [HAIR NAME], a short [STYLE] hairstyle with [DETAILS], compatible with [SPECIES] features such as horns, ears, serpent crown, or automaton panels if specified. Use [HAIR COLOR]. The shape should be clean, readable, and easy to layer over the base head.

Negative prompt: full character, face, head, body, clothing, background clutter, text, watermark, logo, photorealism, harsh shadows, melted hair, unusable layer edges, AI artifacting.
```

## Medium Hair Prompt

```txt
Create a modular medium-length hair layer for a Hades Watch avatar builder on a 1024x1024 square canvas with transparent background. The hair must align to a relaxed neutral 3/4 humanoid avatar head pose. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, grounded anatomy, and game-ready modular asset design.

Generate only the hair layer, no face, no head, no body, no clothing, no background scene. The hair is [HAIR NAME], a medium [STYLE] hairstyle with [DETAILS], compatible with [SPECIES] features such as horns, ears, serpent crown, or automaton panels if specified. Use [HAIR COLOR]. The shape should frame the head cleanly and not cover too much of the torso.

Negative prompt: full character, face, head, body, clothing, background clutter, text, watermark, logo, photorealism, harsh shadows, melted hair, unusable layer edges, AI artifacting.
```

## Long Hair Prompt

```txt
Create a modular long hair layer for a Hades Watch avatar builder on a 1024x1024 square canvas with transparent background. The hair must align to a relaxed neutral 3/4 humanoid avatar head pose and upper body silhouette. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, grounded anatomy, and game-ready modular asset design.

Generate only the hair layer, no face, no head, no body, no clothing, no background scene. The hair is [HAIR NAME], a long [STYLE] hairstyle with [DETAILS], compatible with [SPECIES] features such as horns, ears, serpent crown, or automaton panels if specified. Use [HAIR COLOR]. The shape should remain readable, avoid covering the hands and major clothing zones, and layer cleanly behind or above the body.

Negative prompt: full character, face, head, body, clothing, background clutter, text, watermark, logo, photorealism, harsh shadows, melted hair, huge tangled hair mass, unusable layer edges, AI artifacting.
```

## Braids / Locs Prompt

```txt
Create a modular braided or loc hairstyle layer for a Hades Watch avatar builder on a 1024x1024 square canvas with transparent background. The hair must align to a relaxed neutral 3/4 humanoid avatar head pose. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, grounded anatomy, and game-ready modular asset design.

Generate only the hair layer, no face, no head, no body, no clothing, no background scene. The hair is [HAIR NAME], a [BRAID OR LOC STYLE] with [DETAILS], designed respectfully and clearly, compatible with [SPECIES] features if specified. Use [HAIR COLOR] and optional underworld accent beads or signal-thread accents. Keep the shape clean, modular, and not too dense for avatar UI.

Negative prompt: full character, face, head, body, clothing, background clutter, text, watermark, logo, photorealism, harsh shadows, melted hair, cultural caricature, unusable layer edges, AI artifacting.
```

## Punk / Cyberpunk Hair Prompt

```txt
Create a modular punk cyberpunk hair layer for a Hades Watch avatar builder on a 1024x1024 square canvas with transparent background. The hair must align to a relaxed neutral 3/4 humanoid avatar head pose. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, grounded anatomy, and game-ready modular asset design.

Generate only the hair layer, no face, no head, no body, no clothing, no background scene. The hair is [HAIR NAME], a punk cyberpunk [STYLE] with [DETAILS], compatible with [SPECIES] features if specified. Use [HAIR COLOR] with optional neon accent streaks. The hair should feel Hades Watch, underworld, and expressive without becoming too large or blocking other layers.

Negative prompt: full character, face, head, body, clothing, background clutter, text, watermark, logo, photorealism, harsh shadows, clown styling, copied character design, unusable layer edges, AI artifacting.
```

---

## 11. Complete Face / Eyes / Emotion Prompt Templates

## Eye Layer Prompt

```txt
Create a modular eye layer for a Hades Watch avatar builder on a 1024x1024 square canvas with transparent background. The eyes must align to a relaxed neutral 3/4 humanoid avatar face pose. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable expression, and game-ready modular asset design.

Generate only the eye layer, no full face, no head, no hair, no body, no clothing, no background scene. Eye style: [EYE STYLE]. Eye color: [EYE COLOR]. Species compatibility: [SPECIES]. The eyes should be clear, expressive, readable at avatar size, and aligned for the default head position.

Negative prompt: full character, face, head, hair, body, clothing, background clutter, text, watermark, logo, photorealism, horror eyes unless requested, asymmetrical unintended eyes, malformed pupils, AI artifacting.
```

## Expression Set Prompt

```txt
Create a modular expression asset sheet for a Hades Watch avatar builder on a 1024x1024 square canvas with transparent background. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable expression, natural facial proportions, and game-ready modular asset design.

Generate seven separate face-expression layers aligned to the same relaxed neutral 3/4 avatar head pose: neutral, smirk, focused, haunted, angry, soft, and glitch. Arrange them evenly with clear spacing. Each expression should include eyes, eyebrows, nose, and mouth only, with no hair, no body, no clothing, and no background scene. The glitch expression should use subtle cyberpunk distortion and signal artifacts, not messy AI artifacts. Keep all expressions consistent in face shape and scale.

Negative prompt: full characters, hair, bodies, clothing, background clutter, text, watermark, logo, photorealistic uncanny faces, overexaggerated anime expressions, distorted anatomy, inconsistent face shapes, AI artifacting.
```

## Single Face Prompt

```txt
Create a modular [EXPRESSION] face layer for a Hades Watch avatar builder on a 1024x1024 square canvas with transparent background. The face must align to a relaxed neutral 3/4 humanoid avatar head pose. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable expression, natural facial proportions, and game-ready modular asset design.

Generate only the face layer: eyes, eyebrows, nose, and mouth expressing [EXPRESSION DESCRIPTION]. Species compatibility: [SPECIES]. No hair, no full head, no body, no clothing, no background scene. The face should be readable at avatar size, emotionally clear, and not uncanny or oversexualized.

Negative prompt: full character, hair, body, clothing, background clutter, text, watermark, logo, photorealistic uncanny face, distorted features, overexaggerated expression, horror face unless requested, gore, AI artifacting.
```

---

## 12. Complete Fictional Props & Tech Gear Prompt Templates

## General Fictional Prop Prompt

```txt
Create a modular fictional prop and tech gear asset for a Hades Watch avatar builder on a 1024x1024 square canvas with transparent background. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, underworld technomythic detail, and game-ready modular asset design.

Generate only the cosmetic prop asset: [PROP NAME]. Category: Fictional Props & Tech Gear. It should feel like [FACTION OR THEME] and include [DETAILS]. Use [COLOR PALETTE]. The item is symbolic and cosmetic only, designed for avatar display and dossier flavor. It should not imply real-world use, harm, combat, sabotage, or illegal action. No body, no hands, no character, no background scene unless the prop requires minimal glow.

Negative prompt: real weapon, functional weapon, real tactical device, illegal hacking tool, sabotage device, gore, violence, realistic harm instruction, full character, hands, background clutter, text, watermark, logo, photorealism, harsh shadows, AI artifacting, unusable layer edges.
```

## Underworld Terminal Prop

```txt
Create a modular fictional terminal prop for a Hades Watch avatar builder on a 1024x1024 square canvas with transparent background. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, underworld technomythic detail, and game-ready modular asset design.

Generate only a small cosmetic underworld terminal device, suitable as an avatar side prop. The terminal should have black-glass surfaces, violet and cyan signal glow, pomegranate-black interface marks, and subtle Greek underworld circuit glyphs. It should feel like an archive terminal or signal console, not a real hacking device. No character, no hands, no background scene.

Negative prompt: real hacking instructions, code text, malware symbols, real company logos, weapons, full character, hands, background clutter, watermark, photorealism, AI artifacting, unusable layer edges.
```

## Care Kit Prop

```txt
Create a modular fictional medical kit cosmetic prop for a Hades Watch avatar builder on a 1024x1024 square canvas with transparent background. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, underworld technomythic detail, and game-ready modular asset design.

Generate only a compact Asclepian Veil care kit prop, with black clinic material, veil green glow seam, bone-white label area, small serpent-and-rod motif, pomegranate emergency tag, and soft gold latches. It should feel like care readiness and privacy as medicine. It must not include real medical branding or real medical instructions. No character, no hands, no background scene.

Negative prompt: red cross logo, real medical logos, gore, exposed needles as focal point, real instructions, weapons, full character, background clutter, text, watermark, photorealism, AI artifacting.
```

## Repair Toolkit Prop

```txt
Create a modular fictional repair toolkit cosmetic prop for a Hades Watch avatar builder on a 1024x1024 square canvas with transparent background. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, underworld technomythic detail, and game-ready modular asset design.

Generate only a compact Daedalus Foundry repair toolkit prop, with black iron case, brass latches, forge-orange glow, blueprint-blue schematic edge, and small labyrinth key motif. The tools should be stylized repair and accessibility tools, not weapons or destructive devices. No character, no hands, no background scene.

Negative prompt: weapons, traps, destructive devices, giant hammer, steampunk cliché, real brand logos, full character, background clutter, text, watermark, photorealism, AI artifacting.
```

## Zine Sheet Prop

```txt
Create a modular fictional zine and sticker sheet cosmetic prop for a Hades Watch avatar builder on a 1024x1024 square canvas with transparent background. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, underworld technomythic detail, and game-ready modular asset design.

Generate only a small Styx Rats zine bundle and sticker sheet prop, with neon pink, acid green, grime black, scratched chrome, broken halo marks, rat-tail doodles, and pomegranate seed icons. Any writing should be decorative marks, not real slogans, unless an item name is requested. The prop should feel like morale, art, music, and harmless culture jamming. No character, no hands, no background scene.

Negative prompt: real political caricatures, threats, slurs, vandalism instructions, copyrighted characters, weapons, full character, background clutter, watermark, photorealism, AI artifacting.
```

---

## 13. Complete Background Prompt Templates

## General Avatar Background Prompt

```txt
Create a Hades Watch avatar background layer on a 1024x1024 square canvas. The background must be centered, readable, and designed to sit behind a full-body avatar without interfering with the silhouette. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable shapes, underworld technomythic detail, and game-ready background design.

Background theme: [BACKGROUND THEME]. Include [DETAILS]. Keep the central figure area visually calm and lower contrast so an avatar can be placed on top. Avoid busy detail behind the face, torso, hands, and feet. Use [COLOR PALETTE]. No characters, no foreground props blocking the center, no heavy cast shadows, no text, no watermark, no real logos, no weapons, no photorealism.

Negative prompt: character, people, crowded scene, foreground objects blocking avatar, cropped frame, text, watermark, logo, real political symbols, weapons, gore, harsh lighting, high contrast behind avatar silhouette, clutter, AI artifacting.
```

## Dead Index Archive Background

```txt
Create a Hades Watch avatar background layer on a 1024x1024 square canvas. The background should be a Dead Index archive chamber beneath a broken civic library, designed to sit behind a full-body avatar without interfering with the silhouette. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable shapes, underworld technomythic detail, and game-ready background design.

Include black pomegranate symbols, bone-white record tags, antique gold circuit labyrinths, ghost-white signal fragments, ultraviolet memory glow, old civic tablets, and quiet server stacks. Keep the central figure area calm, darker, and readable for avatar placement. No characters, no foreground props blocking the center, no text-heavy clutter, no weapons, no gore, no real political symbols, no watermark, no photorealism.
```

## Black Clinic Background

```txt
Create a Hades Watch avatar background layer on a 1024x1024 square canvas. The background should be an Asclepian Veil black clinic chamber, designed to sit behind a full-body avatar without interfering with the silhouette. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable shapes, underworld technomythic detail, and game-ready background design.

Include black clinic glass, soft veil-green diagnostic glow, bone-white privacy screens, subtle serpent/rod symbols, pomegranate emergency lights, folded care blankets, and quiet underground architecture. Keep the center visually calm and readable for avatar placement. No characters, no gore, no real medical logos, no red cross symbol, no weapons, no text-heavy clutter, no watermark, no photorealism.
```

## Signal Terminal Background

```txt
Create a Hades Watch avatar background layer on a 1024x1024 square canvas. The background should be an Oracular Circuit signal terminal chamber, designed to sit behind a full-body avatar without interfering with the silhouette. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable shapes, underworld technomythic detail, and game-ready background design.

Include black glass terminals, violet signal haze, cyan circuit sigils, a cracked oracle-eye machine, encrypted veil motifs, and subtle Greek underworld data glyphs. Keep the central figure area calm and readable. No characters, no real hacking code, no malware symbols, no weapons, no text-heavy clutter, no watermark, no photorealism.
```

## Foundry Workshop Background

```txt
Create a Hades Watch avatar background layer on a 1024x1024 square canvas. The background should be a Daedalus Foundry underworld workshop, designed to sit behind a full-body avatar without interfering with the silhouette. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable shapes, underworld technomythic detail, and game-ready background design.

Include blueprint holograms, repair benches, forge-orange light, brass tools, black iron surfaces, mesh-node parts, accessibility devices, and labyrinth engineering diagrams. Keep the central figure area clear and readable. No weapons, no traps, no destructive devices, no corporate logos, no text-heavy clutter, no watermark, no photorealism.
```

## Zine Wall Background

```txt
Create a Hades Watch avatar background layer on a 1024x1024 square canvas. The background should be a Styx Rats underworld zine wall and music corner, designed to sit behind a full-body avatar without interfering with the silhouette. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable shapes, underworld technomythic detail, and game-ready background design.

Include neon pink and acid green accents, grime black wall textures, stickerbomb shapes, zine shelves, poster fragments, harmless public art motifs, and broken halo symbols. Keep the center clear for avatar placement. No illegal vandalism scene, no threats, no real political caricatures, no copyrighted characters, no weapons, no text-heavy clutter, no watermark, no photorealism.
```

## Gatewatch Checkpoint Background

```txt
Create a Hades Watch avatar background layer on a 1024x1024 square canvas. The background should be a nonviolent Myrmidon Grinders gatewatch logistics checkpoint in an underworld transit corridor, designed to sit behind a full-body avatar without interfering with the silhouette. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable shapes, underworld technomythic detail, and game-ready background design.

Include supply crates, route maps, amber warning lights, accessibility signs, buddy-system notes, civic safety markers, and a sturdy underworld gate motif. Keep the central figure area calm and readable. No police imagery, no military imagery, no weapons, no crowd confrontation, no violence, no text-heavy clutter, no watermark, no photorealism.
```

---

## 14. Complete Badge / Icon Prompt Templates

## General Badge Prompt

```txt
Create a Hades Watch profile badge icon on a 1024x1024 square canvas. The badge must be a rounded-corner square that fills the full square, with transparent background outside the rounded square. Use Hades Watch cyberpunk gothic fantasy, Greek underworld resistance, techno-dystopian dossier style, polished semi-stylized icon art, clean line art, soft cel shading, readable centered emblem, subtle hand-painted texture, and game-ready website badge design.

Badge name: [BADGE NAME]. Faction or theme: [FACTION OR THEME]. Central symbol: [SYMBOL]. Meaning: [MEANING]. Use [COLOR PALETTE]. The full badge name should appear clearly on the badge only if requested. Do not add extra slogans or random text. The badge should be readable at small profile size and feel like part of a uniform Hades Watch badge system.

Negative prompt: sticker peel corner, folded corner, rectangular card background, scene background outside badge, photorealism, corporate logo, watermark, signature, weapons, gore, real political symbols, real organization logos, police badge, military insignia, cluttered details, unreadable text, AI artifacting, melted linework.
```

## Badge With Full Text Prompt

```txt
Create a Hades Watch profile badge icon on a 1024x1024 square canvas. The badge must be a rounded-corner square that fills the full square, with transparent background outside the rounded square. Use Hades Watch cyberpunk gothic fantasy, Greek underworld resistance, techno-dystopian dossier style, polished semi-stylized icon art, clean line art, soft cel shading, readable centered emblem, subtle hand-painted texture, and game-ready website badge design.

Badge name on badge: [BADGE NAME]. The full badge name must be clearly readable and correctly spelled. Faction or theme: [FACTION OR THEME]. Central symbol: [SYMBOL]. Meaning: [MEANING]. Use [COLOR PALETTE]. Do not add extra slogans, placeholder words, extra labels, or random text. No sticker peel, no folded corner, no background outside the rounded square. The badge should be readable at small profile size and feel like part of a uniform Hades Watch badge system.

Negative prompt: sticker peel corner, folded corner, rectangular card background, scene background outside badge, photorealism, corporate logo, watermark, signature, weapons, gore, real political symbols, real organization logos, police badge, military insignia, cluttered details, misspelled badge name, unreadable text, AI artifacting, melted linework.
```

---

## 15. Complete Item Sheet Prompt Templates

## Single Category Item Sheet

```txt
Create a Hades Watch avatar item sheet on a 1024x1024 square canvas with transparent background. Generate [NUMBER] modular assets from the same category: [CATEGORY]. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouettes, underworld technomythic detail, and game-ready modular asset design.

All items should be evenly spaced, isolated, and easy to cut into separate transparent PNG layers. The items should share one consistent style, line weight, lighting logic, and production quality. Item theme: [THEME]. Faction or species compatibility: [FACTION OR SPECIES]. Use [COLOR PALETTE]. Do not generate a full character unless the category is base body. Do not add background scenery. Labels are optional only if requested and should stay outside the item art.

Negative prompt: overlapping items, full character body unless requested, background clutter, cropped items, inconsistent style, weapons, gore, real logos, text unless requested, watermark, logo, signature, photorealism, harsh shadows, AI artifacting, unusable layer edges.
```

## Clothing Set Sheet

```txt
Create a Hades Watch avatar clothing set sheet on a 1024x1024 square canvas with transparent background. Generate a complete modular outfit set aligned to the relaxed neutral 3/4 full-body avatar pose. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, realistic natural proportions, underworld technomythic detail, and game-ready modular asset design.

Generate separate clothing layers with clear spacing: top, pants or skirt, outerwear, shoes, belt or harness, gloves or wrist item, and optional faction accessory. Outfit theme: [OUTFIT THEME]. Faction: [FACTION]. Use [COLOR PALETTE]. Generate only the clothing and accessory layers, no body, no face, no hair, no background scene. Each layer should be aligned to the same default 3/4 avatar pose.

Negative prompt: full character body, face, hair, background clutter, overlapping clothing parts, cropped assets, weapons, gore, real logos, text, watermark, logo, photorealism, harsh shadows, AI artifacting, unusable layer edges.
```

## Species Parts Sheet

```txt
Create a Hades Watch avatar species parts sheet on a 1024x1024 square canvas with transparent background. Generate modular species features for [SPECIES], aligned to the relaxed neutral 3/4 avatar base pose. Use Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, realistic natural proportions, underworld technomythic detail, and game-ready modular asset design.

Generate separate species assets with clear spacing: [FEATURE LIST]. Use [COLOR PALETTE]. Generate only the modular parts, no full character body, no clothing, no hair unless it is a species-specific hair asset, no background scene. All assets should be clean, readable, easy to isolate, and compatible with the base body.

Negative prompt: full character body, unwanted clothing, background clutter, overlapping assets, cropped features, weapons, gore, real logos, text, watermark, logo, photorealism, harsh shadows, malformed anatomy, AI artifacting, unusable layer edges.
```

---

## 16. Naming Conventions

Use lowercase slug-style filenames.

Recommended format:

```txt
category_species-or-faction_descriptor_pose_version.png
```

Use:

- category
- species or faction if relevant
- style descriptor
- pose
- version

### Category Prefixes

```txt
body_
horns_
ears_
tail_
wings_
markings_
aura_
hair_
eyes_
face_
top_
pants_
skirt_
shoes_
socks_
gloves_
outerwear_
belt_
accessory_
backitem_
prop_
gear_
flair_
badge_
bg_
sheet_
```

### Pose Codes

```txt
3q       relaxed 3/4 pose
front    front-facing layering pose
sym      symmetrical reference pose
none     item does not need body alignment
```

### Examples

```txt
body_tiefling_androgynous_neutral_3q_v01.png
body_nymph_female_presenting_neutral_front_v01.png
horns_tiefling_ember_curve_3q_v01.png
ears_nymph_leaf_soft_3q_v01.png
tail_tiefling_slim_ember_3q_v01.png
hair_wraithborn_long_mist_3q_v01.png
top_oracular_circuit_signal_jacket_3q_v01.png
outerwear_asclepian_veil_black_clinic_coat_3q_v01.png
accessory_styx_rats_zine_bundle_none_v01.png
badge_asclepian_veil_field_stabilizer_none_v01.png
bg_dead_index_terminal_none_v01.png
sheet_tiefling_species_parts_3q_v01.png
```

---

## 17. Metadata Schema

Use this schema for each generated asset.

```json
{
  "slug": "horns-tiefling-ember-curve",
  "name": "Ember Curve Horns",
  "filename": "horns_tiefling_ember_curve_3q_v01.png",
  "category": "horns",
  "species": ["tiefling"],
  "factions": [],
  "pose": "neutral-3q",
  "canvas": "1024x1024",
  "background": "transparent",
  "layerOrder": 230,
  "rarity": "common",
  "presentationCompatibility": ["female-presenting", "male-presenting", "nonbinary", "androgynous", "custom-unspecified"],
  "baseCompatibility": ["body_tiefling_*_3q"],
  "sourcePrompt": "",
  "negativePrompt": "",
  "notes": "Aligns to base tiefling head, relaxed 3/4 pose."
}
```

### Suggested Layer Orders

```json
{
  "background": 0,
  "backAura": 50,
  "backItems": 100,
  "wings": 120,
  "tail": 130,
  "baseBody": 200,
  "skinMarkings": 210,
  "speciesEars": 220,
  "speciesHornsBehindHair": 230,
  "eyes": 240,
  "face": 245,
  "socks": 300,
  "pants": 310,
  "skirts": 315,
  "shoes": 320,
  "tops": 330,
  "belts": 340,
  "outerwear": 350,
  "gloves": 360,
  "hairBack": 390,
  "hairFront": 410,
  "speciesHornsFront": 420,
  "accessories": 500,
  "fictionalPropsAndTechGear": 550,
  "foregroundFlair": 700,
  "badgeOverlay": 900
}
```

### Rarity Values

```txt
common
uncommon
rare
epic
legendary
canonical
event
```

---

## 18. Quality-Control Checklist

### Base Body Acceptance

- [ ] Full body visible from head to feet.
- [ ] No cropped limbs.
- [ ] Hands visible and readable.
- [ ] Feet visible and readable.
- [ ] Realistic natural proportions.
- [ ] Not scrawny or doll-like.
- [ ] Not oversexualized.
- [ ] Relaxed neutral 3/4 pose or specified pose.
- [ ] Arms slightly away from torso.
- [ ] Clean silhouette.
- [ ] Simple neutral underlayer only.
- [ ] No hair unless intended.
- [ ] No detailed clothing unless intended.
- [ ] No props attached to base body.
- [ ] Transparent or simple background.
- [ ] No text, watermark, logo, or signature.
- [ ] No AI artifacting.
- [ ] Correct species features.
- [ ] Compatible with layer system.

### Clothing Layer Acceptance

- [ ] No body included.
- [ ] No face or hair included.
- [ ] Correct default pose alignment.
- [ ] Fits expected body proportions.
- [ ] Does not cover hands unless gloves.
- [ ] Does not cover feet unless shoes.
- [ ] Clean transparent edges.
- [ ] Layer is not too bulky.
- [ ] Faction colors match.
- [ ] No real-world logos.
- [ ] No weapons or harmful design implications.
- [ ] No AI artifacting.

### Species Feature Acceptance

- [ ] Asset is isolated.
- [ ] Correct 3/4 alignment.
- [ ] Compatible with head or body.
- [ ] Clear silhouette.
- [ ] Species identity is readable.
- [ ] Does not block future clothing or hair layers excessively.
- [ ] No malformed horns, ears, tails, wings, or markings.
- [ ] No unwanted body parts.
- [ ] No AI artifacting.

### Hair Layer Acceptance

- [ ] Hair is isolated.
- [ ] Aligns to default head pose.
- [ ] Does not include full face or body.
- [ ] Does not cover too much of clothing area.
- [ ] Species compatibility is considered.
- [ ] Clean edges.
- [ ] No melted hair.
- [ ] No AI artifacting.

### Face / Emotion Acceptance

- [ ] Expression is readable.
- [ ] Face aligns to default head.
- [ ] No full body or hair included.
- [ ] No uncanny photorealism.
- [ ] No distorted features.
- [ ] No unintended asymmetry.
- [ ] No AI artifacting.

### Props & Tech Gear Acceptance

- [ ] Cosmetic only.
- [ ] Isolated asset.
- [ ] No real-world weapon use.
- [ ] No real-world hacking instruction.
- [ ] No illegal or harmful implication.
- [ ] Fits Hades Watch world.
- [ ] Clean silhouette.
- [ ] No AI artifacting.

### Background Acceptance

- [ ] Does not interfere with avatar silhouette.
- [ ] Center is readable.
- [ ] No characters unless specifically requested.
- [ ] No foreground clutter blocking avatar.
- [ ] No text-heavy clutter.
- [ ] Matches faction or world theme.
- [ ] No weapons, gore, or harmful real-world imagery.
- [ ] No AI artifacting.

### Badge Acceptance

- [ ] Rounded square fills the whole canvas.
- [ ] Transparent outside rounded corners.
- [ ] No sticker peel corner.
- [ ] Central emblem is readable.
- [ ] Badge text readable if included.
- [ ] Full badge name spelled correctly if included.
- [ ] No extra slogans or random text.
- [ ] Faction colors match.
- [ ] No weapons, gore, police, military, or real political symbols.
- [ ] No AI artifacting.

---

## 19. Safety and Tone

Hades Watch can be intense, mythic, cyberpunk, gothic, and politically aware.

Avatar assets must remain:

- safe
- fictional
- non-instructional
- cosmetic
- nonviolent
- non-harmful
- suitable for profile and avatar customization

Do not create prompts that instruct or reward real-world violence, sabotage, weapons use, illegal hacking, intimidation, harassment, doxxing, or harm.

Fictional props may look mythic, symbolic, occult, or cyberpunk, but should remain cosmetic avatar assets.

Missions and badges can imply community support, privacy, care, repair, morale, and resistance storytelling, not real-world harm.
