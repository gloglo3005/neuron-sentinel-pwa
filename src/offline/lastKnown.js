// Stores the last successfully fetched zone summary so the app can show
// something useful with no connection — but always honestly labelled with
// its timestamp (spec section 15: "Ne jamais présenter une ancienne
// donnée comme si elle était actuelle"). Deliberately just localStorage,
// not the service worker cache — this is app data with a clear "as of"
// timestamp, not an HTTP cache pretending to be fresh.

const KEY = 'ns_citizen_last_zone';

export function saveLastKnownZone(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ data, savedAt: new Date().toISOString() }));
  } catch {
    // storage unavailable (private browsing, quota) — non-fatal
  }
}

export function loadLastKnownZone() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
