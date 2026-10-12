# Demand-led content update — 12 October 2026

This is a shortlist of task-based search candidates, not a keyword-volume report. The fresh GSC check showed sitemap success/42 discovered URLs, but 0 search impressions in the available 24-hour report; its data was last updated about 4.5 hours earlier. Neither keyword demand size nor rankings can be inferred from that snapshot. No paid keyword-volume/KD dataset was available. Publication counts are URLs, not unique topics.

| Candidate query group | Signal and search intent | Action |
| --- | --- | --- |
| hellraiser revival skull puzzle / tongue key / mouth door | Several independent walkthroughs discuss the same object; written directions disagree. This is a practical content gap, not measured demand volume. | New /puzzles/skull-tongue-key/ uses PowerPyx's explicit viewing direction and preserves other descriptions as disagreements. |
| hellraiser revival what're ya buyin bug / what're ya sellin / first Zora shop | Direct recent player complaint plus the PS5 launch roadmap. | New /trophies/first-zora-shop/ separates pre-shop precautions from already-stuck recovery; no guaranteed fix. |
| hellraiser revival endings / accept or decline / both endings one playthrough | Two named trophy outcomes and a reported replay route; save availability is a real constraint. | New /endings/ with outcome disclosure and difficulty/build-dependent save caution. |
| hellraiser revival bath code / painting code / mansion code | Player asks where cabinet clues are; existing guides already answer these distinct rooms. | Keep existing URLs, connect to Guide Finder; do not make synonym pages. |
| hellraiser revival collectible locations / crafting recipes | Community guides show completion interest; current site supports personal tracking but not a complete original location route. | Keep tracking tools and explicit external location-source boundary; location expansion requires separate verification. |
| hellraiser revival cube puzzle / voyeur safe / VIP token | Newly published guide indexes show coverage interest, but no reliable demand volume or fully verified new route in this update. | Backlog, not placeholder pages. |

Local-language candidate labels: Russian `череп`, `ключ-язык`, `дверь с пастью`, `концовки`; Spanish `cráneo`, `llave`, `finales`, `trofeos`. Russian skull-guide search returns dedicated guides from Showgamer/Rutab. Spanish results include trophy pages with contradictory unsupported claims; they were not used as game-rule evidence. Native labels and aliases are searchable across EN/RU/ES. These searches do not establish audience size.

## Sources and exclusions

- https://www.reddit.com/r/hellraiserthegame/comments/1x2ce5p/is_the_codes_just_hard_to_find_i_been_walking/ — a player asks about finding cabinet clues.
- https://www.reddit.com/r/hellraiserthegame/comments/1x3kcqw/i_hope_we_get_a_fix_soon/ — recent shop-tracker complaint; personal report, not platform-wide proof.
- https://www.reddit.com/r/hellraiserthegame/comments/1x3vlck/hellraiser_revival_puzzles_and_codes_guide/ — newly shared guide index; a publisher's promotion, not counted as an independent player asking for every listed topic.
- https://www.powerpyx.com/clive-barkers-hellraiser-revival-100-walkthrough/ — explicit skull orientation.
- https://thethumbwars.com/how-to-unlock-the-mouth-door-and-solve-the-nail-skull-puzzle-in-hellraiser-revival/ and https://www.noobfeed.com/articles/hellraiser-revival-skull-puzzle — independent sequence descriptions; differences not attributed to a verified patch/platform cause.
- https://www.powerpyx.com/clive-barkers-hellraiser-revival-trophy-guide-roadmap/ — dated PS5 shop/ending rules, current text checked.
- https://www.destructoid.com/all-endings-in-hellraiser-revival-and-how-to-unlock-them/ — independent ending cross-check.
- https://www.keengamer.com/articles/guides/hellraiser-revival-endings-guide-how-to-get-both-endings-in-one-playthrough/ — save-route difficulty boundary.

No official PS5 shop fix was confirmed. Steam demo patch notes do not prove a retail PS5 fix. Excluded unsupported four-ending/hidden-altar claims and unverified file-overwrite recovery advice. No first-hand gameplay claim, copied article, invented screenshot, or numeric traffic forecast.

## Delivered functionality

/guides/ is a static index of ten useful tasks. It works as linked content without JavaScript; enhancement supports room/objective and stage filters, localized count/empty states, clearing, URL restoration, locale-switch persistence, and explicitly copying a filtered link. Search metadata includes each public title/description and authored aliases, never hidden answers. Ordinary sharing still strips query/hash. No finder search text is sent to GA. Newly authored pages support existing bookmarks/recent-guide resume and opt-in sanitized analytics.

Original English prose and complete RU/ES translations are authored in this repository, with source links next to claims. New pages use Oct12 publication/modified dates; original publication dates and existing canonical URLs are preserved. The sitemap now contains 54 URLs (18 topics in three languages), with three localized 404 pages outside it.

## Validation and working copy

Build/check/privacy tests/finder behavior tests pass. Chrome verified combined filters, refresh and EN→RU→ES state; PS5/trofeos/дверь labels find matching content; searching a hidden code returns zero. 320 CSS px Guide Finder and Spanish skull guide have no horizontal overflow. Spoiler controls start closed and open on request; a filtered Zora entry navigates to its focused page.

The original iCloud directory had dataless source and Git files returning empty bytes. Download requests did not restore it during this task. Development therefore used a fresh clone of the same production repository at /private/tmp/hellraiser-content-20261012, starting at bb3c764; no original local files were overwritten. Keep this checkout until the original directory can be materialized and reconciled. GitHub is the authoritative released source; no private template code or credentials copied.
