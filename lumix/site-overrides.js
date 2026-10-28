// Edits made in the editor (editor/) live in overrides.js and are applied here,
// before the page's own scripts run, so swapped videos, timings and colours are
// what the interactions pick up. The site and the editor share this file, so
// what you see in the editor is exactly what the site does.
//
// Every element gets a stable id (data-eid) from its position in the page, e.g.
// "3.1.0" = 4th child of <body>, its 2nd child, its 1st child. Styles are keyed
// by "@<eid>" for one element, or by a plain CSS selector for site-wide rules.
//
//   texts  eid -> plain text ("\n" = line break), or {html} limited to <i><em><b><strong><br>
//   media  eid -> {src, poster}         (img / video)
//   attrs  eid -> {"data-tone": "#fff"} (data-* attributes the interactions read)
(function () {
  'use strict';
  var D = document, W = window;
  var MOBILE_MAX = 760;
  var EDIT = /[?&]edit\b/.test(location.search);
  var SKIP = { SCRIPT: 1, STYLE: 1, LINK: 1, META: 1, BR: 1, NOSCRIPT: 1, TEMPLATE: 1 };
  var INLINE = { I: 1, EM: 1, B: 1, STRONG: 1 };

  function normalize(o) {
    o = o || {};
    var s = o.styles || {};
    function copy(x) { var r = {}; for (var k in x || {}) r[k] = x[k]; return r; }
    return { version: 1, fonts: (o.fonts || []).slice(), styles: { all: copy(s.all), mobile: copy(s.mobile) },
      texts: copy(o.texts), media: copy(o.media), attrs: copy(o.attrs) };
  }

  function tagElements(root) {
    (function walk(el, path) {
      [].forEach.call(el.children, function (c, i) {
        if (SKIP[c.tagName]) return;
        var p = path ? path + '.' + i : '' + i;
        c.setAttribute('data-eid', p);
        walk(c, p);
      });
    })(root, '');
  }

  function toSelector(key) { return key.charAt(0) === '@' ? '[data-eid="' + key.slice(1) + '"]' : key; }
  function rules(map) {
    return Object.keys(map).map(function (key) {
      var props = map[key], body = Object.keys(props).filter(function (p) { return props[p] !== '' && props[p] != null; })
        .map(function (p) { return p + ':' + props[p] + ' !important'; }).join(';');
      return body ? toSelector(key) + '{' + body + '}' : '';
    }).join('\n');
  }
  function loadFonts(doc, fonts) {
    fonts.forEach(function (f) {
      if (!f.url || [].some.call(doc.querySelectorAll('link[data-font]'), function (l) { return l.getAttribute('data-font') === f.family; })) return;
      var link = doc.createElement('link'); link.rel = 'stylesheet'; link.href = f.url; link.setAttribute('data-font', f.family);
      doc.head.appendChild(link);
    });
  }
  function applyStyles(doc, ov) {
    var tag = doc.getElementById('site-overrides');
    if (!tag) { tag = doc.createElement('style'); tag.id = 'site-overrides'; doc.head.appendChild(tag); }
    tag.textContent = rules(ov.styles.all) + '\n@media (max-width: ' + MOBILE_MAX + 'px) {\n' + rules(ov.styles.mobile) + '\n}';
    loadFonts(doc, ov.fonts);
  }

  // Text is never set as raw HTML: plain text with "\n", or a short markup string
  // rebuilt node by node from the few inline tags the design uses.
  function setText(el, t) {
    var doc = el.ownerDocument, kids = [];
    if (t && typeof t === 'object') {
      var tpl = doc.createElement('template'); tpl.innerHTML = String(t.html || '');
      (function copy(from, out) {
        [].forEach.call(from.childNodes, function (n) {
          if (n.nodeType === 3) out.push(doc.createTextNode(n.nodeValue));
          else if (n.nodeName === 'BR') out.push(doc.createElement('br'));
          else if (INLINE[n.nodeName]) { var e = doc.createElement(n.nodeName.toLowerCase()), sub = []; copy(n, sub); e.append.apply(e, sub); out.push(e); }
          else if (n.nodeType === 1) copy(n, out);
        });
      })(tpl.content, kids);
    } else {
      String(t).split('\n').forEach(function (line, i) { if (i) kids.push(doc.createElement('br')); kids.push(doc.createTextNode(line)); });
    }
    el.replaceChildren.apply(el, kids);
  }

  function setMedia(el, m) {
    if (!el || !m) return;
    if (el.tagName === 'VIDEO') {
      var src = el.querySelector('source');
      if (m.src) { if (src) src.setAttribute('src', m.src); else el.setAttribute('src', m.src); }
      // the page loads transparent video by base name (base.webm, or base_hevc.mp4 on Safari); any other file is used as is
      if (m.src && src && src.hasAttribute('data-alpha'))
        src.setAttribute('data-alpha', /\.webm$|_hevc\.mp4$/.test(m.src) ? m.src.replace(/(_hevc\.mp4|\.webm)$/, '') : m.src);
      if (m.poster != null) { if (m.poster) el.setAttribute('poster', m.poster); else el.removeAttribute('poster'); }
      if (m.src && el.readyState > 0) el.load();
    } else if (el.tagName === 'IMG') {
      if (m.src) { el.setAttribute('src', m.src); el.removeAttribute('srcset'); }
    }
  }

  function byEid(doc, eid) { return doc.querySelector('[data-eid="' + eid + '"]'); }
  function applyOverrides(doc, ov) {
    tagElements(doc.body);
    Object.keys(ov.texts).forEach(function (eid) { var el = byEid(doc, eid); if (el) setText(el, ov.texts[eid]); });
    Object.keys(ov.media).forEach(function (eid) { setMedia(byEid(doc, eid), ov.media[eid]); });
    Object.keys(ov.attrs).forEach(function (eid) {
      var el = byEid(doc, eid), a = ov.attrs[eid]; if (!el) return;
      Object.keys(a).forEach(function (k) { if (/^(data-|aria-label$|alt$)/.test(k)) el.setAttribute(k, a[k]); });
    });
    applyStyles(doc, ov);
  }

  W.LumixOverrides = { normalize: normalize, applyStyles: applyStyles, loadFonts: loadFonts, setText: setText, setMedia: setMedia, MOBILE_MAX: MOBILE_MAX, EDIT: EDIT };

  // ?edit is how the editor loads the site: no loader, every tile revealed, and the editor's unsaved state used.
  var ov = null;
  if (EDIT) {
    D.documentElement.classList.add('edit-mode');
    try { if (W.parent !== W && W.parent.__editorOverrides) ov = W.parent.__editorOverrides(); } catch (e) {}
    var st = D.createElement('style');
    st.textContent = '.edit-mode .loader{display:none!important}' +
      '.edit-mode,.edit-mode *{cursor:auto!important}' +
      '.edit-mode .rv{opacity:1!important;transform:none!important}' +
      '.edit-mode [contenteditable]{-webkit-user-select:text!important;user-select:text!important;outline:none}';
    D.head.appendChild(st);
  }
  applyOverrides(D, normalize(ov || W.__LUMIX_OVERRIDES));
})();
