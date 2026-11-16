/**
 * Background service worker: seeds defaults and keeps the toolbar badge
 * in sync with the number of globally enabled effects.
 */
const updateBadge = async () => {
  const { enabled = {} } = await chrome.storage.sync.get('enabled');
  const count = Object.values(enabled).filter(Boolean).length;
  await chrome.action.setBadgeText({ text: count ? String(count) : '' });
  await chrome.action.setBadgeBackgroundColor({ color: '#7c3aed' });
  await chrome.action.setBadgeTextColor({ color: '#ffffff' });
};

chrome.runtime.onInstalled.addListener(async () => {
  const cur = await chrome.storage.sync.get(['enabled', 'intensity']);
  await chrome.storage.sync.set({
    enabled: cur.enabled ?? {},
    intensity: cur.intensity ?? 1,
  });
  await updateBadge();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.enabled) updateBadge();
});

updateBadge();