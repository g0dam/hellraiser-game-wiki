# Hellraiser Game Wiki

An independent English, Russian and Spanish companion for **Clive Barker’s Hellraiser: Revival** at [hellraisergame.wiki](https://hellraisergame.wiki). Original static site code, MIT licensed. Unaffiliated with Saber Interactive or the Hellraiser rights holders. The code license grants no rights to game IP or third-party articles.

## Run locally

Node 20+ and Python 3 are sufficient. No npm dependencies or account credentials are needed.

```sh
npm run build
npm run check
npm run serve
```

Open http://127.0.0.1:3005. Build output is `dist/`, excluded from Git. Run commands from the project directory.

## Contents

- A first-run preparation route and page-level contents navigation.
- Three sourced keypad guides with hint, clue and answer tiers.
- A 27-entry collectibles checklist and 12-recipe acquired/crafted tracker.
- Local progress storage, cross-tab updates, JSON export/import and reset.
- PS5 trophy planning, objective-based walkthrough navigation, official game facts and demo details.
- Editorial policy, visible source attribution, reported disagreements and verification boundaries.

There has been no first-hand in-game verification. Painting keypad sources disagree: Insider Gaming reports 9901, while PowerPyx lists 0199/9901. Gameplay content must retain this boundary until supported by new evidence. The walkthrough page is a route directory linking a full external walkthrough, not a complete in-house walkthrough. Pillar slots are tracking aids, not location descriptions. Material quantities await verification.

## Publishing

The `Deploy static site` GitHub Actions workflow is deliberately **manual**. Build and checks run before the Pages artifact is uploaded. For every release:

1. Build, check and verify browser behavior.
2. Review staged code for secrets and unsafe inputs; commit and push.
3. Confirm `git rev-parse HEAD` matches `git ls-remote origin refs/heads/main`.
4. Dispatch `gh workflow run pages.yml --ref main` and verify its successful deployment.

Pages must use the GitHub Actions source and custom domain `hellraisergame.wiki`. On Spaceship, apex A records point to GitHub Pages’ four documented addresses and `www` CNAME points to `g0dam.github.io`. GitHub settings, not an artifact CNAME file alone, control the domain for an Actions deployment. Keep HTTPS enforced once its certificate is ready.

## SEO and answer-engine discovery

Each useful intent has one stable URL and substantive static HTML. Canonicals target the custom domain. The build emits `sitemap.xml`, `robots.txt`, social metadata, fully translated static Russian `/ru/` and Spanish `/es/` pages, reciprocal language alternates, matching Article/Breadcrumb structured data and a `noindex` 404 page. Source dates and limits are visible. No special AI file or schema is claimed to guarantee citations. Deployment does not establish search indexing or rankings; Search Console submission and indexing are separate checks.

## Maintenance

Content lives in `src/data/content.js` and `src/templates/pages.js`; shared visual direction is in `src/styles/main.css` and `src/templates/layout.js`. Keep update dates accurate when facts change. Open a [GitHub issue](https://github.com/g0dam/hellraiser-game-wiki/issues) with the page, evidence, platform and game version for a correction. Never attach credentials.

Privacy: no backend or accounts; progress, bookmarks and history stay in the browser. Google Analytics is optional and loads only after visitor opt-in. Hosting request processing is governed by GitHub’s privacy statement. The initial visual implementation was produced through the user-authorized Claude Code session and then completed and reviewed by Codex. No restricted ShipAny template source or history is included.

## Language and image maintenance

English keeps its original URLs. Complete build-time dictionaries live in `src/i18n/ru.json` and `src/i18n/es.json`; untranslated text fails the build. Dynamic progress and search messages are localized in `src/scripts/main.js`. Native language labels remain recognizable. All languages share the same browser progress record and export format. Chinese is excluded from this release.

The homepage illustration was made with the built-in image_gen tool and is explicitly conceptual. Two real screenshots are referenced remotely from Saber’s media gallery with source captions; their rights are not granted by the MIT code license. See `docs/image-provenance.json` for exact sources and the generation prompt. Remote availability is outside this static site’s control.

The player journey and search plan is in `docs/optimization-plan.md`, with dated Steam review-language evidence in `docs/audience-evidence.json`. Review counts are not player counts or search-volume estimates.

## Landing media and engagement

See [the landing plan](docs/landing-retention-plan.md) and [verified media evidence](docs/media-research-2026-10-11.md). `/videos/` and its Russian/Spanish equivalents contain creator-linked video guidance. Bookmarks/history are local and independent of checklist progress.

`src/data/analytics.json` accepts a dedicated GA4 measurement ID; an empty ID disables Analytics completely. Disable Enhanced measurement in that stream before enabling. Analytics loads only after opt-in; visitors can revise consent in the footer. `npm test` verifies request gating, URL/parameter sanitization and revocation. Deployment does not prove GA Realtime receipt.
