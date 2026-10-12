(() => {
  'use strict';
  const locale = document.documentElement.lang === 'ru' ? 'ru' : document.documentElement.lang === 'es' ? 'es' : 'en';
  const text = {
    en: {count:n=>`${n} guide${n === 1 ? '' : 's'} found`, empty:'No matching guides. Try a room or objective name, or clear the filters.', clear:'Clear filters', share:'Copy filtered guide link', copied:'Filtered guide link copied. It includes your room or objective search and selected stage.', failed:'Copy the filtered guide link below.', link:'Filtered guide link'},
    ru: {count:n=>`Найдено руководств: ${n}`, empty:'Подходящих руководств нет. Попробуйте название комнаты или задачи либо сбросьте фильтры.', clear:'Сбросить фильтры', share:'Скопировать ссылку с фильтрами', copied:'Ссылка скопирована. Она содержит ваш поисковый запрос и выбранный этап.', failed:'Скопируйте ссылку с фильтрами ниже.', link:'Ссылка на отфильтрованные руководства'},
    es: {count:n=>`${n} ${n === 1 ? 'guía encontrada' : 'guías encontradas'}`, empty:'No hay guías que coincidan. Prueba el nombre de una habitación o un objetivo, o borra los filtros.', clear:'Borrar filtros', share:'Copiar enlace con filtros', copied:'Enlace copiado. Incluye tu búsqueda de habitación u objetivo y la etapa elegida.', failed:'Copia el enlace con filtros que aparece a continuación.', link:'Enlace a las guías filtradas'}
  }[locale];
  const normalize = value => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase(locale).replace(/ё/g, 'е');
  const cleanQuery = value => String(value || '').replace(/[\u0000-\u001f\u007f]/g, '').slice(0,120);
  document.querySelectorAll('[data-guide-finder]').forEach(root => {
    const query=root.querySelector('input[data-finder-query]');
    const stage=root.querySelector('select[data-finder-stage]');
    const items=[...root.querySelectorAll('[data-finder-item]')];
    if (!query || !stage || !items.length) return;
    query.maxLength=120;
    const stages=new Set([...stage.options].map(option=>option.value));
    // Only author-supplied room/objective keywords are searchable. Visible answer
    // text, links, form values and hidden spoiler details never enter this index.
    const index=items.map(item=>({item, words:normalize(item.dataset.finderKeywords || ''), stages:new Set((item.dataset.finderStage || '').split(/[\s,]+/).filter(Boolean))}));
    const status=root.querySelector('[data-finder-status]') || root.appendChild(document.createElement('p'));
    status.setAttribute('role','status'); status.setAttribute('aria-live','polite'); status.setAttribute('aria-atomic','true');
    const empty=root.querySelector('[data-finder-empty]') || root.appendChild(document.createElement('div'));
    empty.hidden=true;
    if (!empty.textContent.trim()) {const message=document.createElement('p');message.textContent=text.empty;empty.append(message);}
    let clear=root.querySelector('[data-finder-clear]');
    if (!clear) {clear=document.createElement('button');clear.type='button';clear.textContent=text.clear;clear.setAttribute('data-finder-clear','');empty.append(clear);}
    const share=root.querySelector('[data-finder-share]');
    const shareStatus=root.querySelector('[data-finder-share-status]') || (share ? root.appendChild(document.createElement('p')) : null);
    if(shareStatus){shareStatus.setAttribute('role','status');shareStatus.setAttribute('aria-live','polite');}
    let fallback;
    const filteredUrl=()=>{const url=new URL(location.pathname,location.origin);const q=cleanQuery(query.value).trim();if(q)url.searchParams.set('q',q);if(stage.value)url.searchParams.set('stage',stage.value);return url;};
    function updateLanguageLinks() {
      const neutral=path=>path.replace(/^\/(?:ru|es)(?=\/)/,'');
      document.querySelectorAll('.language-switch a').forEach(link=>{try{const url=new URL(link.href,location.href);if(url.origin!==location.origin || neutral(url.pathname)!==neutral(location.pathname))return;const filters=filteredUrl().searchParams;for(const key of ['q','stage']){const value=filters.get(key);if(value)url.searchParams.set(key,value);else url.searchParams.delete(key);}link.href=url.href;}catch{/* Invalid unrelated links do not block filtering. */}});
    }
    function render(writeUrl=true) {
      query.value=cleanQuery(query.value);
      const terms=normalize(query.value.trim()).split(/\s+/).filter(Boolean);
      let count=0;
      index.forEach(entry=>{const matches=(!stage.value || entry.stages.has(stage.value)) && terms.every(term=>entry.words.includes(term));entry.item.hidden=!matches;if(matches)count++;});
      status.textContent=text.count(count);empty.hidden=count!==0;
      if(shareStatus)shareStatus.textContent='';if(fallback)fallback.hidden=true;
      if(writeUrl){try{const url=new URL(location.href);const filters=filteredUrl().searchParams;for(const key of ['q','stage']){const value=filters.get(key);if(value)url.searchParams.set(key,value);else url.searchParams.delete(key);}if(url.href!==location.href)history.replaceState(history.state,'',url.href);}catch{/* Filtering still works when history access is restricted. */}}
      updateLanguageLinks();
    }
    function readUrl(){const params=new URL(location.href).searchParams;query.value=cleanQuery(params.get('q'));const requested=params.get('stage') || '';stage.value=stages.has(requested)?requested:'';render(false);}
    query.addEventListener('input',()=>render());stage.addEventListener('change',()=>render());
    query.form?.addEventListener('submit',event=>{event.preventDefault();render();});
    clear.addEventListener('click',()=>{query.value='';stage.value='';render();query.focus();});
    if(share){share.type='button';share.hidden=false;if(!share.textContent.trim())share.textContent=text.share;share.addEventListener('click',async()=>{const url=filteredUrl().href;try{if(!navigator.clipboard?.writeText)throw new Error('Unavailable clipboard');await navigator.clipboard.writeText(url);shareStatus.textContent=text.copied;}catch{if(!fallback){fallback=document.createElement('label');fallback.className='finder-copy-fallback';fallback.append(document.createTextNode(text.link));const input=document.createElement('input');input.type='url';input.readOnly=true;fallback.append(input);root.append(fallback);}fallback.hidden=false;const input=fallback.querySelector('input');input.value=url;input.focus();input.select();shareStatus.textContent=text.failed;}});}
    readUrl();root.querySelectorAll('[data-finder-controls]').forEach(el=>el.hidden=false);
    window.addEventListener('popstate',readUrl);
    window.addEventListener('pageshow',event=>{if(event.persisted)readUrl();});
    // No analytics calls: the room/objective query stays in this URL and UI.
  });
})();
