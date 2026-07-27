// ============================================================
// LOGIN BRUTE-FORCE PROTECTION
// - Max 5 attempts before lockout
// - Progressive lockout: 30s → 60s → 120s → 300s
// - Persists across page refresh (uses localStorage intentionally)
// - Auto-reset after lockout expires
// ============================================================

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATIONS = [30, 60, 120, 300]; // seconds — progressive
const STORAGE_KEY = "__login_protection__";

const getProtectionState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

const saveProtectionState = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const getDefaultState = () => ({
  failedAttempts: 0,
  lockoutCount: 0, // how many times user has been locked out
  lockedUntil: null, // timestamp
});

/**
 * Check if user is currently locked out
 * @returns {{ isLocked: boolean, remainingSeconds: number }}
 */
export const checkLockout = () => {
  const state = getProtectionState();
  if (!state || !state.lockedUntil) {
    return { isLocked: false, remainingSeconds: 0 };
  }

  const now = Date.now();
  if (now < state.lockedUntil) {
    const remainingSeconds = Math.ceil((state.lockedUntil - now) / 1000);
    return { isLocked: true, remainingSeconds };
  }

  // Lockout expired — reset attempts but keep lockoutCount
  const updated = {
    ...state,
    failedAttempts: 0,
    lockedUntil: null,
  };
  saveProtectionState(updated);
  return { isLocked: false, remainingSeconds: 0 };
};

/**
 * Record a failed login attempt
 * @returns {{ isNowLocked: boolean, attemptsRemaining: number, lockoutSeconds: number }}
 */
export const recordFailedAttempt = () => {
  let state = getProtectionState() || getDefaultState();

  state.failedAttempts += 1;

  if (state.failedAttempts >= MAX_ATTEMPTS) {
    // Get progressive lockout duration
    const durationIndex = Math.min(
      state.lockoutCount,
      LOCKOUT_DURATIONS.length - 1
    );
    const lockoutSeconds = LOCKOUT_DURATIONS[durationIndex];

    state.lockedUntil = Date.now() + lockoutSeconds * 1000;
    state.lockoutCount += 1;
    state.failedAttempts = 0;

    saveProtectionState(state);
    return {
      isNowLocked: true,
      attemptsRemaining: 0,
      lockoutSeconds,
    };
  }

  saveProtectionState(state);
  return {
    isNowLocked: false,
    attemptsRemaining: MAX_ATTEMPTS - state.failedAttempts,
    lockoutSeconds: 0,
  };
};

/**
 * Reset protection state on successful login
 */
export const resetProtection = () => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Get current failed attempts count
 * @returns {number}
 */
export const getFailedAttempts = () => {
  const state = getProtectionState();
  return state ? state.failedAttempts : 0;
};
