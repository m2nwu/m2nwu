/* Minwoo Hong — portfolio 2026 (REV2). Plain JS, no build step. */
(function () {
  'use strict';

  var W = window.WORK, DIMS = window.DIMS || {};
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var SPANS = { full: 12, wide: 8, half: 6, third: 4, quarter: 3 };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var dim = function (p) { return DIMS[p] || [4, 3]; };
  /* work/ boards live in assets/work, 3D renders and motion in assets/motion */
  var url = function (p) { return p.indexOf('motion/') === 0 ? 'assets/' + p : 'assets/work/' + p; };

  if (W.order) W.featured.sort(function (a, b) { return W.order.indexOf(a.slug) - W.order.indexOf(b.slug); });
  var all = W.featured.map(function (p) { p.featured = true; return p; }).concat(W.archive);
  var bySlug = {};
  all.forEach(function (p) { bySlug[p.slug] = p; });

  /* ---------------------------------------------------------------- media */
  function videoTag(src, poster, alt) {
    return '<video muted loop playsinline preload="none" data-src="' + url(src) + '" poster="' + url(poster) + '" aria-label="' + esc(alt) + '"></video>';
  }
  /* Transparent media (alpha: true) sit straight on the page: no well behind them.
     Alpha video: VP9 .webm for Chrome/Firefox, HEVC-with-alpha .mp4 (m.hevc) for Safari. */
  var SAFARI = /^((?!chrome|chromium|android|crios|fxios|edg).)*safari/i.test(navigator.userAgent);
  function mediaEl(m, cls) {
    var d = dim(m.src), ar = m.ar || (d[0] + ' / ' + d[1]);
    var fit = m.fit === 'cover' ? '' : (m.bg || m.blend || m.alpha || m.fit === 'contain' ? ' contain' : '');
    var style = '--ar:' + ar + ';' + (m.alpha ? 'background:transparent;' : m.bg ? 'background:' + m.bg + ';' : '') + (m.pos ? '--pos:' + m.pos + ';' : '') + (m.z ? '--z:' + m.z + ';' : '') + (m.zo ? '--zo:' + m.zo + ';' : '');
    if (m.cls) cls = (cls ? cls + ' ' : '') + m.cls;
    var inner;
    if (m.video) {
      inner = videoTag(m.alpha && m.hevc && SAFARI ? m.hevc : m.src, m.poster, m.alt) +
        '<button class="vbtn meta" type="button" aria-label="Pause: ' + esc(m.alt) + '">Pause</button>';
    } else {
      inner = '<img src="' + url(m.src) + '" alt="' + esc(m.alt) + '" width="' + d[0] + '" height="' + d[1] + '" loading="lazy" decoding="async">';
    }
    if (m.cls) inner = inner.replace(/^(<(?:video|img)[\s\S]*?(?:<\/video>|>))/, '<div class="wrap">$1</div>');
    if (m.idx) inner += '<span class="idx meta" aria-hidden="true">' + esc(m.idx) + '</span>';
    return '<div class="frame' + fit + (m.blend ? ' blend' : '') + (m.pad ? ' pad' : '') + (m.pixel ? ' pixel' : '') + (m.zoom ? ' zoom' : '') + (cls ? ' ' + cls : '') + '" data-reveal style="' + style + '">' + inner + '</div>';
  }
  function figure(m, extra) {
    return '<figure class="sp-' + (m.span || 'full') + (extra || '') + '">' + mediaEl(m) +
      (m.cap && !m._capOut ? '<figcaption>' + esc(m.cap) + '</figcaption>' : '') + '</figure>';
  }
  /* A row that ends short of 12 columns carries its caption in the leftover span. */
  function restCap(r, sum, fallback) {
    var rest = 12 - sum, last = r[r.length - 1];
    if (rest <= 0) return '';
    var txt = last.cap || fallback;
    if (last.cap) last._capOut = true;
    return '<p class="rest meta" style="grid-column:span ' + rest + '"' + (txt ? '' : ' aria-hidden="true"') + '>' + (txt ? esc(txt) : '') + '</p>';
  }
  /* Group media into rows of 12 columns. In a row of mixed shapes the shortest frame leads. */
  function rowsHTML(list, fallback) {
    var rows = [], cur = [], sum = 0;
    list = list.map(function (m) { return Object.assign({}, m); });
    list.forEach(function (m) {
      var s = SPANS[m.span || 'full'];
      if (sum + s > 12 && cur.length) { rows.push(cur); cur = []; sum = 0; }
      cur.push(m); sum += s;
      if (sum >= 12) { rows.push(cur); cur = []; sum = 0; }
    });
    if (cur.length) rows.push(cur);
    return rows.map(function (r) {
      var sum = r.reduce(function (a, m) { return a + SPANS[m.span || 'full']; }, 0);
      var rest = restCap(r, sum, fallback);
      if (r.length === 1) return '<div class="mrow">' + figure(r[0]) + rest + '</div>';
      var arOf = function (m) { if (m.ar) { var q = m.ar.split('/'); return parseFloat(q[1]) / parseFloat(q[0]); } var d = dim(m.src); return d[1] / d[0]; };
      var hs = r.map(function (m) { return SPANS[m.span || 'full'] * arOf(m); });
      var same = hs.every(function (h) { return Math.abs(h - hs[0]) / hs[0] < .03; });
      if (same) return '<div class="mrow">' + r.map(function (m) { return figure(m); }).join('') + rest + '</div>';
      var lead = hs.indexOf(Math.min.apply(null, hs));
      return '<div class="mrow eq">' + r.map(function (m, i) {
        if (i !== lead && !m.fit && !m.bg && !m.blend) m = Object.assign({}, m, { fit: 'contain' });
        return figure(m, i === lead ? ' lead' : ' follow');
      }).join('') + rest + '</div>';
    }).join('');
  }

  /* ---------------------------------------------------------- line split */
  function splitLines(el) {
    // keep the original nodes, so element units (clay objects and their listeners) survive a re-split
    if (!el.__nodes) el.__nodes = Array.prototype.slice.call(el.childNodes);
    var units = [];
    el.__nodes.forEach(function (n) {
      if (n.nodeType === 3) {
        n.textContent.split(/\s+/).forEach(function (w) {
          if (!w) return;
          var s = document.createElement('span'); s.className = 'w'; s.textContent = w; units.push(s);
        });
      } else if (n.nodeType === 1 && n.tagName !== 'BR') units.push(n);
    });
    el.innerHTML = '';
    units.forEach(function (u, i) { el.appendChild(u); if (i < units.length - 1) el.appendChild(document.createTextNode(' ')); });
    var lines = [], top = null;
    units.forEach(function (u) {
      var t = u.offsetTop + u.offsetHeight;   // bottoms, so inline objects of a different height stay on their line
      if (top === null || Math.abs(t - top) > u.offsetHeight * .5) { lines.push([]); top = t; }
      lines[lines.length - 1].push(u);
    });
    el.innerHTML = '';
    var base = parseFloat(el.dataset.d || 0);
    lines.forEach(function (line, i) {
      var ln = document.createElement('span'); ln.className = 'ln';
      var li = document.createElement('span'); li.className = 'ln-i';
      li.style.setProperty('--i', i);
      if (base) li.style.setProperty('--d', base + 's');
      line.forEach(function (u, j) { li.appendChild(u); if (j < line.length - 1) li.appendChild(document.createTextNode(' ')); });
      ln.appendChild(li); el.appendChild(ln);
      if (i < lines.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }
  function reveal(el) {
    el.classList.add('in');
    // once the lines are up, let inline objects breathe past the line mask
    setTimeout(function () { el.classList.add('done'); }, reduce.matches ? 0 : 1600);
  }

  /* ------------------------------------------------------------- reveals */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px 10% 0px', threshold: 0 });
  function observe(root) {
    $$('[data-fade], [data-reveal]', root).forEach(function (el) {
      if (reduce.matches) { el.classList.add('in'); return; }
      io.observe(el);
    });
    $$('video[data-src]', root).forEach(function (v) { vio.observe(v.closest('.frame') || v); });
  }

  /* Videos load when a quarter is in view, play while on screen, pause off screen. */
  var vio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target.tagName === 'VIDEO' ? e.target : e.target.querySelector('video'); if (!v) return;
      if (e.isIntersecting) {
        if (!v.src) { v.src = v.dataset.src; v.preload = 'auto'; }
        if (reduce.matches) {
          var b = v.closest('.frame').querySelector('.vbtn');
          if (b && v.paused) { b.textContent = 'Play'; b.setAttribute('aria-label', 'Play: ' + v.getAttribute('aria-label')); }
          return;
        }
        if (v.dataset.user === 'paused') return;
        var p = v.play(); if (p && p.catch) p.catch(function () {});
      } else if (!v.paused) v.pause();
    });
  }, { threshold: .25 });

  /* ------------------------------------------------------- hero clay */
  /* Sprite-atlas idle loops (assets/motion/hero/clay.json, inlined). */
  var CLAY = { fps: 10, cols: 6, base: 'assets/motion/hero/', objects: {
    pebbles: [360, 315], letter: [328, 360], capsule: [360, 296], book: [302, 360], head: [360, 338], medallion: [356, 360], gem: [360, 296] } };
  function setupClay() {
    var items = [];
    $$('.open [data-o]').forEach(function (el, i) {
      var o = CLAY.objects[el.dataset.o]; if (!o) return;
      var spr = el.querySelector('.spr');
      el.style.setProperty('--ar', (o[0] / o[1]).toFixed(4));
      spr.style.setProperty('--d', (-i * 1.3) + 's');
      spr.style.backgroundImage = 'url(' + CLAY.base + 'clay-' + el.dataset.o + '-loop.webp)';
      items.push({ el: el, spr: spr, t: (i * 7) % 36, speed: 1, target: 1 });
    });
    function paint(it) {
      var f = Math.floor(it.t) % 36, c = f % 6, r = Math.floor(f / 6);
      it.spr.style.backgroundPosition = (c / 5 * 100) + '% ' + (r / 5 * 100) + '%';
    }
    items.forEach(paint);
    var raf = null, last = 0, hero = $('.open'), visible = true;
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; visible ? start() : stop(); }).observe(hero);
    function tick(now) {
      var dt = last ? Math.min(.1, (now - last) / 1000) : 0; last = now;
      items.forEach(function (it) {
        it.speed += (it.target - it.speed) * Math.min(1, dt * 4);
        it.t = (it.t + dt * CLAY.fps * it.speed) % 36;
        paint(it);
      });
      raf = requestAnimationFrame(tick);
    }
    function start() { if (!raf && !reduce.matches && !document.hidden && visible) { last = 0; raf = requestAnimationFrame(tick); } }
    function stop() { if (raf) cancelAnimationFrame(raf); raf = null; }
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    start();
    // hover: the object (or its word) squishes a little and turns faster
    function hot(it, on) { it.el.classList.toggle('is-hot', on); it.target = on ? 2.4 : 1; }
    items.forEach(function (it) {
      var word = it.el.dataset.pair && $('.open [data-w="' + it.el.dataset.pair + '"]');
      [it.el, word].forEach(function (t) {
        if (!t) return;
        t.addEventListener('pointerenter', function () { hot(it, true); });
        t.addEventListener('pointerleave', function () { hot(it, false); it.el.classList.remove('pressed'); });
        t.addEventListener('pointerdown', function () { it.el.classList.add('pressed'); });
        t.addEventListener('pointerup', function () { it.el.classList.remove('pressed'); });
      });
    });
  }

  /* -------------------------------------------------------- home render */
  function tileHTML(p) {
    var t = p.tile;
    return '<article class="tile" style="--col:' + t.col + ';--ar:' + t.ar + ';--accent:' + p.accent + '" data-accent="' + p.accent + '">' +
      '<div class="frame" data-reveal style="--ar:' + t.ar + '">' + videoTag(t.src, t.poster, t.alt) + '</div>' +
      '<div class="tile-cap"><h3 class="tile-title">' + esc(p.title) + '</h3>' +
      '<p class="tile-meta meta"><span></span><span>' + p.year + '</span></p></div>' +
      '<a class="tile-link" href="#/work/' + p.slug + '"><span class="vh">' + esc(p.title) + ', case study</span></a>' +
      '</article>';
  }
  function renderHome() {
    $('#tiles').innerHTML = W.featured.map(tileHTML).join('');
    var rows = W.archive.slice().sort(function (a, b) { return (b.year - a.year) || ((a.rank || 5) - (b.rank || 5)); });
    $('#ix').innerHTML = rows.map(function (p) {
      var media = p.tile
        ? '<div class="frame" data-reveal style="--ar:4 / 5">' + videoTag(p.tile.src, p.tile.poster, p.title) + '</div>'
        : '<div class="frame' + (p.pixel ? ' pixel' : '') + '" data-reveal style="--ar:4 / 5"><img src="' + url('_thumbs/' + p.slug + '.webp') + '" alt="" width="480" height="600" loading="lazy" decoding="async"></div>';
      return '<a class="ix-item" role="listitem" href="#/archive/' + p.slug + '" data-accent="' + p.accent + '" style="--row:' + p.accent + '">' + media +
        '<span class="c-title">' + esc(p.title) + '</span><span class="c-yr meta">' + p.year + '</span>' +
        '</a>';
    }).join('');
  }

  /* hovering a work drifts the dark space a few percent toward its color */
  document.addEventListener('pointerover', function (e) {
    var t = e.target.closest && e.target.closest('[data-accent]');
    if (window.spaceTint) window.spaceTint(t ? t.dataset.accent : null);
  });

  /* ------------------------------------------------------- case study */
  function renderCase(p) {
    var i = W.featured.indexOf(p), next = W.featured[(i + 1) % W.featured.length];
    var facts = '<dl class="cs-facts sub">' +
      '<div class="f1"><dt class="meta">Year</dt><dd>' + p.year + '</dd></div>' +
      '<div class="f2"><dt class="meta">Discipline</dt><dd>' + p.tags.map(esc).join(', ') + '</dd></div>' +
      '<div class="f3' + (p.live ? '' : ' wide') + '"><dt class="meta">Role</dt><dd>' + esc(p.role) + '</dd></div>' +
      (p.live ? '<div class="f4"><dt class="meta">Live</dt><dd>' +
        p.live.map(function (l) { return '<a href="' + l.href + '" target="_blank" rel="noopener">' + esc(l.label) + '</a>'; }).join('<br>') +
        '</dd></div>' : '') + '</dl>';

    var chapters = p.chapters.map(function (c) {
      // swatches sit on page columns: 3 -> span 3, 4 -> span 2, 5-9 -> span 1 ending flush right
      var nSw = c.swatches ? Math.min(c.swatches.length, 9) : 0, spanSw = nSw <= 3 ? 3 : nSw === 4 ? 2 : 1;
      var sw = c.swatches ? '<div class="sw-wrap" data-fade><div class="sw" style="--n:' + nSw + ';--span:' + spanSw + '">' + c.swatches.slice(0, 9).map(function (s, j) {
        var light = luminance(s[1]) > .55;
        var start = (j === 0 && spanSw === 1) ? '--start:' + (10 - nSw) + ';' : '';
        return '<div class="' + (spanSw === 1 ? 'tall' : '') + '" style="' + start + 'background:' + s[1] + ';color:' + (light ? '#161513' : '#F6F2EA') + '"' + (s[2] ? ' data-obj="' + j + '" tabindex="0"' : '') + '><span>' + esc(s[0]) + (s[2] ? '<span class="obj">' + esc(s[2]) + '</span>' : '') + '</span><span class="hex">' + s[1] + '</span></div>';
      }).join('') + '</div></div>' : '';
      var strip = c.strip ? '<div class="strip">' + c.strip.items.map(function (it) {
        var d = dim(it[0]);
        return '<figure><div class="frame contain" data-reveal style="--ar:1"><img src="' + url(it[0]) + '" alt="' + esc(it[1]) + ' add-on" width="' + d[0] + '" height="' + d[1] + '" loading="lazy" decoding="async"></div>' +
          '<figcaption class="meta"><span>' + esc(it[1]) + '</span><span class="muted">' + esc(it[2]) + '</span></figcaption></figure>';
      }).join('') + (c.strip.legend ? '<dl class="strip-legend meta" data-fade>' + c.strip.legend.map(function (r) {
        return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd><dd class="muted">' + esc(r[2]) + '</dd></div>';
      }).join('') + '</dl>' : '') + '</div>' : '';
      return '<section class="ch grid" aria-label="' + esc(c.label) + '">' +
        '<div class="ch-head"><h2 class="ch-big">' + esc(c.label) + '</h2>' +
        '<p>' + esc(c.text) + '</p>' + sw + '</div>' +
        (c.media.length ? rowsHTML(c.media, c.label) : '') + strip + '</section>';
    }).join('');

    var hero = Object.assign({ fit: 'cover' }, p.hero);
    // live hero (Diababy): a still that a real-time WebGL scene covers once it runs (see startLive)
    var heroEl = p.hero.live ? (function () {
      var d = dim(p.hero.src);
      return '<div class="frame live-host" data-live="' + p.hero.live + '" data-reveal style="--ar:' + p.hero.ar + ';position:relative;background:#F3EFE7">' +
        '<img src="' + url(p.hero.src) + '" alt="' + esc(p.hero.alt) + '" width="' + d[0] + '" height="' + d[1] + '" decoding="async"></div>';
    })() : mediaEl(hero);
    return '<article class="cs" style="--accent:' + p.accent + '" aria-labelledby="cs-title">' +
      '<div class="cs-top grid meta"><a class="back ul" href="#/" data-home>All work</a></div>' +
      '<div class="grid"><h1 class="cs-title" id="cs-title" data-split>' + esc(p.title) + '</h1>' +
      '<p class="cs-lede">' + esc(p.purpose) + '</p></div>' +
      '<div class="cs-hero">' + heroEl + '</div>' +
      '<div class="grid">' + facts + '</div>' +
      '<section class="cs-idea grid" aria-label="Idea"><h2 class="lbl meta">Idea</h2><p>' + esc(p.idea) + '</p></section>' +
      chapters +
      '<section class="cs-next grid" aria-label="Next case study" style="--accent:' + next.accent + '">' +
      '<p class="lbl meta">Next case study</p>' +
      '<a class="nx" href="#/work/' + next.slug + '" data-accent="' + next.accent + '">' +
      '<div class="frame" data-reveal style="--ar:3 / 2">' + videoTag(next.tile.src, next.tile.poster, next.tile.alt) + '</div>' +
      '<span class="t"><span class="t-in">' + esc(next.title) + '</span><span class="sub-l">' + esc(next.purpose) + '</span></span></a>' +
      '</section></article>';
  }
  function luminance(hex) {
    var n = parseInt(hex.slice(1), 16), r = (n >> 16) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
    return .2126 * r + .7152 * g + .0722 * b;
  }

  /* Live case hero: assets/js/pour.js (ES module) is loaded only on a case with hero.live, disposed on leave.
     Reduced motion or no WebGL keeps the still. */
  var live = null, liveTok = 0;
  function startLive() {
    var host = $('.live-host', cview);
    if (!host || reduce.matches) return;
    var tok = ++liveTok;
    import('./pour.js').then(function (m) {
      if (tok !== liveTok || !m.supported()) return;
      return m.mount(host).then(function (api) { if (tok !== liveTok) api.dispose(); else live = api; });
    }).catch(function () { /* the still stays */ });
  }
  function stopLive() { liveTok++; if (live) { live.dispose(); live = null; } }

  /* --------------------------------------------------- archive sheet */
  var sheet = $('#sheet'), sheetReturn = null;
  function openSheet(p) {
    sheet.style.setProperty('--accent', p.accent);
    sheet.innerHTML = '<div class="sheet-in grid">' +
      '<div class="sheet-top meta"><span class="k">Archive · ' + p.year + '</span>' +
      '<button class="x ul" type="button" data-close>Close</button></div>' +
      '<h2 id="sheet-title">' + esc(p.title) + '</h2>' +
      '<p class="sub-t">' + esc(p.sub) + '</p>' +
      '<p class="note">' + esc(p.note) + '</p>' +
      rowsHTML(p.media, p.sub) + '</div>';
    sheetReturn = document.activeElement;
    if (typeof sheet.showModal === 'function') sheet.showModal(); else sheet.setAttribute('open', '');
    sheet.scrollTop = 0;
    if (lenis) lenis.stop();
    var sio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); sio.unobserve(e.target); } });
    }, { root: sheet, threshold: 0 });
    $$('[data-fade], [data-reveal]', sheet).forEach(function (el) { if (reduce.matches) el.classList.add('in'); else sio.observe(el); });
    $$('video[data-src]', sheet).forEach(function (v) { vio.observe(v.closest('.frame') || v); });
    $('[data-close]', sheet).focus({ focusVisible: false });
  }
  function closeSheet(fromRoute) {
    if (!sheet.open) return;
    $$('video', sheet).forEach(function (v) { v.pause(); vio.unobserve(v.closest('.frame') || v); });
    sheet.close();
    if (lenis) lenis.start();
    if (!fromRoute) { ignoreNextRoute = true; history.replaceState(null, '', location.pathname + location.search + '#index'); }
    if (sheetReturn && sheetReturn.focus) sheetReturn.focus({ preventScroll: true });
  }
  sheet.addEventListener('click', function (e) { if (e.target.closest('[data-close]') || e.target === sheet) closeSheet(); });
  sheet.addEventListener('cancel', function (e) { e.preventDefault(); closeSheet(); });

  /* ------------------------------------------------------------ router */
  var home = $('#view-home'), cview = $('#view-case');
  var homeY = 0, ignoreNextRoute = false, current = 'home';
  function scrollToY(y) { if (lenis) lenis.scrollTo(y, { immediate: true, force: true }); else window.scrollTo(0, y); }
  function route() {
    if (ignoreNextRoute) { ignoreNextRoute = false; return; }
    var h = location.hash || '';
    var m = h.match(/^#\/work\/([\w-]+)/), a = h.match(/^#\/archive\/([\w-]+)/);
    if (a && bySlug[a[1]] && !bySlug[a[1]].featured) { if (current !== 'home') show('home', null); openSheet(bySlug[a[1]]); return; }
    if (sheet.open) closeSheet(true);
    if (m && bySlug[m[1]] && bySlug[m[1]].featured) { show('case', bySlug[m[1]]); return; }
    // old archive links to works that are now case studies
    if (a && bySlug[a[1]]) { location.replace('#/work/' + a[1]); return; }
    show('home', h && h.charAt(1) !== '/' ? h.slice(1) : null);
  }
  function show(which, arg) {
    var swap = function () {
      stopLive();
      $$('video', which === 'case' ? home : cview).forEach(function (v) { v.pause(); });
      if (which === 'case') {
        if (current === 'home') homeY = window.scrollY;
        home.hidden = true;
        cview.innerHTML = renderCase(arg);
        cview.hidden = false;
        document.title = arg.title + ' — Minwoo Hong';
        $$('[data-split]', cview).forEach(function (el) { splitLines(el); requestAnimationFrame(function () { reveal(el); }); });
        observe(cview);
        startLive();
        scrollToY(0);
        var t = $('#cs-title'); if (t) { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
        current = 'case';
      } else {
        var wasCase = current === 'case';
        cview.hidden = true; cview.innerHTML = '';
        home.hidden = false;
        document.title = 'Minwoo Hong — Brand designer & 3D creative';
        if (arg) {
          var el = document.getElementById(arg);
          if (el) requestAnimationFrame(function () {
            var y = arg === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY - ($('#hd').offsetHeight - 1);
            if (lenis && !wasCase) lenis.scrollTo(y, { duration: 1.2 }); else scrollToY(y);
          });
        } else if (wasCase) scrollToY(homeY);
        current = 'home';
      }
      cview.classList.remove('leaving'); home.classList.remove('leaving');
      onScroll();
    };
    var needsTransition = which === 'case' || current === 'case';
    if (needsTransition && !reduce.matches && booted) {
      (current === 'case' ? cview : home).classList.add('leaving');
      setTimeout(swap, 480);
    } else swap();
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var href = a.getAttribute('href');
    if (href === '#top') { e.preventDefault(); if (lenis && current === 'home') lenis.scrollTo(0, { duration: 1.2 }); else scrollToY(0); var hn = $('.hd-name'); if (hn) hn.focus({ preventScroll: true }); return; }
    if (href === '#/' && current === 'home') { e.preventDefault(); if (lenis) lenis.scrollTo(0, { duration: 1.2 }); else window.scrollTo(0, 0); history.replaceState(null, '', '#/'); return; }
    if (href.charAt(1) !== '/' && current === 'home' && location.hash === href) { e.preventDefault(); route(); }
  });
  window.addEventListener('hashchange', route);

  /* Color chip -> object: a LUMIX chip tints the matching tile in the strip */
  function tintObj(e, on) {
    var c = e.target.closest && e.target.closest('.sw [data-obj]'); if (!c) return;
    var t = document.querySelectorAll('.cs .strip figure .frame')[+c.dataset.obj];
    if (t) t.style.backgroundColor = on ? 'color-mix(in oklab, ' + c.style.backgroundColor + ' 35%, transparent)' : '';
  }
  ['mouseover', 'focusin'].forEach(function (n) { document.addEventListener(n, function (e) { tintObj(e, true); }); });
  ['mouseout', 'focusout'].forEach(function (n) { document.addEventListener(n, function (e) { tintObj(e, false); }); });

  /* -------------------------------------------------- scroll & header */
  var lenis = null, booted = false, hd = $('#hd'), lastY = 0;
  function onScroll() {
    var y = window.scrollY, o = $('#view-home:not([hidden]) .open');
    // header reads ink on the light hero, light ink over the dark space
    document.documentElement.classList.toggle('on-paper', !!o && o.getBoundingClientRect().bottom > hd.offsetHeight);
    if (y > lastY + 4 && y > 240 && !hd.contains(document.activeElement)) hd.classList.add('hide');
    else if (y < lastY - 4 || y < 240) hd.classList.remove('hide');
    lastY = y;
  }
  function initScroll() {
    if (!reduce.matches && window.Lenis) {
      lenis = new window.Lenis({ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true });
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    hd.addEventListener('focusin', function () { hd.classList.remove('hide'); });
    onScroll();
  }

  /* ------------------------------------------------- contact */
  function setupContact() {
    if (W.email) {
      $$('[data-mail]').forEach(function (a) { a.href = 'mailto:' + W.email; });
      var t = $('#ft-mail'); if (t) t.textContent = W.email;
    } else {
      $$('[data-mail]').forEach(function (a) { a.hidden = true; });
    }
  }

  /* Video pause/play control (WCAG 2.2.2). */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.vbtn'); if (!b) return;
    var v = b.closest('.frame').querySelector('video'); if (!v) return;
    if (!v.src) v.src = v.dataset.src;
    if (v.paused) { v.dataset.user = ''; var p = v.play(); if (p && p.catch) p.catch(function () {}); b.textContent = 'Pause'; b.setAttribute('aria-label', 'Pause: ' + v.getAttribute('aria-label')); }
    else { v.pause(); v.dataset.user = 'paused'; b.textContent = 'Play'; b.setAttribute('aria-label', 'Play: ' + v.getAttribute('aria-label')); }
  });
  /* off-screen tab: pause everything */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) $$('video').forEach(function (v) { if (!v.paused) { v.pause(); v.dataset.hid = '1'; } });
    else $$('video[data-hid]').forEach(function (v) { delete v.dataset.hid; var p = v.play(); if (p && p.catch) p.catch(function () {}); });
  });

  /* -------------------------------------------------------------- boot */
  setupContact();
  renderHome();
  initScroll();
  setupClay();
  var go = function () {
    var hs = $('.open-statement'); splitLines(hs); reveal(hs);
    route();
    observe(home);
    booted = true;
  };
  if (document.fonts && document.fonts.ready) {
    var done = false;
    document.fonts.ready.then(function () { if (!done) { done = true; go(); } });
    setTimeout(function () { if (!done) { done = true; go(); } }, 1500);
  } else go();

  var lastW = window.innerWidth, rt;
  window.addEventListener('resize', function () {
    if (window.innerWidth === lastW) return;
    lastW = window.innerWidth; clearTimeout(rt);
    rt = setTimeout(function () {
      $$('[data-split]').forEach(function (el) {
        splitLines(el); el.classList.add('in', 'done');
        $$('.ln-i', el).forEach(function (l) { l.style.transition = 'none'; });
      });
    }, 200);
  });
})();
