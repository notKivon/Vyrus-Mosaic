/* Turntable in 3D: a second <model-viewer> with the same mask.glb as the hero, turned by the turntable's scroll
   progress through window.vyTurntable (turntable.js). The photos stay underneath as the fallback and hide only once
   the model has loaded; a failed load leaves the photo scrub in place. Not used under reduced motion. */
import './vendor/model-viewer.min.js';

var box = document.querySelector('.tt-box');
var view = document.querySelector('.tt-view');
if (box && view && customElements.get('model-viewer') && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  var viewer = document.createElement('model-viewer');
  var attributes = {
    src: 'assets/model/mask.glb',
    poster: 'assets/img/mask-front.jpg',
    alt: 'Vyrus mask, turning on a dark stage',
    loading: 'eager',
    'disable-zoom': '',
    'disable-pan': '',
    'interaction-prompt': 'none',
    'shadow-intensity': '0.6',
    exposure: '1.1',
    'camera-orbit': '0deg 80deg auto'
  };
  Object.keys(attributes).forEach(function (name) { viewer.setAttribute(name, attributes[name]); });
  viewer.className = 'tt-model';
  // One hotspot per callout at its feature's position on the model, so the leader lines can follow the turn
  Array.prototype.forEach.call(document.querySelectorAll('.tt-callout'), function (c, i) {
    var hs = document.createElement('div');
    hs.className = 'tt-hs';
    hs.setAttribute('slot', 'hotspot-' + (i + 1));
    hs.setAttribute('data-position', c.getAttribute('data-hotspot'));
    hs.setAttribute('data-normal', c.getAttribute('data-normal'));
    hs.setAttribute('data-visibility-attribute', 'visible');
    hs.setAttribute('aria-hidden', 'true');
    viewer.appendChild(hs);
  });
  box.appendChild(viewer);
  viewer.addEventListener('load', function () {
    view.classList.add('is-3d');
    if (window.vyTurntable) window.vyTurntable.setModel(viewer);
  });
  viewer.addEventListener('error', function () {
    if (viewer.parentNode) viewer.parentNode.removeChild(viewer);
  });
}
