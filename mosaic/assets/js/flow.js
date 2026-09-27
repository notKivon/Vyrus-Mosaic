/* How it works: teal pips run along the gaps of the converge grid into The picture tile, which flashes brass on each arrival.
   Driven by time alone; no text moves. Skipped under reduced motion. Nothing about the visitor is read. */
(function () {
  var grid = document.querySelector('.converge');
  if (!grid || !window.matchMedia || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var key = grid.querySelector('.is-key');
  var tiles = grid.children; // 0 Location, 1 Face, 7 Voice, 8 Purchase (the Session 4 order)
  if (!key || !window.IntersectionObserver) return;

  var canvas = document.createElement('canvas');
  canvas.className = 'flow-fx';
  canvas.setAttribute('aria-hidden', 'true');
  grid.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var SPEED = 140, SIZE = 4, INTO = 6, FADE = 150, MAX_IN_FLIGHT = 2;
  var TRAIL = [[6, 0.45], [12, 0.2]];

  // Seeded PRNG (mulberry32, seed 4471), so the rhythm is the same on every visit
  var seed = 4471;
  function rand() {
    seed = (seed + 0x6D2B79F5) | 0;
    var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // Lattice lines from the resolved grid tracks: GX0..GX6, GY0..GY4 (edges and gap centres), CX0..CX5 (column centres)
  var W = 0, H = 0, colour = '', routes = [];
  function lines(tracks, gap, start) {
    var sizes = tracks.split(' ').map(parseFloat), g = [start], c = [], x = start;
    sizes.forEach(function (s, k) {
      c.push(x + s / 2);
      x += s;
      if (k < sizes.length - 1) { g.push(x + gap / 2); x += gap; } else g.push(x);
    });
    return { g: g, c: c };
  }
  function measure() {
    var cs = getComputedStyle(grid), dpr = Math.min(2, window.devicePixelRatio || 1);
    W = grid.clientWidth; H = grid.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    colour = cs.getPropertyValue('--teal').trim();
    var X = lines(cs.gridTemplateColumns, parseFloat(cs.columnGap) || 0, parseFloat(cs.paddingLeft) || 0);
    var Y = lines(cs.gridTemplateRows, parseFloat(cs.rowGap) || 0, parseFloat(cs.paddingTop) || 0);
    if (X.g.length !== 7 || Y.g.length !== 5) { routes = []; return; }
    // [source tile, points, entry direction into The picture]
    var table = [
      [tiles[0], [[X.g[0], Y.g[1]], [X.c[2], Y.g[1]]], [0, 1]],
      [tiles[1], [[X.g[4], Y.g[0]], [X.g[4], Y.g[2]]], [-1, 0]],
      [tiles[7], [[X.g[0], Y.g[3]], [X.c[1], Y.g[3]]], [0, -1]],
      [tiles[8], [[X.g[6], Y.g[3]], [X.c[3], Y.g[3]]], [0, -1]]
    ];
    routes = table.map(function (r) {
      var a = r[1][0], b = r[1][1];
      return { tile: r[0], a: a, b: b, len: Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]), into: r[2],
        pips: [], next: 0, sentTimer: 0 };
    });
  }

  // Point at distance d along a route; beyond the end it carries on into The picture
  function at(r, d) {
    if (d <= r.len) {
      var f = r.len ? d / r.len : 0;
      return [r.a[0] + (r.b[0] - r.a[0]) * f, r.a[1] + (r.b[1] - r.a[1]) * f];
    }
    var e = Math.min(INTO, d - r.len);
    return [r.b[0] + r.into[0] * e, r.b[1] + r.into[1] * e];
  }
  function square(p, alpha) {
    ctx.globalAlpha = alpha;
    var x = Math.round(p[0] - SIZE / 2), y = Math.round(p[1] - SIZE / 2);
    if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, SIZE, SIZE, 1); ctx.fill(); }
    else ctx.fillRect(x, y, SIZE, SIZE);
  }

  /* Tile cues: a teal ring as a pip leaves, a brass ring on The picture as it arrives */
  var matchTimer = 0;
  function sent(r) {
    r.tile.classList.add('is-sent');
    clearTimeout(r.sentTimer);
    r.sentTimer = setTimeout(function () { r.tile.classList.remove('is-sent'); }, 300);
  }
  function match() {
    key.classList.add('is-match');
    clearTimeout(matchTimer);
    matchTimer = setTimeout(function () { key.classList.remove('is-match'); }, 450);
  }

  var raf = 0, onScreen = false, running = false;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = colour;
    routes.forEach(function (r) {
      if (now >= r.next) {
        if (r.pips.length < MAX_IN_FLIGHT) { r.pips.push({ t0: now, arrived: 0 }); sent(r); }
        r.next = now + 1400 + rand() * 1200;
      }
      r.pips = r.pips.filter(function (p) {
        var d = (now - p.t0) / 1000 * SPEED;
        if (d >= r.len && !p.arrived) { p.arrived = p.t0 + r.len / SPEED * 1000; match(); }
        var alpha = p.arrived ? 1 - (now - p.arrived) / FADE : 1;
        if (alpha <= 0) return false;
        TRAIL.forEach(function (tr) { if (d - tr[0] >= 0) square(at(r, d - tr[0]), alpha * tr[1]); });
        square(at(r, d), alpha);
        return true;
      });
    });
    ctx.globalAlpha = 1;
  }
  function start() {
    if (running) return;
    running = true;
    var now = performance.now();
    routes.forEach(function (r) { r.pips = []; r.next = now + rand() * 600; });
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
    routes.forEach(function (r) { r.pips = []; });
    ctx.clearRect(0, 0, W, H);
  }
  function sync() { if (onScreen && !document.hidden && routes.length) start(); else stop(); }

  measure();
  new IntersectionObserver(function (entries) { onScreen = entries[0].isIntersecting; sync(); }).observe(grid);
  document.addEventListener('visibilitychange', sync);
  var resizeTimer = 0;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { stop(); measure(); sync(); }, 120);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { stop(); measure(); sync(); });
})();
