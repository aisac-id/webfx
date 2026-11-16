# WebFX

Cinematic VFX for any website. A Chrome extension (Manifest V3) that layers
movie-style visual effects over any page you browse — explosions on click,
matrix rain, film grading, a Thanos snap, and much more.

**28 effects. Zero dependencies. Zero build step. Only selected effects are loaded.**

## Install (Load unpacked)

1. Clone or download this repository.
2. Open `chrome://extensions` in Chrome (or any Chromium browser).
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the repository folder.
5. On any page, click the WebFX toolbar icon (or press **Alt+W**) to open
   the sidebar on the right quarter of the screen. Toggle effects from
   the icon-tab category rail. Press **Esc** or the X to close it.

## Effects

| Category | Effect | What it does |
|---|---|---|
| Click FX | Explosion Click | Fiery particle blast + shockwave ring on every click |
| Click FX | Water Ripple | Concentric water rings expand from each click |
| Click FX | Confetti Burst | Celebration confetti explodes from your clicks |
| Click FX | Screen Shake | The whole page rumbles on click |
| Click FX | Thanos Snap | Clicked elements disintegrate into drifting dust |
| Cursor | Fire Trail | Your cursor drags a trail of rising flames |
| Cursor | Sparkle Trail | Twinkling pastel stars follow your mouse |
| Cursor | Neon Ribbon | A glowing hue-cycling ribbon follows the cursor |
| Cursor | Black Hole | Particles spiral into a singularity at your cursor |
| Ambient | Matrix Rain | Green digital rain of glyphs |
| Ambient | Snowfall | Soft snowflakes with gentle sway |
| Ambient | Rainstorm | Fast rain streaks with splashes |
| Ambient | Fireflies | Wandering glowing bugs pulsing in the dark |
| Ambient | Rising Embers | Hot embers float up from the bottom |
| Ambient | Bubbles | Soap bubbles rise and wobble |
| Ambient | Starfield Warp | Hyperspace star streaks |
| Ambient | Lightning Storm | Random flashes with jagged glowing bolts |
| Ambient | Fireworks | Auto rockets + click to launch your own |
| Ambient | Aurora | Slow northern-light ribbons |
| Ambient | Haunted Fog | Thick drifting fog banks |
| Ambient | Underwater | Blue tint, light caustics and bubbles |
| Cinematic | Cinematic Grade | Letterbox, film grain, vignette, teal-orange |
| Cinematic | Cyber Glitch | RGB split, jitter and corruption bursts |
| Cinematic | VHS Retro | Scanlines, noise, tracking jitter, PLAY badge |
| Cinematic | CRT Monitor | Phosphor scanlines, flicker, curved glass |
| Cinematic | Night Vision | Green phosphor military view |
| Cinematic | Thermal Camera | Heat-map false color, predator style |
| Cinematic | Blueprint | Inverted blue schematic with drafting grid |

Mix and match freely. A global **Intensity** slider (0.2x–2x) scales particle
counts and strengths. Settings sync across your Chrome profiles.

## Architecture

```
manifest.json
src/
  core/
    registry.js      Effect catalog (id, name, category, module file)
    app.js           Lazy loader + lifecycle manager (content side)
    base-effect.js   Abstract BaseEffect: lifecycle + auto-cleanup
    canvas-layer.js  ONE shared canvas + ONE RAF loop for all effects
    particles.js     Particle / ParticleSystem classes
    pointer.js       Shared pointer tracker (single global listener set)
    utils.js         Tiny math helpers
    sidebar-host.js  Injects the sidebar iframe (right 25vw, slide-in)
  content/loader.js  Bootstrap, imports app + sidebar host on demand
  background/service-worker.js  Toolbar/Alt+W toggle, on-demand injection, badge
  sidebar/           Elegant dark UI: icon-tab rail, search, toggles, intensity
  effects/           One ES module per effect, each a BaseEffect subclass
```

Design rules:

- **Lazy loading** — effect modules are `import()`-ed only when enabled.
  Disabled effects are never fetched, parsed, or executed.
- **Atomic files** — every source file is under 300 lines of code.
- **OOP** — every effect is a class extending `BaseEffect`; shared services
  (`CanvasLayer`, `Pointer`, `ParticleSystem`) are classes owned by `App`.
- **Clean teardown** — disabling an effect removes every listener, timer,
  style, overlay and canvas drawer it created. Thanos Snap even restores
  every element it "snapped".
- **Lightweight** — all canvas effects share one canvas and one
  `requestAnimationFrame` loop; frame-rate-independent motion via delta time.

## Adding your own effect

1. Create `src/effects/my-effect.js`:

```js
import BaseEffect from '../core/base-effect.js';

export default class MyEffect extends BaseEffect {
  async onEnable() {
    this.onCleanup(this.pointer.onDown((x, y) => { /* ... */ }));
    this.draw((ctx, { w, h, dt, t }) => { /* per-frame drawing */ });
  }
}
```

2. Add one entry to `src/core/registry.js`. Done — the sidebar and lazy loader
   pick it up automatically.

## Notes

- Effects are cosmetic overlays; they never modify page content (except
  Thanos Snap hiding elements, fully reversible via its toggle).
- Some pages (e.g. the Chrome Web Store) block content scripts by design.
- Not affiliated with Marvel; "Thanos Snap" is a playful fan reference.

## License

[MIT](LICENSE) — use it, fork it, ship it.