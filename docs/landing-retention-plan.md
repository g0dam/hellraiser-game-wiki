# Landing, media and return visits — 11 October 2026

## Player task and information gain

The home page now starts with actual publisher gameplay imagery. Entry points connect a stuck player to a matching clue, a completion player to separate acquisition/crafting records, and a new player to official demo/save/platform information. It describes the three keypad guides' coverage instead of implying a complete walkthrough.

Three original YouTube uploads add visual help unavailable in the text: the basement/bath cabinet (38 seconds), Tongue Key/skull lock (28 seconds), and a PC no-commentary full recording (4:59:50). Each listing states author, scope, language and spoilers. Original titles remain unchanged to identify the upload. YouTube metadata/playability and thumbnails were checked independently; media-research-2026-10-11.md records exact sources. No puzzle sequence, upload date or video chapter was invented. A full recording is not labeled a verified 100% collection route.

Publisher images are remote references with attribution and retained rights. The homepage shows two real screenshots and three real corresponding video thumbnails; the original concept WebP remains separately documented. Videos use an explicit preview disclosure and an explicit load-player button; a youtube-nocookie player is created only on that action, without autoplay. Original outbound links remain usable without JavaScript or if embedding fails.

## Return visits and sharing

The AION 2 reference chat and current share/analytics code informed the design: retain a useful object and a next task, then measure whether people actually use them. No source code from that application was copied.

- Up to eight guides can be bookmarked locally; the four most recently viewed guides appear on the homepage.
- A locale-neutral allowlist rejects stored external URLs and unrecognized routes. EN/RU/ES render links in the current language.
- The homepage resumes the existing 27-entry checklist; crafted-once marks do not inflate acquired-collectible counts.
- Clearing saved guides/history can be undone during the visit and never clears the gameplay checklist.
- Share uses native sharing where available, otherwise clipboard or a selectable link. It shares the clean public page URL, without query/hash, answers or progress. Native dialog resolution is not reported as proof that a recipient received a share.
- Storage failures leave controls usable for the visit and explain the persistence limit.

These are retention hypotheses, not a proven increase in return rate. Useful measurements are guide_save, return_guide, guide_navigation, spoiler_open, video_open, progress_export/import, checklist_change and distinct share click/success/cancel/failure events. video_open means a player/link was opened, not watched to completion; checklist events do not prove an in-game find.

## Google Analytics integration

A dedicated real GA4 measurement ID belongs in src/data/analytics.json. Blank ID means no Analytics requests or consent prompt. Do not reuse another site's measurement ID. After configuring the stream, disable Enhanced measurement automatic interactions so search/form/query data cannot be collected outside the explicit event allowlist.

The site uses basic opt-in: no Google tag loads before permission. Advertising consent stays denied; Google signals and advertising personalization are disabled. Visitors can change consent from the footer. Same-choice confirmation does not duplicate page views; cross-tab removal/clearing immediately revokes events. Only public routes, fixed method/guide/video IDs, language and bounded boolean/tier flags are sent; no search strings, answers, checklist contents or imported JSON are sent. Page URLs exclude queries/hashes; external referrers keep only origin.

Account/resource creation, tag delivery, collect request and Realtime receipt are separate verification steps. An embedded tag or a successful deployment alone must not be called verified Analytics collection. No historical Hellraiser traffic exists in this new instrumentation.

## SEO/GEO and validation

English routes remain stable; /ru and /es provide translated content and accessibility text. The video guide adds three original indexable routes, for 42 content URLs plus three noindex 404s. All pages retain self canonical, reciprocal language alternatives, sourced factual content and language-specific JSON-LD. No fictional reviews, video popularity claims, first-hand playtests or guaranteed AI citations.

Build/check verify 45 HTML pages and links/anchors/languages/sitemap. Analytics VM tests verify consent gating, sanitization, duplicate prevention and revocation. Browser checks cover real image loads, save across locales, restore on homepage, video disclosure/player loading and phone width. Publish only after commit/push/remote SHA match.

### Dedicated production stream

- Account: Kadenly (existing account); resource: Hellraiser Game Wiki, created with explicit user approval.
- Report timezone: Asia/Shanghai; currency: CNY.
- Web stream: Hellraiser Game Wiki Web, `https://hellraisergame.wiki`, stream ID `16106964643`.
- Measurement ID: `G-4SL620DDSQ` (public client identifier, not a credential). Enhanced measurement disabled at creation.
- Initial stream status before publishing: no data in past 48 hours, expected for a newly created stream. Receipt must be checked after release.
