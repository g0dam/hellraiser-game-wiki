(() => {
 'use strict';
 const locale=document.documentElement.lang;
 const copy={en:{player:'YouTube video player',loading:'Player loaded. Press play to watch. If playback is unavailable, use the original YouTube link.'},ru:{player:'Видеоплеер YouTube',loading:'Плеер загружен. Нажмите воспроизведение. Если видео недоступно, откройте оригинал на YouTube.'},es:{player:'Reproductor de vídeo de YouTube',loading:'Reproductor cargado. Pulsa reproducir. Si el vídeo no está disponible, usa el enlace original de YouTube.'}}[locale]||{player:'YouTube video player',loading:'Player loaded. Use the original link if unavailable.'};
 const ids=new Set(['3x4u7Ec_rZw','RVNAZvpt7ZU','AXkeDx-lKw4']);
 document.querySelectorAll('[data-load-video]').forEach(button=>{
  button.hidden=false;
  button.addEventListener('click',()=>{
   const id=button.dataset.loadVideo;if(!ids.has(id))return;
   const frame=button.closest('[data-video-frame]');if(!frame)return;
   const iframe=document.createElement('iframe');iframe.src='https://www.youtube-nocookie.com/embed/'+id;iframe.title=copy.player;iframe.allow='encrypted-media; picture-in-picture; fullscreen';iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';
   const status=document.createElement('p');status.setAttribute('role','status');status.textContent=copy.loading;
   frame.replaceChildren(iframe);frame.after(status);window.hrTrack?.('video_open',{video_id:id,method:'open',guide_id:'videos'});
  });
 });
})();
