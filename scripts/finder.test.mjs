import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const source=await readFile(new URL('../src/scripts/finder.js',import.meta.url),'utf8');
class Element {
  constructor(text=''){this.textContent=text;this.hidden=false;this.listeners={};this.attributes={};this.children=[];this.value='';this.dataset={};}
  setAttribute(key,value){this.attributes[key]=value;}
  addEventListener(name,fn){this.listeners[name]=fn;}
  append(...children){this.children.push(...children);}
  appendChild(child){this.append(child);return child;}
  focus(){this.focused=true;}
  select(){this.selected=true;}
  querySelector(selector){if(selector==='input')return this.children.find(child=>child.type==='url');return null;}
}
function setup({lang='en',url='https://hellraisergame.wiki/puzzle-finder/',clipboard=true}={}){
  const query=new Element(),stage=new Element(),status=new Element(),empty=new Element('No results'),clear=new Element('Clear'),share=new Element('Copy link'),shareStatus=new Element(),controls=new Element();
  stage.options=[{value:''},{value:'early'},{value:'mansion'}];query.form=new Element();controls.hidden=true;
  const items=[new Element('Answer 9891'),new Element('Answer 1966'),new Element('Recipe contents')];
  items[0].dataset={finderKeywords:'bath bathtub basement baño ванна',finderStage:'early'};
  items[1].dataset={finderKeywords:'mansion great fire painting',finderStage:'mansion'};
  items[2].dataset={finderKeywords:'recipe craft repair basement',finderStage:'early mansion'};
  const selectors={'input[data-finder-query]':query,'select[data-finder-stage]':stage,'[data-finder-status]':status,'[data-finder-empty]':empty,'[data-finder-clear]':clear,'[data-finder-share]':share,'[data-finder-share-status]':shareStatus};
  const root=new Element();root.querySelector=s=>selectors[s]||null;root.querySelectorAll=s=>s==='[data-finder-item]'?items:s==='[data-finder-controls]'?[controls]:[];
  const location={};function setUrl(value){const u=new URL(value);Object.assign(location,{href:u.href,pathname:u.pathname,origin:u.origin});}setUrl(url);
  const languageLinks=['en','ru','es'].map(l=>({href:`https://hellraisergame.wiki/${l==='en'?'':l+'/'}puzzle-finder/`}));
  let copied;const events={};let analyticsCalls=0;
  const history={state:{keep:true},replaceState:(state,title,url)=>{assert.equal(state,history.state);setUrl(url);}};
  vm.runInNewContext(source,{document:{documentElement:{lang},querySelectorAll:s=>s==='[data-guide-finder]'?[root]:languageLinks,createElement:()=>new Element(),createTextNode:text=>({textContent:text})},location,history,window:{addEventListener:(name,fn)=>events[name]=fn,hrTrack:()=>analyticsCalls++},navigator:{clipboard:clipboard?{writeText:async value=>{copied=value;}}:undefined},URL});
  return {query,stage,status,empty,clear,share,shareStatus,controls,items,root,location,languageLinks,events,setUrl,copied:()=>copied,analyticsCalls:()=>analyticsCalls};
}
const first=setup({url:'https://hellraisergame.wiki/puzzle-finder/?q=basement&stage=early&unrelated=kept#content'});
assert.equal(first.query.value,'basement');assert.equal(first.stage.value,'early');assert.equal(first.status.textContent,'2 guides found');assert.equal(first.controls.hidden,false);
first.query.value='great fire';first.stage.value='mansion';first.query.listeners.input();assert.deepEqual(first.items.map(x=>x.hidden),[true,false,true]);assert.equal(first.status.textContent,'1 guide found');assert.equal(new URL(first.location.href).searchParams.get('unrelated'),'kept');assert.equal(new URL(first.languageLinks[1].href).searchParams.get('q'),'great fire');
await first.share.listeners.click();assert.equal(first.copied(),'https://hellraisergame.wiki/puzzle-finder/?q=great+fire&stage=mansion');assert.match(first.shareStatus.textContent,/includes your room/);assert.equal(first.analyticsCalls(),0);
first.query.value='1966';first.query.listeners.input();assert.ok(first.items.every(x=>x.hidden));assert.equal(first.empty.hidden,false);first.clear.listeners.click();assert.ok(first.items.every(x=>!x.hidden));assert.equal(first.query.focused,true);assert.equal(new URL(first.location.href).searchParams.has('q'),false);assert.equal(new URL(first.location.href).searchParams.has('stage'),false);
const spanish=setup({lang:'es',url:'https://hellraisergame.wiki/es/puzzle-finder/?q=bano&stage=early'});assert.equal(spanish.status.textContent,'1 guía encontrada');assert.equal(spanish.items[0].hidden,false);
const russian=setup({lang:'ru',url:'https://hellraisergame.wiki/ru/puzzle-finder/?q=%D0%B2%D0%B0%D0%BD%D0%BD%D0%B0&stage=not-a-stage'});assert.equal(russian.stage.value,'');assert.equal(russian.status.textContent,'Найдено руководств: 1');
russian.setUrl('https://hellraisergame.wiki/ru/puzzle-finder/?q=recipe&stage=mansion');russian.events.popstate();assert.equal(russian.query.value,'recipe');assert.equal(russian.items[2].hidden,false);russian.setUrl('https://hellraisergame.wiki/ru/puzzle-finder/');russian.events.pageshow({persisted:true});assert.equal(russian.status.textContent,'Найдено руководств: 3');
const fallback=setup({clipboard:false});await fallback.share.listeners.click();assert.equal(fallback.shareStatus.textContent,'Copy the filtered guide link below.');const field=fallback.root.children[0].querySelector('input');assert.equal(field.value,'https://hellraisergame.wiki/puzzle-finder/');assert.equal(field.focused,true);assert.equal(field.selected,true);
const oversized=setup({url:'https://hellraisergame.wiki/puzzle-finder/?q='+encodeURIComponent('x'.repeat(300)+'\n')});assert.equal(oversized.query.value.length,120);assert.equal(oversized.query.maxLength,120);
console.log('PASS finder: combined query/stage filters, metadata-only search, no answer matching, URL restore/clear, privacy-safe copied URL, locale switching, ES accents, RU state, history/BFCache, manual copy fallback, query bounds, no analytics calls.');
