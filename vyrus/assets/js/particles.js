/* Ambient Particulate Experience™: amber particles drift across a host section; the pointer clears a breathing space
   around it. One engine, vyFumes(host, opts), drives the hero field and the tier-linked pricing field. Options:
     className, density(x, w) -> 0..1, rise, perArea, max, ringToken, onSize
   Decorative only (canvas is aria-hidden). Skipped under reduced motion; paused while off screen or the tab is hidden. */
window.vyFumes = function (host, opts) {
  opts = opts || {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  if (!host || !window.HTMLCanvasElement) return null;

  var canvas = document.createElement('canvas');
  canvas.className = opts.className || 'hero-fx';
  canvas.setAttribute('aria-hidden', 'true');
  host.insertBefore(canvas, host.firstChild);
  var ctx = canvas.getContext('2d');
  if (!ctx) return null;

  var styles = getComputedStyle(document.documentElement);
  var amber = styles.getPropertyValue('--amber').trim();
  var ring = styles.getPropertyValue(opts.ringToken || '--surface-raised').trim();
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var width = 0, height = 0, particles = [], running = false, frame = 0;
  var pointer = { x: -999, y: -999, r: 0, target: 0 };
  var density = opts.density || null;
  var perArea = opts.perArea || 7000, cap = opts.max || 140;

  function size() {
    var box = host.getBoundingClientRect();
    width = box.width; height = box.height;
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (opts.onSize) opts.onSize(width, height);
    var count = Math.round(Math.min(cap, width * height / perArea));
    particles.length = Math.min(particles.length, count);
    while (particles.length < count) particles.push(spawn(true));
  }

  // x sampled by rejection against the density map, so thick columns get more particles
  function pickX() {
    if (!density) return Math.random() * width;
    for (var k = 0; k < 24; k++) {
      var x = Math.random() * width;
      if (Math.random() < density(x, width)) return x;
    }
    return Math.random() * width;
  }

  function spawn(anywhere) {
    if (opts.rise) {
      return {
        x: pickX(),
        y: anywhere ? Math.random() * height : height + 10 + Math.random() * 30,
        vx: (Math.random() - 0.5) * 0.16,
        vy: -0.2 - Math.random() * 0.45,
        r: 1 + Math.random() * 2.6,
        a: 0.25 + Math.random() * 0.5,
        wobble: Math.random() * Math.PI * 2
      };
    }
    // Hero: particles enter from the lower left (the exhaust side) and drift up and right.
    return {
      x: anywhere ? Math.random() * width : -10 - Math.random() * 40,
      y: anywhere ? Math.random() * height : height * (0.35 + Math.random() * 0.7),
      vx: 0.25 + Math.random() * 0.55,
      vy: -0.1 - Math.random() * 0.35,
      r: 1 + Math.random() * 2.6,
      a: 0.25 + Math.random() * 0.5,
      wobble: Math.random() * Math.PI * 2
    };
  }

  function step() {
    if (!running) return;
    frame = requestAnimationFrame(step);
    ctx.clearRect(0, 0, width, height);
    pointer.r += (pointer.target - pointer.r) * 0.08;

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.wobble += 0.02;
      p.x += p.vx + Math.sin(p.wobble) * 0.15;
      p.y += p.vy;
      // The mask at work: push particles out of the pointer's breathing space.
      var dx = p.x - pointer.x, dy = p.y - pointer.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < pointer.r && dist > 0.01) {
        var push = (pointer.r - dist) / pointer.r * 3;
        p.x += dx / dist * push; p.y += dy / dist * push;
      }
      if (p.x > width + 20 || p.y < -20) particles[i] = spawn(false);
      ctx.globalAlpha = p.a;
      ctx.fillStyle = amber;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }

    if (pointer.r > 4) {
      ctx.globalAlpha = 0.55;
      ctx.strokeStyle = ring; ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      ctx.beginPath(); ctx.arc(pointer.x, pointer.y, pointer.r * 0.9, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.globalAlpha = 1;
  }

  host.addEventListener('pointermove', function (event) {
    var box = host.getBoundingClientRect();
    pointer.x = event.clientX - box.left; pointer.y = event.clientY - box.top;
    pointer.target = event.pointerType === 'touch' ? 70 : 90;
  });
  host.addEventListener('pointerleave', function () { pointer.target = 0; });

  var resizeTimer;
  window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(size, 150); });

  var inView = true;
  function start() { if (!running && inView && !document.hidden) { running = true; frame = requestAnimationFrame(step); } }
  function stop() { running = false; cancelAnimationFrame(frame); }
  size();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      inView ? start() : stop();
    }).observe(host);
  } else { start(); }
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  return { resize: size };
};

// Hero: the Session 3 behaviour, unchanged.
window.vyFumes(document.querySelector('.hero'));

// Pricing: density follows each tier's fume meter (3 bars thick, 1 bar sparse); gutters take the nearest card; stacked cards 0.8.
(function () {
  var section = document.querySelector('.pricing-seg');
  if (!section) return;
  var cols = [];
  function measure() {
    var box = section.getBoundingClientRect();
    cols = Array.prototype.map.call(section.querySelectorAll('.vy-tier[data-fume]'), function (card) {
      var r = card.getBoundingClientRect();
      var bars = Number(card.getAttribute('data-fume'));
      return { l: r.left - box.left, r: r.right - box.left, top: r.top - box.top, d: bars >= 3 ? 1 : bars === 1 ? 0.12 : 0 };
    });
  }
  function density(x) {
    if (!cols.length) return 1;
    var sameRow = cols.every(function (c) { return Math.abs(c.top - cols[0].top) < 4; });
    if (!sameRow) return 0.8;
    var best = null, bestD = 1e9;
    for (var i = 0; i < cols.length; i++) {
      var c = cols[i];
      if (x >= c.l && x <= c.r) return c.d;
      var dd = Math.min(Math.abs(x - c.l), Math.abs(x - c.r));
      if (dd < bestD) { bestD = dd; best = c; }
    }
    return best ? best.d : 0.5;
  }
  window.vyFumes(section, { className: 'pricing-fx', rise: true, density: density, onSize: measure, perArea: 4200, max: 220, ringToken: '--aqua-deep' });
})();
