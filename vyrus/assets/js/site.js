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
})();
