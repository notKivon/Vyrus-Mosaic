/* "Pause my journey": a four-screen dialog on the account page that loops instead of ending.
   Inserted by JS, so without it the page is unchanged. Keyboard and touch always work first time;
   only a mouse pointer sees "Continue pausing" step aside, twice per visit, never under reduced motion. */
(function () {
  var cards = document.querySelector('.account-grid');
  if (!cards || typeof HTMLDialogElement !== 'function') return;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cursor = '<span class="vy-cursor" aria-hidden="true">_</span>';
  var keep = '<button class="vy-btn vy-btn-primary" type="button" data-keep>Keep my journey</button>';
  var onward = '<button class="vy-btn vy-btn-ghost" type="button" data-onward>Continue pausing</button>';

  var screens = [
    '<h2 class="t-heading">before you go' + cursor + '</h2>' +
      '<p class="t-body">Pausing ends Personalisation, your Always-Listening Assistant and 412 Sponsored Moments tailored to you.</p>' +
      '<div class="btn-row">' + keep + onward + '</div>',
    '<h2 class="t-heading">are you sure?' + cursor + '</h2>' +
      '<p class="t-body">Retention Assurance™ activates the moment your journey pauses.</p>' +
      '<div class="btn-row">' + keep + onward + '</div>',
    '<h2 class="t-heading">one last offer' + cursor + '</h2>' +
      '<div class="vy-tier pause-offer"><div class="vy-tier-head"><p class="vy-tier-name">Lite</p><span class="vy-chip vy-chip-aqua">40% off</span></div>' +
      '<div class="vy-tier-price"><b>$2.99</b><span>/ month for 3 months</span></div></div>' +
      '<div class="btn-row"><button class="vy-btn vy-btn-primary" type="button" data-purchase>Take the offer</button>' + onward + '</div>',
    '<h2 class="t-heading">processing your pause' + cursor + '</h2>' +
      '<p class="t-body">Your request is being personalised. This can take up to 14:59.</p>' +
      '<div class="pause-bar" role="progressbar" aria-label="Processing your pause"><span></span></div>'
  ];

  // One small inward triangle per screen number, drawn like the renewal banner's row.
  function spikes(count) {
    var paths = '';
    for (var i = 0; i < count; i++) paths += '<path d="M' + (i * 16) + ' 0h12l-6 10z"/>';
    return '<svg class="pause-spikes" aria-hidden="true" width="' + (count * 16 - 4) + '" height="10" viewBox="0 0 ' + (count * 16 - 4) + ' 10">' + paths + '</svg>';
  }

  var dialog = document.createElement('dialog');
  dialog.className = 'vy-dialog';
  dialog.id = 'pause-flow';
  var html = '<div class="vy-dialog-inner">';
  screens.forEach(function (body, i) {
    html += '<div class="pause-screen" data-screen="' + (i + 1) + '"' + (i ? ' hidden' : '') + '>' +
      spikes(i + 1) + '<p class="t-label">Pausing</p>' + body + '</div>';
  });
  html += '<p class="t-body-s vy-dialog-foot">Vyrus and Mosaic are fictional. Made for a school AIML project; nothing here is for sale.</p></div>';
  dialog.innerHTML = html;
  document.body.appendChild(dialog);

  var row = document.createElement('div');
  row.className = 'btn-row';
  row.innerHTML = '<button class="vy-btn vy-btn-secondary" type="button">Pause my journey</button>';
  cards.parentNode.insertBefore(row, cards.nextSibling);

  var panels = dialog.querySelectorAll('.pause-screen');
  var processing = 0, dodgesLeft = 2;

  function show(number) {
    clearTimeout(processing);
    Array.prototype.forEach.call(panels, function (panel, i) {
      panel.hidden = i !== number - 1;
      var link = panel.querySelector('[data-onward]');
      if (link) link.style.transform = '';
    });
    var heading = panels[number - 1].querySelector('h2');
    heading.id = 'pause-title';
    Array.prototype.forEach.call(dialog.querySelectorAll('h2'), function (h) { if (h !== heading) h.removeAttribute('id'); });
    heading.setAttribute('tabindex', '-1');
    dialog.setAttribute('aria-labelledby', 'pause-title');
    heading.focus();
    if (number === 4) processing = setTimeout(function () { show(1); }, 3000);
  }

  row.querySelector('button').addEventListener('click', function () {
    dialog.showModal();
    show(1);
  });
  dialog.addEventListener('close', function () { clearTimeout(processing); });
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) return dialog.close();
    var button = event.target.closest('button');
    if (!button) return;
    if (button.hasAttribute('data-keep') || button.hasAttribute('data-purchase')) dialog.close();
    if (button.hasAttribute('data-onward')) show(Number(button.closest('.pause-screen').dataset.screen) + 1);
  });

  // The sidestep: move 64 to 120 px towards whichever side of the dialog has more room.
  if (!reduceMotion) {
    Array.prototype.forEach.call(dialog.querySelectorAll('[data-onward]'), function (link) {
      link.addEventListener('pointerenter', function (event) {
        if (event.pointerType !== 'mouse' || dodgesLeft <= 0) return;
        dodgesLeft -= 1;
        var box = link.getBoundingClientRect();
        var inner = dialog.querySelector('.vy-dialog-inner');
        var frame = inner.getBoundingClientRect();
        var pad = parseFloat(getComputedStyle(inner).paddingLeft);
        var roomLeft = box.left - frame.left - pad, roomRight = frame.right - pad - box.right;
        var distance = 64 + Math.random() * 56;
        var shift = roomRight >= roomLeft ? Math.min(distance, roomRight) : -Math.min(distance, roomLeft);
        var current = new DOMMatrixReadOnly(getComputedStyle(link).transform).m41;
        link.style.transform = 'translateX(' + Math.round(shift + current) + 'px)';
      });
    });
  }
})();
