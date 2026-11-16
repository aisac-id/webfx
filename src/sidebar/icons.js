/** Inline SVG icon set (24x24, stroke = currentColor). Static, trusted. */
const svg = (body) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ` +
  `stroke-linecap="round" stroke-linejoin="round" width="20" height="20">${body}</svg>`;

const ICONS = {
  all: svg(
    '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/>' +
    '<rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/>' +
    '<rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/>' +
    '<rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>'),
  click: svg(
    '<path d="M9 9l10 4-4.2 1.8L13 19z"/>' +
    '<path d="M4 4l2 2"/><path d="M9 3v2.5"/><path d="M3 9h2.5"/>' +
    '<path d="M5.5 13.5L4 15"/><path d="M13.5 5.5L15 4"/>'),
  cursor: svg(
    '<path d="M12 3l1.7 4.6L18 9l-4.3 1.4L12 15l-1.7-4.6L6 9l4.3-1.4z"/>' +
    '<path d="M18.5 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>' +
    '<path d="M5 16l.6 1.6L7.2 18l-1.6.6L5 20.2l-.6-1.6L2.8 18l1.6-.6z"/>'),
  ambient: svg(
    '<path d="M17.5 13a4.5 4.5 0 0 0-.9-8.9A6 6 0 0 0 5.2 6.3 4.2 4.2 0 0 0 6 12.6"/>' +
    '<path d="M8 16v.01"/><path d="M12 15v.01"/><path d="M16 16v.01"/>' +
    '<path d="M8 20v.01"/><path d="M12 19v.01"/><path d="M16 20v.01"/>'),
  cinema: svg(
    '<rect x="3" y="4" width="18" height="16" rx="2.5"/>' +
    '<path d="M7 4v16"/><path d="M17 4v16"/>' +
    '<path d="M3 9h4"/><path d="M3 15h4"/><path d="M17 9h4"/><path d="M17 15h4"/>'),
  power: svg(
    '<path d="M12 3v8"/>' +
    '<path d="M6.3 6.5a8 8 0 1 0 11.4 0"/>'),
  close: svg('<path d="M6 6l12 12"/><path d="M18 6L6 18"/>'),
  search: svg(
    '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>'),
  dice: svg(
    '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/>' +
    '<path d="M8.5 8.5v.01"/><path d="M15.5 8.5v.01"/><path d="M12 12v.01"/>' +
    '<path d="M8.5 15.5v.01"/><path d="M15.5 15.5v.01"/>'),
  ai: svg(
    '<path d="M12 2.5l2 5.4 5.5 2.1-5.5 2.1-2 5.4-2-5.4L4.5 10l5.5-2.1z"/>' +
    '<path d="M19 15l.9 2.3 2.1.7-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.7z"/>'),
  lab: svg(
    '<path d="M10 3v6l-5.2 9a2 2 0 0 0 1.8 3h10.8a2 2 0 0 0 1.8-3L14 9V3"/>' +
    '<path d="M8.5 3h7"/><path d="M7.3 15h9.4"/>'),
  heart: svg(
    '<path d="M12 20.5S4.5 15.8 2.7 11.5A5.2 5.2 0 0 1 12 6.2a5.2 5.2 0 0 1 9.3 5.3' +
    'c-1.8 4.3-9.3 9-9.3 9z"/>'),
};

export default ICONS;