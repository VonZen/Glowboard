# Glowboard website

Minimal launch page and app-specific legal pages, hosted at **https://vonzen.github.io/Glowboard/**.

The home page intentionally contains only the app icon, name and legal/support links while the app UI is being completed. There are no product screenshots, feature sections, pricing claims or download buttons. The legal pages are in English, matching the reference site's legal-page language and the app's development language.

## Preview and validate

This is a static HTML/CSS website. No package installation, JavaScript or Jekyll build is needed. Run from this repository:

```sh
rtk proxy python3 scripts/validate_site.py
rtk proxy python3 -m http.server 4173 --bind 127.0.0.1 --directory public
```

Open `http://127.0.0.1:4173/`. Relative asset and navigation links work at the local root and under the production `/Glowboard/` prefix.

## Public routes

| Page | Production address |
| --- | --- |
| Home | https://vonzen.github.io/Glowboard/ |
| Privacy policy | https://vonzen.github.io/Glowboard/privacypolicy/ |
| Terms of service | https://vonzen.github.io/Glowboard/termsofservice/ |

These legal addresses already match the native app's runtime configuration. Contact: **vonzenappstudio@gmail.com**.

## Files and deployment

- `public/`: the complete published site. Edit its HTML files and `assets/site.css` directly.
- `scripts/validate_site.py`: checks document structure, local links and fragments, canonical routes, sitemap, and unwanted trackers or keys.
- `docs/PRD.md`: the website's scope.
- `docs/legal-basis.md`: code audit and primary references used when drafting the policies.
- `.github/workflows/pages.yml`: validates and deploys only `public/` when `main` changes. Configure the repository's Pages source as **GitHub Actions**.

Internal documentation, validation scripts and native app files are not published. The website uses local assets and system fonts and has no analytics, cookies or browser storage. Review the legal pages whenever app data practices or purchase behaviour change.
