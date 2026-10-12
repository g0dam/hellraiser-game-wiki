import {readFileSync} from "node:fs";
const analyticsId=JSON.parse(readFileSync(new URL("../data/analytics.json",import.meta.url),"utf8")).measurementId;
if(analyticsId&&!/^G-[A-Z0-9]{4,20}$/.test(analyticsId)) throw new Error("Invalid Google Analytics measurement ID");
import { site, navigation, sources as globalSources } from "../data/content.js";

const puzzleBoxIcon = `<svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="4" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" />
  <line x1="12" y1="4" x2="12" y2="28" stroke="currentColor" stroke-width="1" />
  <line x1="20" y1="4" x2="20" y2="28" stroke="currentColor" stroke-width="1" />
  <line x1="4" y1="12" x2="28" y2="12" stroke="currentColor" stroke-width="1" />
  <line x1="4" y1="20" x2="28" y2="20" stroke="currentColor" stroke-width="1" />
  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  <circle cx="20" cy="12" r="1.5" fill="currentColor" />
  <circle cx="12" cy="20" r="1.5" fill="currentColor" />
  <circle cx="20" cy="20" r="1.5" fill="currentColor" />
</svg>`;

export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#39;"}[c]));

function jsonLd(script) {
  return `<script type="application/ld+json">${JSON.stringify(script).replace(/</g, "\\u003c")}</script>`;
}

function header({ currentPath = "/" }) {
  const navItems = navigation
    .map(
      (item) =>
        `<li><a href="${item.href}" ${
          currentPath.startsWith(item.href) ? 'aria-current="page"' : ""
        }>${item.label}</a></li>`
    )
    .join("");

  return `<header class="site-header">
  <a href="#content" class="skip-link">Skip to content</a>
  <div class="header-inner">
    <a class="brand" href="/">
      ${puzzleBoxIcon}
      <span class="brand-title">Hellraiser<small class="brand-sub">Revival Companion</small></span>
    </a>
    <button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="primary-navigation" type="button" hidden>Menu</button>
    <nav id="primary-navigation" class="main-nav" aria-label="Primary">
      <ul>${navItems}</ul>
    </nav>
  </div>
</header>`;
}

function footer() {
  const navItems = navigation
    .map((item) => `<li><a href="${item.href}">${item.label}</a></li>`)
    .join("");

  return `<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-col">
      <h2>Companion</h2>
      <ul>${navItems}</ul>
    </div>
    <div class="footer-col">
      <h2>Official Sources</h2>
      <ul>
        ${globalSources
          .slice(0, 3)
          .map((s) => `<li><a href="${s.href}" target="_blank" rel="noopener noreferrer">${s.label}</a></li>`)
          .join("")}
      </ul>
    </div>
    <div class="footer-col">
      <h2>Independent & open source</h2>
      <p><a href="/about/">Editorial policy & privacy</a> <button class="guide-action" type="button" data-analytics-preferences hidden>Analytics preferences</button> · <a href="https://github.com/g0dam/hellraiser-game-wiki">Source on GitHub</a></p><p>Unofficial fan companion. Not affiliated with Saber Interactive or the rights holders of Hellraiser.</p>
    </div>
  </div>
  <div class="footer-bottom">
    Last updated: ${site.updated} · Edited by ${site.author}
  </div>
</footer>`;
}

function breadcrumb(items) {
  const list = items
    .map((item, index) => {
      if (index === items.length - 1) {
        return `<li aria-current="page"><span>${item.label}</span></li>`;
      }
      return `<li><a href="${item.href}">${item.label}</a></li>`;
    })
    .join("");

  return `<nav class="breadcrumb" aria-label="Breadcrumb">
  <ol>${list}</ol>
</nav>`;
}

export function renderPage({
  slug,
  title,
  description,
  currentPath,
  breadcrumbs = [],
  content,
  ld = [],
  noindex = false,
}) {
  const canonical = `${site.baseUrl}/${slug === "index" ? "" : slug === "404" ? "404.html" : slug + "/"}`;
  const pageTitle = title.includes("Hellraiser") ? title : `${title} | ${site.name}`;

  const head = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  ${analyticsId?`<meta name="google-analytics-id" content="${analyticsId}">`:""}
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${canonical}">
  <meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow'}">
  <meta property="og:type" content="${slug==='index'?'website':'article'}">
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:site_name" content="${site.name}">
  <meta property="og:image" content="${site.baseUrl}/social.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Hellraiser Game Wiki — unofficial puzzle guides and checklists">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/styles/main.css">
  <link rel="stylesheet" href="/styles/engagement.css">
  <link rel="stylesheet" href="/styles/finder.css">
  ${ld.map(jsonLd).join("\n  ")}
</head>`;

  let sectionIndex = 0;
  const sections = [];
  if (slug !== 'index' && slug !== '404') content = content.replace(/<h2>(.*?)<\/h2>/gs, (_, text) => {
    const id = `section-${++sectionIndex}`;
    if (!text.includes('checklist-summary')) sections.push({id, label: text.replace(/<[^>]*>/g, '')});
    return `<h2 id="${id}">${text}</h2>`;
  });
  if (sections.length > 2 && slug !== 'puzzles' && slug !== 'guides') content = content.replace(/(<p class="page-meta">.*?<\/p>)/s, `$1<nav class="page-toc" aria-label="On this page"><strong>On this page</strong><ul>${sections.map(s=>`<li><a href="#${s.id}">${s.label}</a></li>`).join('')}</ul></nav>`);
  if(slug!=='index'&&slug!=='404') content=content.replace(/(<p class="page-meta">.*?<\/p>)/s, '$1<div data-guide-actions hidden></div>');
  const body = `
<body>
${header({ currentPath })}
${breadcrumb(breadcrumbs)}
<main id="content">
${content}
</main>
${footer()}
<script src="/scripts/analytics.js" defer></script>
<script src="/scripts/engagement.js" defer></script>
<script src="/scripts/media.js" defer></script>
<script src="/scripts/finder.js" defer></script>
<script src="/scripts/main.js" defer><\/script>
</body>
</html>`;

  return head + body;
}

export function pageUrl(slug) {
  if (slug === "index") return "/";
  return `/${slug.replace(/\/?index$/, "")}/`;
}
