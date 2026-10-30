import type {
  Preferences,
  PreferredLanguage,
  PreferredTheme,
  UiMode,
} from '@/bridge/generated/preferences'

/**
 * Web-preview fallback for the preferences command family.
 *
 * On desktop, Rust owns the preferences file. In a plain browser (Vite dev
 * preview or a web build) there is no runtime, and the bridge would reject
 * every call with `desktopUnavailable` — which made language/theme/UI-mode
 * switches dead in the preview. Preferences are documented as local,
 * non-secret state, so mirroring them into localStorage keeps the preview
 * honest without faking any privileged data.
 *
 * Only the nine `preferences.rs` commands are handled here; anything else
 * still reports `desktopUnavailable` through the bridge.
 */
const STORAGE_KEY = 'relaylens-switch.preferences'

const WEB_DEFAULT_PREFERENCES: Preferences = {
  language: 'en',
  theme: 'system',
  lastToolId: null,
  favoriteToolIds: [],
  favoriteServiceIdsByTool: {},
  currentByTool: {},
  undoByTool: {},
  accountOnboardingCompleted: false,
  easyOnboardingCompleted: false,
  uiMode: 'easy',
}

function readStored(): Preferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(WEB_DEFAULT_PREFERENCES)
    const parsed = JSON.parse(raw) as Partial<Preferences>
    return { ...structuredClone(WEB_DEFAULT_PREFERENCES), ...parsed }
  } catch {
    return structuredClone(WEB_DEFAULT_PREFERENCES)
  }
}

function persist(preferences: Preferences): Preferences {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  } catch {
    // Private mode or quota: the in-memory copy still drives this session.
  }
  return preferences
}

/**
 * Applies one preferences command against localStorage. Returns null when the
 * command is outside the preferences family so the caller keeps propagating
 * the original desktopUnavailable error.
 */
export function applyWebPreferences(
  command: string,
  args?: Record<string, unknown>
): Preferences | null {
  const current = readStored()
  switch (command) {
    case 'get_preferences':
      return current
    case 'set_preferred_language':
      return persist({
        ...current,
        language: (args?.language as PreferredLanguage) ?? current.language,
      })
    case 'set_preferred_theme':
      return persist({
        ...current,
        theme: (args?.theme as PreferredTheme) ?? current.theme,
      })
    case 'set_last_tool_id':
      return persist({
        ...current,
        lastToolId: (args?.toolId as string | undefined) ?? null,
      })
    case 'set_favorite_tool_ids':
      return persist({
        ...current,
        favoriteToolIds:
          (args?.toolIds as string[] | undefined) ?? current.favoriteToolIds,
      })
    case 'set_favorite_service_ids': {
      const toolId = args?.toolId as string | undefined
      const serviceIds = args?.serviceIds as string[] | undefined
      if (!toolId) return current
      return persist({
        ...current,
        favoriteServiceIdsByTool: {
          ...current.favoriteServiceIdsByTool,
          [toolId]: serviceIds ?? [],
        },
      })
    }
    case 'complete_account_onboarding':
      return persist({ ...current, accountOnboardingCompleted: true })
    case 'complete_easy_onboarding':
      return persist({ ...current, easyOnboardingCompleted: true })
    case 'set_ui_mode':
      return persist({
        ...current,
        uiMode: (args?.uiMode as UiMode) ?? current.uiMode,
      })
    default:
      return null
  }
}
