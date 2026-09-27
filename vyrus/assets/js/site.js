/* Vyrus site enhancements. Every page works without this file: buttons fall back to #pricing links. */
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Purchase dialog: every [data-purchase] button opens the one shared <dialog>.
  var dialog = document.getElementById('purchase');
  if (dialog && typeof dialog.showModal === 'function') {
    document.addEventListener('click', function (event) {
      var trigger = event.target.closest('[data-purchase]');
      if (!trigger) return;
      event.preventDefault();
      dialog.showModal();
    });
    dialog.querySelector('[data-close]').addEventListener('click', function () {
      dialog.close();
    });
    // A click that lands on the dialog element itself is on the backdrop.
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) dialog.close();
    });
  }

  // Lapsed-state countdown: ticks down from 14:59 once a second. Static under reduced motion or without JS.
  var clock = document.querySelector('[data-countdown]');
  if (clock && !reduceMotion) {
    var remaining = 14 * 60 + 59;
    var tick = setInterval(function () {
      remaining -= 1;
      var minutes = Math.floor(remaining / 60);
      var seconds = remaining % 60;
      clock.textContent = (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
      if (remaining <= 0) clearInterval(tick);
    }, 1000);
  }

  // Hero headline decodes once, left to right through ASCII glyphs, over the real (transparent) text.
  var decoded = document.querySelector('.js-decode');
  if (decoded && !reduceMotion) {
    var heading = decoded.parentElement;
    var text = decoded.textContent, n = text.length;
    var glyphs = 'abcdefghijklmnopqrstuvwxyz0123456789/\\<>{}[]+=*#%$&';
    var overlay = document.createElement('span');
    var overlayText = document.createElement('span');
    var cursor = heading.querySelector('.vy-cursor');
    overlay.className = 'type-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.appendChild(overlayText);
    if (cursor) overlay.appendChild(cursor.cloneNode(true));
    heading.appendChild(overlay);
    heading.classList.add('is-typing');

    // Character i resolves at 180 + 1020 * (i + 1) / n ms, give or take 30 ms; unresolved glyphs re-roll every 50 ms.
    var resolveAt = [], scrambled = [], lastRoll = -Infinity, start = performance.now();
    for (var i = 0; i < n; i++) resolveAt.push(180 + 1020 * (i + 1) / n + (Math.random() - 0.5) * 60);
    requestAnimationFrame(function frame(now) {
      var t = now - start, out = '', roll = now - lastRoll >= 50;
      if (roll) lastRoll = now;
      for (var j = 0; j < n; j++) {
        var ch = text.charAt(j);
        if (ch === ' ' || t >= resolveAt[j]) { out += ch; continue; }
        if (roll || !scrambled[j]) scrambled[j] = glyphs.charAt(Math.floor(Math.random() * glyphs.length));
        out += scrambled[j];
      }
      overlayText.textContent = out;
      if (t < 1240) { requestAnimationFrame(frame); return; }
      heading.classList.remove('is-typing');
      heading.removeChild(overlay);
    });
  }

  // Tab-title nudge: a word while the tab is in the background, a greeting on return. Nothing is counted or kept.
  var title = document.title, welcome = 0;
  document.addEventListener('visibilitychange', function () {
    clearTimeout(welcome);
    if (document.hidden) {
      document.title = 'a pause in your journey_';
    } else {
      document.title = 'welcome back_';
      welcome = setTimeout(function () { document.title = title; }, 2000);
    }
  });
})();
