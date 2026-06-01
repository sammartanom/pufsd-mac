# Mac Hub — Deploy Guide (multi-page version)

This replaces the old single-page `index.html`. Everything is plain static files
plus your existing Cloudflare Function for the AI assistant. No build step.

## Repo layout (what goes at the root)

```
(repo root)
├── index.html              ← home (hero + browse cards)
├── windows-vs-mac.html
├── shortcuts.html
├── gestures.html
├── apps.html
├── accessibility.html
├── videos.html
├── faq.html
├── resources.html
├── admin.html              ← content editor (optional; see below)
├── styles.css              ← shared design system (edit once, all pages update)
├── content.js              ← ALL site data + icons (single source of truth)
├── app.js                  ← shared engine (nav, search, chat, rendering)
├── fonts/
│   └── InterVariable.woff2
└── functions/
    └── api/
        └── chat.js          ← AI assistant endpoint (unchanged)
```

All page links use plain filenames (e.g. `faq.html`). Cloudflare also serves these
at clean URLs (`/faq`), but the `.html` links always work and are what was tested.

## Deploy (GitHub + Cloudflare, the flow you already use)

1. In your repo, DELETE the old single-page `index.html`.
2. Add all the files above (the 9–10 HTML pages, `styles.css`, `content.js`, `app.js`).
   Keep your existing `fonts/` and `functions/` folders exactly where they are.
3. Commit and push. Cloudflare auto-deploys in 1–2 minutes.
4. The AI assistant keeps working with no changes — `app.js` calls the same
   `/api/chat` endpoint, and your `AI` binding is already attached.

## Editing content later

Two ways, both edit the SAME data:

- Directly: open `content.js`, edit the text/arrays, commit. Every page updates.
- In the browser: go to `/admin.html`, make changes, click "Copy updated content.js",
  paste it over your `content.js` file on GitHub, commit. (The admin page never
  saves on its own — it generates the file text for you to paste. This keeps your
  content in version control with no database to manage.)

## Adding real videos

In `content.js`, find the `videos:[ ... ]` array. For each video set:
- `yt`  → the YouTube video ID (the part after `v=` or `youtu.be/`)
- `title` → the card + modal title
- `duration` → optional badge text like "4:12"

Thumbnails auto-pull from YouTube once `yt` is a real ID. Nothing else to touch.

## Notes

- Confirm on the live site: real Inter font, video embeds play, and that your
  Lightspeed filter allows youtube-nocookie.com for students.
- FAQ pages emit FAQPage structured data automatically (good for search results).
