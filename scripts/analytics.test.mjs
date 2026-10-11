import vm from 'node:vm';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../src/scripts/analytics.js',import.meta.url),'utf8');
function create({id='G-1234567890',initial=null,storageFail=false,lang='en'}={}){
 const nodes=[],listeners={},stored=new Map(initial?[['hellraiser-analytics-consent-v1',initial]]:[]);
 function el(tag){const node={tag,children:[],dataset:{},listeners:{},hidden:false,append(...children){this.children.push(...children)},setAttribute(k,v){this[k]=v},addEventListener(k,v){this.listeners[k]=v},remove(){this.removed=true},querySelector(){return this.children.flatMap(c=>c.children||[]).find(n=>n.tag==='button')},focus(){}};nodes.push(node);return node;}
 const body=el('body'),head=el('head'),footer=el('footer');
 const document={documentElement:{lang},title:'Hellraiser Revival — Guide',referrer:'https://ref.example/private?email=secret',body,head,createElement:el,querySelector(selector){return selector==='meta[name="google-analytics-id"]'?{content:id}:selector==='footer'?footer:null},querySelectorAll(){return[]},addEventListener(k,v){listeners[k]=v}};
 const window={addEventListener(k,v){listeners['window:'+k]=v}};
 const context={document,window,location:{origin:'https://hellraisergame.wiki',pathname:'/ru/puzzles/bath-keypad/',href:'https://hellraisergame.wiki/ru/puzzles/bath-keypad/?secret=value#9891'},localStorage:{getItem(k){if(storageFail)throw Error();return stored.get(k)||null},setItem(k,v){if(storageFail)throw Error();stored.set(k,v)}},URL,Set,Date};
 vm.runInNewContext(source,context);
 const clicks=()=>nodes.filter(n=>n.tag==='button'&&n.listeners.click),queue=()=>Array.from(window.dataLayer||[],a=>Array.from(a));
 return{window,head,nodes,listeners,clicks,queue,stored};
}
const app=create();assert.equal(app.head.children.length,0);assert.equal(app.window.hrTrack('guide_save',{guide_id:'bath-keypad'}),false);assert.equal(app.queue().length,0);
app.clicks().find(n=>n.textContent==='Continue without analytics').listeners.click();assert.equal(app.head.children.length,0);assert.equal(app.stored.get('hellraiser-analytics-consent-v1'),'denied');
app.clicks().find(n=>n.textContent==='Analytics preferences').listeners.click();app.clicks().filter(n=>n.textContent==='Allow analytics').at(-1).listeners.click();assert.equal(app.head.children.length,1);
const script=app.head.children[0];script.onload();const view=app.queue().find(a=>a[0]==='event'&&a[1]==='page_view');assert.equal(view[2].page_location,'https://hellraisergame.wiki/ru/puzzles/bath-keypad/');assert.equal(view[2].page_referrer,'https://ref.example/');
const pageViews=()=>app.queue().filter(a=>a[0]==='event'&&a[1]==='page_view').length;
assert.equal(pageViews(),1);app.clicks().find(n=>n.textContent==='Analytics preferences').listeners.click();app.clicks().filter(n=>n.textContent==='Allow analytics').at(-1).listeners.click();assert.equal(pageViews(),1);assert.equal(app.head.children.length,1);
assert.equal(app.window.hrTrack('search',{query:'private'}),false);
app.window.hrTrack('progress_import',{guide_id:'/ru/puzzles/bath-keypad/',method:'clipboard',video_id:'abc123456_-',spoiler_tier:3,checked:true,success:false,query:'private',answer:'9891',email:'me@example.com',language:'ru'});
const event=app.queue().at(-1);assert.deepEqual(JSON.parse(JSON.stringify(event[2])),{language:'en',method:'clipboard',guide_id:'bath-keypad',video_id:'abc123456_-',spoiler_tier:3,checked:true,success:false});
app.window.hrTrack('share_click',{guide_id:'private-person-name',method:'custom-person',video_id:'private',spoiler_tier:99,checked:'yes'});assert.deepEqual(JSON.parse(JSON.stringify(app.queue().at(-1)[2])),{language:'en'});
app.listeners['window:storage']({key:'hellraiser-analytics-consent-v1',newValue:'denied'});const before=app.queue().length;assert.equal(app.window.hrTrack('guide_save',{guide_id:'index'}),false);assert.equal(app.queue().length,before);
const denied=create({initial:'denied'});assert.equal(denied.head.children.length,0);assert.equal(denied.nodes.filter(n=>n.className==='analytics-consent').length,0);
const invalid=create({id:'not-configured'});assert.equal(invalid.head.children.length,0);assert.equal(invalid.nodes.filter(n=>n.tag==='button').length,0);
const pending=create();pending.clicks().find(n=>n.textContent==='Allow analytics').listeners.click();pending.listeners['window:storage']({key:'hellraiser-analytics-consent-v1',newValue:'denied'});pending.head.children[0].onload();assert.equal(pending.queue().filter(a=>a[1]==='page_view').length,0);
const cleared=create({initial:'granted'});cleared.head.children[0].onload();cleared.listeners['window:storage']({key:null,newValue:null});const clearedCount=cleared.queue().length;assert.equal(cleared.window.hrTrack('guide_save',{guide_id:'index'}),false);assert.equal(cleared.queue().length,clearedCount);assert.equal(cleared.queue().at(-1)[2].analytics_storage,'denied');assert.ok(cleared.nodes.some(n=>n.className==='analytics-consent'&&!n.removed));
const temp=create({storageFail:true,lang:'es'});temp.clicks().find(n=>n.textContent==='Permitir analítica').listeners.click();assert.ok(temp.nodes.find(n=>n.className==='analytics-status').textContent.includes('solo durante esta visita'));temp.head.children[0].onerror();assert.equal(temp.window.hrTrack('guide_save',{}),false);assert.ok(temp.nodes.find(n=>n.className==='analytics-status').textContent.includes('No se pudo cargar'));
console.log('PASS: consent request gating, denial persistence, sanitization, clean URLs, revocation including pending load, no-ID disable, storage fallback and localized load failure');
