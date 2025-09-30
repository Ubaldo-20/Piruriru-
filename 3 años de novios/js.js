// ===== Config =====
const NUM_FOTOS = 9;                       // cambia si tienes más/menos
const POSIBLES_EXT = [".jpg",".JPG",".jpeg",".png",".webp"];
const SLIDE_MS = 3000;                     // tiempo por foto

function probarRuta(base){
  return new Promise(res=>{
    const img = new Image();
    img.onload = ()=> res(base);
    img.onerror = ()=> res(null);
    img.src = base + "?v=" + Date.now();
  });
}
async function resolverFotos(){
  const rutas = [];
  for (let i=1; i<=NUM_FOTOS; i++){
    let elegida = null;
    for (const ext of POSIBLES_EXT){
      const ok = await probarRuta(`./${i}${ext}`);
      if (ok){ elegida = ok; break; }
    }
    if (elegida) rutas.push(elegida);
  }
  return rutas;
}

document.addEventListener('DOMContentLoaded', async () => {
  const envelope = document.getElementById('envelope');
  const openBtn  = document.getElementById('openBtn');
  const closeBtn = document.getElementById('closeBtn');
  const flowers  = document.getElementById('flowers');
  const hearts   = document.getElementById('hearts');
  const slideshow= document.getElementById('slideshow');

  const IMAGES = await resolverFotos();

  const slides = [];
  IMAGES.forEach((src,i)=>{
    const s = document.createElement('div'); s.className = 'slide';
    const img = document.createElement('img'); img.alt = `Foto ${i+1}`; img.src = src;
    s.appendChild(img); slideshow.appendChild(s); slides.push(s);
  });

  let slideIndex = 0, timer = null;
  function showSlide(i){ slides.forEach((s,idx)=> s.classList.toggle('active', idx===i)); }
  function startSlideshow(){
    if (!slides.length || timer) return;
    showSlide(0);
    timer = setInterval(()=>{
      slideIndex = (slideIndex + 1) % slides.length;
      showSlide(slideIndex);
    }, SLIDE_MS);
  }
  function stopSlideshow(){
    if (timer){ clearInterval(timer); timer = null; }
  }

  // Abrir carta
  function openCard(){
    envelope.classList.add('open');
    startSlideshow();
    burstHearts();
    spawnFlowers();
  }
  // Cerrar carta
  function closeCard(){
    envelope.classList.remove('open');
    stopSlideshow();
    slides.forEach(s=>s.classList.remove('active'));
    slideIndex = 0;
  }

  openBtn.addEventListener('click', openCard);
  closeBtn.addEventListener('click', closeCard);

  // Corazones
  function burstHearts(){
    const count = 26;
    const r = envelope.getBoundingClientRect();
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    for (let i=0;i<count;i++){
      setTimeout(()=>{
        const h = document.createElement('div'); h.className='heart';
        h.textContent = Math.random()<.5?'❤':'💖';
        h.style.left = cx + (Math.random()*120-60) + 'px';
        h.style.top  = cy + (Math.random()*40 -10) + 'px';
        h.style.fontSize = (18 + Math.random()*22) + 'px';
        hearts.appendChild(h); setTimeout(()=>h.remove(),1300);
      }, i*40);
    }
  }

  // Flores
  const flowerChars = ['✿','❀','🌸','🌺','🌷','💐'];
  function spawnFlowers(){ for (let i=0;i<18;i++) newFlower(true); setInterval(()=>newFlower(false),900); }
  function newFlower(initial){
    const f=document.createElement('div'); f.className='flower';
    f.textContent = flowerChars[(Math.random()*flowerChars.length)|0];
    const startX=Math.random()*100, duration=7+Math.random()*7;
    f.style.left=startX+'vw'; f.style.animationDuration=duration+'s'; f.style.opacity=initial?.0:.9;
    flowers.appendChild(f); setTimeout(()=>f.remove(), duration*1000+500);
  }
});
