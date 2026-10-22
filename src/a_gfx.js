// =====================================================================
// GROK LAND 2 graphics: world-space textures (never stretched), baked
// ambient-occlusion gradients, and static batching for dense worlds.
// =====================================================================
function noiseCanvas(size, draw) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d'); draw(g, size, mulberry(size * 7 + draw.length));
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = IS_TOUCH ? 1 : 4;
  return t;
}
// grayscale patterns; the material colour tints them
const PAT = {
  grass: noiseCanvas(128, (g, s, r) => {
    g.fillStyle = '#e6e6e6'; g.fillRect(0, 0, s, s);
    for (let i = 0; i < 520; i++) { const v = 200 + (r() * 55) | 0; g.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; const x = r() * s, y = r() * s; g.fillRect(x, y, 1.5, 3 + r() * 4); }
    for (let i = 0; i < 160; i++) { const v = 255; g.fillStyle = 'rgba(' + v + ',' + v + ',' + v + ',.55)'; g.fillRect(r() * s, r() * s, 1, 2); }
    for (let i = 0; i < 70; i++) { g.fillStyle = 'rgba(120,120,120,.25)'; g.beginPath(); g.arc(r() * s, r() * s, 2 + r() * 5, 0, TAU); g.fill(); }
  }),
  speck: noiseCanvas(128, (g, s, r) => {
    g.fillStyle = '#e8e8e8'; g.fillRect(0, 0, s, s);
    for (let i = 0; i < 900; i++) { const v = 185 + (r() * 70) | 0; g.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; g.fillRect(r() * s, r() * s, 1 + r() * 2, 1 + r() * 2); }
  }),
  strata: noiseCanvas(128, (g, s, r) => {
    g.fillStyle = '#e4e4e4'; g.fillRect(0, 0, s, s);
    for (let y = 0; y < s; y += 6 + (r() * 10 | 0)) { const v = 190 + (r() * 60) | 0; g.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; g.fillRect(0, y, s, 2 + r() * 4); }
    for (let i = 0; i < 260; i++) { const v = 170 + (r() * 80) | 0; g.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; g.beginPath(); g.arc(r() * s, r() * s, 0.8 + r() * 2.2, 0, TAU); g.fill(); }
  }),
  brick: noiseCanvas(128, (g, s, r) => {
    g.fillStyle = '#b8b8b8'; g.fillRect(0, 0, s, s);
    const bh = 16, bw = 32;
    for (let row = 0; row < s / bh; row++) for (let col = -1; col < s / bw + 1; col++) {
      const x = col * bw + (row % 2 ? bw / 2 : 0), v = 215 + (r() * 40) | 0;
      g.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; g.fillRect(x + 1.5, row * bh + 1.5, bw - 3, bh - 3);
      g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(x + 2, row * bh + 2, bw - 4, 2);
    }
  }),
  plank: noiseCanvas(128, (g, s, r) => {
    g.fillStyle = '#d8d8d8'; g.fillRect(0, 0, s, s);
    for (let x = 0; x < s; x += 32) {
      const v = 210 + (r() * 40) | 0; g.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; g.fillRect(x + 1, 0, 30, s);
      g.fillStyle = 'rgba(90,90,90,.35)'; for (let k = 0; k < 7; k++) g.fillRect(x + 3 + r() * 24, r() * s, 1, 10 + r() * 30);
      g.fillStyle = '#8a8a8a'; g.fillRect(x, 0, 1.5, s);
      g.fillStyle = '#9a9a9a'; g.fillRect(x + 6, (r() * s) | 0, 3, 3); g.fillRect(x + 22, (r() * s) | 0, 3, 3);
    }
  }),
  panel: noiseCanvas(128, (g, s, r) => {
    g.fillStyle = '#d4d4d4'; g.fillRect(0, 0, s, s);
    g.strokeStyle = '#8c8c8c'; g.lineWidth = 2; g.strokeRect(2, 2, s / 2 - 4, s / 2 - 4); g.strokeRect(s / 2 + 2, 2, s / 2 - 4, s / 2 - 4); g.strokeRect(2, s / 2 + 2, s - 4, s / 2 - 4);
    g.fillStyle = '#a0a0a0'; for (const [x, y] of [[8, 8], [s / 2 - 8, 8], [s / 2 + 8, 8], [s - 8, 8], [8, s / 2 + 8], [s - 8, s / 2 + 8], [8, s - 8], [s - 8, s - 8]]) { g.beginPath(); g.arc(x, y, 2.5, 0, TAU); g.fill(); }
    for (let i = 0; i < 300; i++) { g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(r() * s, r() * s, 2, 1); }
  }),
  snow: noiseCanvas(128, (g, s, r) => {
    g.fillStyle = '#f2f2f2'; g.fillRect(0, 0, s, s);
    for (let i = 0; i < 400; i++) { const v = 215 + (r() * 40) | 0; g.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; g.beginPath(); g.arc(r() * s, r() * s, 1 + r() * 3, 0, TAU); g.fill(); }
    for (let i = 0; i < 60; i++) { g.fillStyle = '#ffffff'; g.fillRect(r() * s, r() * s, 1.5, 1.5); }
  }),
  tile: noiseCanvas(128, (g, s, r) => {
    g.fillStyle = '#a8a8a8'; g.fillRect(0, 0, s, s);
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { const v = 222 + (r() * 30) | 0; g.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; g.fillRect(x * 32 + 1.5, y * 32 + 1.5, 29, 29); }
  }),
};
// which pattern each block style wears on its top cap and its sides (tile size in world units)
const STYLE_PAT = {
  grass: ['grass', 'strata', 5], meadow: ['grass', 'strata', 5], stone: ['brick', 'brick', 3], castle: ['brick', 'brick', 3], brick: ['brick', 'brick', 3],
  wood: ['plank', 'plank', 3], fall: ['plank', 'plank', 3], block: ['speck', 'speck', 2], hedge: ['grass', 'grass', 3], dark: ['brick', 'brick', 3],
  snow: ['snow', 'strata', 5], ice: ['speck', 'speck', 4], rock: ['snow', 'strata', 5], grave: ['grass', 'strata', 5], manor: ['plank', 'brick', 3],
  metal: ['panel', 'panel', 3], brass: ['panel', 'panel', 3], sand: ['speck', 'strata', 5], reef: ['speck', 'strata', 5], coral: ['speck', 'speck', 3],
  moon: ['speck', 'strata', 5], hull: ['panel', 'panel', 3], neon: ['panel', 'panel', 3], tide: ['speck', 'speck', 3],
  mesa: ['speck', 'strata', 6], redrock: ['strata', 'strata', 5], desert: ['speck', 'strata', 6], mine: ['plank', 'strata', 4], lab: ['tile', 'panel', 3],
  cheese: ['speck', 'speck', 3], shell: ['tile', 'panel', 3], path: ['speck', 'speck', 3], tech: ['tile', 'panel', 3], park: ['grass', 'strata', 6],
};
const texMatCache = new Map();
function texMat(color, pat, o) {
  const key = color + '|' + pat + '|' + JSON.stringify(o || {});
  let m = texMatCache.get(key);
  if (m) return m;
  const p = Object.assign({ color, map: PAT[pat] || null, vertexColors: true }, o || {});
  if (IS_TOUCH) { delete p.roughness; delete p.metalness; m = new THREE.MeshLambertMaterial(p); }
  else m = new THREE.MeshStandardMaterial(Object.assign({ roughness: 0.85, metalness: 0 }, p));
  texMatCache.set(key, m);
  return m;
}
// A box geometry in real units with UVs in world units (tile = metres per texture repeat),
// so textures keep their aspect ratio on every face, plus a baked bottom-dark AO gradient.
const boxGeoCache = new Map();
function boxGeoUV(w, h, d, tile, aoLo) {
  const key = w.toFixed(2) + ',' + h.toFixed(2) + ',' + d.toFixed(2) + ',' + tile + ',' + (aoLo || 0);
  let g = boxGeoCache.get(key);
  if (g) return g;
  g = new THREE.BoxGeometry(w, h, d);
  const uv = g.attributes.uv, pos = g.attributes.position, n = pos.count;
  const col = new Float32Array(n * 3);
  const lo = aoLo === undefined || aoLo === 0 ? 0.6 : aoLo;
  for (let i = 0; i < n; i++) {
    const face = Math.floor(i / 4); // +x,-x,+y,-y,+z,-z
    const fw = face < 2 ? d : w, fh = face === 2 || face === 3 ? d : h;
    uv.setXY(i, uv.getX(i) * fw / tile, uv.getY(i) * fh / tile);
    const k = h > 0 ? Math.min(1, Math.max(0, (pos.getY(i) + h / 2) / h)) : 1;
    const v = face === 2 ? 1 : face === 3 ? lo : lo + (1 - lo) * Math.pow(k, 0.7);
    col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = v;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  boxGeoCache.set(key, g);
  return g;
}
// Static batching: everything put in W.deco is merged per material after the level is built.
function mergeStatic(group) {
  group.updateMatrixWorld(true);
  const buckets = new Map();
  const leftovers = [];
  group.traverse((o) => {
    if (!o.isMesh || Array.isArray(o.material) || o.userData.noMerge) return;
    const m = o.material;
    if (m.transparent || m.isSpriteMaterial) { leftovers.push(o); return; }
    let b = buckets.get(m); if (!b) { b = []; buckets.set(m, b); } b.push(o);
  });
  const out = new THREE.Group();
  let verts = 0;
  for (const [m, list] of buckets) {
    if (list.length < 2) { for (const o of list) leftovers.push(o); continue; }
    const needUV = !!m.map, needCol = !!m.vertexColors;
    let total = 0;
    const geos = list.map((o) => { let g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone(); g.applyMatrix4(o.matrixWorld); total += g.attributes.position.count; return g; });
    const P3 = new Float32Array(total * 3), N3 = new Float32Array(total * 3), C3 = needCol ? new Float32Array(total * 3) : null, U2 = needUV ? new Float32Array(total * 2) : null;
    let off = 0;
    for (const g of geos) {
      const c = g.attributes.position.count;
      P3.set(g.attributes.position.array, off * 3);
      if (g.attributes.normal) N3.set(g.attributes.normal.array, off * 3);
      if (C3) { if (g.attributes.color) C3.set(g.attributes.color.array, off * 3); else C3.fill(1, off * 3, (off + c) * 3); }
      if (U2 && g.attributes.uv) U2.set(g.attributes.uv.array, off * 2);
      off += c; g.dispose();
    }
    const mg = new THREE.BufferGeometry();
    mg.setAttribute('position', new THREE.BufferAttribute(P3, 3));
    mg.setAttribute('normal', new THREE.BufferAttribute(N3, 3));
    if (C3) mg.setAttribute('color', new THREE.BufferAttribute(C3, 3));
    if (U2) mg.setAttribute('uv', new THREE.BufferAttribute(U2, 2));
    mg.computeBoundingSphere();
    const mesh = new THREE.Mesh(mg, m);
    if (SHADOWS) { mesh.castShadow = true; mesh.receiveShadow = true; }
    out.add(mesh); verts += total;
  }
  for (const o of leftovers) { o.updateMatrixWorld(true); const c = o.clone(); o.matrixWorld.decompose(c.position, c.quaternion, c.scale); out.add(c); }
  W.mergedGeos = (W.mergedGeos || []);
  out.traverse((o) => { if (o.isMesh && o.geometry && !o.geometry.parameters) W.mergedGeos.push(o.geometry); });
  return { group: out, verts, buckets: buckets.size };
}
// put a static prop into the batch group
function deco(obj, x, y, z, ry, s) { obj.position.set(x, y, z); if (ry) obj.rotation.y = ry; if (s) obj.scale.setScalar(s); (W.deco || W.root).add(obj); return obj; }
