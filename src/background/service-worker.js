/**
 * Background service worker:
 * - toolbar click / Alt+W toggles the in-page sidebar
 * - injects the content app on demand if the tab predates installation
 * - runs the AI Director scene rotation
 * - seeds defaults and keeps the toolbar badge in sync
 */
import Director from './director.js';

const director = new Director();

const toggleSidebar = async (tab) => {
  if (!tab?.id) return;
  try {
    await chrome.tabs.sendMessage(tab.id, { type: 'webfx-toggle-sidebar' });
  } catch {
    // No content script yet (tab opened before install) - inject lazily.
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['src/content/loader.js'],
      });
      await chrome.tabs.sendMessage(tab.id, { type: 'webfx-toggle-sidebar' });
    } catch {
      // Restricted page (chrome://, Web Store, etc.) - nothing we can do.
    }
  }
};

chrome.action.onClicked.addListener(toggleSidebar);

chrome.commands.onCommand.addListener(async (name) => {
  if (name !== 'toggle-sidebar') return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await toggleSidebar(tab);
});

const updateBadge = async () => {
  const { enabled = {}, director: ai = false } =
    await chrome.storage.sync.get(['enabled', 'director']);
  const count = Object.values(enabled).filter(Boolean).length;
  await chrome.action.setBadgeText({ text: ai ? 'AI' : count ? String(count) : '' });
  await chrome.action.setBadgeBackgroundColor({ color: ai ? '#0891b2' : '#7c3aed' });
  await chrome.action.setBadgeTextColor({ color: '#ffffff' });
};

chrome.runtime.onInstalled.addListener(async () => {
  const cur = await chrome.storage.sync.get(['enabled', 'intensity', 'director']);
  await chrome.storage.sync.set({
    enabled: cur.enabled ?? {},
    intensity: cur.intensity ?? 1,
    director: cur.director ?? false,
  });
  await updateBadge();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && (changes.enabled || changes.director)) updateBadge();
});

updateBadge();
director.restore();