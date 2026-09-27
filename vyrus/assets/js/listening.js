/* "Listening…" pill: shows at the worst moments. Three triggers, all from the page's own state:
   idle (no pointer movement, press or scroll for 6 s), very fast scrolling, and the pointer entering a pause control.
   Nothing is counted, logged or stored: the state is a few in-memory timers. */
(function () {
  var pill = document.querySelector('.listen-pill');
  if (!pill) return;
  pill.hidden = false;
  var showTimer = 0, idleTimer = 0, idleShown = false;

  function listen(ms) {
    pill.classList.add('on');
    clearTimeout(showTimer);
    showTimer = setTimeout(function () { pill.classList.remove('on'); }, ms);
  }

  // 1. Idle: the timer resets only on pointer movement, pointer presses and scrolling; any of them hides an idle pill
  function activity() {
    clearTimeout(idleTimer);
    if (idleShown) { idleShown = false; listen(400); }
    idleTimer = setTimeout(function () { idleShown = true; listen(3600); }, 6000);
  }
  ['pointermove', 'pointerdown', 'scroll'].forEach(function (type) {
    window.addEventListener(type, activity, { passive: true });
  });
  activity();

  // 2. Fast scroll: smoothed speed above 4000 px/s, ignored while segment paging is animating
  var lastY = window.scrollY, lastT = performance.now(), speed = 0;
  window.addEventListener('scroll', function () {
    var now = performance.now(), y = window.scrollY, dt = Math.max(1, now - lastT);
    speed = 0.6 * speed + 0.4 * Math.abs(y - lastY) / dt * 1000;
    lastY = y; lastT = now;
    var paging = window.vySegments && window.vySegments.animating();
    if (!paging && speed > 4000) { speed = 0; listen(2000); }
  }, { passive: true });

  // 3. Hover: the pointer entering "Pause my journey" or a "Continue pausing" control (never keyboard focus)
  var controls = '#retention .btn-row button, #pause-flow [data-onward]';
  document.addEventListener('pointerover', function (e) {
    var el = e.target.closest && e.target.closest(controls);
    if (el && !(e.relatedTarget && el.contains(e.relatedTarget))) listen(2200);
  });
})();
