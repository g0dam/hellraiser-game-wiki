import {mkdir,writeFile,cp,rm} from 'node:fs/promises';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {pages} from './templates/pages.js';
import {site} from './data/content.js';
const root=fileURLToPath(new URL('../',import.meta.url));
const dist=join(root,'dist');
await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});
for(const p of pages){const file=join(dist,p.path);await mkdir(dirname(file),{recursive:true});await writeFile(file,p.render());}
for(const folder of ['styles','scripts'])await cp(join(root,'src',folder),join(dist,folder),{recursive:true});
await cp(join(root,'public'),dist,{recursive:true});
await writeFile(join(dist,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${site.baseUrl}/sitemap.xml\n`);
await writeFile(join(dist,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.filter(p=>p.slug!=='404').map(p=>`<url><loc>${site.baseUrl}${p.slug==='index'?'/':`/${p.slug}/`}</loc><lastmod>${site.updated}</lastmod></url>`).join('')}</urlset>\n`);
await writeFile(join(dist,'.nojekyll'),'');
await writeFile(join(dist,'CNAME'),'hellraisergame.wiki\n');
console.log(`Built ${pages.length} static HTML pages.`);
