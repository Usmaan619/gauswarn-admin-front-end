// ============================================================
// SECURE SESSION STORAGE SERVICE
// - Uses sessionStorage (clears when tab/browser closes)
// - Token obfuscation (not plain text in devtools)
// - Session expiry system (auto-expire after configured time)
// - Browser fingerprint (prevents token theft across browsers)
// ============================================================

const SESSION_EXPIRY_MS = 2 * 60 * 60 * 1000; // 2 hours
const EXPIRY_KEY = "__session_expiry__";
const FINGERPRINT_KEY = "__session_fp__";
const OBFUSCATION_PREFIX = "gw_sec_";

// --- Obfuscation helpers (NOT encryption, just prevents plain text visibility) ---
const obfuscate = (value) => {
  try {
    return OBFUSCATION_PREFIX + btoa(encodeURIComponent(value));
  } catch {
    return value;
  }
};

const deobfuscate = (value) => {
  try {
    if (value && value.startsWith(OBFUSCATION_PREFIX)) {
      return decodeURIComponent(atob(value.slice(OBFUSCATION_PREFIX.length)));
    }
    return value;
  } catch {
    return value;
  }
};

// --- Browser Fingerprint ---
const generateFingerprint = () => {
  const nav = window.navigator;
  const raw = [
    nav.userAgent,
    nav.language,
    nav.platform,
    window.screen.width + "x" + window.screen.height,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  ].join("|");

  // Simple hash
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return "fp_" + Math.abs(hash).toString(36);
};

// --- Session Expiry ---
const setSessionExpiry = () => {
  const expiresAt = Date.now() + SESSION_EXPIRY_MS;
  sessionStorage.setItem(EXPIRY_KEY, String(expiresAt));
};

export const isSessionExpired = () => {
  const expiresAt = sessionStorage.getItem(EXPIRY_KEY);
  if (!expiresAt) return true;
  return Date.now() > Number(expiresAt);
};

// --- Fingerprint Validation ---
const setFingerprint = () => {
  const fp = generateFingerprint();
  sessionStorage.setItem(FINGERPRINT_KEY, fp);
};

export const isFingerprintValid = () => {
  const storedFp = sessionStorage.getItem(FINGERPRINT_KEY);
  if (!storedFp) return false;
  return storedFp === generateFingerprint();
};

// --- Core Storage Operations ---
export const setItem = (key, value) => {
  const safeValue = typeof value === "string" ? value : JSON.stringify(value);

  // Token gets obfuscated
  if (key === "token") {
    sessionStorage.setItem(key, obfuscate(safeValue));
  } else {
    sessionStorage.setItem(key, safeValue);
  }
};

export const getItem = (key) => {
  const value = sessionStorage.getItem(key);
  if (!value) return null;

  // Auto-check session validity when token is accessed
  if (key === "token") {
    if (isSessionExpired() || !isFingerprintValid()) {
      clearSession();
      return null;
    }
    return deobfuscate(value);
  }

  return value;
};

export const removeItem = (key) => sessionStorage.removeItem(key);

// --- Session Lifecycle ---
export const initSession = () => {
  setSessionExpiry();
  setFingerprint();
};

export const clearSession = () => {
  sessionStorage.clear();
};

// Legacy alias for backward compatibility
export const clearCache = () => clearSession();

// --- Session Health Check ---
export const isSessionValid = () => {
  const token = sessionStorage.getItem("token");
  if (!token) return false;
  if (isSessionExpired()) return false;
  if (!isFingerprintValid()) return false;
  return true;
};
