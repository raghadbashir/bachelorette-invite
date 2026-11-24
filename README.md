# Bachelorette Invitation Film

A ~42-second animated invitation that plays like a story reel, then settles on a details card with a live countdown, calendar, map, WhatsApp RSVP and replay.

**Live:** https://raghadbashir.github.io/bachelorette-invite/

## Edit the content
Everything you see on screen lives in **`config.js`**: the bride's name, monogram, date, time, venue, address, map link, dress code, WhatsApp number and message, event start/end (for the countdown and calendar) and every label.

- **Date:** keep `date.day` two digits (`"07"`). `event.start` / `event.end` should include your timezone offset, e.g. `2026-12-31T19:00:00+03:00`.
- **WhatsApp:** international format, digits only (e.g. `9665XXXXXXXX`).
- **Baby photo:** add `assets/baby.jpg` (square works best) or change `babyPhoto`. If it's missing, an elegant placeholder shows instead.
- **Music (optional):** add `assets/music.mp3`. It fades in after the guest taps "Tap to open". If the file isn't there, the mute button stays hidden.

Commit and push. GitHub Pages updates in about a minute.

## Link preview
WhatsApp and Instagram read the `og:` tags in `index.html` (they don't run JavaScript). The preview image is `assets/og-image.jpg`, and it doesn't include the name, so it works as it is. WhatsApp caches previews, so a link you've already shared may show the old preview for a while.

## Controls
Tap the right side to go to the next scene, tap the left side to go back, hold to pause. Use **Skip** to jump to the details card. Arrow keys and the space bar work on desktop. If the guest has reduced motion turned on, the details card fades in directly.

## Testing a scene
Add `?scene=<name>&t=<seconds>` to the URL to jump to a moment. Scene names: `open`, `envelope`, `invited`, `name`, `photo`, `date`, `place`, `dress`, `final`.

## Files
`index.html` · `styles.css` · `script.js` (cheetah-print generator, GSAP timeline, player) · `config.js` · `assets/` · `.nojekyll`. It's a plain static site with no build step. GSAP and the Google Fonts load from CDNs.
