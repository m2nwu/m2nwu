/*
  Diababy live hero: the project's packaging pours onto the page and piles up.
  Unlit (MeshBasicMaterial), telephoto, every face textured with the owner's own dieline / spread / card art.
  three.js + cannon-es (exact versions, jsDelivr). Loaded on the Diababy case route only; mount() returns
  an object with dispose(). Pauses off screen and in hidden tabs, stops rendering once the heap is asleep.
*/
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';

const PAPER = 0xF3EFE7;
const TEX = ['box1_top', 'box1_bottom', 'box1_sideA', 'box1_sideB', 'box1_endT', 'box1_endB',
  'box2_top', 'box2_bottom', 'box2_sideA', 'box2_sideB', 'box2_endT', 'box2_endB',
  'bag_front', 'bag_back', 'bag_gusL', 'bag_gusR', 'bag_bottom', 'book_s1L', 'book_s1R',
  'card1', 'card2', 'card3', 'card4'];

export function supported() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) { return false; }
}

export async function mount(host, opts = {}) {
  const base = opts.base || 'assets/work/diablo-iv/tex/';
  const manual = !!opts.manual;                 // recording: the caller steps time itself
  const small = host.clientWidth < 700;
  const COUNT = opts.count || (small ? 84 : 140);
  const POUR = opts.pour || 4;                  // seconds over which pieces are released
  const FOV = 14;

  const canvas = document.createElement('canvas');
  canvas.className = 'pour-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;cursor:pointer;touch-action:pan-y';
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: manual });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 2 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(PAPER, 1);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 16 / 9, 1, 400);
  const TARGET = new THREE.Vector3(0, 1.95, 0);

  function placeCamera(aspect) {
    const halfW = 5.25, halfH = 2.7;
    const needH = Math.max(halfH, (aspect < 1 ? halfW * 0.55 : halfW) / aspect);
    const dist = needH / Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const dir = new THREE.Vector3(0, 0.30, 1).normalize();
    camera.position.copy(TARGET).addScaledVector(dir, dist);
    camera.near = Math.max(0.5, dist - 30); camera.far = dist + 40;
    camera.aspect = aspect;
    camera.lookAt(TARGET);
    camera.updateProjectionMatrix();
  }
  function resize() {
    const w = Math.max(1, host.clientWidth), h = Math.max(1, host.clientHeight);
    renderer.setSize(w, h, false);
    placeCamera(w / h);
    draw();
  }

  /* textures: the owner's art, used as-is */
  const loader = new THREE.TextureLoader();
  const T = {};
  const disposables = [];
  const load = (n, ext) => new Promise((res) => loader.load(base + n + '.' + ext, (t) => {
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    disposables.push(t); res(t);
  }, undefined, () => res(null)));
  const got = await Promise.all(TEX.map((n) => load(n, 'jpg')));
  TEX.forEach((n, i) => { T[n] = got[i]; });
  T.devil = await load('devil', 'png');
  if (TEX.some((n) => !T[n])) throw new Error('pour: texture missing');

  const mats = [];
  const mat = (map, color) => { const m = new THREE.MeshBasicMaterial({ map: map || null, color: color == null ? 0xffffff : color }); mats.push(m); return m; };

  /* kinds, in the nets' real proportions (box 1034 x 267, bag 1139 x 802 x 343, book 1400 x 1812, card 1200 x 792) */
  const S = 1.35;
  const red = mat(null, 0xE60000), inner = mat(null, 0x8E0000), cream = mat(null, 0xEDE6DA), white = mat(null, 0xF7F5F0), cord = mat(null, 0xD40000);
  const boxMats = (b) => [mat(T[b + '_sideA']), mat(T[b + '_sideB']), mat(T[b + '_top']), mat(T[b + '_bottom']), mat(T[b + '_endB']), mat(T[b + '_endT'])];
  const devilMat = new THREE.MeshBasicMaterial({ map: T.devil, alphaTest: 0.5, side: THREE.DoubleSide });
  mats.push(devilMat);
  const KINDS = {
    box1: { size: [1 * S, 0.258 * S, 1 * S], mats: boxMats('box1'), mass: 1.2, w: 13 },
    box2: { size: [1 * S, 0.258 * S, 1 * S], mats: boxMats('box2'), mass: 1.2, w: 13 },
    bag: { size: [1.42 * S, 1.0 * S, 0.43 * S], bag: true, mass: 0.6, w: 6 },
    book: { size: [0.62 * S, 0.05 * S, 0.80 * S], mats: [cream, cream, mat(T.book_s1R), mat(T.book_s1L), cream, cream], mass: 0.5, w: 13 },
    cardA: { size: [0.55 * S, 0.02, 0.363 * S], mats: [white, white, mat(T.card1), mat(T.card2), white, white], mass: 0.08, w: 19 },
    cardB: { size: [0.55 * S, 0.02, 0.363 * S], mats: [white, white, mat(T.card3), mat(T.card4), white, white], mass: 0.08, w: 19 },
    devil: { size: [0.62 * S, 0.04, 0.62 * S * 640 / 571], plane: true, mass: 0.25, w: 14 }
  };
  const geos = new Map();
  const geo = (key, make) => { if (!geos.has(key)) geos.set(key, make()); return geos.get(key); };

  /* the bag: open top, printed outside, dark red inside, two cord handles; physics is a matching open box */
  const BT = 0.035;
  function bagMesh() {
    const [w, h, d] = KINDS.bag.size;
    const g = new THREE.Group();
    const add = (gg, m, x, y, z) => { const o = new THREE.Mesh(gg, m); o.position.set(x, y, z); g.add(o); };
    add(geo('bagF', () => new THREE.BoxGeometry(w, h, BT)), [red, red, red, red, mat(T.bag_front), inner], 0, 0, d / 2 - BT / 2);
    add(geo('bagB', () => new THREE.BoxGeometry(w, h, BT)), [red, red, red, red, inner, mat(T.bag_back)], 0, 0, -d / 2 + BT / 2);
    add(geo('bagR', () => new THREE.BoxGeometry(BT, h, d - 2 * BT)), [mat(T.bag_gusR), inner, red, red, red, red], w / 2 - BT / 2, 0, 0);
    add(geo('bagL', () => new THREE.BoxGeometry(BT, h, d - 2 * BT)), [inner, mat(T.bag_gusL), red, red, red, red], -w / 2 + BT / 2, 0, 0);
    add(geo('bagBt', () => new THREE.BoxGeometry(w - 2 * BT, BT, d - 2 * BT)), [red, red, inner, mat(T.bag_bottom), red, red], 0, -h / 2 + BT / 2, 0);
    const handle = geo('bagH', () => {
      const c = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-w * 0.22, h / 2 - 0.06, 0), new THREE.Vector3(-w * 0.17, h / 2 + h * 0.22, 0),
        new THREE.Vector3(0, h / 2 + h * 0.3, 0), new THREE.Vector3(w * 0.17, h / 2 + h * 0.22, 0),
        new THREE.Vector3(w * 0.22, h / 2 - 0.06, 0)]);
      return new THREE.TubeGeometry(c, 24, 0.018, 6, false);
    });
    for (const z of [d / 2 + 0.006, -d / 2 - 0.006]) { const o = new THREE.Mesh(handle, cord); o.position.z = z; g.add(o); }
    return g;
  }
  function bagBody(body) {
    const [w, h, d] = KINDS.bag.size;
    const box = (x, y, z) => new CANNON.Box(new CANNON.Vec3(x / 2, y / 2, z / 2));
    body.addShape(box(w, h, BT), new CANNON.Vec3(0, 0, d / 2 - BT / 2));
    body.addShape(box(w, h, BT), new CANNON.Vec3(0, 0, -d / 2 + BT / 2));
    body.addShape(box(BT, h, d), new CANNON.Vec3(w / 2 - BT / 2, 0, 0));
    body.addShape(box(BT, h, d), new CANNON.Vec3(-w / 2 + BT / 2, 0, 0));
    body.addShape(box(w, BT, d), new CANNON.Vec3(0, -h / 2 + BT / 2, 0));
  }

  /* physics */
  const W = 5.0, Dz = 1.0;
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -26, 0) });
  world.allowSleep = true;
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.solver.iterations = 18;
  world.defaultContactMaterial.friction = 0.45;
  world.defaultContactMaterial.restitution = 0.04;
  world.defaultContactMaterial.contactEquationStiffness = 5e7;
  const ground = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() });
  ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  world.addBody(ground);
  const walls = [];
  const wall = (x, z, ry) => { const b = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() }); b.position.set(x, 0, z); b.quaternion.setFromEuler(0, ry, 0); world.addBody(b); walls.push(b); };
  wall(-W, 0, Math.PI / 2); wall(W, 0, -Math.PI / 2); wall(0, -Dz, 0); wall(0, Dz, Math.PI);

  let bodies = [], queue = [], simT = 0, quiet = 0, dropping = false;
  const kinds = Object.keys(KINDS), wsum = kinds.reduce((a, k) => a + KINDS[k].w, 0);
  const pick = () => { let r = Math.random() * wsum; for (const k of kinds) { r -= KINDS[k].w; if (r <= 0) return k; } return kinds[0]; };

  function spawn(kind) {
    const K = KINDS[kind], [sx, sy, sz] = K.size;
    let mesh;
    if (K.bag) mesh = bagMesh();
    else if (K.plane) mesh = new THREE.Mesh(geo('devil', () => new THREE.PlaneGeometry(sx, sz).rotateX(-Math.PI / 2)), devilMat);
    else mesh = new THREE.Mesh(geo(kind, () => new THREE.BoxGeometry(sx, sy, sz)), K.mats);
    scene.add(mesh);
    const body = new CANNON.Body({ mass: K.mass, linearDamping: 0.08, angularDamping: 0.12, sleepSpeedLimit: 0.15, sleepTimeLimit: 0.6 });
    if (K.bag) bagBody(body); else body.addShape(new CANNON.Box(new CANNON.Vec3(sx / 2, Math.max(sy, 0.03) / 2, sz / 2)));
    body.position.set((Math.random() * 2 - 1) * (W - 1.0), 10 + Math.random() * 4, (Math.random() * 2 - 1) * (Dz - 0.6));
    body.quaternion.setFromEuler(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
    body.velocity.set((Math.random() - 0.5) * 1.5, -3 - Math.random() * 3, 0);
    body.angularVelocity.set((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);
    world.addBody(body);
    bodies.push({ body, mesh });
  }
  function clear() {
    for (const { body, mesh } of bodies) { world.removeBody(body); scene.remove(mesh); }
    bodies = [];
  }
  function pour() {
    clear();
    if (dropping) { world.addBody(ground); walls.forEach((b) => world.addBody(b)); dropping = false; }
    // waves: bags and books first, boxes in the middle, cards and Baby Dia last
    const order = (k) => ({ bag: 0, book: 1, box1: 2, box2: 2, devil: 3, cardA: 3, cardB: 3 }[k] + Math.random() * 1.6);
    queue = Array.from({ length: COUNT }, pick).map((k) => ({ k, o: order(k) })).sort((a, b) => a.o - b.o)
      .map((s, i) => ({ k: s.k, at: (i / COUNT) * POUR * (0.85 + Math.random() * 0.15) }));
    simT = 0; quiet = 0;
    wake();
  }
  /* the heap falls away through the floor (used to close the loop of the recorded tile) */
  function drop() {
    if (dropping) return;
    dropping = true;
    world.removeBody(ground); walls.forEach((b) => world.removeBody(b));
    bodies.forEach(({ body }) => body.wakeUp());
    wake();
  }
  function settle(n = 900) {          // build the settled heap without showing the fall
    pour();
    for (const s of queue) spawn(s.k);
    queue = [];
    for (let i = 0; i < n; i++) world.step(1 / 120);
    sync(); draw();
  }
  function sync() { for (const { body, mesh } of bodies) { mesh.position.copy(body.position); mesh.quaternion.copy(body.quaternion); } }
  function draw() { renderer.render(scene, camera); }
  function step(dt) {
    simT += dt;
    while (queue.length && queue[0].at <= simT) spawn(queue.shift().k);
    world.step(1 / 120, dt, 6);
    sync(); draw();
    const asleep = !queue.length && bodies.every(({ body }) => body.sleepState === CANNON.Body.SLEEPING || body.position.y < -20);
    quiet = asleep ? quiet + dt : 0;
    return quiet > 0.5;
  }

  /* loop: only while visible, tab shown and something still moves */
  let raf = 0, last = 0, visible = false, started = false, alive = true;
  function frame(now) {
    raf = 0;
    if (!alive) return;
    const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
    const done = step(dt || 1 / 60);
    if (!done && visible && !document.hidden) raf = requestAnimationFrame(frame);
  }
  function wake() { if (!manual && alive && visible && !document.hidden && !raf) { last = 0; raf = requestAnimationFrame(frame); } }
  function sleep() { if (raf) cancelAnimationFrame(raf); raf = 0; }

  host.appendChild(canvas);
  resize();
  const ro = new ResizeObserver(resize); ro.observe(host);
  const io = new IntersectionObserver((es) => {
    visible = es[es.length - 1].isIntersecting;
    if (visible && !started && !manual) { started = true; pour(); host.classList.add('is-live'); }
    visible ? wake() : sleep();
  }, { threshold: 0.15 });
  io.observe(host);
  const onVis = () => (document.hidden ? sleep() : wake());
  document.addEventListener('visibilitychange', onVis);
  const onDown = (e) => { if (e.button > 0) return; pour(); };
  canvas.addEventListener('pointerdown', onDown);
  const ctx = renderer.getContext();
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); sleep(); host.classList.remove('is-live'); });

  return {
    pour, drop, settle, step, draw,
    snapshot: () => canvas.toDataURL('image/png'),
    dispose() {
      alive = false; sleep();
      ro.disconnect(); io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('pointerdown', onDown);
      clear();
      geos.forEach((g) => g.dispose()); mats.forEach((m) => m.dispose()); disposables.forEach((t) => t.dispose());
      renderer.dispose();
      const lose = ctx && ctx.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext();
      canvas.remove();
      host.classList.remove('is-live');
    }
  };
}
