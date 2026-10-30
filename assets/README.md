# assets

Brand assets for RelayLens Switch.

- `app-icon.svg` — application icon source of truth (dark tile, cyan lens ring
  and core dot). Apache-2.0, source-authored.
- `app-icon-macos.svg` — macOS Dock variant with a transparent optical safe
  area.
- `app-icon.png` — 1024px render written by
  `node scripts/generate-app-icon.mjs`.
- `brand/` — the same mark used by the UI.

Regenerate the full icon set (`../src-tauri/icons/`):

1. `node scripts/generate-app-icon.mjs`
2. `npx tauri icon assets/app-icon.png`

Licensing boundary: see `LICENSE.md`. External tool marks in
`../src/assets/tool-logos/` are third-party assets governed by
`../THIRD_PARTY_NOTICES.md`.
