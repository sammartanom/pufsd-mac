# AI assistant button + panel

## What changed
- app.js   — chat now lives in a right-side slide-in panel; added a bottom-right
             AI toggle; mutual exclusivity + focus trap with the nav.
- styles.css — old floating chat-window replaced with .ai-panel styles that
             mirror the nav panel; bottom toggle; spark<->X morph.
- all 10 HTML pages — asset version bumped to ?v=3 (cache-bust). No other HTML change.

Upload everything here, delete nav.css + nav.js (still unused), commit, push.

## Behavior
- Bottom-right circle button mirrors the top-right nav toggle exactly: same size,
  same 24px inset (16px mobile), centers aligned vertically. Spark (mint) icon.
- Click it: a panel slides in from the right — same width (460px), same card color,
  same slide animation as the nav. Heading "Ask AI", subtitle, example chips, and the
  message input pinned at the bottom (clear of the corner button).
- The spark morphs to an X while open; click it (or the scrim, or Esc) to close.
- Existing triggers still work: the home "Ask the Assistant" card and the nav panel's
  "Ask AI" item both open this same panel.
- The two panels are mutually exclusive: opening one closes the other. To avoid the
  bottom-right AI button colliding with the nav panel's admin lock, each corner button
  hides while the other panel is open.
- Chat itself is unchanged: same /api/chat call, chips, typing indicator.

## Version bumping going forward
Whenever app.js or styles.css change, bump ?v=N on all pages so browsers fetch fresh.
