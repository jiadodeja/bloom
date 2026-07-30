// builds an SVG bouquet inside #bouquet, then blooms it in.
// Flowers are built from ellipse "petals" arranged in a ring 


(function () {
  const SVG_NS = 'http://www.w3.org/2000/svg';

  const PALETTE = {
    pink: '#ff4d94',
    magenta: '#ff1f75',
    gold: '#ffd23f',
    cyan: '#4deeea',
    violet: '#b967ff',
    green: '#39ff88',
    wrap: '#f3e9ff',
  };

  const VIEW_W = 400;
  const VIEW_H = 520;
  const TIE_POINT = { x: 200, y: 500 };   // where the ribbon knots
  const STEM_ORIGIN = { x: 200, y: 415 }; // where stems emerge from the wrap

  function svgEl(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const key in attrs) el.setAttribute(key, attrs[key]);
    return el;
  }

  function petalRing(cx, cy, count, petalLen, petalWidth, radius, color, rotationOffset) {
    rotationOffset = rotationOffset || 0;
    const g = svgEl('g', {});
    for (let i = 0; i < count; i++) {
      const angle = (360 / count) * i + rotationOffset;
      const petal = svgEl('ellipse', {
        cx: cx,
        cy: cy - radius,
        rx: petalWidth,
        ry: petalLen,
        fill: color,
        class: 'petal',
        transform: `rotate(${angle} ${cx} ${cy})`,
      });
      g.appendChild(petal);
    }
    return g;
  }

  function createRose(cx, cy) {
    const g = svgEl('g', { class: 'flower' });
    g.appendChild(petalRing(cx, cy, 8, 22, 12, 14, PALETTE.pink));
    g.appendChild(petalRing(cx, cy, 6, 13, 9, 6, PALETTE.magenta, 20));
    g.appendChild(svgEl('circle', { cx, cy, r: 5, fill: PALETTE.magenta }));
    return g;
  }

  function createDaisy(cx, cy) {
    const g = svgEl('g', { class: 'flower' });
    g.appendChild(petalRing(cx, cy, 12, 24, 6, 11, PALETTE.cyan));
    g.appendChild(svgEl('circle', { cx, cy, r: 8, fill: PALETTE.gold }));
    return g;
  }

  function createBud(cx, cy) {
    const g = svgEl('g', { class: 'flower' });
    g.appendChild(petalRing(cx, cy, 5, 18, 11, 7, PALETTE.violet));
    g.appendChild(svgEl('circle', { cx, cy, r: 4, fill: PALETTE.magenta }));
    return g;
  }

  function createStem(x1, y1, x2, y2) {
    const midX = (x1 + x2) / 2 + (x2 > x1 ? -10 : 10);
    const midY = (y1 + y2) / 2;
    const d = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
    return svgEl('path', {
      d,
      stroke: PALETTE.green,
      'stroke-width': 4,
      fill: 'none',
      'stroke-linecap': 'round',
    });
  }

  function createLeaf(x, y, angle) {
    return svgEl('ellipse', {
      cx: x,
      cy: y,
      rx: 14,
      ry: 5,
      fill: PALETTE.green,
      opacity: 0.85,
      transform: `rotate(${angle} ${x} ${y})`,
    });
  }

  function createWrap() {
    const g = svgEl('g', {});
    const cone = svgEl('path', {
      d: `M ${TIE_POINT.x - 60} ${STEM_ORIGIN.y} L ${TIE_POINT.x} ${TIE_POINT.y} L ${TIE_POINT.x + 60} ${STEM_ORIGIN.y} Z`,
      fill: PALETTE.wrap,
      opacity: 0.9,
    });
    g.appendChild(cone);
    g.appendChild(svgEl('line', {
      x1: TIE_POINT.x, y1: STEM_ORIGIN.y + 5, x2: TIE_POINT.x, y2: TIE_POINT.y - 5,
      stroke: '#4a3b3e', 'stroke-width': 1.5, opacity: 0.25,
    }));
    // ribbon bow, tied near the top of the cone
    const bowY = STEM_ORIGIN.y;
    g.appendChild(svgEl('path', {
      d: `M ${TIE_POINT.x - 18} ${bowY - 6} Q ${TIE_POINT.x - 4} ${bowY - 18} ${TIE_POINT.x} ${bowY - 6}
          Q ${TIE_POINT.x + 4} ${bowY - 18} ${TIE_POINT.x + 18} ${bowY - 6}
          Q ${TIE_POINT.x} ${bowY + 4} ${TIE_POINT.x - 18} ${bowY - 6} Z`,
      fill: PALETTE.gold,
    }));
    g.appendChild(svgEl('circle', { cx: TIE_POINT.x, cy: bowY - 6, r: 4, fill: PALETTE.magenta }));
    return g;
  }

  // fan of flower positions above the wrap
  const LAYOUT = [
    { x: 90, y: 170, type: 'daisy' },
    { x: 150, y: 100, type: 'rose' },
    { x: 200, y: 70, type: 'rose' },
    { x: 250, y: 100, type: 'bud' },
    { x: 310, y: 170, type: 'daisy' },
    { x: 200, y: 135, type: 'bud' },
  ];

  const BUILDERS = { rose: createRose, daisy: createDaisy, bud: createBud };

  function build() {
    const container = document.getElementById('bouquet');
    const svg = svgEl('svg', {
      viewBox: `0 0 ${VIEW_W} ${VIEW_H}`,
      width: '100%',
      height: '100%',
    });

    svg.appendChild(createWrap());

    const flowers = [];
    LAYOUT.forEach((spot, i) => {
      svg.appendChild(createStem(STEM_ORIGIN.x, STEM_ORIGIN.y, spot.x, spot.y + 14));

      if (i % 2 === 0) {
        const t = 0.55;
        const lx = STEM_ORIGIN.x + (spot.x - STEM_ORIGIN.x) * t;
        const ly = STEM_ORIGIN.y + (spot.y - STEM_ORIGIN.y) * t;
        svg.appendChild(createLeaf(lx, ly, spot.x > STEM_ORIGIN.x ? -35 : 35));
      }

      const flower = BUILDERS[spot.type](spot.x, spot.y);
      flower.style.transformOrigin = `${spot.x}px ${spot.y}px`;
      flower.style.opacity = '0';
      svg.appendChild(flower);
      flowers.push(flower);
    });

    container.appendChild(svg);
    bloom(flowers);
  }

  function bloom(flowers) {
    flowers.forEach((flower, i) => {
      flower.animate(
        [
          { opacity: 0, transform: 'scale(0.2) rotate(-15deg)' },
          { opacity: 1, transform: 'scale(1) rotate(0deg)' },
        ],
        {
          duration: 900,
          delay: 300 + i * 180,
          easing: 'cubic-bezier(.34,1.56,.64,1)',
          fill: 'forwards',
        }
      );
    });

    const totalDelay = 300 + flowers.length * 180 + 900;
    window.dispatchEvent(new CustomEvent('bouquet:bloomed', { detail: { delay: totalDelay } }));
  }

  document.addEventListener('DOMContentLoaded', build);
})();
