// A small heart made of scattered petal-dots, filled using the classic
// implicit heart curve: (x^2 + y^2 - 1)^3 - x^2*y^3 <= 0
// Waits for bouquet.js's "bouquet:bloomed" event, then blooms in and
// starts a soft looping heartbeat pulse. Also reveals the message text.

(function () {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const DOT_COLORS = ['#ff4d94', '#ff1f75', '#ffd23f', '#b967ff'];

  function svgEl(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const key in attrs) el.setAttribute(key, attrs[key]);
    return el;
  }

  function insideHeart(x, y) {
    const yy = -y; // flip so "up" in the formula is up on screen
    const a = x * x + yy * yy - 1;
    return a * a * a - x * x * yy * yy * yy <= 0;
  }

  function buildHeart() {
    const container = document.getElementById('heart');
    // fixed pixel size on purpose, not width:100% — #heart has no CSS
    // width of its own (only height), so a percentage width here would
    // resolve against nothing and the heart would render at zero size.
    const svg = svgEl('svg', { viewBox: '0 0 120 100', width: '108', height: '90' });
    const group = svgEl('g', { id: 'heart-group' });

    const CENTER_X = 60;
    const CENTER_Y = 52;
    const SCALE = 30;
    const TARGET_DOTS = 190;
    let placed = 0;
    let attempts = 0;

    while (placed < TARGET_DOTS && attempts < 4000) {
      attempts++;
      const x = Math.random() * 2.8 - 1.4;
      const y = Math.random() * 2.6 - 1.5;
      if (!insideHeart(x, y)) continue;

      const px = CENTER_X + x * SCALE;
      const py = CENTER_Y + y * SCALE;
      const dot = svgEl('ellipse', {
        cx: px,
        cy: py,
        rx: 1.8 + Math.random() * 1.8,
        ry: 1.3 + Math.random() * 1.4,
        fill: DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)],
        opacity: 0.85,
        transform: `rotate(${Math.random() * 360} ${px} ${py})`,
      });
      group.appendChild(dot);
      placed++;
    }

    group.style.opacity = '0';
    group.style.transformOrigin = `${CENTER_X}px ${CENTER_Y}px`;
    svg.appendChild(group);
    container.appendChild(svg);
    return group;
  }

  function reveal(group) {
    const intro = group.animate(
      [
        { opacity: 0, transform: 'scale(0.3)' },
        { opacity: 1, transform: 'scale(1)' },
      ],
      { duration: 700, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'forwards' }
    );

    intro.onfinish = () => {
      group.animate(
        [
          { transform: 'scale(1)', offset: 0 },
          { transform: 'scale(1.12)', offset: 0.14 },
          { transform: 'scale(1)', offset: 0.28 },
          { transform: 'scale(1.12)', offset: 0.42 },
          { transform: 'scale(1)', offset: 1 },
        ],
        { duration: 1400, iterations: Infinity, easing: 'ease-in-out' }
      );
    };

    document.getElementById('message').classList.add('revealed');
  }

  // NOTE: this runs at top level, not inside a DOMContentLoaded listener.
  // Deferred scripts execute in order after the DOM is parsed, so by the
  // time this file runs, #heart already exists. Registering the
  // "bouquet:bloomed" listener here (instead of waiting for
  // DOMContentLoaded) guarantees it's attached before bouquet.js's own
  // DOMContentLoaded handler fires and dispatches that event — otherwise
  // this file could miss it and the heart would never appear.
  const heartGroup = buildHeart();
  window.addEventListener('bouquet:bloomed', (e) => {
    const delay = (e.detail && e.detail.delay) || 0;
    setTimeout(() => reveal(heartGroup), delay);
  });
})();
