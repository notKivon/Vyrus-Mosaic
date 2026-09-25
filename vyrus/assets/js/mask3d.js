/* Vyrus in 3D: swaps the hero render for the interactive mask once the model has loaded.
   The <img> stays in place underneath as the fallback, so JS off, no module support or a failed load
   all show the same render as before. Reduced motion keeps drag but drops auto-rotate and the scroll link. */
import './vendor/model-viewer.min.js';

var figure = document.querySelector('.hero-media');
var image = figure && figure.querySelector('img');
if (figure && image && customElements.get('model-viewer')) {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hero = document.querySelector('.hero');
  var viewer = document.createElement('model-viewer');
  var attributes = {
    src: 'assets/model/mask.glb',
    poster: 'assets/img/mask-hero.jpg',
    alt: image.getAttribute('alt'),
    'camera-controls': '',
    'disable-zoom': '',
    'disable-pan': '',
    'interaction-prompt': 'none',
    'shadow-intensity': '0.6',
    exposure: '1',
    'camera-orbit': '30deg 75deg auto'
  };
  if (!reduceMotion) {
    attributes['auto-rotate'] = '';
    attributes['rotation-per-second'] = '12deg';
    attributes['auto-rotate-delay'] = '0';
  }
  Object.keys(attributes).forEach(function (name) { viewer.setAttribute(name, attributes[name]); });
  viewer.className = 'hero-model';
  figure.appendChild(viewer);

  // Until the model is in, the viewer shows the same poster over the same render; after, it takes over.
  viewer.addEventListener('load', function () {
    figure.classList.add('is-3d');
    image.setAttribute('aria-hidden', 'true');
  });
  viewer.addEventListener('error', function () {
    figure.removeChild(viewer);
  });

  // Scroll link: hero scroll progress 0 to 1 turns the mask from 30deg to 90deg. A drag holds until the next scroll.
  if (!reduceMotion && hero) {
    var dragging = false, queued = false;
    viewer.addEventListener('pointerdown', function () { dragging = true; });
    window.addEventListener('pointerup', function () { dragging = false; });
    var update = function () {
      queued = false;
      var box = hero.getBoundingClientRect();
      if (dragging || box.bottom <= 0 || box.top >= window.innerHeight) return;
      var progress = Math.min(1, Math.max(0, -box.top / box.height));
      viewer.cameraOrbit = (30 + progress * 60).toFixed(1) + 'deg 75deg auto';
    };
    window.addEventListener('scroll', function () {
      if (!queued) { queued = true; requestAnimationFrame(update); }
    }, { passive: true });
  }
}
