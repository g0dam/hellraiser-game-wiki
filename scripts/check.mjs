import {readFile,readdir,stat} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
async function walk(dir){let out=[];for(const n of await readdir(dir)){const p=join(dir,n);out.push(...(await stat(p)).isDirectory()?await walk(p):[p]);}return out;}
const files=await walk(root);const htmls=files.filter(f=>f.endsWith('.html'));let errors=[];const canonicalSet=new Set(),titles=new Set();
for(const file of htmls){const html=await readFile(file,'utf8');const relative=file.slice(root.length);const canonical=html.match(/rel="canonical" href="([^"]+)"/)?.[1];const title=html.match(/<title>(.*?)<\/title>/s)?.[1];
 const expected='https://hellraisergame.wiki/'+(relative==='index.html'?'':relative.replace(/index\.html$/,''));
 if(canonical!==expected)errors.push(`${relative}: invalid canonical ${canonical}`);
 if(canonicalSet.has(canonical))errors.push(`${relative}: duplicate canonical`);canonicalSet.add(canonical);
 if(!title||titles.has(title))errors.push(`${relative}: missing/duplicate title`);titles.add(title);
 if((html.match(/<h1[ >]/g)||[]).length!==1)errors.push(`${relative}: expected one H1`);
 if(!/<html lang="en">/.test(html)||!/<meta name="description" content=".{40,}"/.test(html))errors.push(`${relative}: missing language/description`);
 for(const script of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)){try{JSON.parse(script[1]);}catch{errors.push(`${relative}: invalid JSON-LD`);}}
 for(const match of html.matchAll(/(?:href|src)="(\/[^"\s]*)"/g)){const url=new URL(match[1],'https://hellraisergame.wiki');let path=decodeURIComponent(url.pathname);const target=join(root,path.endsWith('/')?path+'index.html':path);try{const content=await readFile(target,'utf8');if(url.hash&&!new RegExp(`id=["']${url.hash.slice(1)}["']`).test(content))errors.push(`${relative}: missing anchor ${url.hash}`);}catch{errors.push(`${relative}: broken ${match[1]}`);}}
 if(/Location pending|being assembled|Count the figures|chapter-by-chapter|\bTODO\b/.test(html))errors.push(`${relative}: placeholder or unsupported text`);
}
const sitemap=await readFile(join(root,'sitemap.xml'),'utf8');if(sitemap.includes('404'))errors.push('404 included in sitemap');
for(const c of canonicalSet){if(c.endsWith('404.html'))continue;if(!sitemap.includes(`<loc>${c}</loc>`))errors.push(`Not in sitemap: ${c}`);}
if(!/noindex/.test(await readFile(join(root,'404.html'),'utf8')))errors.push('404 not noindex');
if(errors.length){console.error(errors.join('\n'));process.exit(1);}console.log(`PASS: ${htmls.length} pages; unique canonical/title, language, descriptions, JSON-LD, internal links/assets/anchors, sitemap and 404.`);
