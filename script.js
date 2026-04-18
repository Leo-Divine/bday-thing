const canvas  = document.getElementById('confetti-canvas');
const ctx     = canvas.getContext('2d');
const W       = () => { canvas.width  = window.innerWidth; };
const H       = () => { canvas.height = window.innerHeight; };
W(); H();
window.addEventListener('resize', () => { W(); H(); });

const COLORS = ['#f472b6','#a78bfa','#fb923c','#facc15','#34d399','#60a5fa','#f87171','#e879f9'];
const pieces = [];

function spawnBurst() {
  const count = 160;
  for (let i = 0; i < count; i++) {
    const fromLeft = i % 2 == 0;
    const angle = (Math.PI * 0.1 + Math.random() * Math.PI * 0.35);
    const speed = 9 + Math.random() * 8;
    pieces.push({
      x:     fromLeft ? 0 : canvas.width,
      y:     canvas.height,
      vx:    Math.cos(angle) * speed * (fromLeft ? 1 : -1),
      vy:    -Math.abs(Math.sin(angle) * speed),
      w:     6 + Math.random() * 8,
      h:     3 + Math.random() * 4,
      angle: Math.random() * Math.PI * 2,
      spin:  (Math.random() - 0.5) * 0.25,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      gravity: 0.18 + Math.random() * 0.12,
      life: 1,
      decay: 0.007 + Math.random() * 0.005
    });
  }
}

let animating = true;
function tick() {
  if (!animating) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = pieces.length - 1; i >= 0; i--) {
    const p = pieces[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.angle += p.spin;
    p.life -= p.decay;
    if (p.life <= 0 || p.y > canvas.height + 40) {
      pieces.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  }
  if (pieces.length === 0 && !animating) return;
  requestAnimationFrame(tick);
}

document.getElementById('open-btn').addEventListener('click', () => {
  document.getElementById('splash').classList.add('hidden');
  setTimeout(() => {
    spawnBurst();
    tick();
    document.getElementById('collage').classList.add('visible');
    document.getElementById('vignette').classList.add('visible');
    document.getElementById('message').classList.add('visible');
    setTimeout(() => {
      const music   = document.getElementById('bg-music');
      music.volume = 0.55;
      music.play();
    }, 300);
  }, 300);
});