export const CONSENT_COOKIE = 'fyntix_cookie_preferences';
export const CONSENT_EVENT = 'fyntix:privacy-choice';
export const SETTINGS_EVENT = 'fyntix:privacy-settings';
export const CONSENT_MAX_AGE = 180 * 24 * 60 * 60;
export type PrivacyChoice = { version: 1; externalMedia: boolean; savedAt: number };

export function parseChoice(cookies: string, now = Date.now()): PrivacyChoice | null {
  const value = cookies.split(';').map(part => part.trim()).find(part => part.startsWith(`${CONSENT_COOKIE}=`));
  if (!value) return null;
  try {
    const choice = JSON.parse(decodeURIComponent(value.slice(CONSENT_COOKIE.length + 1)));
    if (choice.version !== 1 || typeof choice.externalMedia !== 'boolean' || !Number.isFinite(choice.savedAt)) return null;
    if (choice.savedAt > now || choice.savedAt <= now - CONSENT_MAX_AGE * 1000) return null;
    return { version: 1, externalMedia: choice.externalMedia, savedAt: choice.savedAt };
  } catch { return null; }
}

export function choiceCookie(choice: PrivacyChoice, secure: boolean): string {
  return `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(choice))}; Path=/; Max-Age=${CONSENT_MAX_AGE}; SameSite=Lax${secure ? '; Secure' : ''}`;
}

// A blocked cookie must not prevent a choice from applying for the current visit.
let visitChoice: PrivacyChoice | null = null;
export function getChoice(): PrivacyChoice | null {
  const now = Date.now();
  if (visitChoice && visitChoice.savedAt > now - CONSENT_MAX_AGE * 1000) return visitChoice;
  visitChoice = null;
  try { return parseChoice(document.cookie, now); } catch { return null; }
}

export function saveChoice(externalMedia: boolean): boolean {
  const choice: PrivacyChoice = { version: 1, externalMedia, savedAt: Date.now() };
  visitChoice = choice;
  let persisted = false;
  try {
    const secure = location.protocol === 'https:';
    document.cookie = choiceCookie(choice, secure);
    // The old imported preference did not cover external media. Never reuse it as consent.
    document.cookie = `aa_cookie_consent=; Path=/; Max-Age=0; SameSite=Lax${secure ? '; Secure' : ''}`;
    persisted = parseChoice(document.cookie)?.savedAt === choice.savedAt;
  } catch { /* Apply the choice for this visit when browser storage is unavailable. */ }
  window.dispatchEvent(new Event(CONSENT_EVENT));
  return persisted;
}

export function openPrivacySettings() { window.dispatchEvent(new Event(SETTINGS_EVENT)); }
