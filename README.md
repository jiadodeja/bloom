# Bloom

A small interactive bouquet, built entirely in the browser with no libraries — just SVG, canvas, and CSS.

**Live:** https://jiadodeja.github.io/bloom/

## Why

I wanted to build something purely for fun that wasn't a coursework gap-filler — just a nice piece of creative coding. No frameworks, no build step, everything procedurally generated from a handful of numbers.

## How it works

**`petals.js`** draws the ambient background: small petal shapes drifting slowly down a canvas, swaying side to side, gently pushed away from the cursor.

**`bouquet.js`** builds the bouquet as an SVG. Every flower is generated from one function, `petalRing()`, which draws a single petal (an ellipse) and rotates copies of it around a center point — different counts, sizes, and colors produce a rose, a daisy, or a bud. Stems, leaves, the paper wrap, and the ribbon are all plain SVG shapes assembled around two reference points. Once built, the flowers bloom in one at a time using the Web Animations API.

**`heart.js`** fills a heart shape with ~130 scattered dots, using the classic implicit heart curve `(x² + y² − 1)³ − x²y³ ≤ 0` to decide which random points land inside it. It waits for the bouquet to finish blooming, then blooms in and settles into a looping heartbeat pulse.

**`main.js`** adds interactivity — click a flower and it squishes and sheds a few petals that fall and fade away.

The four scripts coordinate through a mix of a custom event (`bouquet:bloomed`) and event delegation, since they load and run in a specific order but need to react to things that haven't happened yet.

## Running it

It's fully static — no server, no dependencies. Open `index.html` in a browser, or visit the live link above.
