/* Turntable (#specs): the section pins for 250vh and scroll progress turns the mask (the four photos, or the 3D model
   once turntable3d.js hands it over), runs the degree meter, and switches the callouts and their leader lines on.
   Without JS: a normal dark section with the front photo and all callouts. Reduced motion: unpinned, everything shown. */
(function () {
  var tt = document.querySelector('.turntable');
  if (!tt || !window.matchMedia) return;
  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var nav = document.querySelector('.site-nav');
  var photos = Array.prototype.slice.call(tt.querySelectorAll('.tt-photos img'));
  var callouts = Array.prototype.slice.call(tt.querySelectorAll('.tt-callout'));
  var svg = tt.querySelector('.tt-leaders');
  var deg = tt.querySelector('.tt-deg'), fill = tt.querySelector('.tt-fill');
  var groups = [], model = null, queued = false;
  tt.classList.add('is-live');

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function navH() { return nav ? nav.getBoundingClientRect().height : 0; }

  // Leader lines: from a fixed mid-edge of each card (right edge for the left cards, left edge for the right cards),
  // a short horizontal run, then straight to the feature. The SVG is built on resize; ends move every frame in 3D.
  function drawLeaders() {
    if (!svg) return;
    var box = svg.getBoundingClientRect();
    svg.innerHTML = '';
    groups = [];
    if (!box.width) { sync(); return; } // phones: no leader lines
    svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);
    var ns = 'http://www.w3.org/2000/svg';
    groups = callouts.map(function (c, i) {
      var r = c.getBoundingClientRect(), left = i % 2 === 0;
      var an = c.getAttribute('data-anchor').split(',').map(Number);
      var g = document.createElementNS(ns, 'g');
      var p = document.createElementNS(ns, 'path');
      p.setAttribute('pathLength', '1');
      var dot = document.createElementNS(ns, 'circle');
      dot.setAttribute('r', '4');
      g.appendChild(p); g.appendChild(dot); svg.appendChild(g);
      return { g: g, path: p, dot: dot, dir: left ? 1 : -1, hs: null,
        sx: (left ? r.right : r.left) - box.left, sy: r.top + r.height / 2 - box.top,
        ax: an[0] * box.width, ay: an[1] * box.height };
    });
    update();
    sync();
  }

  function aim(l, x, y) {
    var ex = l.sx + l.dir * Math.min(40, Math.abs(x - l.sx) / 3);
    l.path.setAttribute('d', 'M' + l.sx.toFixed(1) + ' ' + l.sy.toFixed(1) + 'H' + ex.toFixed(1) + 'L' + x.toFixed(1) + ' ' + y.toFixed(1));
    l.dot.setAttribute('cx', x.toFixed(1)); l.dot.setAttribute('cy', y.toFixed(1));
  }

  // Photo mode (model loading or failed, reduced motion): the front-photo anchors, faint while another view shows
  function aimPhotos() {
    var away = !reduceMq.matches && photos.length > 0 && parseFloat(photos[0].style.opacity || '1') < 0.5;
    groups.forEach(function (l) { aim(l, l.ax, l.ay); l.g.classList.toggle('is-away', away); });
  }

  // 3D mode: each line ends on its hotspot's projected position, faint while the feature faces away
  function aimModel() {
    var off = model.getBoundingClientRect(), box = svg.getBoundingClientRect();
    groups.forEach(function (l, i) {
      var q = model.queryHotspot && model.queryHotspot('hotspot-' + (i + 1));
      if (!q) { aim(l, l.ax, l.ay); return; }
      if (!l.hs) l.hs = model.querySelector('[slot="hotspot-' + (i + 1) + '"]');
      aim(l, q.canvasPosition.x + off.left - box.left, q.canvasPosition.y + off.top - box.top);
      l.g.classList.toggle('is-away', !!l.hs && !l.hs.hasAttribute('data-visible'));
    });
  }

  // model-viewer renders a frame after each orbit change, so the ends are read every frame while the turntable is on screen
  var loop = 0, onScreen = false;
  function frame() { loop = requestAnimationFrame(frame); aimModel(); }
  function sync() {
    var run = !!model && onScreen && groups.length > 0;
    if (run && !loop) loop = requestAnimationFrame(frame);
    if (!run && loop) { cancelAnimationFrame(loop); loop = 0; }
  }
  if (window.IntersectionObserver) new IntersectionObserver(function (e) { onScreen = e[0].isIntersecting; sync(); }).observe(tt);

  function progress() {
    var nh = navH(), top = tt.getBoundingClientRect().top + window.scrollY - nh;
    var span = tt.offsetHeight - (window.innerHeight - nh);
    if (span <= 4) return 1;
    return clamp((window.scrollY - top) / span, 0, 1);
  }

  function update() {
    queued = false;
    var still = reduceMq.matches, p = still ? 0 : progress(), shown = still ? 1 : p;
    // Photos: hold each view, crossfade only in the last 30% of each interval
    var n = photos.length;
    if (n > 1) {
      var f = p * (n - 1), i0 = Math.min(n - 2, Math.floor(f)), mix = clamp((f - i0 - 0.7) / 0.3, 0, 1);
      mix = mix * mix * (3 - 2 * mix);
      photos.forEach(function (img, i) {
        var o = still ? (i === 0 ? 1 : 0) : i === i0 ? 1 - mix : i === i0 + 1 ? mix : 0;
        img.style.opacity = o.toFixed(3);
      });
    }
    if (model) model.cameraOrbit = (p * 360).toFixed(1) + 'deg ' + (80 - p * 10).toFixed(1) + 'deg auto';
    if (deg) deg.textContent = ('00' + Math.round(p * 360)).slice(-3) + '°';
    if (fill) fill.style.transform = 'scaleX(' + p.toFixed(3) + ')';
    callouts.forEach(function (c, i) {
      var on = shown >= Number(c.getAttribute('data-at'));
      c.classList.toggle('on', on);
      if (groups[i]) groups[i].g.classList.toggle('on', on);
    });
    if (!model) aimPhotos();
  }
  function request() { if (!queued) { queued = true; requestAnimationFrame(update); } }

  window.vyTurntable = { setModel: function (viewer) { model = viewer; update(); sync(); } };
  window.addEventListener('scroll', request, { passive: true });
  var resizeTimer = 0;
  window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(drawLeaders, 120); });
  if (reduceMq.addEventListener) reduceMq.addEventListener('change', drawLeaders);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawLeaders);
  drawLeaders();
})();
