// ===== Boost Zone gap scenery: real water + things that belong there =====
function gapWaterSurface(deep, light) {
  if (!W.water) return;
  const tex = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#' + deep.toString(16).padStart(6, '0'); g.fillRect(0, 0, w, h);
    const r = mulberry(91); g.lineCap = 'round';
    for (let i = 0; i < 46; i++) {
      const x = r() * w, y = r() * h, L = 18 + r() * 34;
      g.strokeStyle = i % 3 ? 'rgba(255,255,255,0.20)' : '#' + light.toString(16).padStart(6, '0');
      g.lineWidth = 2 + r() * 2.5;
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + L / 2, y - 5, x + L, y); g.stroke();
      if (x + L > w) { g.beginPath(); g.moveTo(x - w, y); g.quadraticCurveTo(x - w + L / 2, y - 5, x - w + L, y); g.stroke(); }
    }
  });
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(140, 140);
  if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
  const o = { color: 0xffffff, map: tex, transparent: true, opacity: 0.94 };
  W.water.material = IS_TOUCH ? new THREE.MeshLambertMaterial(o) : new THREE.MeshStandardMaterial(Object.assign(o, { roughness: 0.18, metalness: 0.15 }));
  W.waterTex = tex;
}
function gapAdd(geo, col, sx, sy, sz, x, y, z, rx, ry, rz) { const m = M(geo, col, sx, sy, sz); m.position.set(x, y, z); if (rx || ry || rz) m.rotation.set(rx || 0, ry || 0, rz || 0); W.deco.add(m); return m; }
function gapRock(x, z, s, col) { return gapAdd(G.dodeca, col, s, s * 0.55, s * 1.1, x, -3.25 + s * 0.15, z, 0, x * 0.37 + z, 0); }

// ---- CANYON: river with banks, cliffs, rocks, a wooden bridge and a mine trestle ----
function gapRiver(z0, z1, seed, trestleSide) {
  const r = mulberry(seed), L = z0 - z1, zc = (z0 + z1) / 2;
  for (const s of [-1, 1]) {
    // sandy bank + continuous cliff wall, no lone spires
    gapAdd(G.box, 0xe2b77c, 9, 0.6, L + 6, s * 24.5, -3.1, zc);
    gapAdd(G.box, 0xcf9a5e, 1.2, 0.3, L + 6, s * 20.2, -3.25, zc);
    for (let z = z0 + 2; z > z1 - 2; z -= 13) { const h = 9 + r() * 6; const m = styledMesh(9, h, 14, r() < 0.5 ? 'redrock' : 'mesa'); m.position.set(s * 33, h / 2 - 3.3, z - 6); W.deco.add(m); }
    for (let z = z0 - 5; z > z1 + 3; z -= 7 + r() * 5) {
      dRocks(s * (22 + r() * 5), -2.8, z, 2, (seed * 7 + z) | 0, 0xb5653a);
      if (r() < 0.45) dCactus(s * (25 + r() * 3), -2.8, z - 2, 0.8 + r() * 0.4);
      for (let k = 0; k < 3; k++) gapAdd(G.cone6, 0x7da04a, 0.12, 1 + r() * 0.6, 0.12, s * (20 + r() * 1.2), -2.7, z + r() * 3);
    }
    // half-sunk river boulders with foam rings, kept off the rail line
    for (let z = z0 - 8; z > z1 + 6; z -= 10 + r() * 6) {
      const x = s * (12 + r() * 6), sc = 1 + r() * 1.3; gapRock(x, z, sc, [0xa65a35, 0x8f5a3c, 0xb8704a][(r() * 3) | 0]);
      gapAdd(G.circle, 0xe9fbff, sc * 1.25, 1, sc * 1.25, x, -3.18, z).material = basic(0xe9fbff, { transparent: true, opacity: 0.55 });
    }
  }
  // wooden footbridge across the river, low under the rail
  const bz = z1 + L * 0.3;
  gapAdd(G.box, 0x9a6232, 41, 0.3, 3, 0, -1.7, bz);
  for (let x = -19.5; x <= 19.5; x += 1.1) gapAdd(G.box, x % 2.2 < 1.1 ? 0x8a5528 : 0xa86b37, 0.9, 0.08, 3.1, x, -1.52, bz);
  for (const e of [-1, 1]) {
    gapAdd(G.box, 0x6b3b1f, 41, 0.14, 0.14, 0, -0.6, bz + e * 1.45);
    for (let x = -20; x <= 20; x += 5) { gapAdd(G.box, 0x6b3b1f, 0.22, 1.1, 0.22, x, -1.0, bz + e * 1.45); gapAdd(G.cyl8, 0x5a3a22, 0.3, 2.2, 0.3, x, -2.7, bz + e * 1.2); }
  }
  // mine trestle carrying an ore line along the river
  const tx = trestleSide * 17, top = 1.0;
  for (let z = z0 - 2; z >= z1 + 2; z -= 6) {
    for (const e of [-1, 1]) gapAdd(G.box, 0x7a4a24, 0.45, top + 3.3, 0.45, tx + e * 1.4, (top - 3.3) / 2, z);
    gapAdd(G.box, 0x6b3b1f, 3.4, 0.35, 0.4, tx, top - 0.2, z);
    gapAdd(G.box, 0x6b3b1f, 0.22, 4.8, 0.22, tx, -1.2, z, 0, 0, 0.72);
    gapAdd(G.box, 0x6b3b1f, 0.22, 4.8, 0.22, tx, -1.2, z, 0, 0, -0.72);
  }
  gapAdd(G.box, 0x7a4a24, 3.2, 0.3, L - 2, tx, top, zc);
  for (let z = z0 - 1.5; z >= z1 + 1.5; z -= 1.4) gapAdd(G.box, 0x5a3a22, 2.4, 0.12, 0.4, tx, top + 0.2, z);
  for (const e of [-0.55, 0.55]) gapAdd(G.box, 0x9aa0a8, 0.12, 0.14, L - 2, tx + e, top + 0.33, zc);
  for (const f of [0.3, 0.68]) { const c = dMinecart(null); deco(c, tx, top + 0.25, z1 + L * f); }
  dSign(tx - trestleSide * 2.4, top + 0.15, z0 - 4, trestleSide * 0.4, 'ORE LINE', '#7a3a1a');
}

// ---- SPEEDWAY: Tortuga Tech test lake with docks, grandstand, pit garage, test tower ----
function gapPier(x, z, w, d, y) {
  gapAdd(G.box, 0x9a7048, w, 0.3, d, x, y, z);
  for (let i = -d / 2 + 0.6; i < d / 2; i += 1.2) gapAdd(G.box, 0x84603c, w + 0.05, 0.06, 0.08, x, y + 0.16, z + i);
  for (let a = -w / 2 + 0.4; a <= w / 2 - 0.3; a += Math.max(1, w / 3 - 0.4)) for (let b = -d / 2 + 0.4; b <= d / 2 - 0.3; b += 4) gapAdd(G.cyl8, 0x5d4630, 0.22, y + 3.4, 0.22, x + a, (y - 3.4) / 2, z + b);
}
function gapBoat(x, z, col, ry) {
  const g = new THREE.Group();
  const h = M(G.box, col, 1.6, 0.6, 4); h.position.y = 0.3; g.add(h);
  const b = M(G.cone6, col, 0.95, 1.2, 0.5); b.rotation.x = -Math.PI / 2; b.position.set(0, 0.3, -2.5); b.scale.set(0.8, 1.2, 0.5); g.add(b);
  const c = M(G.box, 0xf4efe6, 1.1, 0.7, 1.4); c.position.set(0, 0.9, 0.6); g.add(c);
  const s = M(G.box, 0xffd23f, 1.62, 0.12, 4.02); s.position.y = 0.45; g.add(s);
  deco(g, x, -3.35, z, ry || 0);
}
function gapBuoyLine(x, z0, z1) {
  for (let z = z0, i = 0; z >= z1; z -= 2.2, i++) gapAdd(G.sphereLo, i % 2 ? 0xffffff : 0xff4d4d, 0.32, 0.26, 0.32, x, -3.15, z);
}
function gapGarage(x, z, ry, label) {
  const g = new THREE.Group();
  const body = M(G.box, 0xe7ece9, 8, 4.2, 6); body.position.y = 2.1; g.add(body);
  const roof = M(G.box, 0x2f7a52, 8.6, 0.4, 6.6); roof.position.y = 4.4; g.add(roof);
  const door = M(G.box, 0x8a929e, 5.6, 3, 0.1); door.position.set(0, 1.5, 3.02); g.add(door);
  for (let i = 0; i < 5; i++) { const l = M(G.box, 0x6f7783, 5.6, 0.06, 0.12); l.position.set(0, 0.4 + i * 0.6, 3.05); g.add(l); }
  const st = M(G.box, 0xffd23f, 8.02, 0.3, 6.02); st.position.y = 3.7; g.add(st);
  deco(g, x, -2.3, z, ry);
  dShellSign(x, 2.9, z, ry, label);
}
function gapTower(x, z) {
  gapAdd(G.cyl8, 0xdfe5e2, 0.7, 15, 0.7, x, 4.4, z);
  for (let y = -1; y < 11; y += 3) gapAdd(G.cyl8, 0x2f7a52, 0.78, 0.3, 0.78, x, y, z);
  gapAdd(G.cyl8, 0x2f7a52, 2.6, 2.4, 2.6, x, 13, z);
  gapAdd(G.cyl8, 0x8fe8ff, 2.65, 1.2, 2.65, x, 13.1, z).material = mat(0x8fe8ff, { transparent: true, opacity: 0.8 });
  gapAdd(G.cone, 0xf4efe6, 2.9, 1.4, 2.9, x, 14.9, z);
  gapAdd(G.sphereLo, 0xff3b3b, 0.35, 0.35, 0.35, x, 15.9, z).material = basic(0xff5a4a);
  dShellSign(x, 10, z + 0.8, 0, 'TEST TOWER');
}
function gapLake(z0, z1, seed, opts) {
  const r = mulberry(seed), L = z0 - z1, zc = (z0 + z1) / 2;
  for (const s of [-1, 1]) {
    // concrete sea wall framing the lake, with lamp posts
    gapAdd(G.box, 0xc9d0cc, 4, 1.8, L + 4, s * 34, -2.4, zc);
    gapAdd(G.box, 0x2f7a52, 4.05, 0.25, L + 4, s * 34, -1.4, zc);
    for (let z = z0 - 4; z > z1; z -= 12) { gapAdd(G.cyl8, 0x5d6673, 0.14, 5, 0.14, s * 33, 1, z); gapAdd(G.box, 0xfff3c0, 0.6, 0.25, 0.4, s * 33, 3.5, z).material = basic(0xfff3c0); }
    gapBuoyLine(s * opts.buoyX, z0 - 3, z1 + 3);
  }
  const L1 = opts.left, R1 = opts.right; // what goes on each side
  // long dock + boats on both sides
  for (const [side, x] of [[-1, L1.dockX], [1, R1.dockX]]) {
    gapPier(x, zc, 4, L - 6, -2.4);
    for (let z = z0 - 10; z > z1 + 8; z -= 15) { gapPier(x - side * 4, z, 4, 2.4, -2.4); gapBoat(x - side * 4.6, z - 4, [0xff7a1a, 0x3b8bff, 0x2f7a52, 0xff4d4d][(r() * 4) | 0], side * 0.08); }
    for (let z = z0 - 6; z > z1 + 4; z -= 9) { gapAdd(G.cyl8, 0xffd23f, 0.3, 0.6, 0.3, x - side * 1.6, -2.0, z); }
  }
  // grandstand on a pier facing the lake
  const gs = L1.grand ? L1 : R1, gsx = gs === L1 ? -28 : 28, gsr = gs === L1 ? Math.PI / 2 : -Math.PI / 2;
  gapAdd(G.box, 0xc9d0cc, 9, 1.4, 26, gsx, -2.9, z1 + L * 0.55);
  dBleachers(gsx - Math.sign(gsx) * 0.5, -2.2, z1 + L * 0.55, 22, gsr);
  dFlagLine(gsx, z1 + L * 0.55 + 12, gsx, z1 + L * 0.55 - 12, 2.8);
  // pit garage + test tower on the other side
  const gx = gs === L1 ? 28 : -28;
  gapAdd(G.box, 0xc9d0cc, 10, 1.4, L - 8, gx, -2.9, zc);
  gapGarage(gx, z1 + L * 0.7, gx > 0 ? -Math.PI / 2 : Math.PI / 2, 'PIT 5');
  gapGarage(gx, z1 + L * 0.45, gx > 0 ? -Math.PI / 2 : Math.PI / 2, 'PIT 6');
  dTire(gx - Math.sign(gx) * 3.5, -2.2, z1 + L * 0.58); dTire(gx - Math.sign(gx) * 3.8, -2.2, z1 + L * 0.6, 2);
  dCone(gx - Math.sign(gx) * 4, -2.2, z1 + L * 0.33); dCone(gx - Math.sign(gx) * 4, -2.2, z1 + L * 0.3);
  gapTower(gx, z1 + L * 0.2);
}

// ---- MEADOW: a proper farm lake with grassy banks, reeds, lily pads, boathouse + jetty ----
function gapPond(z0, z1, seed) {
  const r = mulberry(seed), L = z0 - z1, zc = (z0 + z1) / 2;
  for (const s of [-1, 1]) {
    gapAdd(G.box, 0x6fcf4f, 12, 1.0, L + 6, s * 27, -2.8, zc);
    gapAdd(G.box, 0xd9c48a, 1.6, 0.4, L + 6, s * 20.6, -3.1, zc);
    for (let z = z0 - 3; z > z1 + 2; z -= 6 + r() * 4) {
      for (let k = 0; k < 4; k++) gapAdd(G.cone6, 0x4f9a3a, 0.1, 1.2 + r() * 0.8, 0.1, s * (20 + r() * 1.5), -2.6, z + r() * 2.5);
      if (r() < 0.55) dTree(s * (27 + r() * 5), -2.3, z - 2, 0.8 + r() * 0.3); else dFlowerBed(s * (25 + r() * 3), -2.3, z, 3, 1);
    }
    for (let z = z0 - 6; z > z1 + 4; z -= 7 + r() * 5) {
      const x = s * (11 + r() * 7);
      gapAdd(G.cyl, 0x3fbf4a, 0.9 + r() * 0.5, 0.03, 0.9 + r() * 0.5, x, -3.12, z);
      if (r() < 0.5) gapAdd(G.sphereLo, 0xff9ad5, 0.22, 0.18, 0.22, x + 0.2, -3.0, z);
    }
  }
  // boathouse + jetty + rowboat on the east bank
  const bx = 27, bz = z1 + L * 0.55;
  gapAdd(G.box, 0xb5452f, 7, 4, 6, bx + 1, -0.3, bz);
  gapAdd(G.cone, 0x6b3b1f, 5.6, 2.2, 4.4, bx + 1, 2.8, bz, 0, Math.PI / 4, 0);
  gapAdd(G.box, 0xf4efe6, 0.2, 2.6, 3.4, bx - 2.55, -0.8, bz);
  gapPier(bx - 6, bz, 6, 2.6, -2.5);
  gapBoat(bx - 7, bz - 3.2, 0xffd23f, Math.PI / 2);
  // a little dock with a fishing spot on the west bank
  gapPier(-23, z1 + L * 0.3, 4, 3, -2.5); dBench(-24, -2.3, z1 + L * 0.3 + 1.2, 0);
}
