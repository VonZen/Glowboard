# Glowboard website

Product landing page for Glowboard at **https://vonzen.github.io/Glowboard/**.

The page uses the native app’s puppy, kitten and shiba artwork. It includes use-case presets, a live browser-based LED preview, theme switching, Pro information and the configured App Store link. The homepage and legal pages are in English. Release status is deliberately omitted.

## Preview and validate

Static HTML, CSS and JavaScript. No package installation or build is required.

```sh
rtk proxy python3 scripts/validate_site.py
rtk proxy node --check public/assets/landing.js
rtk proxy python3 -m http.server 4173 --bind 127.0.0.1 --directory public
```

Open http://127.0.0.1:4173/. Relative links also work under the production /Glowboard/ prefix.

## Public routes

| Page | Production address |
| --- | --- |
| Home | https://vonzen.github.io/Glowboard/ |
| Privacy policy | https://vonzen.github.io/Glowboard/privacypolicy/ |
| Terms of service | https://vonzen.github.io/Glowboard/termsofservice/ |

The legal addresses match the native app configuration. Contact: **vonzenappstudio@gmail.com**.

## Editing

- public/index.html: product copy and semantic structure.
- public/assets/landing.css: responsive layout and app-derived colours.
- public/assets/landing.js: local Canvas preview, presets and themes; no analytics, storage or user-text uploads.
- public/assets/site.css: shared legal styles and base typography.
- docs/PRD.md: website scope and acceptance criteria.
- docs/assets.md: artwork provenance and feature-copy checks.
- docs/legal-basis.md: original legal-code audit and primary references.
- scripts/validate_site.py: public files, links, canonical URLs and privacy checks.

The main branch deploys through .github/workflows/pages.yml, publishing only public/. The web preview illustrates selected effects; it does not impersonate a native screenshot or offer the full app renderer, purchases or export. Long messages fit when motion is paused, and reduced-motion settings are respected. Without JavaScript, product information, artwork and download/legal links remain available.

Review feature copy and legal pages when native app behaviour changes. Keep the web preview free of analytics and persistence unless a deliberate data-flow change is reflected in the privacy policy.
