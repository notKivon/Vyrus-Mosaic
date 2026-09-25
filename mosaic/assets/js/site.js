/* Mosaic site enhancements. Every page works without this file: briefing buttons fall back to #briefing links. */
(function () {
  // Briefing dialog: every [data-briefing] button opens the one shared <dialog>.
  var dialog = document.getElementById('briefing-dialog');
  if (dialog && typeof dialog.showModal === 'function') {
    document.addEventListener('click', function (event) {
      var trigger = event.target.closest('[data-briefing]');
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

  // Live network panel: the proof row ticks and an endpoint map pulses. JS only; static figures otherwise.
  var tiles = document.querySelectorAll('.tile-row .mo-tile-value');
  var proof = document.querySelector('.proof');
  if (tiles.length === 3 && proof) {
    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var endpoints = 41038207;
    var random = function (min, max) { return min + Math.floor(Math.random() * (max - min + 1)); };
    if (!still) {
      tiles[0].textContent = endpoints.toLocaleString('en-GB');
      (function enrol() {
        setTimeout(function () {
          endpoints += random(1, 9);
          tiles[0].textContent = endpoints.toLocaleString('en-GB');
          enrol();
        }, random(800, 2000));
      })();
      setInterval(function () { tiles[2].textContent = random(11, 17) + ' ms'; }, 2000);
    }

    // Decorative dot grid, no geography: 48 x 16 dots, 24 x 16 on narrow screens.
    var map = document.createElement('div');
    map.className = 'endpoint-map';
    map.setAttribute('aria-hidden', 'true');
    proof.appendChild(map);
    var narrow = window.matchMedia('(max-width: 639px)');
    var dots = [];
    var drawMap = function () {
      var columns = narrow.matches ? 24 : 48, circles = '';
      for (var row = 0; row < 16; row++) {
        for (var col = 0; col < columns; col++) circles += '<circle cx="' + (col * 12 + 6) + '" cy="' + (row * 12 + 6) + '" r="2"/>';
      }
      map.innerHTML = '<p class="t-label eyebrow">Live endpoint activity</p>' +
        '<svg viewBox="0 0 ' + columns * 12 + ' 192" focusable="false">' + circles + '</svg>';
      dots = map.querySelectorAll('circle');
    };
    drawMap();
    if (narrow.addEventListener) narrow.addEventListener('change', drawMap);
    if (!still) {
      setInterval(function () {
        for (var n = random(1, 3); n > 0; n--) {
          var dot = dots[random(0, dots.length - 1)];
          dot.classList.remove('is-pulse');
          dot.getBoundingClientRect();
          dot.classList.add('is-pulse');
        }
      }, 250);
      map.addEventListener('animationend', function (event) { event.target.classList.remove('is-pulse'); });
    }
  }
})();
