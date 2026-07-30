// petals drifting slowly across the background
// Self-initializing
// draws to #petals-bg, doesn't depend on any other file

(function () {
  const canvas = document.getElementById('petals-bg');
  const ctx = canvas.getContext('2d');

  const COLORS = ['#ff4d94', '#ff1f75', '#ffd23f', '#4deeea', '#b967ff', '#39ff88'];
  const PETAL_COUNT = 28;

  let width, height;
  let petals = [];
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function randomPetal() {
    return {
      x: Math.random() * width,
      y: Math.random() * height - height, // start above the screen, staggered
      size: 6 + Math.random() * 8,
      speed: 0.3 + Math.random() * 0.5,
      drift: Math.random() * 2 - 1,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.02,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.005 + Math.random() * 0.01,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: 0.4 + Math.random() * 0.4,
    };
  }

  function initPetals() {
    petals = Array.from({ length: PETAL_COUNT }, randomPetal);
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function update(p) {
    p.sway += p.swaySpeed;
    p.y += p.speed;
    p.x += p.drift + Math.sin(p.sway) * 0.4;
    p.angle += p.spin;

    // gently pushed away from the cursor, so the scene feels alive
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const radius = 90;
    if (dist < radius && dist > 0.01) {
      const force = (radius - dist) / radius;
      p.x += (dx / dist) * force * 2;
      p.y += (dy / dist) * force * 2;
    }

    // recycle petals once they drift off screen
    if (p.y > height + 20) {
      p.y = -20;
      p.x = Math.random() * width;
    }
    if (p.x < -20) p.x = width + 20;
    if (p.x > width + 20) p.x = -20;
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    for (const p of petals) {
      update(p);
      drawPetal(p);
    }
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  resize();
  initPetals();
  loop();
})();
