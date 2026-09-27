/* Hero: the italic phrase resolves from coarse tiles into sharp type, then the hero tiles fly into place.
   The real text stays in the page (transparent while the canvas draws), so layout never moves. Skipped under reduced motion. */
(function () {
  if (!window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var root = document.documentElement;

  /* ---------- Tile fly-in: scattered by JS only, so without JS the tiles simply sit in place ---------- */
  var art = document.querySelector('svg.hero-art');
  var pieces = art ? Array.prototype.slice.call(art.children).filter(function (el) { return /^(rect|g)$/i.test(el.tagName); }) : [];
  var flown = false;
  pieces.forEach(function (el) {
    // Stagger by the rect's own --i; the eye group moves as one unit with the --i of its rect
    var src = el.tagName.toLowerCase() === 'g' ? el.querySelector('[style*="--i"]') : el;
    el.__order = src ? parseFloat(src.style.getPropertyValue('--i')) || 0 : 0;
    var dx = (Math.random() * 2 - 1) * 160, dy = (Math.random() * 2 - 1) * 160, turn = (Math.random() * 2 - 1) * 45;
    el.style.transition = 'none';
    el.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px) rotate(' + turn.toFixed(1) + 'deg)';
    el.style.opacity = '0.2';
  });

  function flyTiles() {
    if (flown || !pieces.length) return;
    flown = true;
    var longest = 0;
    pieces.forEach(function (el) {
      var delay = el.__order * 35;
      longest = Math.max(longest, delay);
      el.style.transition = 'transform 1s cubic-bezier(.16,.84,.3,1) ' + delay + 'ms, opacity .7s ease ' + delay + 'ms';
      el.style.transform = '';
      el.style.opacity = '';
    });
    // Once everything has landed, hand the tiles back to the stylesheet
    setTimeout(function () { pieces.forEach(function (el) { el.style.transition = ''; }); }, longest + 1100);
  }
  // If the resolve never runs or stalls, the tiles still land
  var fallback = setTimeout(flyTiles, 7000);
  function done() { clearTimeout(fallback); flyTiles(); }

  /* ---------- Headline resolve ---------- */
  var em = document.querySelector('#hero-title em');
  if (!em) { done(); return; }
  em.classList.add('resolve-word');

  function start() {
    var cs = getComputedStyle(em);
    var font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
    var ready = document.fonts && document.fonts.load ? document.fonts.load(font, em.textContent) : Promise.resolve();
    ready.then(function () { run(cs, font); }, function () { run(cs, font); });
  }

  function run(cs, font) {
    var text = em.textContent;
    // Baseline from a zero-size inline-block probe, relative to the phrase box
    var probe = document.createElement('span');
    probe.className = 'baseline-probe';
    em.appendChild(probe);
    var box = em.getBoundingClientRect();
    var baseline = probe.getBoundingClientRect().bottom - box.top;
    probe.remove();

    var size = parseFloat(cs.fontSize);
    var pad = Math.round(size * 0.25);
    var W = Math.ceil(box.width) + pad * 2, H = Math.ceil(box.height) + pad * 2;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Sharp source: the phrase exactly where the real text sits
    var src = document.createElement('canvas');
    src.width = W * dpr; src.height = H * dpr;
    var s = src.getContext('2d');
    if (!s) { done(); return; }
    s.scale(dpr, dpr);
    s.font = font;
    if ('letterSpacing' in s) s.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;
    s.fillStyle = cs.color;
    s.textBaseline = 'alphabetic';
    s.fillText(text, pad, pad + baseline);

    var out = document.createElement('canvas');
    out.width = W * dpr; out.height = H * dpr;
    out.style.width = W + 'px'; out.style.height = H + 'px';
    out.style.left = -pad + 'px'; out.style.top = -pad + 'px';
    out.setAttribute('aria-hidden', 'true');
    var o = out.getContext('2d');
    em.appendChild(out);
    em.classList.add('is-resolving');

    var styles = getComputedStyle(root);
    var accents = ['--teal', '--blue', '--navy'].map(function (k) { return styles.getPropertyValue(k).trim(); });
    var small = document.createElement('canvas');
    var sm = small.getContext('2d', { willReadFrequently: true });

    // Block sizes relative to the type size, coarse to fine: about 2.6 s in all
    var steps = [0.34, 0.26, 0.19, 0.14, 0.1, 0.075, 0.055, 0.04].map(function (f) { return Math.max(2, Math.round(size * f)); });
    var hold = 240, first = 600, seed = 7;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }

    function frame(i) {
      var b = steps[i];
      var cols = Math.ceil(W / b), rows = Math.ceil(H / b);
      small.width = cols; small.height = rows;
      sm.imageSmoothingEnabled = true;
      sm.imageSmoothingQuality = 'high';
      sm.clearRect(0, 0, cols, rows);
      sm.drawImage(src, 0, 0, cols * b * dpr, rows * b * dpr, 0, 0, cols, rows);
      var px = sm.getImageData(0, 0, cols, rows).data;
      o.setTransform(dpr, 0, 0, dpr, 0, 0);
      o.clearRect(0, 0, W, H);
      var gap = b >= 6 ? Math.max(1, b * 0.14) : 0;
      var accentShare = i < 2 ? 0.14 : i < 4 ? 0.06 : 0;
      seed = 7 + i;
      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          var k = (y * cols + x) * 4, a = px[k + 3] / 255;
          if (a < 0.05) continue;
          var r = rnd();
          if (r < accentShare) { o.globalAlpha = Math.min(1, a * 1.6); o.fillStyle = accents[Math.floor(r / accentShare * accents.length) % accents.length]; }
          else { o.globalAlpha = Math.min(1, a * (i < 4 ? 1.6 : 1.25)); o.fillStyle = 'rgb(' + px[k] + ',' + px[k + 1] + ',' + px[k + 2] + ')'; }
          o.fillRect(x * b + gap / 2, y * b + gap / 2, b - gap, b - gap);
        }
      }
      o.globalAlpha = 1;
      if (i + 1 < steps.length) setTimeout(function () { frame(i + 1); }, i === 0 ? first : hold);
      else setTimeout(finish, hold);
    }

    function finish() {
      // Last frame: the sharp type itself, then hand over to the real text
      o.setTransform(1, 0, 0, 1, 0, 0);
      o.clearRect(0, 0, out.width, out.height);
      o.drawImage(src, 0, 0);
      em.classList.remove('is-resolving');
      requestAnimationFrame(function () {
        out.classList.add('is-done');
        setTimeout(function () { out.remove(); }, 350);
        done();
      });
    }

    frame(0);
  }

  function later() { setTimeout(start, 250); }
  if (document.readyState === 'complete') later(); else window.addEventListener('load', later);
})();
