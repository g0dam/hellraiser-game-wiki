(() => {
 'use strict';
 const locale=['en','ru','es'].includes(document.documentElement.lang)?document.documentElement.lang:'en';
 const id=document.querySelector('meta[name="google-analytics-id"]')?.content||'';
 window.hrTrack=()=>false;
 if(!/^G-[A-Z0-9]{4,20}$/.test(id))return;
 const messages={
  en:{title:'Optional site analytics',body:'Help us understand which guides are useful. If you accept, Google Analytics receives page visits and basic guide actions. Checklist contents, searches and puzzle answers are never sent. You can change this choice at any time.',accept:'Allow analytics',decline:'Continue without analytics',preferences:'Analytics preferences',enabled:'Analytics enabled.',disabled:'Analytics disabled.',failed:'Analytics could not load. Your guides and saved progress still work.',temporary:'This choice applies to this visit because browser storage is unavailable.'},
  ru:{title:'Необязательная аналитика сайта',body:'Помогите понять, какие руководства полезны. С вашего согласия Google Analytics получает посещения страниц и основные действия с руководствами. Содержимое списков, поисковые запросы и ответы на загадки не передаются. Вы можете изменить выбор в любой момент.',accept:'Разрешить аналитику',decline:'Продолжить без аналитики',preferences:'Настройки аналитики',enabled:'Аналитика включена.',disabled:'Аналитика отключена.',failed:'Не удалось загрузить аналитику. Руководства и сохранённый прогресс работают.',temporary:'Хранилище браузера недоступно: выбор действует только во время этого посещения.'},
  es:{title:'Analítica opcional del sitio',body:'Ayúdanos a entender qué guías resultan útiles. Si aceptas, Google Analytics recibe visitas y acciones básicas en las guías. No enviamos el contenido de las listas, las búsquedas ni las respuestas de los puzles. Puedes cambiar tu decisión cuando quieras.',accept:'Permitir analítica',decline:'Continuar sin analítica',preferences:'Preferencias de analítica',enabled:'Analítica activada.',disabled:'Analítica desactivada.',failed:'No se pudo cargar la analítica. Las guías y el progreso guardado siguen funcionando.',temporary:'El almacenamiento no está disponible: esta decisión se aplica solo durante esta visita.'}
 };
 const ui=messages[locale],key='hellraiser-analytics-consent-v1';
 const eventNames=new Set(['guide_save','guide_unsave','share_click','share_success','share_cancel','share_failed','video_open','guide_navigation','spoiler_open','checklist_change','progress_export','progress_import','return_guide']);
 const guideNames=new Set(['index','home','puzzles','painting-keypad','bath-keypad','mansion-keypad','collectibles','crafting','trophies','walkthrough','game-info','demo','about','beginner-guide','videos','404']);
 const methods=new Set(['native','clipboard','copy','fallback','link','open','x','reddit','facebook','whatsapp','telegram','manual','bookmark','saved','recent']);
 let consent=null,enabled=false,requested=false,loaded=false,failed=false,temporary=false,banner=null;
 try{const value=localStorage.getItem(key);if(value==='granted'||value==='denied')consent=value;}catch{temporary=true;}
 const denied={analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'};
 function gtag(){window.dataLayer.push(arguments);}
 function cleanGuide(value){if(typeof value!=='string')return undefined;const name=value.replace(/^\/(?:ru\/|es\/)?/,'').replace(/^puzzles\//,'').replace(/\/$/,'')||'index';return guideNames.has(name)?name:undefined;}
 const pageGuide=cleanGuide(location.pathname)||'404';
 function safeParams(params){const result={language:locale};if(!params||typeof params!=='object'||Array.isArray(params))return result;
  if(methods.has(params.method))result.method=params.method;
  const guide=cleanGuide(params.guide_id);if(guide)result.guide_id=guide;
  if(typeof params.video_id==='string'&&/^[A-Za-z0-9_-]{11}$/.test(params.video_id))result.video_id=params.video_id;
  if(Number.isInteger(params.spoiler_tier)&&params.spoiler_tier>=1&&params.spoiler_tier<=3)result.spoiler_tier=params.spoiler_tier;
  if(typeof params.checked==='boolean')result.checked=params.checked;
  if(typeof params.success==='boolean')result.success=params.success;
  return result;
 }
 window.hrTrack=(name,params)=>{if(!enabled||failed||!eventNames.has(name))return false;gtag('event',name,safeParams(params));return true;};
 const status=document.createElement('p');status.className='analytics-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.hidden=true;
 function announce(text){status.textContent=text+(temporary?' '+ui.temporary:'');status.hidden=false;}
 function cleanPageLocation(){const path=pageGuide==='404'?'/404.html':location.pathname;return location.origin+path;}
 function cleanReferrer(){try{const url=new URL(document.referrer);return /^(https?:)$/.test(url.protocol)&&url.origin!==location.origin?url.origin+'/':'';}catch{return '';}}
 function pageView(){gtag('event','page_view',{page_location:cleanPageLocation(),page_title:(document.title||'Hellraiser Revival Wiki').slice(0,160),page_referrer:cleanReferrer(),language:locale});}
 function activate(){enabled=true;
  if(!requested){requested=true;window.dataLayer=window.dataLayer||[];window.gtag=gtag;
   gtag('consent','default',{...denied});gtag('js',new Date());
   gtag('consent','update',{...denied,analytics_storage:'granted'});
   gtag('config',id,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:cleanPageLocation(),page_referrer:cleanReferrer()});
   // Disable GA enhanced-measurement interactions in the property's stream settings.
   // This script sends only the explicitly sanitized events below.
   const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+id;
   script.onload=()=>{loaded=true;if(enabled){failed=false;pageView();}};
   script.onerror=()=>{failed=true;announce(ui.failed);};document.head.append(script);
  }else{gtag('consent','update',{...denied,analytics_storage:'granted'});if(loaded&&!failed)pageView();}
 }
 function choose(value,persist=true){const changed=consent!==value;consent=value;enabled=value==='granted';if(persist){try{localStorage.setItem(key,value);}catch{temporary=true;}}
  banner?.remove();banner=null;if(changed){if(enabled)activate();else if(requested)gtag('consent','update',{...denied});}announce(enabled?(failed?ui.failed:ui.enabled):ui.disabled);
 }
 function showPreferences(){if(banner){banner.querySelector('button')?.focus();return;}
  banner=document.createElement('section');banner.className='analytics-consent';banner.setAttribute('aria-label',ui.title);
  const title=document.createElement('strong');title.textContent=ui.title;const body=document.createElement('p');body.textContent=ui.body;
  const actions=document.createElement('div');actions.className='analytics-consent-actions';
  for(const [label,value]of[[ui.accept,'granted'],[ui.decline,'denied']]){const button=document.createElement('button');button.type='button';button.className='btn';button.textContent=label;button.addEventListener('click',()=>choose(value));actions.append(button);}
  banner.append(title,body,actions);document.body.append(banner);
 }
 document.body.append(status);
 let controls=[...document.querySelectorAll('[data-analytics-preferences]')];
 if(!controls.length){const button=document.createElement('button');button.type='button';button.className='analytics-preferences';button.dataset.analyticsPreferences='';button.textContent=ui.preferences;(document.querySelector('footer')||document.body).append(button);controls=[button];}
 controls.forEach(button=>{button.hidden=false;button.addEventListener('click',showPreferences);});
 if(consent==='granted')activate();else if(consent===null)showPreferences();
 window.addEventListener('storage',event=>{if(event.key!==key&&event.key!==null)return;const value=event.key===null?null:event.newValue;if(value==='granted'||value==='denied')choose(value,false);else{choose('denied',false);showPreferences();}});
 document.addEventListener('click',event=>{
  const anchor=event.target.closest?.('a[href]');if(!anchor)return;
  if(anchor.dataset.videoId){window.hrTrack('video_open',{video_id:anchor.dataset.videoId,guide_id:pageGuide});return;}
  try{const url=new URL(anchor.href,location.href),guide=cleanGuide(url.pathname);if(url.origin===location.origin&&guide&&url.pathname!==location.pathname)window.hrTrack('guide_navigation',{guide_id:guide});}catch{}
 });
 document.addEventListener('change',event=>{const input=event.target;if(input.matches?.('[data-checklist] input[type="checkbox"],input[data-progress]'))window.hrTrack('checklist_change',{guide_id:pageGuide,checked:input.checked});});
 document.querySelectorAll('details.spoiler-tier').forEach((details,index)=>details.addEventListener('toggle',()=>{if(!details.open)return;const tier=Number(details.dataset.spoilerTier)||index+1;if(tier>=1&&tier<=3)window.hrTrack('spoiler_open',{guide_id:pageGuide,spoiler_tier:tier});}));
})();
