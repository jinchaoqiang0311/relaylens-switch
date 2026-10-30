/**
 * Web-preview stubs for Tauri APIs used directly by feature code (outside the
 * `src/bridge` wrapper).
 *
 * The desktop runtime injects `window.__TAURI_INTERNALS__`; when the UI is
 * served by Vite alone (`bun run dev:web`) or built as a web bundle, that
 * object is missing and the real modules throw on first use. The bridge keeps
 * its own graceful `desktopUnavailable` degradation, so only these direct call
 * sites need no-op replacements.
 *
 * Vite rewires the affected imports to this file only when the process runs
 * outside the Tauri CLI (see the alias logic in `vite.config.ts`); the desktop
 * app always gets the real modules.
 */

type UnlistenFn = () => void

export type Event<T> = { payload: T; id: number }

export async function listen<T>(
  _event: string,
  _handler?: (event: Event<T>) => void,
): Promise<UnlistenFn> {
  return () => {}
}

export async function emit(
  _event: string,
  _payload?: unknown,
): Promise<void> {}

export type WebviewWindowOptions = Record<string, unknown>

/**
 * Minimal WebviewWindow stub: window creation is skipped and every instance
 * operation is a no-op, matching the "no desktop runtime" empty state.
 */
export class WebviewWindow {
  label: string

  constructor(label: string, _options?: WebviewWindowOptions) {
    this.label = label
  }

  static async getByLabel(_label: string): Promise<WebviewWindow | null> {
    return null
  }

  async listen(_event: string, _handler?: unknown): Promise<UnlistenFn> {
    return () => {}
  }

  async once(_event: string, _handler?: unknown): Promise<UnlistenFn> {
    return () => {}
  }

  async onCloseRequested(_handler?: unknown): Promise<UnlistenFn> {
    return () => {}
  }

  async destroy(): Promise<void> {}

  async close(): Promise<void> {}

  async show(): Promise<void> {}

  async hide(): Promise<void> {}

  async setFocus(): Promise<void> {}

  async unminimize(): Promise<void> {}

  async setTitle(_title: string): Promise<void> {}
}

export function getCurrentWebviewWindow(): WebviewWindow {
  return new WebviewWindow('main')
}

export async function relaunch(): Promise<void> {}

/** Always reports "no update" in the web preview. */
export async function check(_options?: unknown): Promise<null> {
  return null
}
