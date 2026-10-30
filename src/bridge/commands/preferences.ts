import type {
  Preferences,
  PreferredLanguage,
  PreferredTheme,
  UiMode,
} from '@/bridge/generated/preferences'
import { BRIDGE_ERROR, BridgeError, invokeCommand } from '@/bridge/invoke'
import { applyWebPreferences } from '@/bridge/preferences-web'

/**
 * Runs a preferences command on the Rust core, falling back to the
 * localStorage mirror when no desktop runtime exists (web preview). Genuine
 * core errors still propagate; only `desktopUnavailable` is downgraded.
 */
async function preferencesCommand(
  command: string,
  args?: Record<string, unknown>
): Promise<Preferences> {
  try {
    return await invokeCommand<Preferences>(command, args)
  } catch (error) {
    if (
      error instanceof BridgeError &&
      error.code === BRIDGE_ERROR.desktopUnavailable
    ) {
      const fallback = applyWebPreferences(command, args)
      if (fallback) return fallback
    }
    throw error
  }
}

/** Reads local preferences. Rust falls back to defaults on a missing file. */
export async function getPreferences(): Promise<Preferences> {
  return preferencesCommand('get_preferences')
}

/**
 * Persists the language choice and returns the stored result.
 *
 * The WebView supplies only the language value; Rust owns the file location
 * and the atomic write.
 */
export async function setPreferredLanguage(
  language: PreferredLanguage
): Promise<Preferences> {
  return preferencesCommand('set_preferred_language', { language })
}

/** Stores appearance through the same Rust-owned preference boundary. */
export async function setPreferredTheme(
  theme: PreferredTheme
): Promise<Preferences> {
  return preferencesCommand('set_preferred_theme', { theme })
}

/** Persists the tool selected in the switcher chrome. */
export async function setLastToolId(toolId: string): Promise<Preferences> {
  return preferencesCommand('set_last_tool_id', { toolId })
}

/** Stores the ordered tools shown in the top switcher. */
export async function setFavoriteToolIds(
  toolIds: string[]
): Promise<Preferences> {
  return preferencesCommand('set_favorite_tool_ids', { toolIds })
}

/** Stores the ordered favorite services for one coding tool. */
export async function setFavoriteServiceIds(
  toolId: string,
  serviceIds: string[]
): Promise<Preferences> {
  return preferencesCommand('set_favorite_service_ids', { toolId, serviceIds })
}

export async function completeAccountOnboarding(): Promise<Preferences> {
  return preferencesCommand('complete_account_onboarding')
}

export function completeEasyOnboarding(): Promise<Preferences> {
  return preferencesCommand('complete_easy_onboarding')
}

/** Stores Easy / Pro interface density. */
export async function setUiMode(uiMode: UiMode): Promise<Preferences> {
  return preferencesCommand('set_ui_mode', { uiMode })
}
