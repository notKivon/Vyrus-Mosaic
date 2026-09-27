/* Full-screen segments: eased one-gesture paging on desktop, a pass-through for tall sections, and the segment pager.
   Paging only moves the page in response to the visitor's own wheel or keys; nothing is read, counted or stored. */
(function () {
  var root = document.documentElement;
  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-seg]'));
  if (!sections.length || !window.matchMedia) return;
  var nav = document.querySelector('.site-nav');
  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var desktop = window.matchMedia('(min-width: 960px) and (min-height: 600px) and (pointer: fine)');

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function navH() { return nav ? nav.getBoundingClientRect().height : 0; }
  function setNav() { root.style.setProperty('--nav-h', navH() + 'px'); }
  function maxScroll() { return Math.max(0, root.scrollHeight - window.innerHeight); }
  function paging() { return desktop.matches; }
  function syncPaging() { root.classList.toggle('vy-paging', paging()); }

  setNav();
  root.classList.add('vy-seg');
  syncPaging();

  // One stop per section. A section taller than about 1.5 screens is a scroll-through zone [start, end].
  function stops() {
    var y = window.scrollY, nh = navH(), vh = window.innerHeight, max = maxScroll();
    var list = sections.map(function (section, i) {
      var start = section.getBoundingClientRect().top + y - nh;
      var h = section.offsetHeight;
      var end = h > 1.5 * vh ? start + h - (vh - nh) : start;
      start = Math.round(clamp(start, 0, max));
      end = Math.round(clamp(end, start, max));
      return { start: start, end: end, index: i };
    });
    var last = list[list.length - 1];
    // After the last segment, "next" goes to the footer at the bottom of the page
    if (last && max > last.end + 2) list.push({ start: max, end: max, index: -1 });
    return list;
  }

  /* Eased paging: easeInOutCubic, driven one frame at a time */
  var anim = 0, animating = false, locked = false, lastWheel = 0, lastDir = 0;
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function jump(top) { window.scrollTo({ top: top, behavior: 'instant' }); }

  function animateTo(target, dur) {
    cancelAnimationFrame(anim);
    target = Math.round(clamp(target, 0, maxScroll()));
    var from = window.scrollY, dist = target - from;
    if (reduceMq.matches || Math.abs(dist) < 1) { jump(target); animating = false; locked = true; return; }
    if (dur == null) dur = Math.abs(dist) > window.innerHeight * 0.5 ? 1100 : 700;
    animating = true;
    var t0 = performance.now();
    anim = requestAnimationFrame(function step(now) {
      var t = Math.min(1, (now - t0) / dur);
      jump(from + dist * ease(t));
      if (t < 1) { anim = requestAnimationFrame(step); return; }
      animating = false;
      locked = true; // trackpad inertia after the move must die out before the next gesture counts
    });
  }

  // What one gesture in direction dir does: {pass} lets native scrolling through a tall zone,
  // {clamp} stops at a zone edge, {to} animates to the neighbouring stop.
  function plan(dir, delta) {
    var y = window.scrollY, list = stops(), i;
    for (i = 0; i < list.length; i++) {
      var s = list[i];
      if (s.end - s.start < 2) continue;
      if (y >= s.start - 1 && y <= s.end + 1 && (dir > 0 ? y < s.end - 1 : y > s.start + 1)) {
        if (dir > 0 && y + delta >= s.end - 1) return { clamp: s.end };
        if (dir < 0 && y + delta <= s.start + 1) return { clamp: s.start };
        return { pass: true };
      }
    }
    if (dir > 0) { for (i = 0; i < list.length; i++) if (list[i].start > y + 2) return { to: list[i].start }; }
    else { for (i = list.length - 1; i >= 0; i--) if (list[i].end < y - 2) return { to: list[i].end }; }
    return {};
  }

  window.addEventListener('wheel', function (e) {
    if (e.ctrlKey || e.defaultPrevented || !paging() || document.querySelector('dialog[open]')) return;
    var a = document.activeElement;
    if (a && a.matches && a.matches('input, textarea, select, summary')) return;
    var dy = e.deltaY * (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerHeight : 1);
    if (dy === 0 || Math.abs(dy) < Math.abs(e.deltaX)) return; // mostly horizontal: tables scroll natively
    var now = e.timeStamp || performance.now(), dir = dy > 0 ? 1 : -1;
    var fresh = now - lastWheel >= 180 || dir !== lastDir;
    lastWheel = now; lastDir = dir;
    if (animating || (locked && !fresh)) { e.preventDefault(); return; }
    var p = plan(dir, dy);
    if (p.pass) { locked = false; return; }
    e.preventDefault();
    locked = true;
    if (p.clamp != null) jump(p.clamp);
    else if (p.to != null) animateTo(p.to);
  }, { passive: false });

  window.addEventListener('keydown', function (e) {
    if (e.defaultPrevented || e.altKey || e.metaKey || e.ctrlKey || !paging()) return;
    if (document.querySelector('dialog[open]')) return;
    var t = e.target;
    if (t && t.closest && t.closest('a[href], button, summary, input, textarea, select, [contenteditable], .table-scroll')) return;
    var k = e.key, dir = 0, delta = 0, pageSize = window.innerHeight * 0.875;
    if (k === 'Home' || k === 'End') { e.preventDefault(); animateTo(k === 'Home' ? 0 : maxScroll(), 1400); return; }
    if (k === 'PageDown' || (k === ' ' && !e.shiftKey)) { dir = 1; delta = pageSize; }
    else if (k === 'PageUp' || (k === ' ' && e.shiftKey)) { dir = -1; delta = -pageSize; }
    else if (k === 'ArrowDown') { dir = 1; delta = 40; }
    else if (k === 'ArrowUp') { dir = -1; delta = -40; }
    if (!dir) return;
    if (animating) { e.preventDefault(); return; }
    var p = plan(dir, delta);
    if (p.pass) return;
    e.preventDefault();
    if (p.clamp != null) animateTo(p.clamp, 450);
    else if (p.to != null) animateTo(p.to);
  });

  function goTo(el) {
    var i = sections.indexOf(el), target = null;
    stops().forEach(function (s) { if (s.index === i && i !== -1) target = s.start; });
    if (target == null) target = el.getBoundingClientRect().top + window.scrollY - navH();
    if (paging()) animateTo(target);
    else window.scrollTo({ top: target, behavior: reduceMq.matches ? 'auto' : 'smooth' });
  }

  // In-page anchors use the same movement while paging (purchase buttons open the dialog in site.js)
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || !paging()) return;
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || a.matches('.skip-link, [data-purchase]')) return;
    var id = a.getAttribute('href').slice(1);
    var el = id && id !== 'main' && document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    goTo(el);
    if (history.replaceState) history.replaceState(null, '', '#' + id);
  });

  /* Pager: one link per segment in the page's own <nav>, tracking the current segment from the scroll position */
  var pager = document.querySelector('.seg-pager');
  var buttons = pager ? sections.map(function (section) {
    var a = document.createElement('a');
    a.href = '#' + section.id;
    a.innerHTML = '<span class="lbl t-label">' + section.getAttribute('data-seg') + '</span><span class="sq" aria-hidden="true"></span>';
    pager.appendChild(a);
    return a;
  }) : [];
  if (pager) pager.hidden = false;

  var active = -1, queued = false;
  function track() {
    queued = false;
    var nh = navH(), line = nh + (window.innerHeight - nh) * 0.45, current = 0;
    sections.forEach(function (section, i) { if (section.getBoundingClientRect().top <= line) current = i; });
    if (window.scrollY >= maxScroll() - 2) current = sections.length - 1;
    if (current === active) return;
    active = current;
    buttons.forEach(function (b, j) { if (j === current) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
  }
  window.addEventListener('scroll', function () { if (!queued) { queued = true; requestAnimationFrame(track); } }, { passive: true });
  window.addEventListener('resize', function () { setNav(); syncPaging(); track(); });
  if (desktop.addEventListener) desktop.addEventListener('change', syncPaging);
  track();
  window.vySegments = { animating: function () { return animating; } };
})();
