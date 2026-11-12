/* One actual card element travels between the scroll scene and gallery.
   Reparenting preserves its gallery click/swipe handlers. */
(()=>{
 const bridge=document.querySelector('.story-bridge'),visual=document.querySelector('.story-bridge-visual'),gallery=document.querySelector('#deck3d'),stage=gallery?.querySelector('.deck3d-stage'),card=stage?.querySelector('.deck3d-card');
 if(!bridge||!visual||!gallery||!stage||!card)return;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 if(reduced.matches)return;
 const placeholder=visual.querySelector('.story-bridge-card');
 if(placeholder)placeholder.remove();
 let inGallery=false,ticking=false,transferTimer=0,hasRevealed=false;
 function progress(){
  const r=bridge.getBoundingClientRect(),distance=Math.max(1,r.height-innerHeight);
  return Math.min(1,Math.max(0,-r.top/distance));
 }
 function moveTo(parent,mode){
  if((mode==='gallery')===inGallery)return;
  const old=card.getBoundingClientRect();
  card.getAnimations().forEach(a=>{if(a.id==='shared-transfer')a.cancel()});
  if(mode==='gallery'){
   card.classList.remove('shared-bridge-card');
   gallery.galleryRefresh?.();
   card.style.removeProperty('transform');
   parent.appendChild(card);
   gallery.gallerySetFace?.(true);
   inGallery=true;
  }else{
   parent.appendChild(card);
   card.classList.add('shared-bridge-card');
   inGallery=false;
   hasRevealed=false;
   gallery.gallerySetFace?.(false);
   const image=card.querySelector('.deck3d-front');if(image){image.src='assets/ecstasy.webp';image.alt='Акварельная карта с радужными крыльями'}
   card.style.transform='rotateY('+Math.round(progress()*180)+'deg) rotateZ('+((1-progress())*-9)+'deg)';
  }
  const now=card.getBoundingClientRect();
  const dx=old.left-now.left,dy=old.top-now.top;
  const sx=now.width?old.width/now.width:1,sy=now.height?old.height/now.height:1;
  if(card.animate&&Math.abs(dx)+Math.abs(dy)<innerHeight*2){
   const animation=card.animate([{translate:dx+'px '+dy+'px',scale:sx+' '+sy,opacity:.95},{translate:'0px 0px',scale:'1 1',opacity:1}],{duration:650,easing:'cubic-bezier(.2,.75,.2,1)'});
   animation.id='shared-transfer';
  }
  clearTimeout(transferTimer);
  if(inGallery&&!hasRevealed){
   hasRevealed=true;
   transferTimer=setTimeout(()=>{if(inGallery)gallery.gallerySetFace?.(false)},780);
  }
 }
 function update(){
  ticking=false;
  const p=progress();
  bridge.style.setProperty('--bridge-progress',p.toFixed(4));
  const galleryTop=gallery.getBoundingClientRect().top;
  // Hysteresis avoids oscillating when the page rests at the handoff.
  if(!inGallery&&galleryTop<innerHeight*.77)moveTo(stage,'gallery');
  else if(inGallery&&galleryTop>innerHeight*.94)moveTo(visual,'bridge');
  if(!inGallery){
   card.style.transform='rotateY('+(p*180).toFixed(1)+'deg) rotateZ('+((1-p)*-9).toFixed(1)+'deg) scale('+(0.75+p*.42).toFixed(3)+')';
  }
 }
 function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(update)}}
 visual.appendChild(card);
 const firstImage=card.querySelector('.deck3d-front');if(firstImage){firstImage.src='assets/ecstasy.webp';firstImage.alt='Акварельная карта с радужными крыльями'}
 card.classList.add('shared-bridge-card');
 card.style.transform='rotateY(0deg) rotateZ(-9deg) scale(.75)';
 addEventListener('scroll',onScroll,{passive:true});
 addEventListener('resize',onScroll,{passive:true});
 update();
})();
