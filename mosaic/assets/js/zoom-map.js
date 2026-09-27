/* The picture: deterministic street-map generator for zoom.js (fixed seed, no real geography).
   moZoomMap({ cols, rows, P, G, ox, oy, W, H, phone }) returns the tile kinds, the route, the marks, and the label values. */
(function () {
  var K = { STREET: 0, BLOCK: 1, RAISED: 2, PARK: 3, ENDPOINT: 4, ROUTE: 5, STOP: 6, HOME: 7 };
  var STOP_TIMES = ['08:14 HKT', '11:02 HKT', '18:40 HKT'];
  var SUBJECT = 'SUB-4471-0932';

  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function pad(n, w) { n = String(n); while (n.length < w) n = '0' + n; return n; }
  function fmtTime(sec) {
    sec = ((sec % 86400) + 86400) % 86400;
    return pad(Math.floor(sec / 3600), 2) + ':' + pad(Math.floor(sec / 60) % 60, 2) + ':' + pad(sec % 60, 2);
  }
  // Street lines: irregular spacing, 4 to 8 tiles apart
  function streetLines(n, r) {
    var out = [], i = 1 + Math.floor(r() * 3);
    while (i < n) { out.push(i); i += 4 + Math.floor(r() * 5); }
    return out;
  }

  function generate(o) {
    var cols = o.cols, rows = o.rows, P = o.P, T = o.P - o.G, W = o.W, H = o.H;
    var r = rng(4471932);
    var sRows = streetLines(rows, r), sCols = streetLines(cols, r);
    var isSR = {}, isSC = {};
    sRows.forEach(function (v) { isSR[v] = 1; });
    sCols.forEach(function (v) { isSC[v] = 1; });

    // Which block band (between streets) each row and column falls in
    function bands(n, isS) { var b = [], k = 0; for (var i = 0; i < n; i++) { if (isS[i]) k++; b.push(k); } return b; }
    var bandR = bands(rows, isSR), bandC = bands(cols, isSC);
    var blockKind = {};
    function bk(br, bc) {
      var key = br + ',' + bc;
      if (!(key in blockKind)) blockKind[key] = r() < 0.1 ? K.RAISED : K.BLOCK;
      return blockKind[key];
    }
    var kinds = new Array(rows * cols), x, y, i;
    for (y = 0; y < rows; y++) for (x = 0; x < cols; x++) kinds[y * cols + x] = isSR[y] || isSC[x] ? K.STREET : bk(bandR[y], bandC[x]);
    // Parks: one or two whole blocks
    var parkCount = 0, tries = 0;
    while (parkCount < 2 && tries++ < 40) {
      var key = (1 + Math.floor(r() * (sRows.length - 1))) + ',' + (1 + Math.floor(r() * (sCols.length - 1)));
      if (blockKind[key] === K.PARK) continue;
      blockKind[key] = K.PARK; parkCount++;
    }
    for (y = 0; y < rows; y++) for (x = 0; x < cols; x++) {
      if (kinds[y * cols + x] !== K.STREET) kinds[y * cols + x] = blockKind[bandR[y] + ',' + bandC[x]];
    }
    // Vyrus endpoints: about 5% of block tiles
    for (i = 0; i < kinds.length; i++) if ((kinds[i] === K.BLOCK || kinds[i] === K.RAISED) && r() < 0.05) kinds[i] = K.ENDPOINT;

    // Route region: the right ~55% of the stage on desktop, the lower half on phones
    var cx0, cx1, ry0, ry1;
    if (o.phone) { cx0 = 0.05 * W; cx1 = 0.95 * W; ry0 = 0.46 * H; ry1 = 0.95 * H; }
    else { cx0 = 0.5 * W; cx1 = 0.94 * W; ry0 = 0.12 * H; ry1 = 0.88 * H; }
    function colX(c) { return o.ox + c * P + T / 2; }
    function rowY(q) { return o.oy + q * P + T / 2; }
    var candR = sRows.filter(function (v) { var yy = rowY(v); return yy >= ry0 && yy <= ry1; });
    var candC = sCols.filter(function (v) { var xx = colX(v); return xx >= cx0 && xx <= cx1; });
    if (candR.length < 2) candR = sRows.slice(-3);
    if (candC.length < 2) candC = sCols.slice(-3);
    // Four intersections from two disjoint halves, so the loop always has width and height
    function ends(list) {
      var m = Math.floor(list.length / 2), lo = list.slice(0, m), hi = list.slice(m);
      function two(a) { return [a[Math.floor(r() * a.length)], a[Math.floor(r() * a.length)]]; }
      return [two(lo), two(hi)];
    }
    var er = ends(candR), ec = ends(candC);
    var pts = [[er[1][0], ec[1][0]], [er[1][1], ec[0][0]], [er[0][0], ec[0][1]], [er[0][1], ec[1][1]]]; // home, stops 1-3
    function same(a, b) { return a[0] === b[0] && a[1] === b[1]; }
    if (same(pts[2], pts[3])) pts[3][1] = ec[1][0];
    if (same(pts[3], pts[0])) pts[3][0] = er[0][0];
    if (same(pts[1], pts[2])) pts[1][0] = er[1][0];

    var route = [], onRoute = {};
    function push(q, c) {
      var id = q * cols + c;
      if (route.length && route[route.length - 1] === id) return;
      route.push(id); onRoute[id] = 1;
    }
    function walkRow(q, c0, c1) { var s = c1 >= c0 ? 1 : -1; for (var c = c0; c !== c1 + s; c += s) push(q, c); }
    function walkCol(c, r0, r1) { var s = r1 >= r0 ? 1 : -1; for (var q = r0; q !== r1 + s; q += s) push(q, c); }
    for (var s = 0; s < 4; s++) {
      var a = pts[s], b = pts[(s + 1) % 4];
      if (s % 2 === 0) { walkRow(a[0], a[1], b[1]); walkCol(b[1], a[0], b[0]); }
      else { walkCol(a[1], a[0], b[0]); walkRow(b[0], a[1], b[1]); }
    }
    route.pop(); // the last tile equals the first
    route.forEach(function (id) { kinds[id] = K.ROUTE; });

    // Home and stops: a block tile diagonal to each intersection, touching the route
    var marks = [], diag = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    pts.forEach(function (pt, n) {
      for (var d = 0; d < 4; d++) {
        var q = pt[0] + diag[(d + n) % 4][0], c = pt[1] + diag[(d + n) % 4][1];
        if (q < 0 || c < 0 || q >= rows || c >= cols) continue;
        var id = q * cols + c;
        if (kinds[id] === K.ROUTE || kinds[id] === K.STREET) continue;
        if (!(onRoute[pt[0] * cols + c] || onRoute[q * cols + pt[1]])) continue;
        kinds[id] = n === 0 ? K.HOME : K.STOP;
        marks.push({ id: id, n: n });
        return;
      }
    });

    // Focus tile: a route tile mid-route on a straight run, not on a crossing
    var fi = Math.floor(route.length * 0.45), focusIdx = fi;
    for (var off = 0; off < route.length; off++) {
      var j = (fi + off) % route.length, fid = route[j];
      if (!(isSR[Math.floor(fid / cols)] && isSC[fid % cols])) { focusIdx = j; break; }
    }
    var focusId = route[focusIdx];

    // Per-tile label values (deterministic)
    var lr = rng(208311), vals = new Array(kinds.length), kindTxt = new Array(kinds.length), routePos = {};
    route.forEach(function (id, n) { routePos[id] = n; });
    var BASE = 8 * 3600 + 14 * 60 + 7;
    for (i = 0; i < kinds.length; i++) {
      var k = kinds[i], pick = lr();
      if (k === K.ROUTE) {
        kindTxt[i] = 'LOCATION';
        vals[i] = 'ping · ' + fmtTime(BASE + ((routePos[i] - focusIdx + route.length) % route.length) * 37);
      } else if (k === K.ENDPOINT) {
        kindTxt[i] = 'ENDPOINT'; vals[i] = 'EP-VY-' + pad(100000 + Math.floor(lr() * 899999), 6);
      } else if (k === K.BLOCK || k === K.RAISED || k === K.PARK) {
        var m = Math.floor(pick * 3);
        if (m === 0) { kindTxt[i] = 'FACE'; vals[i] = 'match 0.' + (80 + Math.floor(lr() * 19)); }
        else if (m === 1) { kindTxt[i] = 'VOICE'; vals[i] = 'sample ' + (1 + lr() * 6).toFixed(1) + ' s'; }
        else { kindTxt[i] = 'GAIT'; vals[i] = 'stride ' + (62 + Math.floor(lr() * 18)) + ' cm'; }
      }
    }
    vals[focusId] = 'ping · ' + fmtTime(BASE);
    marks.forEach(function (mk) {
      if (mk.n === 0) { kindTxt[mk.id] = 'RESIDENCE'; vals[mk.id] = SUBJECT; }
      else { kindTxt[mk.id] = 'PURCHASE'; vals[mk.id] = STOP_TIMES[mk.n - 1]; }
    });
    return { kinds: kinds, vals: vals, kindTxt: kindTxt, focusId: focusId, marks: marks };
  }

  window.moZoomMap = generate;
  window.moZoomMap.K = K;
  window.moZoomMap.SUBJECT = SUBJECT;
  window.moZoomMap.STOP_TIMES = STOP_TIMES;
})();
