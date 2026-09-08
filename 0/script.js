(function(){
  const deck = document.getElementById('deck');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const total = slides.length;
  const rail = document.getElementById('rail');
  const curNum = document.getElementById('curNum');
  const totNum = document.getElementById('totNum');
  const progFill = document.getElementById('progFill');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let idx = 0;
  let animating = false;

  totNum.textContent = String(total).padStart(2,'0');

  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Ir para slide ' + (i+1));
    if(i===0) b.classList.add('active');
    b.addEventListener('click', () => go(i));
    rail.appendChild(b);
  });
  const dots = Array.from(rail.children);

  function update(){
    deck.style.transform = 'translateY(-' + (idx*100) + 'vh)';
    dots.forEach((d,i) => d.classList.toggle('active', i===idx));
    curNum.textContent = String(idx+1).padStart(2,'0');
    progFill.style.width = ((idx+1)/total*100) + '%';
    prevBtn.disabled = idx===0;
    nextBtn.disabled = idx===total-1;
  }

  function go(n){
    if(animating) return;
    n = Math.max(0, Math.min(total-1, n));
    if(n === idx) return;
    idx = n;
    animating = true;
    update();
    setTimeout(() => animating = false, 500);
  }

  prevBtn.addEventListener('click', () => go(idx-1));
  nextBtn.addEventListener('click', () => go(idx+1));

  window.addEventListener('keydown', (e) => {
    if(['ArrowDown','PageDown',' '].includes(e.key)){ e.preventDefault(); go(idx+1); }
    else if(['ArrowUp','PageUp'].includes(e.key)){ e.preventDefault(); go(idx-1); }
    else if(e.key === 'Home'){ go(0); }
    else if(e.key === 'End'){ go(total-1); }
  });

  let wheelLock = false;
  window.addEventListener('wheel', (e) => {
    if(wheelLock) return;
    if(Math.abs(e.deltaY) < 18) return;
    wheelLock = true;
    if(e.deltaY > 0) go(idx+1); else go(idx-1);
    setTimeout(() => wheelLock = false, 700);
  }, { passive:true });

  let touchStartY = null;
  window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; }, {passive:true});
  window.addEventListener('touchend', (e) => {
    if(touchStartY === null) return;
    const dy = touchStartY - e.changedTouches[0].clientY;
    if(Math.abs(dy) > 60){ if(dy > 0) go(idx+1); else go(idx-1); }
    touchStartY = null;
  }, {passive:true});

  update();

  // ---- hero scaffold svg generation ----
  const svg = document.getElementById('scaffoldSvg');
  if(svg){
    const cols = 6, rows = 6, spacing = 400/cols;
    let i = 0;
    for(let r=0; r<rows; r++){
      for(let c=0; c<cols; c++){
        const cx = spacing*c + spacing/2 + (r%2 ? spacing/2 * 0.3 : 0);
        const cy = spacing*r + spacing/2;
        const dx = cx - 200, dy = cy - 200;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const rad = Math.max(3, 15 - dist/22);
        const op = Math.max(.15, 1 - dist/230);
        const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', rad.toFixed(1));
        circle.setAttribute('class','scaffold-dot');
        circle.style.setProperty('--op', op.toFixed(2));
        circle.style.animationDelay = (i*0.018) + 's';
        circle.style.opacity = op;
        svg.appendChild(circle);
        i++;
      }
    }
  }
})();
