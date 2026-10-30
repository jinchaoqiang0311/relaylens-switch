import type { SessionState } from '@/bridge/generated/session'
import { BRIDGE_ERROR, BridgeError, invokeCommand } from '@/bridge/invoke'

/**
 * Reads the redacted session state from the Rust core.
 *
 * Rust owns whether a session exists and whether authorization can start. The
 * WebView renders that answer and never derives or persists its own.
 *
 * In a plain browser (web preview) there is no runtime, and the truthful
 * answer is the same one Rust gives a fresh desktop install: no session, no
 * authorization flow. Without this mirror the route guards would fail before
 * the sign-in screen could render at all. Privileged commands (start, cancel,
 * sign out) still report `desktopUnavailable`.
 */
export async function getSessionState(): Promise<SessionState> {
  try {
    return await invokeCommand<SessionState>('get_session_state')
  } catch (error) {
    if (
      error instanceof BridgeError &&
      error.code === BRIDGE_ERROR.desktopUnavailable
    ) {
      return { status: 'unauthenticated', authorization: 'unavailable', user: null }
    }
    throw error
  }
}

export async function startAccountSignIn(): Promise<SessionState> {
  return invokeCommand<SessionState>('start_account_sign_in')
}

export async function cancelAccountSignIn(): Promise<void> {
  await invokeCommand<null>('cancel_account_sign_in')
}

export async function signOutAccount(): Promise<SessionState> {
  return invokeCommand<SessionState>('sign_out_account')
}
