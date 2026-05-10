# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

Marketing website for ZetaCore Dynamics LLC, served at `zetacoredynamics.com` via GitHub Pages (`CNAME` file pins the apex domain). The flagship product surfaced on the site is **AI Data Collect** (the `#aidatacollect` section).

## Architecture

**Single-file static site.** Everything lives in `index.html` (~1,200 lines). There is no build step, no JS framework, no package manager, no test suite, no asset pipeline, no separate stylesheet.

- All CSS is inline in one `<style>` block at the top of `index.html`.
- Design tokens are defined as CSS custom properties on `:root` (`--navy`, `--blue`, `--accent`, `--font-display` Cormorant Garamond, `--font-body` DM Sans loaded from Google Fonts). When changing colors or typography, update the variables — most rules consume them.
- Page is structured as a sequence of `<section>` elements with stable `id`s used by the in-page nav: `#home` (hero), `#about`, `#projects`, `#aidatacollect`, `#industries`, `#contact`. The fixed `<nav>` and the footer link to these IDs — keep them in sync if you rename a section.
- The contact form is a visual stub: the submit button uses an inline `onclick="alert(...)"`, no `<form action>`, no backend wired up. Treat it as non-functional unless explicitly asked to wire it up.
- Logo and decorative graphics are inline SVG; there are no external image assets in the repo.

## Deployment

GitHub Pages serves `main` directly — pushing to `origin/main` (`github.com/bbradford1/zetacoredynamics.com`) is the deploy. There is no CI, no preview environment, no staging. Verify changes locally before pushing.

**Deploy workflow the user expects:** after a batch of changes is approved, run `git add` + `git commit` + `git push` to publish the site live. Do not push after every small edit — wait until the user signals a milestone is ready, then ship the batch in one commit (or a small number of logical commits).

## Sister site

The user also maintains `aidatacollect.com` at `/home/bradford/websites/aidatacollect.com` (the AI Data Collect product surfaced in this site's `#aidatacollect` section). It's a separate repo and separate GitHub Pages deploy — do not edit it from this session unless explicitly asked.

## Local preview

Open `index.html` directly in a browser, or serve the directory:

```
python3 -m http.server 8000   # then visit http://localhost:8000
```

No install step is required.

## Editing conventions for this file

- Prefer editing the existing CSS variables and section markup over adding new top-level structure — the single-file layout is intentional.
- When adding a new section, give it an `id`, register it in both the `<nav>` `<ul class="nav-links">` and the footer `<ul>`, and reuse the existing `.section-label` / `h2` / `.section-desc` / `.divider` pattern for visual consistency.
