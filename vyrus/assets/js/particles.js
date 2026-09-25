/* Ambient Particulate Experience™: amber particles drift across the hero; the pointer clears a breathing space around it.
   Decorative only (canvas is aria-hidden). Skipped under reduced motion; paused while the hero is off screen. */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var hero = document.querySelector('.hero');
  if (!hero || !window.HTMLCanvasElement) return;

  var canvas = document.createElement('canvas');
  canvas.className = 'hero-fx';
  canvas.setAttribute('aria-hidden', 'true');
  hero.insertBefore(canvas, hero.firstChild);
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var styles = getComputedStyle(document.documentElement);
  var amber = styles.getPropertyValue('--amber').trim();
  var ring = styles.getPropertyValue('--surface-raised').trim();
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var width = 0, height = 0, particles = [], running = false, frame = 0;
  var pointer = { x: -999, y: -999, r: 0, target: 0 };

  function size() {
    var box = hero.getBoundingClientRect();
    width = box.width; height = box.height;
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = Math.round(Math.min(140, width * height / 7000));
    while (particles.length < count) particles.push(spawn(true));
    particles.length = count;
  }

  // Particles enter from the lower left (the exhaust side) and drift up and right.
  function spawn(anywhere) {
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

  hero.addEventListener('pointermove', function (event) {
    var box = hero.getBoundingClientRect();
    pointer.x = event.clientX - box.left; pointer.y = event.clientY - box.top;
    pointer.target = event.pointerType === 'touch' ? 70 : 90;
  });
  hero.addEventListener('pointerleave', function () { pointer.target = 0; });

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
    }).observe(hero);
  } else { start(); }
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
})();
