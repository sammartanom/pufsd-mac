# Applying the new navigation

Two files changed. Commit both, plus delete two now-unused files.

## Replace
- `app.js`   — nav injection now builds the corner toggle + slide-in panel
- `styles.css` — old header/menu/search-pop styles swapped for the panel styles

## Delete (no longer referenced by any page)
- `nav.css`
- `nav.js`

These were the earlier standalone version. The nav now lives inside app.js +
styles.css, the same way the rest of the site already works, so no page links
them and no HTML files change.

## No HTML changes
Every page still loads styles.css + content.js + app.js and calls initPage(...)
exactly as before. The toggle, panel, scrim, chat, and video modal are all
injected by app.js into the existing #site-header / body.

## What it does
- Single corner toggle (top-right), 24px inset; opens a 420px right-side panel
  that slides in. Lock icon mirrors the toggle in the bottom corner.
- Search at the top runs the existing universal cross-page index (hyphen-
  insensitive: "wifi" finds "Wi-Fi"). Results replace the link list while typing.
- Page links + active-page highlight (mint, color only). Divider, then
  Get Help (mailto to CONTENT.helpEmail) and Ask AI (opens the assistant).
- Esc / scrim-click / link-click all close it; focus is trapped while open;
  prefers-reduced-motion honored.

## Kept exactly as-is
Chat assistant + /api/chat, video modal, footer, FAQ/Videos per-page search,
admin editor, all section rendering.

## Deploy
Commit app.js + styles.css, delete nav.css + nav.js, push. Cloudflare auto-deploys.
