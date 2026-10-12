(() => {
  'use strict';
  const locale = ['ru', 'es'].includes(document.documentElement.lang) ? document.documentElement.lang : 'en';
  const copy = {
    en: {save:'Save guide', saved:'Remove saved guide', share:'Share this page', copied:'Page link copied. Puzzle answers and checklist progress are not included.', manual:'Copy this page link:', failed:'The link could not be copied. Select the link below.', stored:'Guide saved on this device.', removed:'Guide removed from saved guides.', unavailable:'Browser storage is unavailable. Saved guides and history will last only for this visit.', favorites:'Saved guides', recent:'Recently viewed', empty:'Save a useful guide with the bookmark button. It will appear here when you return.', clear:'Clear saved guides and history', undo:'Undo clear', cleared:'Saved guides and history cleared. Checklist progress is unchanged.', restored:'Saved guides and history restored.', local:'Stored on this device, without an account. Shared across the three site languages.', progress:n=>`${n} / 27 collectible entries checked`, tracker:'Continue my checklist', none:'No recently viewed guides yet.', limit:'You can save up to eight guides. Remove one before saving another.', open:'Open saved guide', shared:'Share dialog completed.', cancelled:'Sharing cancelled.', home:'Hellraiser: Revival Wiki'},
    ru: {save:'Сохранить руководство', saved:'Удалить из сохранённого', share:'Поделиться страницей', copied:'Ссылка скопирована. Ответы на загадки и прогресс сбора в неё не входят.', manual:'Скопируйте ссылку на страницу:', failed:'Не удалось скопировать ссылку. Выделите её ниже.', stored:'Руководство сохранено на этом устройстве.', removed:'Руководство удалено из сохранённого.', unavailable:'Хранилище браузера недоступно. Сохранённые страницы и история доступны только до конца посещения.', favorites:'Сохранённые руководства', recent:'Недавно просмотрено', empty:'Сохраните полезное руководство кнопкой закладки. Оно появится здесь при следующем посещении.', clear:'Очистить сохранённые страницы и историю', undo:'Отменить очистку', cleared:'Сохранённые страницы и история очищены. Прогресс сбора не изменён.', restored:'Сохранённые страницы и история восстановлены.', local:'Хранятся на этом устройстве без аккаунта. Общие для трёх языков сайта.', progress:n=>`${n} / 27 предметов отмечено`, tracker:'Продолжить список предметов', none:'Недавно просмотренных руководств пока нет.', limit:'Можно сохранить до восьми руководств. Удалите одно, чтобы добавить другое.', open:'Открыть сохранённое руководство', shared:'Диалог отправки завершён.', cancelled:'Отправка отменена.', home:'Hellraiser: Revival Wiki'},
    es: {save:'Guardar guía', saved:'Quitar de guardadas', share:'Compartir esta página', copied:'Enlace copiado. No incluye respuestas a puzles ni el progreso de tu lista.', manual:'Copia este enlace:', failed:'No se pudo copiar el enlace. Selecciónalo a continuación.', stored:'Guía guardada en este dispositivo.', removed:'Guía eliminada de las guardadas.', unavailable:'El almacenamiento del navegador no está disponible. Las guías y el historial durarán solo durante esta visita.', favorites:'Guías guardadas', recent:'Vistas recientemente', empty:'Guarda una guía útil con el botón de marcador. Aparecerá aquí cuando vuelvas.', clear:'Borrar guías guardadas e historial', undo:'Deshacer borrado', cleared:'Guías e historial borrados. El progreso de la lista no ha cambiado.', restored:'Guías e historial restaurados.', local:'Se guardan en este dispositivo, sin cuenta, y se comparten entre los tres idiomas del sitio.', progress:n=>`${n} / 27 entradas de coleccionables marcadas`, tracker:'Continuar mi lista', none:'Todavía no has visto ninguna guía.', limit:'Puedes guardar hasta ocho guías. Quita una antes de añadir otra.', open:'Abrir guía guardada', shared:'El diálogo de compartir ha terminado.', cancelled:'Se canceló la acción de compartir.', home:'Hellraiser: Revival Wiki'}
  }[locale];
  const titles = {
    '/guides/':['Guide Finder','Поиск руководств','Buscador de guías'], '/puzzles/skull-tongue-key/':['Skull puzzle / Tongue Key','Череп / Tongue Key','Cráneo / Tongue Key'], '/endings/':['Ending choices','Выбор концовки','Decisiones finales'], '/trophies/first-zora-shop/':['First Zora shop','Первый магазин Зоры','Primera tienda de Zora'],
    '/videos/':['Video guides','Видеоруководства','Guías en vídeo'], '/beginner-guide/':['Beginner guide','Руководство для начинающих','Guía para principiantes'], '/puzzles/':['Puzzles & codes','Загадки и коды','Puzles y códigos'],
    '/puzzles/painting-keypad/':['Painting keypad','Код у картины','Código del cuadro'], '/puzzles/bath-keypad/':['Bath keypad','Код у ванны','Código de la bañera'], '/puzzles/mansion-keypad/':['Mansion Great Fire keypad','Код в особняке: Великий пожар','Código de la mansión: Gran Incendio'],
    '/collectibles/':['Collectibles checklist','Список предметов','Lista de coleccionables'], '/crafting/':['Crafting tracker','Учёт создания предметов','Lista de fabricación'], '/trophies/':['PS5 trophy planning','План трофеев PS5','Plan de trofeos de PS5'], '/walkthrough/':['Walkthrough guide routes','Маршруты прохождения','Rutas de guías'], '/game-info/':['Official game information','Официальная информация об игре','Información oficial del juego'], '/demo/':['Demo guide','Руководство по демоверсии','Guía de la demo'], '/about/':['About & sources','О сайте и источниках','Acerca del sitio y sus fuentes']
  };
  const key = 'hellraiser-guides-v1';
  const route = path => path.replace(/^\/(?:ru|es)(?=\/)/, '').replace(/index\.html$/, '') || '/';
  const current = route(location.pathname);
  const valid = path => Object.hasOwn(titles, path);
  const href = path => `${locale === 'en' ? '' : '/'+locale}${path}`;
  const title = path => titles[path][{en:0,ru:1,es:2}[locale]];
  const sanitize = raw => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {saved:[],recent:[]};
    const list = (value, max) => Array.isArray(value) ? [...new Set(value.filter(item=>typeof item==='string' && valid(item)))].slice(0,max) : [];
    return {saved:list(raw.saved,8), recent:list(raw.recent,4)};
  };
  let state={saved:[],recent:[]}, persistent=true, beforeClear=null;
  try {state=sanitize(JSON.parse(localStorage.getItem(key)));} catch {persistent=false;}
  const track = (event, details={}) => {try {if(typeof window.hrTrack==='function') window.hrTrack(event,{guide_id:current==='/'?'home':current,...details});} catch {/* Analytics must not interrupt guide controls. */}};
  const element = (tag, text, className) => {const el=document.createElement(tag); if(text)el.textContent=text;if(className)el.className=className;return el;};
  const panels=[...document.querySelectorAll('[data-personal-guides]')];
  const toolbars=[...document.querySelectorAll('[data-guide-actions]')];
  const statuses=[];
  const panelStatuses=new Map(panels.map(panel=>{const status=element('p',null,'guide-action-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');return [panel,status];}));
  function announce(message,panel){(panel?[panelStatuses.get(panel)]:statuses).forEach(el=>el.textContent=message);}
  function persist(){try{localStorage.setItem(key,JSON.stringify(state));persistent=true;}catch{persistent=false;}if(!persistent)announce(copy.unavailable);}
  const saveButtons=[];
  function renderButtons(){saveButtons.forEach(button=>{const saved=state.saved.includes(current);button.textContent=saved?copy.saved:copy.save;button.setAttribute('aria-pressed',String(saved));});}
  function renderPanels(){panels.forEach(panel=>{
    panel.replaceChildren(); panel.hidden=false;
    panel.append(element('p',copy.local,'personal-note'));
    let count=0;
    try{const progress=JSON.parse(localStorage.getItem('hellraiser-progress-v1'));if(progress && typeof progress==='object')count=Object.entries(progress).filter(([k,v])=>v===true && /^(firearms:[0-4]|recipes:(?:[0-9]|1[01])|pain:[0-4]|suffering:[0-4])$/.test(k)).length;}catch{/* A malformed checklist must not block bookmarks. */}
    const resume=element('a',`${copy.tracker} · ${copy.progress(count)}`,'personal-progress');resume.href=href('/collectibles/');panel.append(resume);
    const columns=element('div',null,'personal-columns');
    [['saved',copy.favorites,copy.empty],['recent',copy.recent,copy.none]].forEach(([list,heading,empty])=>{const section=element('section');section.append(element('h3',heading));if(state[list].length){const ul=element('ul');state[list].forEach(path=>{const li=element('li'),a=element('a',title(path));a.href=href(path);a.addEventListener('click',()=>track('return_guide',{method:list,guide_id:path}));li.append(a);ul.append(li);});section.append(ul);}else section.append(element('p',empty,'personal-empty'));columns.append(section);});
    panel.append(columns);
    const actions=element('div',null,'personal-controls');
    if(state.saved.length || state.recent.length){const clear=element('button',copy.clear,'guide-action');clear.type='button';clear.setAttribute('data-clear-guides','');clear.addEventListener('click',()=>{beforeClear={saved:[...state.saved],recent:[...state.recent]};state={saved:[],recent:[]};persist();render();announce(persistent?copy.cleared:copy.unavailable,panel);panel.querySelector('[data-undo-guides]')?.focus();});actions.append(clear);}
    if(beforeClear){const undo=element('button',copy.undo,'guide-action');undo.type='button';undo.setAttribute('data-undo-guides','');undo.addEventListener('click',()=>{state=beforeClear;beforeClear=null;persist();render();announce(persistent?copy.restored:copy.unavailable,panel);panel.querySelector('[data-clear-guides]')?.focus();});actions.append(undo);}
    panel.append(actions,panelStatuses.get(panel));
  });}
  function render(){renderButtons();renderPanels();}
  const canonical=document.querySelector('link[rel="canonical"]');
  // Construct a public route only. Never copy hashes, query strings, hints or storage.
  const shareUrl=new URL(href(valid(current)?current:'/'),'https://hellraisergame.wiki').href;
  const canonicalUrl=(()=>{try{const url=new URL(canonical?.href||shareUrl);return url.origin==='https://hellraisergame.wiki' && route(url.pathname)===(valid(current)?current:'/') ? new URL(url.pathname,url.origin).href : shareUrl;}catch{return shareUrl;}})();
  toolbars.forEach(toolbar=>{
    toolbar.hidden=false;
    if(valid(current)){const save=element('button',copy.save,'guide-action');save.type='button';save.addEventListener('click',()=>{const saved=state.saved.includes(current);if(!saved && state.saved.length>=8){announce(copy.limit);return;}state.saved=saved?state.saved.filter(path=>path!==current):[current,...state.saved];persist();render();announce(persistent?(saved?copy.removed:copy.stored):copy.unavailable);track(saved?'guide_unsave':'guide_save',{method:'bookmark'});});toolbar.append(save);saveButtons.push(save);}
    const share=element('button',copy.share,'guide-action');share.type='button';
    const status=element('p',null,'guide-action-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');statuses.push(status);
    const fallback=element('div',null,'share-link-fallback');fallback.hidden=true;
    const label=element('label',copy.manual),input=element('input');input.type='url';input.readOnly=true;input.value=canonicalUrl;label.append(input);fallback.append(label);
    share.addEventListener('click',async()=>{
      fallback.hidden=true;const method=typeof navigator.share==='function'?'native':'copy';track('share_click',{method});
      if(method==='native'){try{await navigator.share({title:document.title,url:canonicalUrl});announce(copy.shared);track('share_success',{method:'native'});return;}catch(error){if(error?.name==='AbortError'){announce(copy.cancelled);track('share_cancel',{method:'native'});return;}}}
      try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(canonicalUrl);announce(copy.copied);track('share_success',{method:'copy'});}catch{fallback.hidden=false;announce(copy.failed);input.focus();input.select();track('share_failed',{method:'manual'});}
    });toolbar.append(share,status,fallback);
  });
  if(valid(current)){state.recent=[current,...state.recent.filter(path=>path!==current)].slice(0,4);persist();}
  render();if(!persistent)announce(copy.unavailable);
  window.addEventListener('storage',event=>{if(event.key===key || event.key===null){try{state=sanitize(JSON.parse(event.newValue));}catch{state={saved:[],recent:[]};}beforeClear=null;render();}else if(event.key==='hellraiser-progress-v1')renderPanels();});
})();
