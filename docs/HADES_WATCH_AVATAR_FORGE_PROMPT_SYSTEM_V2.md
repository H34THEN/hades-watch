# HADES WATCH AVATAR FORGE PROMPT SYSTEM V2

## Purpose

This document is the updated canonical prompt system for Hades Watch avatar-builder assets after testing with Nano Banana 2. It captures the hard-won fixes from production so future agents do not repeat the same failures.

This system is for creating:

- approved base-body conversions
- species variants
- faction outfits
- masculine and feminine clothing layers
- nonbinary masc-leaning and nonbinary fem-leaning variants
- accessories that correctly lay over the body
- full character designs when needed
- repair prompts when the model changes pose, mirrors direction, or makes straight-on unusable assets

Central rule:

```txt
Pose lock comes before design.
```

The approved Tiefling base pose is the master alignment reference. The approved masculine and feminine human base bodies are body-fit references for clothing after they have been generated from the Tiefling form.

---

## Source of Truth References

Use these files as visual references whenever possible:

```txt
approved_tiefling_base.png
male_base.png
female_base.png
```

The approved Tiefling base is the primary pose, scale, facing-direction, and 3/4 angle reference.

The approved masculine and feminine human base bodies are the preferred clothing-fit references after they have been successfully generated from the approved Tiefling form.

When generating actual images, attach the relevant base image in the active generation chat. Knowledge-file references may help, but active image references are more reliable for pose and layer alignment.

---

## Absolute Production Rules

### Pose and Facing Direction

The approved base body is the source of truth.

Never:

- change the pose
- straighten the stance
- make the figure front-facing
- mirror the body
- flip the garment horizontally
- reverse the 3/4 angle
- change the screen-facing direction
- change which shoulder is forward
- change which arm is forward
- change which leg is forward
- change the hip angle
- change the thigh, knee, calf, ankle, or foot placement
- make a new fashion pose
- make a stiff mannequin pose
- create straight-on accessories unless explicitly making inventory icons

Always preserve:

- canvas placement
- body scale
- margins
- 3/4 body angle
- head angle
- shoulder line
- torso angle
- hip angle
- arm placement
- hand placement
- leg placement
- foot placement
- screen-side forward limb relationship
- layer alignment

---

## The Phrases That Worked

Use these near the beginning of prompts.

For clothing:

```txt
This is a pose-alignment task first and a clothing-design task second.
```

For accessories:

```txt
This is an alignment task first and an accessory-design task second.
```

For species or character conversions:

```txt
This is not a new character design. This is a surface conversion of the approved Tiefling base form.
```

For clothing repair prompts:

```txt
This is not a new clothing illustration. This is a clothing overlay on the existing approved base body.
```

For pants that drift:

```txt
The pants must be generated as if they are painted directly over the approved base body without moving, rotating, straightening, mirroring, reposing, or changing the body in any way.
```

For Wraithborn or faun/satyr forms:

```txt
The figure must remain grounded on the same foot placement as the approved Tiefling base.
```

For Slewfoot hoof alignment:

```txt
The hoof placement should correspond to the original foot placement, with the same forward leg and same back leg on the same screen sides.
```

---

## Required Output Format for Prompt Packs

When creating prompt packs:

- each prompt must be fully self-contained
- each prompt must be in its own copy/paste code block
- do not say “paste the style block”
- do not split required details into separate sections
- do not rely on “same as above”
- repeat the pose lock inside every prompt
- repeat the negative prompt inside every prompt
- for faction outfits, separate masculine and feminine versions where body fit matters

---

## Standard Canvas and Style Clause

Use this in most prompts:

```txt
Style:
Hades Watch cyberpunk gothic avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, natural proportions, practical modular game-ready asset design, technomythic underworld resistance aesthetic.

Canvas:
1024x1024 square canvas, transparent background. If transparency is not possible, use a flat neutral gray background.
```

For layer-only prompts, add:

```txt
Generate only the requested layer. Do not include the body, face, hair, background scenery, weapons, props, or unrelated outfit pieces.
```

---

## Master Hard Pose Lock Block

```txt
CRITICAL POSE PRESERVATION:
The approved base body is the source of truth. Do not change the pose. Do not redraw the body. Do not straighten the stance. Do not make the figure front-facing. Do not mirror the body. Do not flip the garment horizontally. Do not reverse the 3/4 angle. Do not create a new model pose. Preserve the exact body angle, facing direction, canvas placement, scale, shoulder angle, torso angle, hip angle, arm placement, hand placement, leg placement, knee placement, ankle placement, foot placement, and screen-side forward limb relationship from the approved base body.
```

---

## Master Facing Direction Lock Block

Replace `screen-right` with `screen-left` if the approved base faces the other direction.

```txt
CRITICAL FACING DIRECTION LOCK:
The final asset must face the exact same direction as the approved base body. Do not mirror the body. Do not flip the asset horizontally. Do not reverse the 3/4 angle. Do not turn the character to face the opposite side.

The avatar’s body must remain turned toward screen-right, with the same screen-side shoulder, arm, leg, and foot forward as the approved base.

Preserve the approved base’s exact screen-left and screen-right relationship:
- the same shoulder must remain closer to the viewer
- the same side of the torso must remain visible
- the same arm must remain slightly more forward
- the same leg must remain slightly more forward
- the same foot must remain slightly more forward
- the head must face the same direction
- the torso must rotate the same direction
- the hips must rotate the same direction
- the feet must point the same direction
- the silhouette must not be mirrored
```

---

## Master Clothing Layer Prompt Template

```txt
Create a modular [CLOTHING TYPE] layer for the Hades Watch avatar builder: [ITEM NAME], designed specifically to fit the approved [masculine/feminine] Hades Watch base body exactly.

This is a pose-alignment task first and a clothing-design task second.

Use the approved [masculine/feminine] base body image as the exact placement reference. The clothing must be generated as if it is painted directly over the approved base body without moving, rotating, straightening, mirroring, reposing, or changing the body in any way.

CRITICAL POSE PRESERVATION:
Do not change the pose. Do not redraw the body. Do not correct the stance. Do not straighten the character. Do not make the figure front-facing. Do not mirror the body. Do not flip the garment horizontally. Do not reverse the 3/4 angle. Do not create a new clothing model pose. Do not change the body angle, torso angle, shoulder line, hip angle, arm placement, hand placement, leg placement, body scale, canvas margins, or facing direction.

FACING DIRECTION LOCK:
The clothing must face the exact same direction as the approved base body. Do not reverse which side appears forward. Do not reverse the side seam perspective. Do not make the clothing symmetrical or straight-on. The garment must lay naturally over the existing base body’s angled form.

Generate only the [CLOTHING TYPE] layer. Do not include the body, skin, feet, face, hair, hands, unrelated clothing, shoes, props, or background. The output should be a transparent clothing layer that fits directly on top of the approved [masculine/feminine] base body.

Design:
[ITEM DESIGN DETAILS HERE]

Fit notes:
Make the [CLOTHING TYPE] specifically compatible with the approved [masculine/feminine] base body’s [RELEVANT BODY AREAS]. Preserve the exact pose, scale, and layer alignment. Do not make it oversexualized, militarized, bulky, or straight-on.

Style:
Hades Watch cyberpunk gothic avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, modular game-ready clothing layer.

Canvas:
1024x1024 square canvas, transparent background. Only the [CLOTHING TYPE] layer, positioned exactly where it would sit on the approved [masculine/feminine] base body.

Negative prompt:
changed pose, new stance, straightened stance, front-facing clothing, symmetrical clothing pose, mirrored clothing, wrong facing direction, reversed 3/4 angle, wrong forward side, wrong torso angle, wrong hip angle, wrong arm placement, wrong leg placement, changed body scale, changed canvas placement, body included, skin included, full character, face, hair, background, unrelated clothing, shoes, boots, weapons, props, text, watermark, logo, photorealism, AI artifacting, distorted seams, unusable layer edges.
```

---

## Pants-Specific Hard Lock Template

Use this when pants drift, especially on feminine forms.

```txt
Create a modular lower-body clothing layer for the Hades Watch avatar builder: [ITEM NAME], designed specifically to fit the approved [masculine/feminine] Hades Watch base body exactly.

This is a pose-alignment task first and a clothing-design task second.

Use the approved [masculine/feminine] base body image as the exact placement reference. The pants must be generated as if they are painted directly over the approved base body without moving, rotating, straightening, mirroring, reposing, or changing the body in any way.

CRITICAL POSE PRESERVATION:
Do not change the pose. Do not redraw the legs. Do not correct the stance. Do not straighten the character. Do not make the figure front-facing. Do not mirror the body. Do not flip the garment horizontally. Do not reverse the 3/4 angle. Do not create a new pants model pose. Do not change the hip angle, thigh angle, knee placement, calf placement, ankle placement, foot placement, body scale, canvas margins, or facing direction.

The pants must preserve and match:
- the exact waist position of the approved base body
- the exact hip angle of the approved base body
- the exact pelvis tilt of the approved base body
- the exact thigh placement of the approved base body
- the exact knee placement of the approved base body
- the exact calf placement of the approved base body
- the exact ankle placement of the approved base body
- the exact forward leg on the same screen side
- the exact back leg on the same screen side
- the exact visible side of each leg
- the exact 3/4 facing direction
- the exact canvas scale and placement
- the exact silhouette needed to layer over the approved base

Generate only the pants layer. Do not include the body, skin, feet, face, hair, hands, top, jacket, shoes, props, or background. The output should be a transparent clothing layer that fits directly on top of the approved base body.

FACING DIRECTION LOCK:
The pants must face the exact same direction as the approved base body. Do not reverse which leg appears forward. Do not reverse which hip side is visible. Do not reverse the side seam perspective. Do not make the pants symmetrical or straight-on. The garment must lay naturally over the existing base body’s angled hips and legs.

Design:
[FACTION AND ITEM DESIGN DETAILS HERE]

Fit notes:
The pants must be specifically compatible with the approved [masculine/feminine] base body’s waist, hips, thigh shape, knee placement, calf angle, and ankle placement. The pants should preserve the exact leg alignment and stance. They should read clearly as practical pants.

Style:
Hades Watch cyberpunk gothic avatar-builder style, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, modular game-ready clothing layer, early-2000s avatar-game charm with modern polish.

Canvas:
1024x1024 square canvas, transparent background. Only the pants layer, positioned exactly where it would sit on the approved base body. No cast shadow outside the garment.

Negative prompt:
changed pose, new stance, straightened stance, front-facing pants, symmetrical pants pose, mirrored pants, wrong facing direction, reversed 3/4 angle, reversed leg position, wrong forward leg, wrong back leg, wrong hip angle, wrong pelvis angle, wrong knee placement, wrong calf angle, wrong ankle placement, changed body scale, changed canvas placement, body included, skin included, feet included, full character, face, hair, background, bulky combat pants, military uniform pants, police uniform pants, sci-fi armor legs, leggings only, skirt, dress, shoes, boots, oversexualized fit, ultra low-rise pants, text, watermark, logo, photorealism, AI artifacting, distorted seams, unusable layer edges.
```

---

## Even Stricter Pants Overlay Repair

```txt
Edit the approved [masculine/feminine] Hades Watch base body image by adding only a [FACTION] [ITEM NAME] pants layer while preserving the exact original pose, body angle, facing direction, scale, and canvas placement.

This is not a new pants illustration. This is a clothing overlay on the existing approved base body.

CRITICAL:
Do not change the body. Do not change the legs. Do not change the pose. Do not change the facing direction. Do not mirror the image. Do not straighten the stance. Do not redraw the figure. Do not move the hips, thighs, knees, calves, ankles, or feet. The pants must be fitted directly onto the approved base body exactly as it is.

Preserve:
- exact waist position
- exact hip tilt
- exact thigh placement
- exact knee placement
- exact calf placement
- exact ankle placement
- exact foot placement beneath the pants
- exact forward leg and back leg on the same screen sides
- exact 3/4 body angle
- exact screen-facing direction
- exact body scale
- exact canvas margins

Add only the pants:
[DESIGN DETAILS]

Output preference:
If possible, output only the transparent pants layer. If layer-only output is not possible, show the approved base body wearing the pants without changing the base body at all.

Style:
Hades Watch cyberpunk gothic avatar-builder style, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, modular game-ready clothing layer.

Negative prompt:
changed body, changed pose, changed legs, changed hips, changed knees, changed feet, straightened stance, front-facing pose, mirrored body, reversed facing direction, reversed leg position, wrong forward leg, wrong hip angle, wrong knee placement, wrong ankle placement, full redesign, new character, added top, added jacket, added shoes, added boots, added accessories, background, military pants, police pants, armor, leggings only, skirt, dress, low-rise pants, oversexualized fit, text, watermark, logo, AI artifacting, unusable layer edges.
```

---

## Accessory Alignment Template

```txt
Create a modular [ACCESSORY TYPE] layer for the Hades Watch avatar builder: [ITEM NAME], designed to fit the approved [masculine/feminine/both] Hades Watch base body exactly.

This is an alignment task first and an accessory-design task second.

Use the approved base body as the exact alignment reference. Preserve the same pose, scale, [RELEVANT BODY AREA] angle, facing direction, canvas placement, and avatar-builder alignment. Generate only the accessory layer.

CRITICAL ACCESSORY ALIGNMENT:
This accessory must lay over the approved base body in the same 3/4 perspective. Do not create a straight-on product icon. Do not mirror the accessory. Do not reverse the facing direction. Do not change the head, wrist, neck, shoulder, chest, waist, hip, hand, or torso angle. The accessory must sit naturally on the approved base body as a transparent modular avatar layer.

FACING DIRECTION LOCK:
The accessory must match the exact same screen-facing direction as the approved base body. Do not flip it horizontally. Do not reverse its strap direction, clasp direction, visible side, or perspective.

Placement:
The accessory must align to the approved base body’s [NECK / WRIST / HIP / SHOULDER / CHEST / HEAD / WAIST / HAND] position. It should sit naturally in the correct 3/4 angle and should be usable as a layer over the approved body.

Design:
[ACCESSORY DESIGN DETAILS HERE]

Style:
Hades Watch cyberpunk gothic avatar-builder style, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, modular game-ready accessory design.

Canvas:
1024x1024 square canvas, transparent background. Only the accessory layer, positioned exactly where it would sit on the approved base body.

Negative prompt:
full character, body, face, hair, background, changed pose, straight-on accessory icon, wrong body angle, wrong facing direction, mirrored accessory, reversed perspective, floating disconnected accessory, oversized accessory, unusable layer edges, weapons, police gear, military gear, real logos, readable text, watermark, logo, photorealism, AI artifacting.
```

---

## Straight-On Accessory Warning

Do not create accessories like this unless the user explicitly asks for inventory icons:

```txt
a front-facing satchel on a transparent background
a straight-on scarf on a transparent background
a floating bracelet icon
a centered product render
```

Instead, use:

```txt
a crossbody satchel aligned to the approved body’s shoulder-to-hip 3/4 angle
a scarf draped over the approved base body’s neck and shoulder angle
a wrist cuff aligned to the visible wrist and lower forearm position
a pendant following the approved chest and neck angle
a hip pouch hanging from the approved visible hip side
```

---

## Species Surface Conversion Template

```txt
Edit or regenerate the approved Tiefling base avatar into a [SPECIES / FORM] variant while preserving the exact original pose, body scale, canvas placement, avatar-builder alignment, and facing direction.

This is not a new character design. This is a surface conversion of the approved Tiefling base form.

CRITICAL POSE PRESERVATION:
Do not redraw the body pose. Do not reinterpret the stance. Do not mirror the figure. Do not flip the character horizontally. Do not reverse the 3/4 angle. Preserve the exact body position, head angle, shoulder line, torso angle, hip position, arm placement, hand placement, leg placement, foot placement, body scale, canvas margins, relaxed 3/4 orientation, and facing direction from the approved Tiefling base.

The final form must keep:
- the same centered full-body placement as the approved Tiefling base
- the same head-to-feet visibility
- the same canvas margins
- the same relaxed neutral 3/4 body angle
- the same facing direction, not mirrored
- the same head angle
- the same shoulder height and shoulder slope
- the same torso angle
- the same hip angle
- the same arms relaxed slightly away from the torso
- the same elbow bend and elbow distance from the body
- the same relaxed visible hands
- the same leg placement
- the same forward leg on the same screen side
- the same back leg on the same screen side
- the same feet placement
- the same stable grounded stance
- the same overall silhouette width
- the same avatar-builder layer alignment

Only change species surface traits:
[SPECIES TRAITS HERE]

Style:
Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, natural proportions, game-ready modular asset design.

Canvas:
1024x1024 square canvas, centered full body, transparent background. If transparency is not possible, use flat neutral gray.

Negative prompt:
changed pose, new stance, mirrored body, horizontally flipped body, reversed 3/4 angle, facing wrong direction, facing opposite direction, wrong shoulder forward, wrong arm forward, wrong leg forward, wrong foot forward, changed hand placement, changed leg placement, changed foot placement, different body angle, different body scale, different canvas margins, different canvas placement, cropped limbs, missing hands, missing feet, extra characters, hair if not requested, clothing if not requested, shoes if not requested, jewelry if not requested, props, weapons, background clutter, text, watermark, logo, photorealistic uncanny face, oversexualized body, scrawny doll body, exaggerated skinny limbs, AI artifacting, fused fingers, distorted hands, wrong number of fingers.
```

---

## Human Reference Form Template Using Tiefling Form

```txt
Edit or regenerate the approved Tiefling base avatar into a plain human [male-presenting/female-presenting/nonbinary masc-leaning/nonbinary fem-leaning] reference form while preserving the exact original Tiefling pose, body scale, canvas placement, avatar-builder alignment, and facing direction.

This is not a new mannequin design. This is a plain human surface conversion of the approved Tiefling base form.

CRITICAL FACING DIRECTION LOCK:
The final human reference form must face the exact same direction as the approved Tiefling base. Do not mirror the body. Do not flip the character horizontally. Do not reverse the 3/4 angle. Do not turn the character to face the opposite side.

CRITICAL POSE PRESERVATION:
Do not redraw the body pose. Do not reinterpret the stance. Do not create a mannequin pose. Do not make the figure stiff, symmetrical, robotic, fashion-model-like, heroic, dramatic, statuesque, leaning, twisted, defensive, seductive, or posed differently. Preserve the exact body position, head angle, shoulder line, torso angle, hip position, arm placement, hand placement, leg placement, foot placement, body scale, canvas margins, relaxed 3/4 orientation, and facing direction from the approved Tiefling base.

Only change surface traits and simplify the figure:
- remove Tiefling horns
- remove pointed Tiefling ears
- remove infernal markings
- remove glow effects
- remove species-specific traits
- keep the same underlying Tiefling body shape, pose, scale, layer alignment, and facing direction
- convert the figure into a plain human [PRESENTATION] reference body
- keep natural limb thickness, believable torso, hips, hands, and feet
- keep the body softly athletic but neutral
- use a simple matte neutral fitted bodysuit or underlayer for clothing compatibility
- keep the face simple, neutral, and reference-friendly
- keep the figure clean and reusable as a clothing and accessory anchor

Style:
Hades Watch avatar-builder reference style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, natural human proportions, plain technical reference form, game-ready modular asset design.

Canvas:
1024x1024 square canvas, centered full body, transparent background. If transparency is not possible, use flat neutral gray.

Negative prompt:
changed pose, new stance, mannequin pose, stiff pose, symmetrical front pose, T-pose, A-pose, fashion model pose, heroic pose, dramatic pose, statuesque pose, contrapposto, hip pop, leaning body, twisted torso, crossed legs, bent knee pose, arms raised, arms straight out, hands hidden, arms touching torso, changed hand placement, changed leg placement, changed foot placement, different body angle, different body scale, different canvas margins, different canvas placement, cropped limbs, missing hands, missing feet, extra characters, hair, horns, pointed ears, species traits, markings, glow effects, clothing beyond simple neutral bodysuit, shoes, jewelry, props, weapons, background clutter, text, watermark, logo, photorealistic uncanny face, exaggerated muscles, exaggerated curves, oversized chest, tiny waist, oversexualized body, scrawny doll body, exaggerated skinny limbs, AI artifacting, fused fingers, distorted hands, wrong number of fingers.
```

---

## Presentation and Body Separation Rules

For faction outfits, create separate prompts for:

1. masculine top
2. feminine top
3. masculine pants
4. feminine pants
5. masculine jacket or outerwear
6. feminine jacket or outerwear
7. three body-aligned accessories

Do not rely on one universal prompt for fitted pants, fitted tops, or jackets.

Universal accessory prompts are acceptable only if the accessory can naturally fit both bodies, such as:

- scarf
- satchel
- wrist cuff
- pendant
- earpiece
- pin set
- keyring
- belt pouch

For fitted or body-shaping assets, always split masculine and feminine.

---

## Faction Outfit Set Required Scope

When the user asks for the next faction outfit set, use this structure.

```md
# [Faction Name] Outfit Set

## [Faction Name] Masculine Top

```txt
[full prompt]
```

## [Faction Name] Feminine Top

```txt
[full prompt]
```

## [Faction Name] Masculine Pants

```txt
[full prompt]
```

## [Faction Name] Feminine Pants

```txt
[full prompt]
```

## [Faction Name] Masculine Jacket

```txt
[full prompt]
```

## [Faction Name] Feminine Jacket

```txt
[full prompt]
```

## [Faction Name] Accessory 1: [Name]

```txt
[full prompt]
```

## [Faction Name] Accessory 2: [Name]

```txt
[full prompt]
```

## [Faction Name] Accessory 3: [Name]

```txt
[full prompt]
```
```

---

## Faction Visual Language

### Chthonic Uprising

Core feel: underworld leadership, archive-punk, patched resistance clothing, Dead Index memory relics, black pomegranate oath symbols, collective leadership.

Palette:

```txt
black, charcoal, smoke gray, pomegranate red, bone white, antique gold, muted plum
```

Motifs:

```txt
Dead Index glyphs, pomegranate seeds, redaction tabs, broken laurels, archive stitches, signal cords, patched black denim, punk-metal fieldwear
```

Avoid:

```txt
royal crowns, military medals, police badges, national flags, clean corporate futurism, fantasy ruler styling
```

### Asclepian Veil

Core feel: underground care infrastructure, field stabilizers, harm-reduction workers, medical privacy, survival as sabotage, calm under pressure.

Palette:

```txt
worn black, charcoal, muted gray, bone white, faded clinic green, desaturated teal, muted crimson
```

Motifs:

```txt
privacy veils, care pouches, soft wraps, fictional care glyphs, low-profile utility seams, redaction stitches, underclinic tabs
```

Avoid:

```txt
modern hospital branding, real medical logos, military medic gear, police/tactical gear, clinical advice, red cross symbols, over-armored medic design
```

### Oracular Circuit

Core feel: signal readers, cipher operatives, oracle technicians, black-channel analysis, machine prophecy altered through literacy.

Palette:

```txt
black glass, graphite, smoke gray, electric blue, violet, signal cyan, antique gold
```

Motifs:

```txt
oracle eyes, circuit traces, encrypted veils, ghost packets, signal glyphs, black-glass tabs, blue-violet piping
```

Avoid:

```txt
malware symbols, real hacker logos, VR combat helmets, military goggles, cyber-ninja armor, realistic hacking interfaces with private data
```

### Myrmidon Grinders

Core feel: community defense, logistics, protest marshals, strength without cruelty, gatewatch stewards, disciplined mutual aid.

Palette:

```txt
matte black, utility gray, amber warning, rust, dark denim, worn canvas, bone white
```

Motifs:

```txt
reflective straps, gatewatch tabs, supply webbing, reinforced workwear, civic safety patches, route markers
```

Avoid:

```txt
riot police armor, military uniforms, weapons, tactical combat gear, nationalist symbols, intimidation aesthetics
```

### Daedalus Foundry

Core feel: repair culture, makers, engineering, anti-surveillance tools, open knowledge, toolsmiths, liberatory infrastructure.

Palette:

```txt
gunmetal, brass, bronze, workshop black, warm gray, blueprint blue, forge amber
```

Motifs:

```txt
schematic lines, maker aprons, tool belts, repair tags, labyrinth engineering, circuit-forge seams, hardware patches
```

Avoid:

```txt
weaponsmith aesthetics, combat armor, industrial corporate branding, mecha armor, unsafe tool imagery
```

### Styx Rats

Core feel: punk morale workers, culture jammers, zine makers, graffiti ghosts, joy as sabotage, humiliating false gods through art.

Palette:

```txt
grime black, neon pink, acid green, sticker white, spray gray, faded purple, dirty yellow
```

Motifs:

```txt
stickerbomb patches, zine scraps, graffiti strokes, rat-tail curves, patched streetwear, torn posters, joke glyphs
```

Avoid:

```txt
real gang symbols, hate symbols, property damage instructions, real-world slogans, brand logos, weapons, combat styling
```

---

## Nonbinary Base Variant Language

Use two nonbinary presentation variants:

```txt
nonbinary masc-leaning
nonbinary fem-leaning
```

Preferred wording:

```txt
androgynous nonbinary body with only a very subtle masc-coded hint in the shoulders and torso
```

or:

```txt
androgynous nonbinary body with only a very subtle fem-coded hint in the torso and hip line
```

The hint must not change pose, silhouette, or layer alignment.

---

## Special Species Notes

### Gorgon

Problem:

```txt
Gorgon language may trigger dramatic, statuesque, serpent-like poses.
```

Solution:

```txt
Use surface conversion language. Add Gorgon traits only after pose lock. Avoid serpent hair in base. Generate serpent hair as a separate layer.
```

Safe base traits:

```txt
stone-gray undertones, faint basilisk-green scale markings, golden reptile eyes, smoke-gray shadows, bronze accents
```

Avoid:

```txt
serpent hair, snake crown, snake body, dramatic gaze effects, horror monster face
```

### Automaton

Problem:

```txt
Automaton language may trigger stiff robot, mannequin, T-pose, A-pose, or combat-ready poses.
```

Solution:

```txt
Use surface conversion language. Say this is not a new Automaton character. It is a species surface conversion of the approved Tiefling base.
```

Safe base traits:

```txt
porcelain or bone-colored synthetic shell surfaces, thin black mechanical joint lines, antique-gold circuit seams, bronze panel edges, faint lumen-gold eye glow, eclipse-black joint shadows
```

Avoid:

```txt
bulky robot armor, exposed wires, cables, helmets, mecha limbs, robotic stiff stance
```

### Wraithborn

Problem:

```txt
Wraithborn language may trigger floating, fading lower bodies, missing feet, drifting poses, ghost trails.
```

Solution:

```txt
Repeat grounded foot placement. Say the figure must remain grounded on the same foot placement as the approved Tiefling base.
```

Safe base traits:

```txt
ghostly translucent edge treatment close to body, pale glowing eyes, faint spectral markings, subtle close-body smoky aura, rune-violet accents, spectral teal highlights, void-black and smoke-gray undertones
```

Avoid:

```txt
floating lower body, missing legs, torn ghost trails, giant fog clouds, skull face, horror effects
```

### Slewfoot / Faun / Satyr Lower Half

Problem:

```txt
Faun or satyr language may trigger leaping, crouching, dancing, rearing, or animalistic poses.
```

Solution:

```txt
Anchor hoof placement to the original foot placement.
```

Required phrase:

```txt
The hoof placement should correspond to the original foot placement, with the same forward leg and same back leg on the same screen sides.
```

Safe lower-body traits:

```txt
black fur from hips down, digitigrade goat-like legs, strong natural haunches, visible knees and hocks, cloven hooves, charcoal-to-black fur texture, pomegranate-red undertones, ash-gray highlights, antique-gold underworld glyph accents near ankles or hooves
```

Avoid:

```txt
leaping, crouching, rearing, dancing, full animal body, centaur body, tail unless requested, monster face
```

---

## Full Character Prompt Template

Use only when the user asks for a complete character render, not modular layers.

```txt
Create a full-body Hades Watch avatar character for [CHARACTER NAME], using the approved Tiefling base avatar as the exact pose, scale, facing direction, and avatar-builder alignment reference.

This is a character-specific full design. Preserve the approved Tiefling base pose exactly while adding the character’s body traits, outfit, hair, and gear.

CRITICAL POSE AND FACING PRESERVATION:
Do not redraw the body pose. Do not reinterpret the stance. Do not mirror the figure. Do not flip the character horizontally. Do not reverse the 3/4 angle. Preserve the exact body position, head angle, shoulder line, torso angle, hip position, arm placement, hand placement, leg placement, body scale, canvas margins, relaxed 3/4 orientation, and facing direction from the approved Tiefling base.

The final character must keep:
- the same centered full-body placement as the approved Tiefling base
- the same head-to-feet visibility
- the same canvas margins
- the same relaxed neutral 3/4 body angle
- the same facing direction, not mirrored
- the same head angle
- the same shoulder height and shoulder slope
- the same torso angle
- the same hip angle
- the same arms relaxed slightly away from the torso
- the same elbow bend and elbow distance from the body
- the same relaxed visible hands
- the same upper-body silhouette and avatar-builder layer alignment
- the same stable grounded stance
- the same overall character scale and readable full-body composition

Character identity:
[LORE AND PERSONALITY]

Body design:
[BODY TRAITS]

Hair:
[HAIR DESIGN]

Outfit:
[OUTFIT DESIGN]

Props and gear:
[GEAR DESIGN. Keep props from disrupting pose.]

Mood and expression:
[EXPRESSION AND CHARACTER ENERGY]

Style:
Hades Watch cyberpunk gothic fantasy avatar-builder style, modernized early 2000s Gaia Online charm, polished semi-stylized realism, clean line art, soft cel shading, readable silhouette, natural proportions, myth-tech underworld aesthetic, game-ready modular design sensibility, scavenged futurism, punk resistance styling, and high visual clarity.

Color direction:
[PALETTE]

Canvas:
1024x1024 square canvas, centered full body, transparent background if possible. If transparency is not possible, use a flat neutral gray background.

Negative prompt:
changed pose, new stance, mirrored body, horizontally flipped body, reversed 3/4 angle, facing wrong direction, facing opposite direction, wrong shoulder forward, wrong arm forward, wrong leg forward, changed hand placement, changed leg placement, different body angle, different body scale, different canvas margins, dramatic pose, crouching pose, leaping pose, dancing pose, rearing pose, hunched torso, twisted torso, contrapposto, hip pop, crossed legs, bent knee pose, arms raised, hands hidden, missing hands, missing feet, malformed feet, oversized props that block the body, oversexualized body, exaggerated muscles, oversized chest, tiny waist, fashion model look, pristine clothing if worn-in clothing is requested, AI artifacting, fused fingers, distorted hands, wrong number of fingers, background clutter, text, watermark, logo, photorealistic uncanny face, gore, violence, weapons.
```

---

## Chthonic Uprising Archivist / Slewfoot Character Notes

Identity:

```txt
Heathen, The Archivist, Slewfoot. A child of the underworld who dreams of sunlight. A technopunk technomancer, archive-builder, signal witch, systems saboteur, keeper of the Dead Index, and reluctant organizer of the Chthonic Uprising.
```

Body:

```txt
Tiefling-inspired humanoid top half, pointed ears, curved underworld horns, subtle ember-like markings, charcoal and smoky plum undertones, ash-gray shadows, restrained antique-gold accent marks.
```

Slewfoot lower half:

```txt
black fur from hips down, digitigrade goat-like legs, strong natural haunches, visible knees and hocks, cloven hooves, dark charcoal-to-black fur texture, subtle pomegranate-red undertones, faint ash-gray highlights, antique-gold underworld glyph accents near ankles or hooves.
```

Outfit:

```txt
punk patched-up black jean vest, sleeveless, weathered, repaired, frayed edges, stitched reinforcement, metal studs, pomegranate-black symbolic patches, archive patches, signal-glyph patches, redacted-tab motifs, anti-authoritarian cryptic iconography, dark fitted underlayer, practical belts or harness details, pomegranate-red stitching.
```

Gear:

```txt
staff with ceramic antenna at the top, practical reclaimed signal instrument, not a fantasy wizard staff. Compact rugged cyberdeck worn at hip or strapped across body, with memory slots, cables, small screen surfaces, stickers, redacted labels, patched casing, Dead Index field utility.
```

Hair:

```txt
punk mohawk, black with subtle signal-red or deep plum undertones, shaved sides, practical, not cartoonish.
```

Mood:

```txt
grounded, observant, tired, stubborn, alive, dangerous to tyrants, safe to erased people.
```

---

## Repair Decision Tree

### Problem: The figure faces the wrong way.

Use the Master Facing Direction Lock Block.

Add:

```txt
Do not mirror the body. Do not flip the image horizontally. The asset must remain turned toward screen-right with the same screen-side shoulder, arm, leg, and foot forward as the approved base.
```

Replace screen-right with screen-left if needed.

### Problem: Pants change the pose.

Use the Pants-Specific Hard Lock Template. If still failing, use the Even Stricter Pants Overlay Repair.

### Problem: Accessories render straight-on.

Use:

```txt
CRITICAL ACCESSORY ALIGNMENT:
This accessory must lay over the approved base body in the same 3/4 perspective. Do not create a straight-on product icon.
```

### Problem: Automaton becomes stiff.

Use:

```txt
This is not a new Automaton character. This is a species surface conversion of the approved Tiefling base.
```

Add:

```txt
Do not make the figure robotic, stiff, symmetrical, mannequin-like, T-pose, A-pose, or combat-ready.
```

### Problem: Wraithborn floats.

Use:

```txt
The figure must remain grounded on the same foot placement as the approved Tiefling base.
```

Add:

```txt
Do not add floating lower body, missing legs, torn ghost trails, giant fog clouds, or fading feet.
```

### Problem: Gorgon changes pose.

Use:

```txt
This is a pose-matching task first and a Gorgon species-design task second.
```

Add:

```txt
Do not make the figure dramatic, elegant, statuesque, serpent-like, twisted, leaning, defensive, seductive, heroic, or monster-like.
```

Generate serpent hair separately.

### Problem: Human mannequin changes pose.

Use:

```txt
This is not a new mannequin design. This is a plain human surface conversion of the approved Tiefling base form.
```

---

## Quality Control Checklist

Before accepting a generated asset, check:

- Does it match the approved base pose?
- Is the facing direction correct?
- Did it mirror the body or garment?
- Did it preserve the screen-side forward leg?
- Did it preserve hip angle and knee placement?
- Does it fit the masculine or feminine base it was meant for?
- Is the asset transparent or cleanly cut out?
- Did it include unwanted body parts?
- Did it include straight-on accessory perspective?
- Is it too bulky to layer?
- Did it add weapons or unsafe tactical elements?
- Did it include real logos or unrelated readable text?
- Is the silhouette readable at avatar size?
- Does it match the faction palette and motifs?
- Is it practical, gothic, cyberpunk, and Hades Watch aligned?

If any pose-related check fails, regenerate using the relevant repair prompt before proceeding.

---

## Recommended GPT Agent Setup

GPT name:

```txt
Hades Watch Avatar Forge
```

Description:

```txt
Creates consistent Hades Watch avatar-builder prompts and image-generation instructions for modular base bodies, faction outfits, accessories, species variants, and character layers using approved masculine and feminine base references.
```

Knowledge files to upload:

```txt
male_base.png
female_base.png
approved_tiefling_base.png
HADES_WATCH_AVATAR_FORGE_PROMPT_SYSTEM_V2.md
HADES_WATCH_NANO_BANANA_2_AVATAR_PROMPT_SYSTEM.md
```

Core GPT instruction:

```txt
The approved base body images are the source of truth for pose, scale, facing direction, canvas placement, body angle, limb placement, and layer alignment. Pose lock always comes before design. If an image-generation prompt risks changing pose, rewrite it using surface-conversion or overlay language before generating.
```

---

## Final Field Note

```txt
The underworld does not waste good work by fighting the same ghost twice.

Lock the pose.
Name the direction.
Split the bodies when fit matters.
Make accessories obey the angle.
Treat the base as canon.

Then let the factions dress themselves in signal, care, grit, repair, and joy.
```
