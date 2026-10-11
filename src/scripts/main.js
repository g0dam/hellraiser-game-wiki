(() => {
 'use strict';
 const key='hellraiser-progress-v1';
 const validKey=k=>/^(firearms:(?:[0-4])|recipes:(?:[0-9]|1[01])|crafted:(?:[0-9]|1[01])|pain:[0-4]|suffering:[0-4])$/.test(k);
 let state={};
 let persistent=true;
 const status=text=>document.querySelectorAll('[data-storage-status]').forEach(el=>el.textContent=text);
 function clean(raw){if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('Invalid progress object');const result={};for(const [k,v] of Object.entries(raw)){if(validKey(k)&&typeof v==='boolean')result[k]=v;}return result;}
 try{const raw=localStorage.getItem(key);if(raw)state=clean(JSON.parse(raw));localStorage.setItem(key,JSON.stringify(state));}catch{persistent=false;status('Browser storage is unavailable or unreadable. Progress works for this visit; export a backup to keep it.');}
 const inputs=[...document.querySelectorAll('[data-checklist] input[type="checkbox"], input[data-progress]')];
 const inputKey=input=>input.dataset.progress||`${input.closest('[data-checklist]').dataset.checklist}:${input.value}`;
 function render(){inputs.forEach(input=>input.checked=state[inputKey(input)]===true);document.querySelectorAll('[data-checklist]').forEach(list=>{const boxes=list.querySelectorAll('input');const checked=[...boxes].filter(b=>b.checked).length;list.closest('.checklist-section').querySelector('.checklist-summary').textContent=`${checked} / ${boxes.length} ${list.dataset.verb||'collected'}`;});}
 function save(){try{localStorage.setItem(key,JSON.stringify(state));persistent=true;}catch{persistent=false;}if(!persistent)status('Progress is not saved in this browser. Export a backup before leaving.');render();}
 inputs.forEach(input=>input.addEventListener('change',()=>{state[inputKey(input)]=input.checked;save();}));render();
 window.addEventListener('storage',event=>{if(event.key!==key)return;try{state=event.newValue?clean(JSON.parse(event.newValue)):{};render();}catch{status('A changed progress file could not be read. Export a backup of this visit.');}});
 document.querySelectorAll('[data-export]').forEach(button=>button.addEventListener('click',()=>{const blob=new Blob([JSON.stringify({version:1,progress:state},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='hellraiser-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status('Progress backup exported. Keep the file to restore it on another device.');}));
 document.querySelectorAll('[data-import]').forEach(input=>input.addEventListener('change',async()=>{try{const file=input.files[0];if(!file)return;if(file.size>100000)throw new Error('File too large');const data=JSON.parse(await file.text());if(data.version!==1)throw new Error('Unsupported version');state={...state,...clean(data.progress)};save();if(persistent)status('Progress imported and merged with your existing record.');}catch{status('Could not import this file. Choose a Hellraiser progress JSON backup under 100 KB.');}input.value='';}));
 document.querySelectorAll('[data-reset]').forEach(button=>button.addEventListener('click',()=>{if(!confirm('Reset all collectible and crafting progress on this device? Export a backup first if you want to restore it.'))return;state={};save();if(persistent)status('Progress reset. An exported backup can restore it.');}));
 const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.main-nav');
 if(menu&&nav){menu.hidden=false;menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.focus();}});document.addEventListener('click',event=>{if(!nav.contains(event.target)&&!menu.contains(event.target)){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}});}
 const search=document.querySelector('[data-puzzle-search]');
 if(search){search.addEventListener('input',()=>{const q=search.value.trim().toLowerCase();let count=0;document.querySelectorAll('[data-puzzle-item]').forEach(item=>{item.hidden=!item.textContent.toLowerCase().includes(q);if(!item.hidden)count++;});document.querySelector('[data-search-status]').textContent=count?`${count} puzzle guide${count===1?'':'s'}`:'No matching puzzle. Try painting, bath or mansion.';});}
 document.querySelectorAll('.js-control').forEach(el=>el.hidden=false);
 document.documentElement.classList.add('js');
})();
