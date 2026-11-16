import { pickScene, sceneToEnabled } from '../core/scenes.js';

/**
 * AI Director: while enabled, rotates curated scenes every 30 seconds
 * using chrome.alarms (survives MV3 service-worker sleep). Every scene
 * respects the performance budget, so the auto-rotation never piles
 * effects up. Manual toggles in the sidebar turn the director off.
 */
export default class Director {
  constructor() {
    this.alarmName = 'webfx-director';
    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === this.alarmName) this.nextScene();
    });
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'sync' && changes.director) {
        this._apply(!!changes.director.newValue);
      }
    });
  }

  async restore() {
    const { director = false } = await chrome.storage.sync.get('director');
    if (director) await this._apply(true);
  }

  async _apply(on) {
    if (on) {
      await chrome.alarms.create(this.alarmName, { periodInMinutes: 0.5 });
      await this.nextScene();
    } else {
      await chrome.alarms.clear(this.alarmName);
    }
  }

  async nextScene() {
    const { lastScene = null } = await chrome.storage.local.get('lastScene');
    const scene = pickScene(lastScene);
    await chrome.storage.sync.set({ enabled: sceneToEnabled(scene) });
    await chrome.storage.local.set({ lastScene: scene.id });
  }
}