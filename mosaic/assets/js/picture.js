/* The assembled picture: 400 tiles move from scattered to placed as the section scrolls into view.
   The inline SVG is the finished picture and the single source of the layout; this script reads it,
   draws the same tiles on a canvas and hides the SVG. Skipped under reduced motion. */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var section = document.getElementById('picture');
  var figure = section && section.querySelector('.picture-figure');
  var art = figure && figure.querySelector('.picture-art');
  var caption = figure && figure.querySelector('.picture-caption');
  if (!art || !caption || !window.HTMLCanvasElement) return;

  var canvas = document.createElement('canvas');
  canvas.className = 'picture-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var styles = getComputedStyle(document.documentElement);
  var fills = { tn: '--navy', ts: '--stone', tb: '--blue', tt: '--teal', tk: '--brass' };
  Object.keys(fills).forEach(function (name) { fills[name] = styles.getPropertyValue(fills[name]).trim(); });

  var box = art.viewBox.baseVal;
  var tiles = Array.prototype.map.call(art.querySelectorAll('rect'), function (rect) {
    return {
      x: Number(rect.getAttribute('x')), y: Number(rect.getAttribute('y')),
      size: Number(rect.getAttribute('width')), fill: fills[rect.getAttribute('class')],
      dx: (Math.random() * 2 - 1) * 160, dy: (Math.random() * 2 - 1) * 160,
      turn: (Math.random() * 2 - 1) * Math.PI / 4, delay: Math.random() * 0.4
    };
  });

  figure.insertBefore(canvas, art);
  figure.classList.add('is-live');

  var dpr = Math.min(window.devicePixelRatio || 1, 2), width = 0, scale = 1, lastProgress = -1;

  function size() {
    width = canvas.getBoundingClientRect().width;
    scale = width / box.width;
    canvas.width = canvas.height = Math.round(width * dpr);
    lastProgress = -1;
    draw();
  }

  // 0 when the section top reaches 85% of the viewport, 1 when the figure centre reaches 50%.
  function progress() {
    var vh = window.innerHeight;
    var top = section.getBoundingClientRect().top;
    var figureBox = figure.getBoundingClientRect();
    var span = 0.35 * vh + (figureBox.top + figureBox.height / 2 - top);
    return Math.min(1, Math.max(0, (0.85 * vh - top) / span));
  }

  function draw() {
    var p = progress();
    if (p === lastProgress) return;
    lastProgress = p;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var placed = 0;
    tiles.forEach(function (tile) {
      var t = Math.min(1, Math.max(0, (p - tile.delay) / 0.6));
      if (t === 1) placed += 1;
      var e = 1 - Math.pow(1 - t, 3), rest = 1 - e;
      var half = tile.size / 2;
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
      ctx.translate(tile.x + half + tile.dx * rest / scale, tile.y + half + tile.dy * rest / scale);
      ctx.rotate(tile.turn * rest);
      ctx.globalAlpha = 0.2 + 0.8 * e;
      ctx.fillStyle = tile.fill;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(-half, -half, tile.size, tile.size, 2); else ctx.rect(-half, -half, tile.size, tile.size);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    var complete = placed === tiles.length;
    caption.textContent = complete ? 'The picture: 100%' : 'Tiles placed: ' + placed + ' / ' + tiles.length;
    caption.classList.toggle('is-complete', complete);
  }

  var queued = false;
  window.addEventListener('scroll', function () {
    if (!queued) { queued = true; requestAnimationFrame(function () { queued = false; draw(); }); }
  }, { passive: true });
  var resizeTimer;
  window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(size, 150); });
  size();
})();
