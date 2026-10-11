import {readFile,readdir,stat} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {locales,route} from '../src/i18n/localize.js';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
async function walk(dir){let out=[];for(const n of await readdir(dir)){const p=join(dir,n);out.push(...(await stat(p)).isDirectory()?await walk(p):[p]);}return out;}
const files=await walk(root);const htmls=files.filter(f=>f.endsWith('.html')&&!/\/google[a-f0-9]+\.html$/.test(f));let errors=[];const canonicalSet=new Set(),titles=new Set();
for(const file of htmls){const html=await readFile(file,'utf8');const relative=file.slice(root.length);const canonical=html.match(/rel="canonical" href="([^"]+)"/)?.[1];const title=html.match(/<title>(.*?)<\/title>/s)?.[1];
 const locale=relative.startsWith('ru/')?'ru':relative.startsWith('es/')?'es':'en';
 const expected='https://hellraisergame.wiki/'+(relative==='index.html'?'':relative.replace(/index\.html$/,''));
 if(canonical!==expected)errors.push(`${relative}: invalid canonical ${canonical}`);
 if(canonicalSet.has(canonical))errors.push(`${relative}: duplicate canonical`);canonicalSet.add(canonical);
 if(!title||titles.has(title))errors.push(`${relative}: missing/duplicate title`);titles.add(title);
 if((html.match(/<h1[ >]/g)||[]).length!==1)errors.push(`${relative}: expected one H1`);
 if(!html.includes(`<html lang="${locale}">`)||!/<meta name="description" content=".{40,}"/.test(html))errors.push(`${relative}: missing language/description`);
 for(const script of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)){try{const ld=JSON.parse(script[1]);if(ld.inLanguage&&ld.inLanguage!==locale)errors.push(`${relative}: JSON-LD language mismatch`);if(ld.url&&ld.url!==canonical)errors.push(`${relative}: JSON-LD canonical mismatch`);}catch{errors.push(`${relative}: invalid JSON-LD`);}}
 for(const match of html.matchAll(/(?:href|src)="(\/[^"\s]*)"/g)){const url=new URL(match[1],'https://hellraisergame.wiki');let path=decodeURIComponent(url.pathname);const target=join(root,path.endsWith('/')?path+'index.html':path);try{const content=await readFile(target,'utf8');if(url.hash&&!new RegExp(`id=["']${url.hash.slice(1)}["']`).test(content))errors.push(`${relative}: missing anchor ${url.hash}`);}catch{errors.push(`${relative}: broken ${match[1]}`);}}
 if(/Location pending|being assembled|Count the figures|chapter-by-chapter|\bTODO\b/.test(html))errors.push(`${relative}: placeholder or unsupported text`);
}
 for(const file of htmls){
 const html=await readFile(file,'utf8'),relative=file.slice(root.length);
 const baseRelative=relative.replace(/^(ru|es)\//,'');
 const basePath='/'+(baseRelative==='index.html'?'':baseRelative.replace(/index\.html$/,''));
 for(const lang of [...locales,'x-default']){
  const expected='https://hellraisergame.wiki'+route(basePath,lang==='x-default'?'en':lang);
  if(!html.includes(`hreflang="${lang}" href="${expected}"`))errors.push(`${relative}: missing alternate ${lang}`);
  const target=join(root,expected.replace('https://hellraisergame.wiki/','').replace(/\/$/,'/index.html')||'index.html');
  try{const peer=await readFile(target,'utf8');if(!peer.includes(`hreflang="${lang}" href="${expected}"`))errors.push(`${relative}: nonreciprocal alternate`);}catch{errors.push(`${relative}: alternate target missing ${expected}`);}
 }
 if(/href="\/zh\//.test(html))errors.push(`${relative}: Chinese published despite scope`);
 for(const m of html.matchAll(/<img\b([^>]*)>/g))if(!/alt=".+?"/.test(m[1])||!/width="\d+"/.test(m[1])||!/height="\d+"/.test(m[1]))errors.push(`${relative}: missing image accessibility/dimensions`);
}
const sitemap=await readFile(join(root,'sitemap.xml'),'utf8');if(sitemap.includes('404'))errors.push('404 included in sitemap');
for(const c of canonicalSet){if(c.endsWith('404.html'))continue;if(!sitemap.includes(`<loc>${c}</loc>`))errors.push(`Not in sitemap: ${c}`);}
for(const lang of locales)if(!/noindex/.test(await readFile(join(root,lang==='en'?'404.html':`${lang}/404.html`),'utf8')))errors.push(`${lang} 404 not noindex`);
if(errors.length){console.error(errors.join('\n'));process.exit(1);}console.log(`PASS: ${htmls.length} pages; unique canonical/title, locale metadata, reciprocal alternates, image dimensions/alt, JSON-LD, internal links/assets/anchors, sitemap and 404.`);

const verification=await readFile(join(root,'googlec2cb467714d97bac.html'),'utf8');if(verification.trim()!=='google-site-verification: googlec2cb467714d97bac.html')throw new Error('Invalid GSC verification file');
