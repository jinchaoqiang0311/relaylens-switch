# RelayLens Switch

Manage AI API services for Claude Code, Codex, Gemini CLI, OpenCode and other
coding tools. Switch Base URL and API Key between relay stations and official
routes in one click, and review public route data plus your local usage trend.

This is a community fork of
[Folkbench Switch](https://github.com/Folkbench/folkbench) (`apps/switch`,
Apache-2.0) with the branding, icon, and data source fully replaced. No
upstream brand assets are used.

## Development

Requires Bun and the Rust toolchain (edition 2024, rust-version 1.90).

```sh
bun install
bun run dev:web        # frontend only (Vite)
bun run tauri dev      # desktop app
bun run check          # version + release-tools + i18n + typecheck
bun run rust:test      # Rust tests (needs cargo)
```

Rust crates: `relaylens-switch` (app) and `relaylens-switch-contract`
(Rust/TS bridge contract; `bun run bridge:generate` regenerates TS bindings).

## Replace before shipping

| Where | What |
| --- | --- |
| `src-tauri/src/services/catalog.rs` → `RELAYLENS_PUBLIC_ORIGIN` | Rankings data source, currently the placeholder `https://data.relaylens.local`; point it at your own probe/rankings endpoint (JSON contract: `parse_rankings_json` and the types in `crates/contract`) |
| `src-tauri/tauri.conf.json` → `plugins.updater` | Placeholder pubkey/endpoints; generate your own keypair with `bunx tauri signer generate` before publishing |
| `assets/` | Icons are fork-authored (Apache-2.0); `node scripts/generate-app-icon.mjs && npx tauri icon assets/app-icon.png` regenerates the set |
| `package.json` / `src-tauri/Cargo.toml` | repository/homepage point at the fork placeholder repo |

## License

- Source code: Apache-2.0 (see `LICENSE`, `NOTICE`).
- Names and logos: see `TRADEMARKS.md`; not licensed with the source.
- Third-party dependencies and tool marks: `THIRD_PARTY_NOTICES.md`,
  `THIRD_PARTY_LICENSES.txt`.
