import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The Tauri CLI injects TAURI_ENV_* variables for dev/build runs; a plain
// `bun run dev:web` (or a web-only build) does not run under the CLI. Outside
// the CLI there is no WebView runtime, so the direct @tauri-apps imports in
// feature code are rewired to no-op stubs (src/shims/tauri-web-stub.ts)
// instead of throwing on first use. The desktop app keeps the real modules.
const isTauriCli = Boolean(
  process.env.TAURI_ENV_PLATFORM ?? process.env.TAURI_PLATFORM,
)

const tauriWebStub = fileURLToPath(
  new URL('./src/shims/tauri-web-stub.ts', import.meta.url),
)
const tauriStubAliases = isTauriCli
  ? []
  : [
      { find: /^@tauri-apps\/api\/event$/, replacement: tauriWebStub },
      { find: /^@tauri-apps\/api\/webviewWindow$/, replacement: tauriWebStub },
      { find: /^@tauri-apps\/plugin-process$/, replacement: tauriWebStub },
      { find: /^@tauri-apps\/plugin-updater$/, replacement: tauriWebStub },
    ]

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      {
        find: '@assets',
        replacement: fileURLToPath(new URL('./assets', import.meta.url)),
      },
      ...tauriStubAliases,
    ],
  },
  clearScreen: false,
  server: {
    host: '127.0.0.1',
    port: 1420,
    strictPort: true,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
})
