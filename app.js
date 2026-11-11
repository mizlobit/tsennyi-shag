const cards=[
['worth','08','Самоценность','support','17-21-44','Внутренняя опора начинается с признания собственной ценности. Этот образ приглашает прислушаться к себе без необходимости заслуживать одобрение.','Что во мне ценно независимо от чужой оценки?'],
['transformation','11','Трансформация','change','17-22-22','Бабочка, цветы и спирали напоминают о переменах. Иногда новому состоянию нужно время, тишина и бережное отношение к себе.','Что во мне уже меняется, даже если результат пока не виден?'],
['strength','36','Сила','support','17-22-27','Прямой взгляд и насыщенные цвета — повод заметить свою смелость, устойчивость и право оставаться собой.','В какой ситуации я уже проявляю силу?'],
['creator','37','Творец','path','17-22-17','Цвет и движение складываются в живую композицию. Позвольте этому образу напомнить о способности создавать и выбирать.','Какое небольшое действие сегодня зависит от меня?'],
['resonance','16','Резонанс','support','17-21-44','Небо отражается в воде, а радужный поток соединяет части картины. В авторском прочтении это образ обмена и связи с миром.','Что наполняет меня, а чему я отдаю слишком много сил?'],
['truth','05','Истина','support','17-21-44','Спирали и внимательный взгляд приглашают замедлиться. За внешним шумом можно услышать собственные ощущения.','Что я знаю о себе, когда перестаю искать чужое подтверждение?'],
['goal','23','Цель','path','17-21-54','Лучник соединяет намерение и действие. Рассмотрите направление взгляда, натяжение лука и пространство вокруг.','К чему я хочу двигаться и что поможет мне сфокусироваться?'],
['growth','09','Совершенствование','path','17-21-17','Движение через необычный мир может напомнить о пути обучения: он не всегда прямой, но каждый опыт способен что-то открыть.','Какой опыт я могу взять с собой на следующий этап?'],
['wholeness','21','Самодостаточность','support','17-22-00','Тишина, закрытые глаза и мягкие волны создают пространство внутреннего внимания. Попробуйте заметить ощущение целостности.','На какой собственный ресурс я могу опереться сейчас?'],
['kaleidoscope','34','Калейдоскоп','change','17-22-10','Когда привычный узор меняется, появляется место для нового. В авторском тексте карта связана с отпусканием прошлого.','Чему я готова позволить сложиться по-новому?'],
['breakthrough','35','Прорыв','change','17-22-10','Движение к солнцу — яркая метафора выхода за привычные границы и встречи с собственной инициативой.','Какое желание я давно откладываю?'],
['balance','20','Баланс','support','17-22-35','Симметрия гор, воды и фигуры помогает обратиться к теме равновесия. У каждого человека оно складывается по-своему.','Что поможет мне восстановить равновесие сегодня?']
].map(([image,number,title,category,original,text,prompt])=>({image,number,title,category,original,text,prompt}));
const grid=document.querySelector('#cardGrid');function render(filter='all'){grid.innerHTML=cards.map((c,i)=>filter!=='all'&&c.category!==filter?'':`<button class="card" data-index="${i}" aria-label="Рассмотреть карту ${c.title}"><div class="card-image"><img src="assets/${c.image}.webp" alt="${c.title}" loading="lazy"></div><div class="card-label"><small>${c.number}</small><h3>${c.title}</h3><span>↗</span></div></button>`).join('')}render();
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));render(b.dataset.filter)}));
const viewer=document.querySelector('#viewer'),turn=document.querySelector('#turnCard'),original=document.querySelector('#originalImage');let current=0,side='front';const tabs=['front','back','original'];function setSide(value){side=value;turn.hidden=value==='original';original.hidden=value!=='original';document.querySelector('#angle').disabled=value==='original';tabs.forEach(t=>document.querySelector('#'+t+'Btn').classList.toggle('active',t===value));rotate()};function rotate(){turn.style.transform=`rotateY(${(side==='back'?180:0)+Number(document.querySelector('#angle').value)}deg)`}function show(i){current=(i+cards.length)%cards.length;const c=cards[current];document.querySelector('#frontImage').src=`assets/${c.image}.webp`;document.querySelector('#frontImage').alt=c.title;original.src=`assets/photo_2026-11-11_${c.original}.webp`;document.querySelector('#cardNumber').textContent=`ЦЕННЫЙ ШАГ / КАРТА ${c.number}`;document.querySelector('#cardTitle').textContent=c.title;document.querySelector('#cardText').textContent=c.text;document.querySelector('#cardPrompt').textContent=c.prompt;document.querySelector('#angle').value=0;setSide('front');if(!viewer.open)viewer.showModal()}
grid.addEventListener('click',e=>{const b=e.target.closest('[data-index]');if(b)show(Number(b.dataset.index))});tabs.forEach(t=>document.querySelector('#'+t+'Btn').onclick=()=>setSide(t));document.querySelector('#angle').oninput=rotate;document.querySelector('#previous').onclick=()=>show(current-1);document.querySelector('#next').onclick=()=>show(current+1);document.querySelector('.close').onclick=()=>viewer.close();viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)viewer.close()}});viewer.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;if(e.key==='ArrowRight')show(current+1);if(e.key==='ArrowLeft')show(current-1)});
let selection=[],chosen=null;const draw=document.querySelector('#drawCards'),result=document.querySelector('#drawResult');function shuffle(){selection=cards.map((_,i)=>i).sort(()=>Math.random()-.5).slice(0,3);chosen=null;result.hidden=true;draw.innerHTML=selection.map((_,i)=>`<button class="draw-card" data-pick="${i}" aria-label="Открыть карту ${i+1}"><img src="assets/back.webp" alt="Закрытая карта"><span>${i+1}</span></button>`).join('')}shuffle();draw.addEventListener('click',e=>{const b=e.target.closest('[data-pick]');if(!b)return;const i=Number(b.dataset.pick);chosen=selection[i];const c=cards[chosen];b.querySelector('img').src=`assets/${c.image}.webp`;b.querySelector('img').alt=c.title;b.querySelector('span').textContent='';result.hidden=false;result.innerHTML=`<div class="eyebrow">ВАШ ОБРАЗ ДЛЯ РАЗМЫШЛЕНИЯ</div><div class="question-echo"></div><h3>${c.title}</h3><p>${c.text}</p><p><strong>${c.prompt}</strong></p><button class="text-link" id="inspectDraw">Рассмотреть карту со всех сторон ↗</button><small>Образ выбран случайно. Его личный смысл определяете вы.</small>`;const q=document.querySelector('#question').value.trim();result.querySelector('.question-echo').textContent=q?'Ваш вопрос: '+q:'';document.querySelector('#inspectDraw').onclick=()=>show(chosen);result.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'})});document.querySelector('#shuffle').onclick=shuffle;
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));


/* Touch navigation and card flip for mobile */
(function(){
  let startX=0,startY=0,started=false;
  const surface=document.querySelector('.viewer-image');
  surface.addEventListener('touchstart',e=>{
    if(e.touches.length!==1)return;
    startX=e.touches[0].clientX;startY=e.touches[0].clientY;started=true;
  },{passive:true});
  surface.addEventListener('touchend',e=>{
    if(!started||!viewer.open||!e.changedTouches.length)return;
    started=false;
    const dx=e.changedTouches[0].clientX-startX;
    const dy=e.changedTouches[0].clientY-startY;
    if(Math.abs(dx)<55||Math.abs(dx)<Math.abs(dy)*1.3)return;
    show(current+(dx<0?1:-1));
  },{passive:true});
  surface.addEventListener('touchcancel',()=>{started=false},{passive:true});
  turn.addEventListener('click',()=>{
    if(!viewer.open||side==='original')return;
    document.querySelector('#angle').value=0;
    setSide(side==='front'?'back':'front');
  });
  turn.style.cursor='pointer';
  const shuffleButton=document.querySelector('#shuffle');
  shuffleButton.addEventListener('click',()=>{
    draw.querySelectorAll('.draw-card').forEach(b=>b.disabled=false);
  });
})();
