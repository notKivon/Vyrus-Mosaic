/* The picture: a scroll-driven zoom out from one location tile to a tiled street map that reveals one resident's
   daily route. Canvas only, redrawn from scroll progress (no stored state); the copy never animates.
   Without JS, or under reduced motion, the static map SVG in the page is the finished state. */
(function () {
  var section = document.querySelector('.zoom');
  var gen = window.moZoomMap;
  if (!section || !gen || !window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var stage = section.querySelector('.zoom-stage');
  var caption = section.querySelector('.zoom-caption');
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext && canvas.getContext('2d');
  if (!stage || !ctx) return;
  var K = gen.K;

  // Canvas, scrim, and hint exist only while the zoom runs
  canvas.className = 'zoom-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  var scrim = document.createElement('div');
  scrim.className = 'zoom-scrim';
  scrim.setAttribute('aria-hidden', 'true');
  var hint = document.createElement('p');
  hint.className = 't-data zoom-hint';
  hint.setAttribute('aria-hidden', 'true');
  hint.textContent = 'Scroll to zoom out ↓';
  stage.insertBefore(scrim, stage.firstChild);
  stage.insertBefore(canvas, stage.firstChild);
  stage.appendChild(hint);
  section.classList.add('is-live');

  var C = {}, L = null, W = 0, H = 0, dpr = 1, lastP = -1, captionText = '', queued = false;
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function smooth(t) { return t * t * (3 - 2 * t); }

  function readColours() {
    var cs = getComputedStyle(document.documentElement);
    ['ground', 'surface-raised', 'surface-sunken', 'ink', 'ink-muted', 'navy', 'blue', 'stone', 'brass', 'brass-strong',
      'on-brass', 'teal', 'flag', 'flag-strong', 'font-mono'].forEach(function (k) { C[k] = cs.getPropertyValue('--' + k).trim(); });
    if (!C['font-mono']) C['font-mono'] = 'monospace';
  }

  function build() {
    readColours();
    W = stage.clientWidth; H = stage.clientHeight;
    if (!W || !H) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    var phone = W < 760, P = phone ? 18 : 23, G = 3, T = P - G;
    var cols = Math.ceil(W / P) + 1, rows = Math.ceil(H / P) + 1;
    var ox = Math.floor((W - cols * P + G) / 2), oy = Math.floor((H - rows * P + G) / 2);
    L = gen({ cols: cols, rows: rows, P: P, G: G, ox: ox, oy: oy, W: W, H: H, phone: phone });
    L.P = P; L.T = T; L.cols = cols; L.ox = ox; L.oy = oy; L.phone = phone; L.total = L.kinds.length;
    L.fwx = ox + (L.focusId % cols) * P + T / 2;
    L.fwy = oy + Math.floor(L.focusId / cols) * P + T / 2;
    // At p = 0 the focus tile fills about 40% of the stage width (phones: a smaller tile, lower down)
    if (phone) { L.f0x = 0.5 * W; L.f0y = 0.64 * H; L.s0 = Math.min(0.7 * W, 0.35 * H) / T; }
    else { L.f0x = 0.66 * W; L.f0y = 0.5 * H; L.s0 = 0.4 * W / T; }
    placeMapLabels();
  }

  // Labels next to the home and the stops at full zoom-out, placed once on the natural layout
  function placeMapLabels() {
    var placed = [];
    ctx.font = '12px ' + C['font-mono'];
    var minX = L.phone ? 4 : 0.44 * W, minY = L.phone ? 0.46 * H : 4;
    L.labels = [];
    L.marks.slice().sort(function (a, b) { return a.n - b.n; }).forEach(function (mk) {
      var text = mk.n === 0 ? gen.SUBJECT + ' · residence' : gen.STOP_TIMES[mk.n - 1];
      var tw = Math.ceil(ctx.measureText(text).width) + 12, th = 20;
      var x = L.ox + (mk.id % L.cols) * L.P, y = L.oy + Math.floor(mk.id / L.cols) * L.P, t = L.T, g = 6;
      var cands = [
        [x + t + g, y + t / 2 - th / 2], [x - g - tw, y + t / 2 - th / 2],
        [x + t / 2 - tw / 2, y - g - th], [x + t / 2 - tw / 2, y + t + g],
        [x + t + g, y - g - th], [x + t + g, y + t + g], [x - g - tw, y - g - th], [x - g - tw, y + t + g]
      ];
      var chosen = null;
      for (var i = 0; i < cands.length * 2 && !chosen; i++) {
        var c = cands[i % cands.length];
        if (i < cands.length && (c[0] < minX || c[1] < minY)) continue;
        if (c[0] < 4 || c[1] < 4 || c[0] + tw > W - 4 || c[1] + th > H - 4) continue;
        var hit = placed.some(function (p) {
          return c[0] < p[0] + p[2] + 4 && c[0] + tw + 4 > p[0] && c[1] < p[1] + p[3] + 4 && c[1] + th + 4 > p[1];
        });
        if (!hit) chosen = c;
      }
      if (!chosen) chosen = cands[0];
      var rect = [chosen[0], chosen[1], tw, th];
      placed.push(rect);
      L.labels.push({ rect: rect, text: text, home: mk.n === 0 });
    });
  }

  function roundRect(x, y, w, h, rad) {
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, rad); else ctx.rect(x, y, w, h);
    ctx.fill();
  }
  function fillFor(k) {
    return k === K.STREET ? C.stone : k === K.RAISED ? C['surface-raised'] : k === K.PARK ? C.blue : k === K.ENDPOINT ? C.teal
      : k === K.ROUTE ? C.brass : k === K.STOP ? C['brass-strong'] : k === K.HOME ? C.flag : C.navy;
  }
  function textFor(k) {
    if (k === K.ROUTE || k === K.STOP || k === K.HOME) return [C['on-brass'], C['on-brass']];
    if (k === K.ENDPOINT) return [C.ground, C.ground];
    return [C['ink-muted'], C.ink];
  }

  function progress() {
    var navH = parseFloat(getComputedStyle(stage).top) || 0;
    var span = section.offsetHeight - stage.clientHeight;
    if (span <= 0) return 1;
    return clamp(-(section.getBoundingClientRect().top - navH) / span, 0, 1);
  }

  function draw(p) {
    if (!L) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    // Camera: log-linear zoom out while the focus tile slides to its true place on the map
    var e = ease(clamp((p - 0.04) / 0.78, 0, 1));
    var s = Math.exp(Math.log(L.s0) * (1 - e));
    var fx = lerp(L.f0x, L.fwx, e), fy = lerp(L.f0y, L.fwy, e);
    var far = Math.max(Math.hypot(fx, fy), Math.hypot(W - fx, fy), Math.hypot(fx, H - fy), Math.hypot(W - fx, H - fy));
    // Reveal: tiles appear outward from the focus tile as the radius grows
    var fade = L.P * lerp(1.2, 6, e);
    var grow = smooth(clamp(p / 0.9, 0, 1));
    var R = lerp(0.12, 1.1, grow) * (far / s) + fade * grow;
    var size = L.T * s, rad = Math.min(2 * s, 6);
    var placedCount = 0, labelQ = [], cols = L.cols, P = L.P, T = L.T, kinds = L.kinds;

    for (var i = 0; i < kinds.length; i++) {
      var c = i % cols, q = (i - c) / cols;
      var dx = L.ox + c * P + T / 2 - L.fwx, dy = L.oy + q * P + T / 2 - L.fwy;
      var a = i === L.focusId ? 1 : clamp((R - Math.sqrt(dx * dx + dy * dy)) / fade, 0, 1);
      if (a >= 0.999) placedCount++;
      if (a <= 0) continue;
      var sx = fx + dx * s - size / 2, sy = fy + dy * s - size / 2;
      if (sx > W || sy > H || sx + size < 0 || sy + size < 0) continue; // off screen
      var k = kinds[i];
      ctx.globalAlpha = a * (k === K.PARK ? 0.8 : 1);
      ctx.fillStyle = fillFor(k);
      roundRect(sx, sy, size, size, rad);
      if (size > 80 && k !== K.STREET && L.vals[i]) labelQ.push([i, sx, sy, a]);
    }

    // In-tile labels fade in with on-screen size, and out inside the copy zone
    for (var n = 0; n < labelQ.length; n++) {
      var it = labelQ[n], id = it[0];
      var la = it[3] * clamp((size - 80) / 50, 0, 1) *
        (L.phone ? clamp((it[2] - 0.4 * H) / (0.1 * H), 0, 1) : clamp((it[1] - 0.42 * W) / (0.08 * W), 0, 1));
      if (la <= 0.01) continue;
      var pad = Math.max(8, size * 0.07), vf = Math.min(Math.max(size * 0.06, 10), 22);
      var val = L.vals[id], maxW = size - pad * 2;
      ctx.font = vf + 'px ' + C['font-mono'];
      var vw = ctx.measureText(val).width;
      if (vw > maxW) vf = vf * maxW / vw;
      if (vf < 8) continue;
      var kf = Math.max(8, vf * 0.82), col = textFor(kinds[id]);
      ctx.globalAlpha = la;
      ctx.textBaseline = 'top';
      ctx.font = '600 ' + kf.toFixed(1) + 'px ' + C['font-mono'];
      if ('letterSpacing' in ctx) ctx.letterSpacing = (kf * 0.12).toFixed(2) + 'px';
      ctx.fillStyle = col[0];
      ctx.fillText(L.kindTxt[id], it[1] + pad, it[2] + pad);
      if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
      ctx.font = '400 ' + vf.toFixed(1) + 'px ' + C['font-mono'];
      ctx.fillStyle = col[1];
      ctx.fillText(val, it[1] + pad, it[2] + pad + kf * 1.45);
    }

    // End state: the residence and stop times at near-full zoom-out
    var ma = clamp((p - 0.85) / 0.07, 0, 1);
    if (ma > 0) {
      ctx.globalAlpha = ma;
      ctx.font = '12px ' + C['font-mono'];
      ctx.textBaseline = 'middle';
      L.labels.forEach(function (lb) {
        var r4 = lb.rect;
        ctx.fillStyle = C['surface-sunken'];
        roundRect(r4[0], r4[1], r4[2], r4[3], 2);
        ctx.fillStyle = lb.home ? C['flag-strong'] : C['brass-strong'];
        ctx.fillText(lb.text, r4[0] + 6, r4[1] + r4[3] / 2 + 0.5);
      });
    }
    ctx.globalAlpha = 1;

    var done = p >= 0.9;
    var txt = done ? 'The picture: 100%'
      : 'Tiles placed: ' + placedCount.toLocaleString('en-GB') + ' / ' + L.total.toLocaleString('en-GB');
    if (caption && txt !== captionText) {
      captionText = txt; caption.textContent = txt;
      caption.classList.toggle('is-complete', done);
    }
    hint.style.opacity = String(1 - clamp(p / 0.08, 0, 1));
  }

  function frame() { queued = false; var p = progress(); if (p !== lastP) { lastP = p; draw(p); } }
  function request() { if (!queued) { queued = true; requestAnimationFrame(frame); } }
  function rebuild(force) {
    if (force || stage.clientWidth !== W || stage.clientHeight !== H || !L) build();
    lastP = -1; request();
  }

  build();
  frame();
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', function () { rebuild(false); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { rebuild(true); });
})();
