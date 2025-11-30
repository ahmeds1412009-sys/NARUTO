
// Canvas effects: falling embers, random explosions, rising smoke, heat blur
(() => {
  const canvas = document.getElementById('fireCanvas');
  const ctx = canvas.getContext('2d');
  const audio = document.getElementById('fireSound');

  function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
  resize(); window.addEventListener('resize', resize);

  // particles
  let embers = [];
  let explosions = [];
  let smoke = [];

  function spawnEmber(){
    embers.push({ x: Math.random()*canvas.width, y: canvas.height+10, vx: (Math.random()-0.5)*0.6, vy: 1+Math.random()*2, r: 2+Math.random()*6, life: 80+Math.random()*120, alpha: 0.2+Math.random()*0.6 });
    if(embers.length>200) embers.splice(0, embers.length-200);
  }
  setInterval(spawnEmber, 90);

  function spawnExplosion(){
    const cx = Math.random()*canvas.width;
    const cy = canvas.height * (0.4 + Math.random()*0.5);
    for(let i=0;i<24;i++){
      explosions.push({ x:cx, y:cy, vx:(Math.random()-0.5)*6, vy:(Math.random()-0.8)*6, r:6+Math.random()*24, life:50+Math.random()*60, alpha:0.6+Math.random()*0.6, color:`rgba(255,${80+Math.floor(Math.random()*140)},0,` });
    }
    if(explosions.length>600) explosions.splice(0, explosions.length-600);
  }
  setInterval(spawnExplosion, 2600 + Math.random()*1200);

  function spawnSmoke(){
    smoke.push({ x: Math.random()*canvas.width, y: canvas.height+20, vy: 0.5+Math.random()*1.6, r: 20+Math.random()*40, alpha: 0.03+Math.random()*0.12 });
    if(smoke.length>90) smoke.splice(0, smoke.length-90);
  }
  setInterval(spawnSmoke, 180);

  // heat shimmer helper
  function heatShimmer() {
    // simple shimmer using translucent rects
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.06;
    for(let i=0;i<4;i++){
      const w = canvas.width*(0.2+Math.random()*0.3);
      const h = 40 + Math.random()*140;
      const x = Math.random()*(canvas.width - w);
      const y = Math.random()*canvas.height;
      ctx.fillStyle = 'rgba(255,120,40,0.06)';
      ctx.fillRect(x,y,w,h);
    }
    ctx.restore();
  }

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // embers
    for(let i=embers.length-1;i>=0;i--){
      const e = embers[i];
      e.x += e.vx; e.y -= e.vy; e.life -=1; e.alpha -= 0.002;
      if(e.life<=0 || e.y < -50) { embers.splice(i,1); continue; }
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,${120+Math.floor(Math.random()*100)},0,${e.alpha})`;
      ctx.arc(e.x,e.y,e.r,0,Math.PI*2);
      ctx.fill();
    }

    // explosions
    for(let i=explosions.length-1;i>=0;i--){
      const ex = explosions[i];
      ex.x += ex.vx; ex.y += ex.vy; ex.life -=1; ex.alpha -= 0.01;
      if(ex.life<=0) { explosions.splice(i,1); continue; }
      ctx.beginPath(); ctx.fillStyle = ex.color + Math.max(0,ex.alpha) + ')'; ctx.arc(ex.x,ex.y,ex.r,0,Math.PI*2); ctx.fill();
    }

    // smoke
    for(let i=smoke.length-1;i>=0;i--){
      const s = smoke[i]; s.y -= s.vy; s.alpha -= 0.0006; s.r += 0.06;
      if(s.alpha<=0 || s.y < -200) { smoke.splice(i,1); continue; }
      ctx.beginPath(); ctx.fillStyle = `rgba(90,90,90,${s.alpha})`; ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
    }

    heatShimmer();

    requestAnimationFrame(draw);
  }

  // start
  draw();

  // ensure sound plays (some browsers block autoplay unless muted/user-interaction)
  window.addEventListener('click', ()=>{ if(audio && audio.paused) audio.play().catch(()=>{}); });

  // prevent image download by disabling context menu on images
  document.addEventListener('contextmenu', (e)=>{
    if(e.target && e.target.tagName === 'IMG') e.preventDefault();
  });

})();