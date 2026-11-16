/**
 * Injects and controls the WebFX sidebar: a fixed iframe occupying the
 * right quarter of the viewport (clamped 300-440px). The iframe loads an
 * extension page, so page CSS can never touch it and vice versa.
 * Created lazily on first open; slides in/out with an eased transform.
 */
export default class SidebarHost {
  constructor() {
    this.frame = null;
    this.visible = false;
    this._onPageMessage = (e) => {
      if (
        this.frame &&
        e.source === this.frame.contentWindow &&
        e.data && e.data.webfx === 'close-sidebar'
      ) {
        this.hide();
      }
    };
  }

  install() {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg && msg.type === 'webfx-toggle-sidebar') this.toggle();
    });
    window.addEventListener('message', this._onPageMessage);
  }

  toggle() {
    if (this.visible) this.hide();
    else this.show();
  }

  show() {
    this._ensure();
    // Double rAF so the initial offscreen transform is committed first.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      this.frame.style.transform = 'translateX(0)';
    }));
    this.visible = true;
  }

  hide() {
    if (this.frame) this.frame.style.transform = 'translateX(105%)';
    this.visible = false;
  }

  _ensure() {
    if (this.frame) return;
    const f = document.createElement('iframe');
    f.src = chrome.runtime.getURL('src/sidebar/sidebar.html');
    f.setAttribute('allow', '');
    f.style.cssText =
      'position:fixed;top:0;right:0;height:100vh;height:100dvh;' +
      'width:clamp(300px,25vw,440px);border:none;margin:0;padding:0;' +
      'z-index:2147483647;background:#0b0b14;color-scheme:dark;' +
      'transform:translateX(105%);' +
      'transition:transform 0.4s cubic-bezier(0.22,1,0.36,1);' +
      'box-shadow:-24px 0 80px rgba(0,0,0,0.55);';
    document.documentElement.appendChild(f);
    this.frame = f;
  }
}