// =====================================================================
// GROK LAND 2 props (static ones go to W.deco and get batched)
// =====================================================================
Object.assign(STYLE, {
  park: { side: 0x9a6a40, top: 0x5fcf4a, cap: 0.5 },
  path: { side: 0xbfa77a, top: 0xe8d6a8, cap: 0 },
  barn: { side: 0xb83a2e, top: 0x7a2a22, cap: 0.3 },
  hay: { side: 0xe8c55a, top: 0xf4d978, cap: 0.12 },
  mesa: { side: 0xc8643a, top: 0xe8a060, cap: 0.4 },
  redrock: { side: 0xa84a2a, top: 0xd07a48, cap: 0.3 },
  desert: { side: 0xc8915a, top: 0xf0cf8e, cap: 0.4 },
  mine: { side: 0x6a4a32, top: 0x8a6a4a, cap: 0.2 },
  lab: { side: 0xc8ccd8, top: 0xeef0f6, cap: 0.18 },
  cheese: { side: 0xf5c542, top: 0xffdf6e, cap: 0.15, emissive: 0x2a1a00 },
  tech: { side: 0x3a7a5a, top: 0x9ee6b8, cap: 0.18 },
  shell: { side: 0x8a6a3a, top: 0xc8a060, cap: 0.25 },
});
// a static, batched ground/wall block (no per-frame cost, joins the merged mesh)
const PRISM = (() => { const g = new THREE.CylinderGeometry(1 / 1.732, 1 / 1.732, 1, 3); g.rotateZ(Math.PI / 2); g.rotateX(-Math.PI / 2); g.translate(0, 0.2887, 0); return g; })();
function gnd(x, top, z, w, d, h, style) {
  h = h || 1;
  const mesh = styledMesh(w, h, d, style);
  mesh.position.set(x, top - h / 2, z);
  (W.deco || W.root).add(mesh);
  const s = addSolid(x, top - h / 2, z, w / 2, h / 2, d / 2, 'static', null);
  s.style = style;
  return s;
}
// stair ramp from (z0, y0) to (z1, y1) along -z, each step <= 0.3 high so you run straight up it
function stairs(x, z0, z1, y0, y1, w, style, base) {
  const n = Math.max(1, Math.ceil((y1 - y0) / 0.3));
  const dz = (z1 - z0) / n;
  for (let i = 0; i < n; i++) {
    const top = y0 + (y1 - y0) * (i + 1) / n;
    gnd(x, top, z0 + dz * (i + 0.5), w, Math.abs(dz) + 0.02, top - (base === undefined ? y0 - 4 : base), style);
  }
}
function dTree(x, top, z, s, leaf) {
  s = s || 1;
  const t = buildTree(s, leaf); deco(t, x, top, z, (x * 7 + z * 3) % TAU);
  addSolid(x, top + 1.2 * s, z, 0.3 * s, 1.2 * s, 0.3 * s, 'static', null).noCam = true;
}
function dPine(x, top, z, s, col) {
  s = s || 1;
  const g = new THREE.Group();
  const trunk = M(G.cyl8, 0x7a4a24, 0.2 * s, 1 * s, 0.2 * s); trunk.position.y = 0.5 * s; g.add(trunk);
  for (let i = 0; i < 3; i++) { const c = M(G.cone, col || [0x2f8a4a, 0x3a9a55, 0x2a7a40][i], (1.3 - i * 0.3) * s, 1.5 * s, (1.3 - i * 0.3) * s); c.position.y = (1.3 + i * 0.85) * s; g.add(c); }
  deco(g, x, top, z);
  addSolid(x, top + 1.2 * s, z, 0.3 * s, 1.2 * s, 0.3 * s, 'static', null).noCam = true;
}
function dLamp(x, top, z, col) {
  const g = new THREE.Group();
  const post = M(G.cyl8, 0x2b2f48, 0.08, 3, 0.08); post.position.y = 1.5; g.add(post);
  const base = M(G.cyl8, 0x2b2f48, 0.2, 0.3, 0.2); base.position.y = 0.15; g.add(base);
  const arm = M(G.box, 0x2b2f48, 0.6, 0.06, 0.06); arm.position.set(0.25, 2.95, 0); g.add(arm);
  const lamp = new THREE.Mesh(G.sphereLo, basic(col || 0xfff1b0)); lamp.scale.set(0.22, 0.18, 0.22); lamp.position.set(0.5, 2.82, 0); g.add(lamp);
  const cap = M(G.cone6, 0x2b2f48, 0.28, 0.2, 0.28); cap.position.set(0.5, 3.0, 0); g.add(cap);
  deco(g, x, top, z, x > 0 ? Math.PI : 0);
  addSolid(x, top + 1.5, z, 0.12, 1.5, 0.12, 'static', null).noCam = true;
}
function dFence(x1, z1, x2, z2, top, col) {
  const L = Math.hypot(x2 - x1, z2 - z1), n = Math.max(1, Math.round(L / 2.2));
  const c = col || 0xf4efe6;
  for (let i = 0; i <= n; i++) { const t = i / n; const p = M(G.box, c, 0.18, 1.1, 0.18); p.position.set(lerp(x1, x2, t), top + 0.55, lerp(z1, z2, t)); (W.deco || W.root).add(p); }
  const a = Math.atan2(x2 - x1, z2 - z1);
  for (const hy of [0.45, 0.85]) { const r = M(G.box, c, 0.08, 0.12, L); r.position.set((x1 + x2) / 2, top + hy, (z1 + z2) / 2); r.rotation.y = a; (W.deco || W.root).add(r); }
  // thin solid so you can't pass, but it is low enough to hop
  const ax = Math.abs(x2 - x1) > Math.abs(z2 - z1);
  addSolid((x1 + x2) / 2, top + 0.55, (z1 + z2) / 2, ax ? L / 2 : 0.12, 0.55, ax ? 0.12 : L / 2, 'static', null).noCam = true;
}
const FLOWER_SET = [0xff5a8a, 0xffffff, 0xff9d2e, 0xb06bff, 0xffe14a];
function dFlowerBed(x, top, z, w, d, seed) {
  const r = mulberry(seed || (x * 31 + z * 17) | 0);
  const g = new THREE.Group();
  const soil = M(G.box, 0x6a4128, w, 0.18, d); soil.position.y = 0.09; g.add(soil);
  for (const [sx, sz, lw, ld] of [[0, d / 2, w + 0.2, 0.2], [0, -d / 2, w + 0.2, 0.2], [w / 2, 0, 0.2, d], [-w / 2, 0, 0.2, d]]) { const b = M(G.box, 0xc98a4b, lw, 0.3, ld); b.position.set(sx, 0.15, sz); g.add(b); }
  const nx = Math.max(1, Math.floor(w / 0.6)), nz = Math.max(1, Math.floor(d / 0.6));
  const col = FLOWER_SET[(r() * FLOWER_SET.length) | 0], col2 = FLOWER_SET[(r() * FLOWER_SET.length) | 0];
  for (let i = 0; i < nx; i++) for (let k = 0; k < nz; k++) { const f = buildFlower((i + k) % 2 ? col : col2); f.position.set(-w / 2 + (i + 0.5) * w / nx, 0.15, -d / 2 + (k + 0.5) * d / nz); g.add(f); }
  deco(g, x, top, z);
}
function dRocks(x, top, z, n, seed, col) {
  const r = mulberry(seed || 3);
  for (let i = 0; i < n; i++) { const s = 0.4 + r() * 0.9; const m = M(G.dodeca, col || [0x9a9a9a, 0x8a8f99, 0xb0aaa0][i % 3], s, s * 0.7, s); m.position.set(x + (r() - 0.5) * 3, top + s * 0.3, z + (r() - 0.5) * 3); m.rotation.set(r() * 3, r() * 3, 0); (W.deco || W.root).add(m); }
}
function dBench(x, top, z, ry) {
  const g = new THREE.Group();
  const seat = M(G.box, 0xc07f3f, 1.8, 0.1, 0.5); seat.position.y = 0.5; g.add(seat);
  const back = M(G.box, 0xc07f3f, 1.8, 0.45, 0.08); back.position.set(0, 0.8, -0.22); g.add(back);
  for (const s of [-0.75, 0.75]) { const l = M(G.box, 0x2b2f48, 0.08, 0.5, 0.45); l.position.set(s, 0.25, 0); g.add(l); }
  deco(g, x, top, z, ry);
}
function dPicnic(x, top, z, ry, cloth) {
  const g = new THREE.Group();
  const t = M(G.box, 0xc07f3f, 1.4, 0.1, 2.2); t.position.y = 0.8; g.add(t);
  const cl = M(G.box, cloth || 0xff4d4d, 1.2, 0.02, 1.4); cl.position.y = 0.86; g.add(cl);
  for (const s of [-1, 1]) { const b = M(G.box, 0xa86b3c, 0.4, 0.08, 2.2); b.position.set(s * 1.0, 0.45, 0); g.add(b); const l = M(G.box, 0x7a4a24, 0.1, 0.8, 0.1); l.position.set(s * 0.5, 0.4, 0.9); g.add(l); const l2 = l.clone(); l2.position.z = -0.9; g.add(l2); }
  const basket = M(G.box, 0xd89a48, 0.4, 0.3, 0.3); basket.position.set(0.2, 1.0, 0.3); g.add(basket);
  const pie = M(G.cyl, 0xe8a060, 0.22, 0.08, 0.22); pie.position.set(-0.3, 0.92, -0.4); g.add(pie);
  deco(g, x, top, z, ry);
  addSolid(x, top + 0.45, z, 0.9, 0.45, 0.9, 'static', null).noCam = true;
}
function signTex(text, bg, fg) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 128;
  const g = c.getContext('2d'); g.fillStyle = bg || '#c98a4b'; g.fillRect(0, 0, 256, 128);
  g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 8; g.strokeRect(4, 4, 248, 120);
  g.fillStyle = fg || '#fff6d0'; g.textAlign = 'center'; g.textBaseline = 'middle';
  let fs = 48; g.font = 'bold ' + fs + 'px "Trebuchet MS",Arial';
  while (g.measureText(text).width > 228 && fs > 18) { fs -= 2; g.font = 'bold ' + fs + 'px "Trebuchet MS",Arial'; }
  g.fillText(text, 128, 66);
  return new THREE.CanvasTexture(c);
}
// signboard: the 2:1 canvas sits on a 2:1 board, so the words are never stretched
function dSign(x, top, z, ry, text, bg, w) {
  w = w || 2.4;
  const g = new THREE.Group();
  for (const s of [-1, 1]) { const p = M(G.box, 0x7a4a24, 0.14, 2, 0.14); p.position.set(s * w * 0.4, 1, 0); g.add(p); }
  const tm = new THREE.MeshBasicMaterial({ map: signTex(text, bg) });
  const board = new THREE.Mesh(new THREE.PlaneGeometry(w, w / 2), tm); board.position.set(0, 1.9, 0.08); board.userData.noMerge = true; g.add(board);
  const back = M(G.box, 0x7a4a24, w + 0.1, w / 2 + 0.1, 0.12); back.position.set(0, 1.9, 0); g.add(back);
  g.position.set(x, top, z); g.rotation.y = ry || 0; W.root.add(g);
}
function dHay(x, top, z, w, d, h) { return gnd(x, top + (h || 1.4), z, w || 2, d || 2, h || 1.4, 'hay'); }
function dBarn(x, top, z, w, d, h, ry) {
  const s = gnd(x, top + h, z, w, d, h, 'barn');
  const roof = new THREE.Group();
  const pr = new THREE.Mesh(PRISM, mat(0x5a2a22)); pr.scale.set(w + 0.5, h * 0.55, d + 0.5); roof.add(pr);
  const ridge = M(G.box, 0xf4efe6, w + 0.7, 0.18, 0.3); ridge.position.y = h * 0.55 * 0.866 + 0.05; roof.add(ridge);
  const gab = new THREE.Mesh(PRISM, mat(0xb83a2e)); gab.scale.set(w + 0.02, h * 0.55 - 0.1, d - 0.2); roof.add(gab);
  void ry;
  // big doors and windows painted on (the barn is closed: nothing inside to walk into)
  const door = M(G.box, 0xf4efe6, 3.2, 3.4, 0.12); door.position.set(0, 1.7, d / 2 + 0.06); const door2 = M(G.box, 0x8a2a20, 2.8, 3.0, 0.14); door2.position.set(0, 1.6, d / 2 + 0.07);
  const xb = M(G.box, 0xf4efe6, 0.16, 3.6, 0.16); xb.rotation.z = 0.7; xb.position.set(0, 1.6, d / 2 + 0.12); const xb2 = xb.clone(); xb2.rotation.z = -0.7;
  const win = M(G.box, 0xf4efe6, 1.4, 1.2, 0.12); win.position.set(0, h - 1.2, d / 2 + 0.06); const win2 = M(G.box, 0x2b2f48, 1.1, 0.9, 0.14); win2.position.set(0, h - 1.2, d / 2 + 0.07);
  const g = new THREE.Group(); [door, door2, xb, xb2, win, win2].forEach((m) => g.add(m));
  deco(g, x, top, z);
  roof.position.set(x, top + h, z); (W.deco || W.root).add(roof);
  return s;
}
function addWindmill(x, top, z, h) {
  h = h || 9;
  const tower = new THREE.Group();
  const body = M(G.cyl8, 0xf4efe6, 1.6, h, 2.2); body.position.y = h / 2; tower.add(body);
  const cap = M(G.cone, 0x7a2a22, 2.0, 2, 2.0); cap.position.y = h + 1; tower.add(cap);
  const door = M(G.box, 0x7a4a24, 1, 1.8, 0.2); door.position.set(0, 0.9, 2.05); tower.add(door);
  deco(tower, x, top, z);
  addSolid(x, top + h / 2, z, 1.7, h / 2, 1.7, 'static', null);
  const hub = new THREE.Group(); hub.position.set(x, top + h - 0.5, z + 2.3); W.root.add(hub);
  for (let i = 0; i < 4; i++) { const b = M(G.box, 0xf4efe6, 0.7, 4.6, 0.08); b.position.y = 2.4; const arm = new THREE.Group(); arm.rotation.z = i * Math.PI / 2; arm.add(b); const lat = M(G.box, 0xc98a4b, 0.1, 4.4, 0.1); lat.position.set(-0.3, 2.4, 0.05); arm.add(lat); hub.add(arm); }
  W.things.push({ update(dt) { hub.rotation.z += dt * 0.8; } });
}
function dBleachers(x, top, z, w, ry) {
  const g = new THREE.Group();
  for (let i = 0; i < 4; i++) { const st = M(G.box, i % 2 ? 0x3b8bff : 0xf4efe6, w, 0.4 + i * 0.5, 1); st.position.set(0, (0.4 + i * 0.5) / 2, -i * 1); g.add(st); }
  const r = mulberry(w * 13 | 0);
  for (let i = 0; i < Math.floor(w * 1.2); i++) { // a little cheering crowd
    const row = (r() * 4) | 0, fx = -w / 2 + 0.5 + r() * (w - 1);
    const b = M(G.sphereLo, [0xff4d4d, 0xffd23f, 0x59d65a, 0x38b6ff, 0xff6bd6][i % 5], 0.22, 0.3, 0.2); b.position.set(fx, 0.4 + row * 0.5 + 0.35, -row * 1); g.add(b);
    const hd = M(G.sphereLo, 0xffc996, 0.17); hd.position.set(fx, 0.4 + row * 0.5 + 0.75, -row * 1); g.add(hd);
  }
  deco(g, x, top, z, ry);
}
function dFlagLine(x1, z1, x2, z2, y) {
  const n = Math.max(2, Math.round(Math.hypot(x2 - x1, z2 - z1) / 1.2));
  const cols = [0xff4d4d, 0xffd23f, 0x59d65a, 0x38b6ff, 0xff6bd6];
  for (let i = 0; i < n; i++) { const t = (i + 0.5) / n; const f = M(G.cone6, cols[i % 5], 0.25, 0.5, 0.06); f.rotation.x = Math.PI; f.position.set(lerp(x1, x2, t), y - Math.sin(t * Math.PI) * 0.8, lerp(z1, z2, t)); (W.deco || W.root).add(f); }
}
function dCrops(x, top, z, w, d, col) {
  const g = new THREE.Group();
  for (let i = 0; i < Math.floor(w / 1.2); i++) {
    const row = M(G.box, 0x6a4128, 0.8, 0.3, d); row.position.set(-w / 2 + 0.6 + i * 1.2, 0.15, 0); g.add(row);
    for (let k = 0; k < Math.floor(d / 0.9); k++) { const p = M(G.ico, col || 0x59d65a, 0.28); p.position.set(-w / 2 + 0.6 + i * 1.2, 0.5, -d / 2 + 0.45 + k * 0.9); g.add(p); }
  }
  deco(g, x, top, z);
}
function dHedgeWall(x, top, z, w, d, h) { return gnd(x, top + (h || 2.4), z, w, d, h || 2.4, 'hedge'); }
function dArch(x, top, z, w, text, col) {
  for (const s of [-1, 1]) gnd(x + s * w / 2, top + 5, z, 1.2, 1.2, 5, 'stone');
  const beam = M(G.box, col || 0x3b8bff, w + 1.6, 1.0, 1.0); beam.position.set(x, top + 5.5, z); (W.deco || W.root).add(beam);
  const tm = new THREE.MeshBasicMaterial({ map: signTex(text, '#1b1440', '#ffe14d') });
  for (const s of [-1, 1]) { const b = new THREE.Mesh(new THREE.PlaneGeometry(4, 2), tm); b.position.set(x, top + 5.5, z + s * 0.52); if (s < 0) b.rotation.y = Math.PI; W.root.add(b); }
}
