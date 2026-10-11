# Three-language optimization validation

## Scope

English, Russian and Spanish; no Chinese pages published. 13 content pages per language plus 404: 42 HTML files, 39 sitemap URLs. English URLs and version-1 progress format stay stable. Added beginner preparation, contextual next actions, article contents, original illustrated hero and two remotely referenced official screenshots.

## Verified locally

- Build fails for missing translation units; complete body text, metadata, captions and accessible labels are translated.
- Automated checks pass for unique self canonicals/titles, page language, reciprocal en/ru/es/x-default alternates, valid localized JSON-LD, internal paths and anchors, image alt/dimensions, sitemap coverage and noindex 404s.
- Browser: both official screenshots load at their actual 1920×1080 dimensions. Hero is an optimized 1536×1024 WebP, about 172 KiB, with visible AI/conceptual caption.
- At actual 390 CSS pixels, Russian homepage and Spanish checklist fit without horizontal overflow; language selector and mobile menu remain accessible. Viewport override restored afterward.
- Russian → Spanish → English switch preserves the collectibles page and stable progress. A temporary shotgun test mark was shared across languages and then restored to its prior unchecked state.
- Russian search accepts both `ванна` and the English clue `bath`. Spanish `bano` matches `baño`; no-match status is Spanish. Spoiler tiers begin closed; the third bath tier reveals the sourced 9891 answer on request.
- Translation review corrected a Spanish SMG/LMG mistranslation, Russian literal cabinet/pillar phrasing, dated source boundaries and a few missing exact dictionary keys. Game item English names remain recognizable alongside translated labels.
- Shared CSS/JS URLs carry content hashes to avoid receiving stale English-only controls after release.

## Evidence boundary

No first-hand gameplay playtest, current-patch trophy confirmation, new search ranking or AI-citation claim. Steam review-language snapshots are audience signals, not country/player/keyword-volume data. Artwork provenance and prompt are in image-provenance.json; player journey and audience reasoning are in optimization-plan.md and audience-evidence.json.

## Production verification

Record the deployment run and live verification after push/SHA confirmation. Search Console submission and indexing are separate from deployment.

## Subsequent landing and retention release

The prior 42-HTML validation above describes the first multilingual release. This follow-up builds 45 HTML files (42 sitemap content URLs plus three noindex 404s). It replaces the homepage concept hero with an attributed real publisher screenshot, adds three verified video previews and a translated video-guide page, bookmarks/recent history/resume/share, and dedicated opt-in GA4. `npm run build`, `npm run check`, `npm test` and `git diff --check` pass. Browser checks confirm five homepage remote images load, English video guide saved is restored on Spanish homepage, actual 390 CSS-pixel layout has no horizontal overflow, and the Spanish bath clip loads the selected youtube-nocookie iframe on explicit action. Native sharing opens a dialog; VM checks cover success/cancel/fallback, with no claim of recipient delivery.

The dedicated GA4 Web stream was created after explicit user approval; G-4SL620DDSQ, stream ID 16106964643, Enhanced measurement off. Collection/Realtime receipt is validated separately after publication.
