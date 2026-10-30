# RelayLens Switch

管理常用 AI API 服务，将配置接入 Claude Code、Codex、Gemini CLI、OpenCode
等编程工具，在多个中转站和官方线路之间一键切换 Base URL 与 API Key，并查看
公开线路数据与本机使用曲线。

本项目是基于 [Folkbench Switch](https://github.com/Folkbench/folkbench)
（`apps/switch`，Apache-2.0）的社区 fork：品牌、图标与数据源已全部替换，
上游品牌资产未使用。

## 开发与构建

依赖 Bun 与 Rust 工具链（`rustup`，edition 2024，rust-version 1.90）。

```sh
bun install
bun run dev:web        # 仅前端 (Vite)
bun run tauri dev      # 桌面端
bun run check          # version + release-tools + i18n + typecheck
bun run rust:test      # Rust 测试（需 cargo）
```

Rust crate：`relaylens-switch`（应用）与 `relaylens-switch-contract`
（Rust/TS 桥接契约，`bun run bridge:generate` 重新生成 TS 绑定）。

## 需要你自行替换的部分

| 位置 | 说明 |
| --- | --- |
| `src-tauri/src/services/catalog.rs` → `RELAYLENS_PUBLIC_ORIGIN` | 榜单数据源，当前是占位地址 `https://data.relaylens.local`，替换为你自己的评测数据端点；JSON 契约见 `parse_rankings_json` 与 `crates/contract` 中的类型定义 |
| `src-tauri/tauri.conf.json` → `plugins.updater` | 更新器 pubkey/endpoints 均为占位；发布前用 `bunx tauri signer generate` 生成自己的密钥对，私钥保密，公钥填回 `pubkey` |
| `assets/` | 图标已为本 fork 自绘（Apache-2.0）；如需新的品牌视觉，改 `app-icon.svg` 后运行 `node scripts/generate-app-icon.mjs && npx tauri icon assets/app-icon.png` |
| `package.json` / `src-tauri/Cargo.toml` | repository/homepage 指向 fork 仓库占位，按实际仓库修改 |

## 应用图标（macOS 打包）

`bundle.createUpdaterArtifacts` 已设为 `false`，本地构建无需签名密钥。
DMG 背景图未捆绑，需要时自行添加并恢复
`bundle.macOS.dmg.background` 配置。

## 许可证

- 源码：Apache-2.0（见 `LICENSE`、`NOTICE`）。
- 品牌名称与标识：见 `TRADEMARKS.md`，不随源码授权。
- 第三方依赖与工具标识：见 `THIRD_PARTY_NOTICES.md`、
  `THIRD_PARTY_LICENSES.txt`。
