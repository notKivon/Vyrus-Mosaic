/* Turntable (#specs): the section pins for 250vh and scroll progress turns the mask (the four photos, or the 3D model
   once turntable3d.js hands it over), runs the degree meter and switches the callouts and their leader lines on.
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

  // Leader lines: from the card's mid-edge nearest the anchor, a short horizontal run, then straight to the anchor
  function drawLeaders() {
    if (!svg) return;
    var box = svg.getBoundingClientRect();
    svg.innerHTML = '';
    groups = [];
    if (!box.width) return; // phones: no leader lines
    svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);
    var ns = 'http://www.w3.org/2000/svg';
    groups = callouts.map(function (c) {
      var r = c.getBoundingClientRect();
      var an = c.getAttribute('data-anchor').split(',').map(Number);
      var ax = an[0] * box.width, ay = an[1] * box.height;
      var leftSide = r.left + r.width / 2 - box.left < ax;
      var sx = (leftSide ? r.right : r.left) - box.left, sy = r.top + r.height / 2 - box.top;
      var ex = sx + (leftSide ? 1 : -1) * Math.min(40, Math.abs(ax - sx) / 3);
      var g = document.createElementNS(ns, 'g');
      var p = document.createElementNS(ns, 'path');
      p.setAttribute('d', 'M' + sx.toFixed(1) + ' ' + sy.toFixed(1) + 'H' + ex.toFixed(1) + 'L' + ax.toFixed(1) + ' ' + ay.toFixed(1));
      p.setAttribute('pathLength', '1');
      var dot = document.createElementNS(ns, 'circle');
      dot.setAttribute('cx', ax.toFixed(1)); dot.setAttribute('cy', ay.toFixed(1)); dot.setAttribute('r', '4');
      g.appendChild(p); g.appendChild(dot); svg.appendChild(g);
      return g;
    });
    update();
  }

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
      if (groups[i]) groups[i].classList.toggle('on', on);
    });
  }
  function request() { if (!queued) { queued = true; requestAnimationFrame(update); } }

  window.vyTurntable = { setModel: function (viewer) { model = viewer; update(); } };
  window.addEventListener('scroll', request, { passive: true });
  var resizeTimer = 0;
  window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(drawLeaders, 120); });
  if (reduceMq.addEventListener) reduceMq.addEventListener('change', drawLeaders);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawLeaders);
  drawLeaders();
})();
