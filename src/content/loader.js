/**
 * Tiny non-module bootstrap. Content scripts cannot be ES modules in the
 * manifest, so this dynamically imports the real app + sidebar host from
 * the extension's web-accessible resources. Zero effect code is loaded
 * until selected.
 */
(async () => {
  if (window.__webfxLoaded) return;
  window.__webfxLoaded = true;
  try {
    const [{ default: App }, { default: SidebarHost }] = await Promise.all([
      import(chrome.runtime.getURL('src/core/app.js')),
      import(chrome.runtime.getURL('src/core/sidebar-host.js')),
    ]);
    await new App().init();
    new SidebarHost().install();
  } catch (err) {
    console.warn('[WebFX] bootstrap failed', err);
  }
})();