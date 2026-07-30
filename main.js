// Wires up interactivity: clicking a flower gives it a little squish and
// releases a few petals that fall away and fade out.
//
// Uses event delegation on #bouquet instead of attaching a listener to
// each flower directly. The flowers don't exist yet when this script runs
// (bouquet.js builds them later, on DOMContentLoaded) but #bouquet itself
// is already in the page from the initial HTML, so listening there and
// checking what got clicked works no matter when the flowers show up.

(function () {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const PETAL_COLORS = ['#ff4d94', '#ff1f75', '#ffd23f', '#4deeea', '#b967ff'];

  function svgEl(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const key in attrs) el.setAttribute(key, attrs[key]);
    return el;
  }

  function releasePetals(svg, cx, cy) {
    const count = 5 + Math.floor(Math.random() * 4);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spread = 5 + Math.random() * 8;
      const startX = cx + Math.cos(angle) * spread;
      const startY = cy + Math.sin(angle) * spread;

      const petal = svgEl('ellipse', {
        cx: startX,
        cy: startY,
        rx: 3 + Math.random() * 2.5,
        ry: 2 + Math.random() * 1.5,
        fill: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        opacity: 0.9,
      });
      svg.appendChild(petal);

      const driftX = (Math.random() - 0.5) * 60;
      const fallY = 90 + Math.random() * 60;
      const spin = (Math.random() - 0.5) * 240;

      const anim = petal.animate(
        [
          { transform: 'translate(0px, 0px) rotate(0deg)', opacity: 0.9 },
          { transform: `translate(${driftX}px, ${fallY}px) rotate(${spin}deg)`, opacity: 0 },
        ],
        { duration: 1100 + Math.random() * 500, easing: 'ease-in' }
      );
      anim.onfinish = () => petal.remove();
    }
  }

  function bounceFlower(flower) {
    flower.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(0.85)' },
        { transform: 'scale(1)' },
      ],
      { duration: 350, easing: 'ease-out' }
    );
  }

  function init() {
    const container = document.getElementById('bouquet');

    container.addEventListener('click', (event) => {
      const flower = event.target.closest('.flower');
      if (!flower) return;

      const svg = container.querySelector('svg');
      const box = flower.getBBox();
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;

      bounceFlower(flower);
      releasePetals(svg, cx, cy);
    });
  }

  init();
})();
