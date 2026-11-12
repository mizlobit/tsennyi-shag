/* 3D showcase inspired by modern motion galleries, without dependencies */
(function(){
 const host=document.querySelector('#deck3d');
 if(!host||typeof cards==='undefined'||!cards.length)return;
 let active=0,flipped=true,tilt=0,start=null,hasEntered=false;
 const stage=host.querySelector('.deck3d-stage'),card=host.querySelector('.deck3d-card');
 const front=host.querySelector('.deck3d-front'),title=host.querySelector('.deck3d-title'),description=host.querySelector('.deck3d-description'),question=host.querySelector('.deck3d-question'),counter=host.querySelector('.deck3d-count'),flip=host.querySelector('.deck3d-flip');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function transform(){card.style.transform='rotateY('+(flipped?180:0)+ 'deg) rotateX('+tilt+'deg)'}
 function render(){const c=cards[active];front.src='assets/'+c.image+'.webp';front.alt='Карта '+c.title;title.textContent=c.title;description.textContent=c.text;question.textContent=c.prompt;counter.textContent=(active+1)+' / '+cards.length;flipped=false;tilt=0;flip.textContent='Перевернуть карту';card.setAttribute('aria-label','Перевернуть карту '+c.title);transform()}
 function move(delta){active=(active+delta+cards.length)%cards.length;render()}
 function toggle(){flipped=!flipped;flip.textContent=flipped?'Показать лицевую':'Перевернуть карту';card.setAttribute('aria-label',flipped?'Показать лицевую сторону':'Перевернуть карту');transform()}
 host.querySelector('.deck3d-prev').addEventListener('click',()=>move(-1));
 host.querySelector('.deck3d-next').addEventListener('click',()=>move(1));
 flip.addEventListener('click',toggle);card.addEventListener('click',toggle);
 host.querySelector('.deck3d-detail').addEventListener('click',()=>{if(typeof show==='function')show(active)});
 stage.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')start={x:e.clientX,y:e.clientY}});
 stage.addEventListener('pointerup',e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.2){move(dx<0?1:-1);stage.dataset.swiped='1'}});
 card.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||reduced.matches)return;const r=card.getBoundingClientRect();tilt=Math.max(-9,Math.min(9,((r.top+r.height/2-e.clientY)/r.height)*18));transform()});
 card.addEventListener('pointerleave',()=>{tilt=0;transform()});
 stage.addEventListener('click',e=>{if(stage.dataset.swiped==='1'){stage.dataset.swiped='';e.stopPropagation()}},true);
 render();
 // Match the back of the card shown at the end of the scroll scene.
 flipped=true;flip.textContent='Показать лицевую';transform();
 const io=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting||hasEntered)return;hasEntered=true;io.disconnect();if(reduced.matches){flipped=false;flip.textContent='Перевернуть карту';transform();return}
 setTimeout(()=>{if(!document.contains(host))return;flipped=false;flip.textContent='Перевернуть карту';transform()},420);
 },{threshold:.35});
 io.observe(host);
})();
