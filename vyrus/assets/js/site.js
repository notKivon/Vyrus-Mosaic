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

  // Hero headline types on once at 30 ms per character, over the real (transparent) text.
  var typed = document.querySelector('.js-type');
  if (typed && !reduceMotion) {
    var heading = typed.parentElement;
    var text = typed.textContent;
    var overlay = document.createElement('span');
    var overlayText = document.createElement('span');
    var cursor = heading.querySelector('.vy-cursor');
    overlay.className = 'type-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.appendChild(overlayText);
    if (cursor) overlay.appendChild(cursor.cloneNode(true));
    heading.appendChild(overlay);
    heading.classList.add('is-typing');

    var index = 0;
    var timer = setInterval(function () {
      index += 1;
      overlayText.textContent = text.slice(0, index);
      if (index >= text.length) {
        clearInterval(timer);
        heading.classList.remove('is-typing');
        heading.removeChild(overlay);
      }
    }, 30);
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
