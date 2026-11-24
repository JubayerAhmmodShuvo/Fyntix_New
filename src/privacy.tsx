import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CONSENT_EVENT, CONSENT_MAX_AGE, getChoice, saveChoice, SETTINGS_EVENT, type PrivacyChoice } from './consent';

export function usePrivacyChoice() {
  const [choice, setChoice] = useState<PrivacyChoice | null>(() => getChoice());
  useEffect(() => {
    const update = () => setChoice(getChoice());
    window.addEventListener(CONSENT_EVENT, update);
    return () => window.removeEventListener(CONSENT_EVENT, update);
  }, []);
  useEffect(() => {
    if (!choice) return;
    // Long delays exceed the browser's 32-bit timer limit; check expiry daily.
    const expiry = choice.savedAt + CONSENT_MAX_AGE * 1000;
    const timer = setInterval(() => setChoice(getChoice()), Math.min(86400000, Math.max(50, expiry - Date.now() + 50)));
    return () => clearInterval(timer);
  }, [choice]);
  return choice;
}

export function CookieConsent({ request }: { request: number }) {
  const choice = usePrivacyChoice();
  const [view, setView] = useState<'banner' | 'settings'>();
  const [externalMedia, setExternalMedia] = useState(false);
  const [notice, setNotice] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const previous = useRef<HTMLElement | null>(null);
  const openSettings = () => {
    previous.current = document.activeElement as HTMLElement | null;
    setExternalMedia(getChoice()?.externalMedia ?? false);
    setNotice(''); setView('settings');
  };
  useEffect(() => {
    const timer = setTimeout(() => { if (!getChoice()) setView(current => current ?? 'banner'); }, 2500);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (request) openSettings();
  }, [request]);
  useEffect(() => {
    window.addEventListener(SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(SETTINGS_EVENT, openSettings);
  }, []);
  useEffect(() => {
    if (view !== 'settings' || !dialog.current) return;
    const panel = dialog.current;
    panel.showModal();
    return () => { panel.close(); previous.current?.focus({ preventScroll: true }); };
  }, [view]);

  function dismiss() { setView(choice ? undefined : 'banner'); }
  function select(allow: boolean) {
    const persisted = saveChoice(allow);
    setExternalMedia(allow);
    setNotice(persisted ? '' : 'Your browser could not save this choice. It applies for this visit.');
    setView(undefined);
    previous.current?.focus({ preventScroll: true });
  }

  return createPortal(<>
    {view === 'banner' && <section className="fyntix-cookie-banner" aria-labelledby="fyntix-cookie-heading">
      <div className="fyntix-cookie-copy"><h2 id="fyntix-cookie-heading">Your privacy at Fyntix</h2>
        <p>We use a necessary cookie to remember your choice. Optional Vimeo videos stay blocked until you allow them. This site currently has no analytics or advertising tags. <a href="/cookie-policy">Read our cookie policy</a>.</p></div>
      <div className="fyntix-cookie-actions"><button type="button" onClick={() => select(false)}>Reject optional</button><button type="button" onClick={openSettings}>Customise</button><button type="button" onClick={() => select(true)}>Allow videos</button></div>
    </section>}
    {view === 'settings' && <dialog className="fyntix-cookie-dialog" ref={dialog} aria-labelledby="fyntix-settings-heading" aria-describedby="fyntix-settings-description" onCancel={event => { event.preventDefault(); dismiss(); }}>
      <div className="fyntix-cookie-dialog-heading"><div><p className="fyntix-privacy-eyebrow">Fyntix · Your privacy</p><h2 id="fyntix-settings-heading">Cookie settings</h2></div><button type="button" onClick={dismiss}>Close</button></div>
      <p id="fyntix-settings-description">Choose whether external videos can load. Rejecting them keeps the rest of the site available. You can change your choice here at any time.</p>
      <div className="fyntix-cookie-category"><label><input type="checkbox" checked disabled /><span>Necessary preference cookie <small>Always active</small></span></label><p>Stores your choice for 180 days. It does not contain your name or contact details.</p></div>
      <div className="fyntix-cookie-category"><label><input type="checkbox" checked={externalMedia} onChange={event => setExternalMedia(event.target.checked)} aria-describedby="fyntix-media-description" /><span>External media <small>Optional · Vimeo</small></span></label><p id="fyntix-media-description">Allows Vimeo video players to load. Vimeo receives technical information such as your IP address and may use cookies or storage under its own privacy policy.</p></div>
      <p>We do not currently load analytics or advertising tags on this website. Our SEO and paid advertising services for clients do not activate tracking on this site.</p>
      <p><a href="/cookie-policy">Cookie policy</a> · <a href="/privacy-policy">Privacy policy</a></p>
      <div className="fyntix-cookie-actions"><button type="button" onClick={() => select(false)}>Reject optional</button><button type="button" onClick={() => select(externalMedia)}>Save settings</button></div>
    </dialog>}
    {notice && <p className="replica-toast" role="status">{notice}</p>}
  </>, document.body);
}
