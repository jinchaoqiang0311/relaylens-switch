# Asset Licensing Boundary

The RelayLens Switch application icon and UI mark are source-authored artwork
created for this fork and are covered by Apache-2.0 like the rest of the
source code. No proprietary font is included.

## Icon set

- `app-icon.svg` — dark tile with a cyan lens ring and core dot (the source of
  truth for the mark).
- `app-icon-macos.svg` — the same artwork with a transparent optical safe area
  for the macOS Dock.
- `app-icon.png` — 1024px render produced by
  `node scripts/generate-app-icon.mjs`; feed it to `npx tauri icon` to
  regenerate `../src-tauri/icons/`.
- `../src/assets/brand/relaylens-logo-only.svg` — the same mark for UI use
  (app shell, sign-in, share poster).

## DMG background

No DMG background artwork is bundled. If you brand macOS installers, add your
own image and re-add the `bundle.macOS.dmg.background` entry in
`../src-tauri/tauri.conf.json`.

## External tool marks

`../src/assets/tool-logos/` holds small marks for the coding tools this app can
switch. They identify those tools. They are not RelayLens artwork, and the
Apache-2.0 grant does not cover them.

Copyright, redistribution, and the exact upstream files are in
`../THIRD_PARTY_NOTICES.md`. Colored Lobe Icons SVGs are unmodified. Four
single-color SVGs keep the upstream paths and change only the fill and the
pixel size so the interface can tint them. The Kimi color file is white ink on
a black tile. The Aider file is that project's apple touch icon, unmodified.

Forks may keep these files while the interface still names those tools. Do not
crop, recolor, or redraw a mark. Replace the file from the recorded upstream
source instead.

## General rules

Unless a file says otherwise:

- source-authored generic diagrams and UI assets are covered by Apache-2.0;
- third-party assets retain their own licenses and must be listed in
  `../THIRD_PARTY_NOTICES.md`;
- RelayLens names, logos, and official-distribution identity are governed by
  `../TRADEMARKS.md`, not by the source-code license.

Before adding another brand asset or a brand font, record its copyright owner,
redistribution terms, allowed modification scope, and relationship to forks.
Do not copy font binaries from another repository without that review.
