# AI assistant: menu-triggered panel with back arrow + single sparkle

## What changed
- app.js     — removed the bottom-right corner AI button; AI panel now opens only
               from the menu's "Ask AI"; added a top-left back arrow that returns to
               the menu; single-sparkle icon in the panel header.
- content.js — the AI icon (ICONS.spark) is now a single sparkle, so the home
               "Ask the Assistant" card matches.
- styles.css — corner-toggle styles removed; added .ai-back (top-left arrow) and the
               sparkle header; padding adjusted (no corner button to clear anymore).
- all 10 HTML pages — asset version bumped to ?v=4 (cache-bust). No other HTML change.

Upload everything here, delete nav.css + nav.js (still unused), commit, push.

## Behavior
- No floating AI button anywhere.
- Open the menu (top-right), tap "Ask AI" — the menu closes and the AI panel slides in
  (same panel: same width, card color, animation).
- Top-left of the AI panel is a back arrow ( < ) that returns you to the menu.
- The scrim or Esc dismisses the panel entirely. While it's open, the top-right nav
  toggle hides so the corner stays clean.
- Header shows a single mint sparkle next to "Ask AI". The home "Ask the Assistant"
  card uses the same single sparkle and still opens this panel.
- Chat itself unchanged: /api/chat, chips, typing indicator.

## Version bumping
Whenever app.js / styles.css / content.js change, bump ?v=N on all pages.
