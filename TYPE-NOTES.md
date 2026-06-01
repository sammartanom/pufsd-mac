# Bigger desktop type + body letter-spacing 0

## What changed (styles.css only)
- body letter-spacing: -0.01px -> 0.
- Headings scale up on desktop (mobile unchanged):
    hero h1  clamp max 72 -> 84px
    section h2  clamp max 42 -> 50px
- New "DESKTOP TYPE SCALE" block (@media min-width:768px) bumps, desktop only:
    body 20px; section lead 20px; hero tagline 21px;
    card/accessibility desc 17px; app desc 19px; FAQ answer 18px;
    resource desc 18px; gesture detail 18px; comparison rows 18px;
    card titles / accessibility names 22px; app names 20px; FAQ question 20px.
- Mobile (<768px) is untouched: body stays 18px, hero h1 40px, h2 28px, lead 18px.

All 10 HTML pages: asset version bumped to ?v=5 (cache-bust). No other change to
app.js / content.js content.

## Upload
Upload everything here, delete nav.css + nav.js (still unused), commit, push.
(Only styles.css changed in substance; the HTML changed just the ?v= number.)
