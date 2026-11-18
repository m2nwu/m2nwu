/* The dark ambient space under the site.
   A place, not a motion graphic: one undulating dark surface seen at a low angle,
   moving on a scale of tens of seconds, with a few degrees of camera tilt and a
   soft lift under the cursor. Raw WebGL, one draw call, no library.
   Static frame for reduced motion; CSS fallback (html.no-space) without WebGL. */
(function () {
  'use strict';
  var canvas = document.getElementById('space');
  if (!canvas) return;
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var coarse = window.matchMedia('(pointer: coarse)');
  var gl = null;
  try { gl = canvas.getContext('webgl', { antialias: true, alpha: false, depth: true, powerPreference: 'low-power' }); } catch (e) {}
  if (!gl) { root.classList.add('no-space'); return; }

  /* colours (match --space in site.css) */
  var BG = [0.953, 0.937, 0.906];          // #F3EFE7
  var BASE = [1.10, 1.08, 1.04];        // surface, a little lighter than the fog
  var SHEEN = [0.035, 0.03, 0.025];          // cool, soft highlight

  var VS = [
    'precision highp float;',
    'attribute vec2 a;',
    'uniform mat4 uPV; uniform float uT; uniform vec2 uM; uniform float uH;',
    'varying vec3 vP; varying vec3 vN;',
    'float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }',
    'float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y); }',
    'float H(vec2 q){',
    '  float t = uT;',
    '  float h = sin(q.x * 0.32 + t * 0.21 + sin(q.y * 0.27 + t * 0.11) * 1.3) * 0.22;',
    '  h += sin(q.y * 0.52 - t * 0.16 + q.x * 0.18) * 0.09;',
    '  h += (noise(q * 0.55 + vec2(t * 0.045, -t * 0.035)) - 0.5) * 0.42;',
    '  h += (noise(q * 1.4 - vec2(t * 0.03, t * 0.05)) - 0.5) * 0.08;',
    '  vec2 d = q - uM; h += uH * 0.30 * exp(-dot(d, d) * 0.30);',
    '  return h;',
    '}',
    'void main(){',
    '  vec2 q = vec2(a.x * 24.0, a.y * 22.0 - 8.0);',
    '  float h = H(q);',
    '  float e = 0.12;',
    '  vec3 n = normalize(vec3(H(q - vec2(e, 0.0)) - H(q + vec2(e, 0.0)), 2.0 * e, H(q - vec2(0.0, e)) - H(q + vec2(0.0, e))));',
    '  vP = vec3(q.x, h, q.y); vN = n;',
    '  gl_Position = uPV * vec4(vP, 1.0);',
    '}'
  ].join('\n');

  var FS = [
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    'varying vec3 vP; varying vec3 vN;',
    'uniform vec3 uCam; uniform vec3 uBg; uniform vec3 uBase; uniform vec3 uSheen; uniform vec3 uTint;',
    'uniform vec2 uM; uniform float uH; uniform float uTintK;',
    'void main(){',
    '  vec3 n = normalize(vN);',
    '  vec3 v = normalize(uCam - vP);',
    '  vec3 L = normalize(vec3(-0.35, 0.55, -0.75));',          // key light from behind, low: glints ride the crests
    '  vec3 hv = normalize(L + v);',
    '  float spec = pow(max(dot(n, hv), 0.0), 22.0) * 0.30;',
    '  float wide = pow(max(dot(n, hv), 0.0), 4.0) * 0.07;',
    '  float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0) * 0.12;',
    '  vec3 sheen = mix(uSheen, uTint, uTintK);',
    '  vec3 col = uBase * (0.55 + 0.45 * max(dot(n, L), 0.0)) + sheen * (spec + wide + fres);',
    '  vec2 d = vP.xz - uM; float pool = exp(-dot(d, d) * 0.22) * uH;',   // soft light pool under the cursor
    '  col += uSheen * pool * 0.035 + uSheen * spec * pool * 0.6;',
    '  float dist = length(uCam - vP);',
    '  float fog = max(1.0 - exp(-pow(dist * 0.068, 1.9)), smoothstep(15.0, 28.0, dist));',
    '  gl_FragColor = vec4(mix(col, uBg, clamp(fog, 0.0, 1.0)), 1.0);',
    '}'
  ].join('\n');

  function sh(type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { throw new Error(gl.getShaderInfoLog(s)); }
    return s;
  }
  var prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
  } catch (e) { root.classList.add('no-space'); return; }
  gl.useProgram(prog);

  /* grid mesh, 150 x 150 quads (22,801 vertices, 16-bit indices) */
  var N = window.innerWidth < 700 ? 110 : 150, V = N + 1;
  var pos = new Float32Array(V * V * 2), k = 0, i, j;
  for (j = 0; j < V; j++) for (i = 0; i < V; i++) { pos[k++] = i / N * 2 - 1; pos[k++] = j / N * 2 - 1; }
  var idx = new Uint16Array(N * N * 6); k = 0;
  for (j = 0; j < N; j++) for (i = 0; i < N; i++) {
    var p = j * V + i;
    idx[k++] = p; idx[k++] = p + 1; idx[k++] = p + V;
    idx[k++] = p + 1; idx[k++] = p + V + 1; idx[k++] = p + V;
  }
  var vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);
  var ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
  var aLoc = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(aLoc); gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);
  var U = {};
  ['uPV', 'uT', 'uM', 'uH', 'uCam', 'uBg', 'uBase', 'uSheen', 'uTint', 'uTintK'].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
  gl.uniform3fv(U.uBg, BG); gl.uniform3fv(U.uBase, BASE); gl.uniform3fv(U.uSheen, SHEEN);
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(BG[0], BG[1], BG[2], 1);

  /* small matrix helpers */
  function persp(fov, asp, n, f) { var t = 1 / Math.tan(fov / 2), r = 1 / (n - f); return [t / asp, 0, 0, 0, 0, t, 0, 0, 0, 0, (f + n) * r, -1, 0, 0, 2 * f * n * r, 0]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function norm(a) { var l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function look(e, c) {
    var z = norm(sub(e, c)), x = norm(cross([0, 1, 0], z)), y = cross(z, x);
    return { m: [x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, e), -dot(y, e), -dot(z, e), 1], f: [-z[0], -z[1], -z[2]], r: x, u: y };
  }
  function mul(a, b) {
    var o = new Array(16);
    for (var c = 0; c < 4; c++) for (var r = 0; r < 4; r++) {
      o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
    }
    return o;
  }

  /* state */
  var FOV = 0.85, w = 0, h = 0, dpr = 1;
  var mx = 0, my = 0, tilt = [0, 0], cur = [0, 0], curT = [0, 0];
  var hov = 0, speed = 0, lastMove = 0, pointerIn = false;
  var tint = [0.62, 0.66, 0.70], tintT = tint.slice(), tintK = 0, tintKT = 0;
  var scrollK = 0, t0 = performance.now(), last = 0, raf = null;
  var lowEnd = (navigator.hardwareConcurrency || 8) <= 4;
  var cam = [0, 2.1, 7.2];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    if (window.innerWidth > 2560) dpr *= 0.75;
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (reduce.matches || !raf) draw(0);
  }

  function covered() {
    // on the home page the light hero covers the whole viewport at the top: no need to draw
    var o = document.querySelector('#view-home:not([hidden]) .open');
    return !!o && o.getBoundingClientRect().bottom >= h - 1;
  }

  function draw(dt) {
    var t = reduce.matches ? 12 : (performance.now() - t0) / 1000;
    var damp = function (k) { return 1 - Math.exp(-k * dt); };
    // camera tilt toward the cursor: a few degrees, critically damped
    tilt[0] += (mx * 0.05 - tilt[0]) * damp(3);
    tilt[1] += (my * 0.035 - tilt[1]) * damp(3);
    // a very small dolly across the whole page so the space feels continuous
    var max = Math.max(1, document.documentElement.scrollHeight - h);
    scrollK += (window.scrollY / max - scrollK) * damp(4);
    var e = [cam[0], cam[1] - scrollK * 0.35, cam[2] - scrollK * 0.9];
    var c = [e[0] + Math.sin(tilt[0]) * 9, e[1] - 2.1 + Math.sin(-tilt[1]) * 9, e[2] - 9];
    var V = look(e, c), P = persp(FOV, w / h, 0.1, 60);
    // cursor ray onto the surface (y = 0)
    if (pointerIn && !coarse.matches) {
      var tf = Math.tan(FOV / 2), dir = norm([
        V.f[0] + V.r[0] * mx * tf * (w / h) - V.u[0] * my * tf,
        V.f[1] + V.r[1] * mx * tf * (w / h) - V.u[1] * my * tf,
        V.f[2] + V.r[2] * mx * tf * (w / h) - V.u[2] * my * tf]);
      if (dir[1] < -0.01) { var s = -e[1] / dir[1]; curT = [e[0] + dir[0] * s, e[2] + dir[2] * s]; }
    }
    cur[0] += (curT[0] - cur[0]) * damp(5); cur[1] += (curT[1] - cur[1]) * damp(5);
    // hover strength: a smoothed scalar, 0.25 s in, 1 s out, driven by cursor speed
    speed *= Math.exp(-dt * 3);
    var target = pointerIn && !coarse.matches ? Math.min(1, 0.35 + speed) : 0;
    hov += target > hov ? Math.min(target - hov, dt * 4) : -Math.min(hov - target, dt * 1);
    // project tint: drift a few percent toward the hovered work over about a second
    tintK += (tintKT - tintK) * damp(1.6);
    for (var q = 0; q < 3; q++) tint[q] += (tintT[q] - tint[q]) * damp(1.6);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(U.uPV, false, new Float32Array(mul(P, V.m)));
    gl.uniform1f(U.uT, t);
    gl.uniform2f(U.uM, cur[0], cur[1]);
    gl.uniform1f(U.uH, hov);
    gl.uniform3fv(U.uCam, e);
    gl.uniform3fv(U.uTint, tint);
    gl.uniform1f(U.uTintK, tintK);
    gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0);
  }

  function loop(now) {
    raf = requestAnimationFrame(loop);
    var dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016;
    if (lowEnd && dt < 1 / 31) return;            // 30 fps cap on low-end machines
    last = now;
    if (covered()) return;
    draw(dt);
  }
  function start() { if (!raf && !reduce.matches && !document.hidden) { last = 0; raf = requestAnimationFrame(loop); } }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = null; }

  window.addEventListener('pointermove', function (ev) {
    if (ev.pointerType && ev.pointerType !== 'mouse') return;
    var nx = ev.clientX / w * 2 - 1, ny = ev.clientY / h * 2 - 1;
    var now = performance.now(), dtm = Math.max(16, now - lastMove) / 1000;
    speed = Math.min(1, speed + Math.hypot(nx - mx, ny - my) / dtm * 0.08);
    mx = nx; my = ny; lastMove = now; pointerIn = true;
  }, { passive: true });
  document.addEventListener('pointerleave', function () { pointerIn = false; mx = 0; my = 0; });
  window.addEventListener('blur', function () { pointerIn = false; });

  /* site.js calls this when a work is hovered (hex) or left (null) */
  window.spaceTint = function (hex) {
    if (!hex) { tintKT = 0; return; }
    var n = parseInt(hex.slice(1), 16);
    tintT = [(n >> 16) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
    tintKT = 0.12;
  };

  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  reduce.addEventListener && reduce.addEventListener('change', function () { reduce.matches ? (stop(), draw(0)) : start(); });
  canvas.addEventListener('webglcontextlost', function (ev) { ev.preventDefault(); stop(); root.classList.add('no-space'); });
  window.addEventListener('resize', resize);
  resize();
  root.classList.add('has-space');
  if (reduce.matches) draw(0); else start();
})();
