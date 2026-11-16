/**
 * Tiny non-module bootstrap. Content scripts cannot be ES modules in the
 * manifest, so this dynamically imports the real app from the extension's
 * web-accessible resources. Zero effect code is loaded until selected.
 */
(async () => {
  if (window.__webfxLoaded) return;
  window.__webfxLoaded = true;
  try {
    const { default: App } = await import(chrome.runtime.getURL('src/core/app.js'));
    await new App().init();
  } catch (err) {
    console.warn('[WebFX] bootstrap failed', err);
  }
})();