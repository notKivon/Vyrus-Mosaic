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
})();
