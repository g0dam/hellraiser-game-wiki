import { readFileSync } from 'node:fs';

export const locales = ['en', 'ru', 'es'];
export const route = (path, locale) => locale === 'en' ? path : `/${locale}${path}`;
let messages = {};
const dictionaries = {};
const decode = text => text.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const escape = text => text.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const missing = new Set();

export function translate(text) {
  const key = decode(text).trim();
  if (!key || ['English','Русский','Español'].includes(key)) return text;
  if (Object.hasOwn(messages, key)) return text.replace(text.trim(), escape(messages[key]));
  if (!/[A-Za-z]/.test(key)) return text;
  missing.add(key);
  return text;
}

// Localization runs at build time. Published pages need no translation script,
// and an untranslated text unit fails the build rather than silently falling back.
export function localizeHtml(html, locale, path) {
  const alternates = locales.map(lang=>`<link rel="alternate" hreflang="${lang}" href="https://hellraisergame.wiki${route(path,lang)}">`).join('')+`<link rel="alternate" hreflang="x-default" href="https://hellraisergame.wiki${path}">`;
  const ogLocale = {en:'en_US',ru:'ru_RU',es:'es_ES'};
  html = html.replace('</head>', `${alternates}</head>`).replace('<meta property="og:type"', `<meta property="og:locale" content="${ogLocale[locale]}">${locales.filter(lang=>lang!==locale).map(lang=>`<meta property="og:locale:alternate" content="${ogLocale[lang]}">`).join('')}<meta property="og:type"`);
  const names = {en:'English',ru:'Русский',es:'Español'};
  html = html.replace('<button class="menu-toggle"', `<nav class="language-switch" aria-label="Language">${locales.map(lang=>`<a href="${route(path,lang)}" lang="${lang}" hreflang="${lang}" ${lang===locale?'aria-current="page"':''}>${names[lang]}</a>`).join('')}</nav><button class="menu-toggle"`);
  if(locale==='en') return html;
  messages = dictionaries[locale] ||= JSON.parse(readFileSync(new URL(`./${locale}.json`,import.meta.url),'utf8'));
  html = html.replace('<html lang="en">',`<html lang="${locale}">`);
  html = html.replace(/<script type="application\/ld\+json">(.*?)<\/script>/gs, (_,raw)=>{
    function localize(value, key='') {
      if(Array.isArray(value)) return value.map(v=>localize(v,key));
      if(value && typeof value==='object') return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,localize(v,k)]));
      if(typeof value!=='string') return value;
      if(key==='inLanguage') return locale;
      if(['headline','name','description'].includes(key)) return decode(translate(escape(value)));
      if(['url','item'].includes(key) && value.startsWith('https://hellraisergame.wiki')) return value.replace('https://hellraisergame.wiki',`https://hellraisergame.wiki/${locale}`);
      return value;
    }
    return `<script type="application/ld+json">${JSON.stringify(localize(JSON.parse(raw))).replace(/</g,'\\u003c')}</script>`;
  });
  let inScript=false, originalText=false;
  return html.split(/(<[^>]+>)/g).map(token=>{
    if(token.startsWith('<script')) {inScript=true;return token;}
    if(token.startsWith('</script')) {inScript=false;return token;}
    if(inScript) return token;
    if(token.startsWith('<')&&token.includes('data-original-text')) {originalText=true;return token;}
    if(originalText){if(token.startsWith('</'))originalText=false;return token;}
    if(!token.startsWith('<')) return translate(token);
    token = token.replace(/(alt|aria-label|placeholder|content)="([^"]*)"/g, (all,key,value)=>{
      if(key==='content' && !/(?:name="description"|property="og:(?:title|description|image:alt)")/.test(token)) return all;
      return `${key}="${translate(value)}"`;
    });
    // Assets and English language-switch links keep their original paths.
    if(!token.includes('hreflang=')) token=token.replace(/href="(\/[^"\s]*)"/g,(all,url)=>/^\/(?:styles|scripts|images)\/|^\/favicon/.test(url)?all:`href="${route(url,locale)}"`);
    if(/rel="canonical"|property="og:url"/.test(token)) token=token.replace('https://hellraisergame.wiki/',`https://hellraisergame.wiki/${locale}/`);
    return token;
  }).join('');
}

export function assertComplete() {
  if(missing.size) throw new Error(`Missing translations (${missing.size}):\n${[...missing].join('\n')}`);
}
