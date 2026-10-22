// =====================================================================
// NEW WORLD PROPS + HELPERS
// =====================================================================
function canyonEnv(c) {
  setupEnv(Object.assign({ top: 0x3a8cff, horizon: 0xffd9a8, bottom: 0xe8a070, fog: 0xffd9a8, fogNear: 90, fogFar: 300, hemiSky: 0xfff4e0, hemiGround: 0xb07040, hemiI: 0.8, sunColor: 0xffe2b8, sunI: 1.05, amb: 0.22, sunSprite: 0xfff0c0 }, c || {}));
  W.killY = -6;
  const river = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400), mat(0x4aa8a0, { transparent: true, opacity: 0.9, roughness: 0.25, metalness: 0.1 }));
  river.rotation.x = -Math.PI / 2; river.position.y = -3.4; W.root.add(river); W.water = river;
  const r = mulberry(41);
  // canyon walls and far mesas so every direction has layered red rock
  for (const s of [-1, 1]) for (let i = 0; i < 9; i++) {
    const h = 18 + r() * 16, w = 14 + r() * 10, z = 30 - i * 26 - r() * 8;
    const m = styledMesh(w, h + 6, 22, i % 2 ? 'mesa' : 'redrock'); m.position.set(s * (34 + r() * 10), h / 2 - 6, z); (W.deco || W.root).add(m);
  }
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * TAU, d = 190 + r() * 60, h = 30 + r() * 40, w = 30 + r() * 30;
    const m = styledMesh(w, h, w * 0.8, i % 3 ? 'mesa' : 'redrock'); m.position.set(Math.cos(a) * d, h / 2 - 10, Math.sin(a) * d - 60); (W.deco || W.root).add(m);
  }
  skyClouds(10, 45, 80, 80, 240, 7);
  W.scenery = (dt, t) => { river.position.y = -3.4 + Math.sin(t * 0.7) * 0.06; };
}
function dCactus(x, top, z, s) {
  s = s || 1;
  const g = new THREE.Group(), c = 0x3a9a55;
  const trunk = M(G.cyl8, c, 0.35 * s, 3 * s, 0.35 * s); trunk.position.y = 1.5 * s; g.add(trunk);
  const cap = M(G.sphereLo, c, 0.35 * s); cap.position.y = 3 * s; g.add(cap);
  for (const sd of [-1, 1]) {
    const arm = M(G.cyl8, c, 0.22 * s, 1.1 * s, 0.22 * s); arm.position.set(sd * 0.75 * s, (1.6 + (sd > 0 ? 0.4 : 0)) * s + 0.55 * s, 0); g.add(arm);
    const elbow = M(G.cyl8, c, 0.22 * s, 0.7 * s, 0.22 * s); elbow.rotation.z = Math.PI / 2; elbow.position.set(sd * 0.45 * s, (1.6 + (sd > 0 ? 0.4 : 0)) * s, 0); g.add(elbow);
  }
  const fl = M(G.ico, 0xff6bd6, 0.16 * s); fl.position.set(0.1, 3.3 * s, 0.1); g.add(fl);
  deco(g, x, top, z, (x + z) % 3);
  addSolid(x, top + 1.5 * s, z, 0.4 * s, 1.5 * s, 0.4 * s, 'static', null).noCam = true;
}
function dSkull(x, top, z, ry) {
  const g = new THREE.Group();
  const sk = M(G.sphereLo, 0xf4efe6, 0.4, 0.3, 0.5); sk.position.y = 0.25; g.add(sk);
  for (const s of [-1, 1]) { const h = M(G.cone6, 0xf4efe6, 0.09, 0.6, 0.09); h.rotation.z = s * -1.2; h.position.set(s * 0.5, 0.4, -0.1); g.add(h); const e = M(G.sphereLo, 0x2b1d14, 0.08); e.position.set(s * 0.15, 0.32, 0.38); g.add(e); }
  deco(g, x, top, z, ry);
}
function dWagon(x, top, z, ry) {
  const g = new THREE.Group();
  const bed = M(G.box, 0xa86b3c, 2.2, 0.6, 3.6); bed.position.y = 1.0; g.add(bed);
  for (const sx of [-1.15, 1.15]) for (const sz of [-1.2, 1.2]) { const wh = M(G.cyl, 0x6b3b1f, 0.6, 0.12, 0.6); wh.rotation.z = Math.PI / 2; wh.position.set(sx, 0.6, sz); g.add(wh); }
  const cover = M(new THREE.CylinderGeometry(1, 1, 1, 12, 1, false, 0, Math.PI), 0xf4efe6, 1.15, 3.4, 1.0); cover.rotation.x = Math.PI / 2; cover.rotation.z = Math.PI / 2; cover.position.y = 1.3; g.add(cover);
  deco(g, x, top, z, ry);
  addSolid(x, top + 1.1, z, 1.1, 1.1, 1.8, 'static', null);
}
function dTent(x, top, z, ry, col) {
  const g = new THREE.Group();
  const t = new THREE.Mesh(PRISM, mat(col || 0xff9d2e)); t.scale.set(2.6, 2, 2.4); g.add(t);
  const flap = M(G.box, 0x2b1d14, 0.05, 1.2, 0.8); flap.position.set(1.31, 0.6, 0); g.add(flap);
  deco(g, x, top, z, ry);
  addSolid(x, top + 0.9, z, 1.2, 0.9, 1.1, 'static', null).noCam = true;
}
function dCrate(x, top, z, s) { const m = new THREE.Mesh(G.box, mat(0xffffff, { map: crateTex })); m.scale.setScalar(s || 1); deco(m, x, top + (s || 1) / 2, z); addSolid(x, top + (s || 1) / 2, z, (s || 1) / 2, (s || 1) / 2, (s || 1) / 2, 'static', null); }
function dBarrel(x, top, z, col) { const g = new THREE.Group(); const b = M(G.cyl, col || 0x8a5a2b, 0.45, 1.1, 0.45); b.position.y = 0.55; g.add(b); for (const y of [0.2, 0.9]) { const h = M(G.cyl, 0x3a3f4a, 0.47, 0.08, 0.47); h.position.y = y; g.add(h); } deco(g, x, top, z); addSolid(x, top + 0.55, z, 0.45, 0.55, 0.45, 'static', null).noCam = true; }
function dTorchPost(x, top, z) { addTorchDecor(x, top, z); addSolid(x, top + 0.7, z, 0.15, 0.7, 0.15, 'static', null).noCam = true; }
function buildBuzzard() {
  const m = buildFlyer('gull');
  m.root.traverse((o) => { if (o.isMesh && o.material && o.material.color) { const c = o.material.color.getHex(); if (c === 0xffffff) o.material = mat(0x4a3428); else if (c === 0xdde4ee) o.material = mat(0x2b1d14); } });
  const neck = M(G.sphereLo, 0xff8f8f, 0.16); neck.position.set(0, 0.62, 0.42); m.body.add(neck);
  return m;
}
function addBuzzard(x, y, z) { const e = makeEnemy('bee', x, y, z, buildBuzzard(), { r: 0.5, h: 0.95 }); const blob = new THREE.Mesh(G.circle, new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25, depthWrite: false })); blob.scale.setScalar(0.45); W.root.add(blob); e.blob = blob; return e; }
function buildTumbleweed() {
  const g = new THREE.Group(); const b = new THREE.Group(); g.add(b);
  const core = new THREE.Mesh(G.ico, mat(0xb08a4e, { wireframe: false })); core.scale.setScalar(0.62); core.position.y = 0.62; b.add(core);
  for (let i = 0; i < 10; i++) { const t = M(G.torus, 0x8a6a3a, 0.62, 0.62, 2.2); t.rotation.set(i * 0.9, i * 1.7, i * 0.4); t.position.y = 0.62; b.add(t); }
  eyesOn(b, 0.75, 0.55, 0.16, 0.1, true);
  shadowy(g, true, false);
  return { root: g, body: b };
}
function addTumbleweed(x, top, z, x2, z2) { const e = makeEnemy('spiky', x, top, z, buildTumbleweed(), { r: 0.62, h: 1.2, stompable: false, spinnable: false, a: new V3(x, top, z), b: new V3(x2, top, z2), toB: true }); e.tumble = true; return e; }
// Candy's buried bones: ground pound the X to dig one up
function addDigSpot(x, top, z, tracker) {
  const g = new THREE.Group();
  const soil = M(G.cyl, 0x8a5a36, 1.0, 0.1, 1.0); soil.position.y = 0.05; g.add(soil);
  for (const a of [0.78, -0.78]) { const x1 = M(G.box, 0xff4d4d, 1.5, 0.06, 0.24); x1.rotation.y = a; x1.position.y = 0.12; g.add(x1); }
  const paw = M(G.sphereLo, 0x7b8088, 0.14, 0.05, 0.14); paw.position.set(0.7, 0.12, 0.6); g.add(paw);
  g.position.set(x, top, z); W.root.add(g);
  const spot = { done: false };
  W.things.push({ update() {
    if (spot.done) return;
    if (P.state === 'poundLand' && P.stateT < 0.02 && Math.abs(P.pos.x - x) < 1.4 && Math.abs(P.pos.z - z) < 1.4 && Math.abs(P.pos.y - top) < 0.5) {
      spot.done = true; tracker.n++;
      soil.material = mat(0x5a3a22); g.children.slice(1, 3).forEach((m) => { m.visible = false; });
      const bone = new THREE.Group(); const sh = M(G.cyl8, 0xf4efe6, 0.12, 1.0, 0.12); sh.rotation.z = Math.PI / 2; bone.add(sh);
      for (const s of [-1, 1]) for (const k of [-1, 1]) { const kn = M(G.sphereLo, 0xf4efe6, 0.17); kn.position.set(s * 0.55, k * 0.12, 0); bone.add(kn); }
      bone.position.set(x, top + 0.5, z); W.root.add(bone);
      W.anim.push({ t: 0, f(dt, a) { a.t += dt; bone.position.y = top + 0.5 + Math.min(1.5, a.t * 4) - Math.max(0, a.t - 0.6) * 2; bone.rotation.y += dt * 8; if (a.t > 1.2) { W.root.remove(bone); return true; } return false; } });
      Snd.S.key(); burst(x, top + 0.4, z, 0x8a5a36, 16, 5, 0.6);
      showToast('<b>BONE ' + tracker.n + ' / ' + tracker.need + '</b> dug up for Candy!' + (tracker.n >= tracker.need ? ' The bone gate is opening!' : ''), 3);
      if (tracker.n >= tracker.need && tracker.onDone) tracker.onDone();
    }
  } });
  return spot;
}
function dMinecart(parent, col) {
  const g = new THREE.Group();
  const tub = M(G.box, col || 0x6a6f7a, 2.0, 1.0, 2.6); tub.position.y = 0.8; g.add(tub);
  const rim = M(G.box, 0x3a3f4a, 2.15, 0.12, 2.75); rim.position.y = 1.3; g.add(rim);
  const ore = M(G.dodeca, 0xffd23f, 0.5); ore.position.set(0.4, 1.4, -0.5); g.add(ore);
  for (const sx of [-0.9, 0.9]) for (const sz of [-0.9, 0.9]) { const wh = M(G.cyl, 0x2b2f38, 0.32, 0.15, 0.32); wh.rotation.z = Math.PI / 2; wh.position.set(sx, 0.32, sz); g.add(wh); }
  if (parent) parent.add(g);
  return g;
}
function trackLine(x, top, z1, z2) {
  const L = Math.abs(z2 - z1);
  for (const s of [-0.8, 0.8]) { const r = M(G.box, 0x7a7f8a, 0.12, 0.12, L); r.position.set(x + s, top + 0.06, (z1 + z2) / 2); (W.deco || W.root).add(r); }
  for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z += 1.2) { const t = M(G.box, 0x6b3b1f, 2.2, 0.08, 0.35); t.position.set(x, top + 0.02, z); (W.deco || W.root).add(t); }
}

// =====================================================================
// WORLD 1-1 — RED ROCK TRAIL (Candy's Canyon)
// =====================================================================
function buildCanyon1() {
  canyonEnv();
  const bones = { n: 0, need: 3, onDone: null };
  // start mesa
  gnd(0, 0, -2, 16, 20, 10, 'mesa');
  dArch(0, 0, -9.5, 8, "CANDY'S CANYON", 0xc8643a);
  addPet('candy', 3.8, 0, 3.5, -2.2, 'Woof woof! I buried <b>3 bones</b> in my canyon. Find the red <b>X</b> spots and <b>GROUND POUND</b> them (jump, then SHIFT) to dig them up. That opens the bone gate!', 'Woof woof! I buried <b>3 bones</b>. Find the red <b>X</b> spots: jump, then tap <b>ACTION</b> to ground pound and dig!');
  addHint(-3, 0, 5, 'Move with <b>WASD</b> / arrows, <b>SPACE</b> jumps (again in mid-air for a double jump). Drag the mouse or use <b>Q</b>/<b>E</b> for the camera.', 'Stick to move, <b>JUMP</b> to jump (tap again in mid-air for a double jump). Drag on the right to turn the camera.', 2.6);
  dCactus(-6, 0, 6, 0.9); dCactus(6.3, 0, -6, 1.1); dSkull(-5, 0, -4, 0.7); dTent(-4.5, 0, 0.5, Math.PI / 2, 0xff9d2e); dBarrel(5.5, 0, 6.5); dBarrel(6.3, 0, 5.4, 0x6b3b1f);
  coinLine(0, 0.9, 3, 0, 0.9, -8, 5);
  // rope bridge with a tumbleweed rolling across
  for (let i = 0; i < 6; i++) gnd(0, 0, -13.2 - i * 2.2, 3.2, 2.0, 0.35, 'wood');
  for (const s of [-1, 1]) { for (let i = 0; i < 4; i++) { const p = M(G.cyl8, 0x7a4a24, 0.1, 1.4, 0.1); p.position.set(s * 1.7, 0.4, -12.2 - i * 4.2); W.deco.add(p); } const rope = M(G.box, 0xd8b878, 0.06, 0.06, 13.4); rope.position.set(s * 1.7, 0.95, -18.5); W.deco.add(rope); }
  addTumbleweed(-1.2, 0, -18, 1.2, -18);
  addHint(1.8, 0, -10.6, '<b>Tumbleweeds</b> are prickly: you can\'t stomp them. Jump over!', null, 2);
  coinLine(0, 1.2, -13, 0, 1.2, -24, 5);
  // mesa B: dig spot 1, spring pillar star
  gnd(0, 0, -34, 20, 20, 10, 'mesa');
  addCheckpoint(-2, 0, -26, 0);
  addDigSpot(-5.5, 0, -32, bones);
  addHint(-3, 0, -28.5, 'A red <b>X</b>! Jump and press <b>SHIFT</b> in mid-air to <b>GROUND POUND</b> it.', 'A red <b>X</b>! Jump, then tap <b>ACTION</b> in mid-air to <b>GROUND POUND</b> it.', 2.2);
  addWalker(3, 0, -36); addWalker(-3, 0, -40);
  gnd(6.5, 6, -40.5, 2.6, 2.6, 16, 'redrock'); addSpring(6.5, 0, -35.5);
  addItem('star', 6.5, 7.3, -40.5, { idx: 0 });
  dCactus(-8, 0, -27, 1); dCactus(8.5, 0, -28, 0.8); dCactus(-8.5, 0, -42, 1.2); dSkull(3, 0, -27.5, 2); dWagon(-6, 0, -38.5, 0.2); dRocks(8, 0, -43, 4, 5);
  addQBlock(0, 3.4, -33, 'coins');
  // mine cart ferry over the river
  trackLine(0, -0.6, -44, -58);
  const cart = addMover(0, 0, -47, 3.2, 3.2, [0, 0, -9], 6, 0, 'metal'); dMinecart(cart.mesh).position.y = -0.4;
  addHint(2.2, 0, -42.5, 'Hop in the <b>mine cart</b> to ride across the river!', null, 2);
  coinLine(0, 1.6, -48, 0, 1.6, -56, 4);
  // mesa C: dig spot 2, buzzards, secret ledge star
  gnd(0, 0, -70, 22, 22, 10, 'mesa');
  addCheckpoint(-2, 0, -61, 0);
  addDigSpot(5, 0, -72, bones);
  addBuzzard(-3, 3, -68); addBuzzard(4, 3.2, -76); addWalker(-6, 0, -74);
  addQBlock(-2, 3.4, -66, 'coins'); addQBlock(-0.9, 3.4, -66, '1up');
  addSecretBlock(12.6, 0.4, -70, 2.2, 2.2, 'redrock'); addSecretBlock(15.4, 1.6, -71.5, 2.2, 2.2, 'redrock');
  gnd(18.6, 2.8, -73, 3, 3, 6, 'mesa'); addItem('star', 18.6, 4.1, -73, { idx: 1 });
  addHint(9, 0, -70, 'Candy sniffs something to the <b>east</b>... walk to the edge.', null, 2);
  dTent(-8, 0, -63, 0.4, 0xff4d4d); dCactus(9, 0, -62, 1); dCactus(-9.5, 0, -79, 0.9); dBarrel(8.8, 0, -79); dCrate(7.7, 0, -79.5, 1); dSkull(-3, 0, -79, 1); dTorchPost(-9.5, 0, -66);
  // steps up to the high mesa
  gnd(-4, 1.4, -83.5, 3, 3, 4, 'redrock'); gnd(0, 2.8, -86.5, 3, 3, 6, 'redrock'); gnd(4, 4.2, -89.5, 3, 3, 8, 'redrock');
  coinLine(-4, 2.3, -83.5, 4, 5.1, -89.5, 5);
  // mesa D: dig spot 3, hot-spring geyser star, bone gate
  gnd(0, 4, -103, 22, 24, 14, 'mesa');
  addCheckpoint(2, 4, -94, 0);
  addDigSpot(-4, 4, -100, bones);
  addTumbleweed(-6, 4, -106, 6, -106); addWalker(5, 4, -100); addBuzzard(0, 7.5, -103);
  addGeyser(-7.5, 4, -110, 7.5, 4, 2.5, 0); gnd(-7.5, 11, -113.6, 3, 3, 1.2, 'redrock'); addItem('star', -7.5, 12.3, -113.6, { idx: 2 });
  addHint(-4, 4, -107.5, 'A <b>hot spring</b>! Ride the steam up and steer onto the ledge.', null, 2.2);
  dCactus(8.5, 4, -95, 1); dCactus(-9.5, 4, -94, 0.8); dWagon(7, 4, -108, -0.3); dRocks(9, 4, -113, 4, 9); dTorchPost(3, 4, -113); dTorchPost(-3, 4, -113);
  gnd(-6.5, 9, -115.5, 9, 1.2, 5, 'redrock'); gnd(6.5, 9, -115.5, 9, 1.2, 5, 'redrock');
  const gate = addGate(0, 9, -115.5, 4, 1, 5);
  bones.onDone = () => { gate.open(); Snd.S.solve(); };
  addHint(0, 4, -112.2, 'The <b>BONE GATE</b> opens when Candy\'s <b>3 bones</b> are dug up.', null, 2.2);
  // goal ledge
  gnd(0, 4, -124, 12, 16, 14, 'mesa');
  addBox(0, 4.8, -127, 4, 4, 0.8, 'redrock');
  addGoal(0, 4.8, -127, 'flag');
  dCactus(-4.5, 4, -129, 1); dCactus(4.5, 4, -121, 0.8);
  W.titleFocus = new V3(0, 1, -20);
}

// =====================================================================
// WORLD 1-2 — MESA MINES (an open-pit gold mine)
// =====================================================================
function buildCanyon2() {
  canyonEnv({ horizon: 0xffc890, fog: 0xffc890, sunColor: 0xffd0a0 });
  gnd(0, 0, 0, 16, 16, 10, 'desert');
  dSign(-4.5, 0, -6, 0.3, 'MESA MINES', '#6a4a32');
  addPet('candy', 4, 0, 1, -2.4, 'Woof! The old gold mine is full of <b>lever lamps</b>. Light all three to open the mine gate. Watch out for the rolling carts!');
  deco(dMinecart(null), -5, 0, 3, 0.4);
  dCrate(5.5, 0, -5, 1.2); dCrate(5.5, 1.2, -5, 0.9); dBarrel(-5.8, 0, -3.5); dTorchPost(-6.5, 0, 6); dTorchPost(6.5, 0, 6);
  coinLine(0, 0.9, 2, 0, 0.9, -6, 4);
  // conveyor bridge of ore
  addConveyor(0, 0, -13, 3, 10, 0, 3.2);
  addHint(2, 0, -7, 'Ore <b>conveyors</b> push you back. Keep running!', null, 2);
  coinLine(0, 1.2, -9, 0, 1.2, -17, 4);
  // pit floor A: walkers and falling planks to the star
  gnd(0, 0, -30, 24, 18, 10, 'mine');
  addCheckpoint(-2, 0, -22.5, 0);
  addWalker(4, 0, -28); addWalker(-5, 0, -33); addRobot(-8, 0, -36, 8, -36);
  for (let i = 0; i < 4; i++) { const b = M(G.box, 0x6b3b1f, 0.5, 6, 0.5); b.position.set(-11.5, 3, -22 - i * 4); W.deco.add(b); const b2 = b.clone(); b2.position.x = 11.5; W.deco.add(b2); const top = M(G.box, 0x6b3b1f, 23.4, 0.5, 0.5); top.position.set(0, 6.1, -22 - i * 4); W.deco.add(top); }
  addFalling(-9, 2.5, -40, 2.5, 2.5); addFalling(-9, 4, -44, 2.5, 2.5); gnd(-9, 5.5, -48, 3, 3, 2, 'mine');
  addItem('star', -9, 6.8, -48, { idx: 0 });
  addBox(-9, 1.2, -37, 2.4, 2.4, 1.2, 'wood');
  trackLine(6, 0, -24, -38); deco(dMinecart(null), 6, 0, -27);
  dCrate(9.5, 0, -24, 1); dBarrel(10, 0, -26); dBarrel(10, 0, -27.2, 0x6b3b1f); dTorchPost(-10.5, 0, -30); dTorchPost(10.5, 0, -34);
  // the lever-lamp puzzle on floor B
  gnd(0, 0, -56, 24, 18, 10, 'mine');
  addCheckpoint(3, 0, -48.5, 0);
  addLeverPuzzle({ top: 0, init: [0, 1, 0], levers: [[-7, -54, [0, 1], 'A'], [0, -58, [1, 2], 'B'], [7, -54, [0, 2], 'C']],
    lamps: [[-4, 0, -63.5, 3], [0, 0, -63.5, 3], [4, 0, -63.5, 3]], msg: '<b>ALL LAMPS LIT!</b> The mine gate creaks open!', onSolve: () => mgate.open() });
  addHint(-2.5, 0, -50, '<b>LEVER LAMPS:</b> each lever flips two lamps. Step on the levers to light <b>all three</b>.', null, 2.6);
  gnd(-7.5, 5, -65, 9, 1.2, 5, 'redrock'); gnd(7.5, 5, -65, 9, 1.2, 5, 'redrock');
  const mgate = addGate(0, 5, -65, 6, 1, 5);
  dCrate(-10, 0, -50, 1); dCrate(10, 0, -60, 1.2); dBarrel(-10.4, 0, -60); dTorchPost(-10.5, 0, -55); dTorchPost(10.5, 0, -55);
  // mine-shaft facade with a cart track into the cliff (decorative, closed off by a gate)
  const shaft = new THREE.Group();
  const frame = M(G.box, 0x6b3b1f, 5, 0.6, 0.8); frame.position.set(0, 4.2, 0); shaft.add(frame);
  for (const s of [-1, 1]) { const p = M(G.box, 0x6b3b1f, 0.6, 4.2, 0.8); p.position.set(s * 2.2, 2.1, 0); shaft.add(p); }
  const dark = new THREE.Mesh(G.box, basic(0x140a04)); dark.scale.set(3.8, 3.9, 0.2); dark.position.set(0, 1.95, -0.3); shaft.add(dark);
  deco(shaft, -15, 0, -54, Math.PI / 2);
  gnd(-17, 9, -54, 4, 18, 9, 'redrock');
  // floor C: star 2 on the crane, star 3 behind the rolling carts
  gnd(0, 0, -78, 24, 24, 10, 'mine');
  addCheckpoint(-2, 0, -68, 0);
  const crane = new THREE.Group();
  const mast = M(G.box, 0xffb627, 0.6, 9, 0.6); mast.position.y = 4.5; crane.add(mast);
  const boom = M(G.box, 0xffb627, 7, 0.5, 0.5); boom.position.set(3, 9, 0); crane.add(boom);
  const hook = M(G.box, 0x3a3f4a, 0.12, 3, 0.12); hook.position.set(6, 7.5, 0); crane.add(hook);
  deco(crane, -9, 0, -84); addSolid(-9, 4.5, -84, 0.4, 4.5, 0.4, 'static', null);
  gnd(-3, 3, -84, 2.4, 2.4, 3, 'wood'); addMover(-3, 6.2, -84.5, 2.4, 2.4, [0, 0, 4], 4, 0, 'wood');
  addItem('star', -3, 9.4, -82, { idx: 1 });
  addLog(5, 0, -76, 9, 1.2);
  addTumbleweed(-4, 0, -90, 6, -90);
  trackLine(9, 0, -68, -90);
  const runCart = { root: dMinecart(null, 0x8a3a2a) }; W.root.add(runCart.root);
  W.things.push({ update() { const t = (W.time * 0.35) % 1; const z = -68 - t * 22; runCart.root.position.set(9, 0, z); if (P.state !== 'dead' && Math.abs(P.pos.x - 9) < 1.6 && Math.abs(P.pos.z - z) < 1.8 && P.pos.y < 1.8) hurtPlayer(new V3(9, 0, z), 'cart'); } });
  gnd(13.5, 1.5, -88, 3, 3, 1.5, 'wood'); addItem('star', 13.5, 2.8, -88, { idx: 2 });
  addHint(6, 0, -70, 'Runaway <b>mine cart</b> on the track! Time your crossing.', null, 2.2);
  dCrate(-10, 0, -72, 1); dCrate(-10, 1, -72, 0.8); dBarrel(10.5, 0, -72); dTorchPost(-10.5, 0, -90); dTorchPost(5, 0, -89.5);
  addBox(0, 0.8, -88, 4, 4, 0.8, 'gold');
  addGoal(0, 0.8, -88, 'star');
  W.titleFocus = new V3(0, 1, -30);
}

// =====================================================================
// WORLD 2-1 — CHEESE CONVEYOR (Ratita Works, with Luna, Pi-rat and Snowie)
// =====================================================================
function labEnv() {
  setupEnv({ top: 0x16123a, horizon: 0x6a4aa8, bottom: 0x241a50, fog: 0x4a3a88, fogNear: 70, fogFar: 260, hemiSky: 0xd8d0ff, hemiGround: 0x403060, hemiI: 0.85, sunColor: 0xffffff, sunI: 0.9, amb: 0.28 });
  W.killY = -12;
  const r = mulberry(61);
  for (let i = 0; i < 18; i++) { // the Ratita Industries skyline
    const a = (i / 18) * TAU, d = 150 + r() * 70, h = 30 + r() * 50, w = 14 + r() * 16;
    const m = styledMesh(w, h, w, i % 2 ? 'lab' : 'metal'); m.position.set(Math.cos(a) * d, h / 2 - 20, Math.sin(a) * d - 40); (W.deco || W.root).add(m);
    for (let k = 0; k < 4; k++) { const win = new THREE.Mesh(G.box, basic(k % 2 ? 0xffe14d : 0x56f0ff)); win.scale.set(w * 0.7, 1.2, 0.2); win.position.set(Math.cos(a) * d - Math.cos(a) * w * 0.52, h * 0.2 + k * 6 - 20, Math.sin(a) * d - 40 - Math.sin(a) * w * 0.52); win.lookAt(0, win.position.y, -40); (W.deco || W.root).add(win); }
  }
  addStarfield(300);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400), mat(0x1a1440)); floor.rotation.x = -Math.PI / 2; floor.position.y = -14; W.root.add(floor);
}
function dRatSign(x, top, z, ry) { dSign(x, top, z, ry, 'RATITA INDUSTRIES', '#1b1440'); }
function dCheese(x, top, z, s) { const m = new THREE.Mesh(PRISM, mat(0xffd23f, { emissive: 0x2a1a00 })); m.scale.set(1.4 * (s || 1), 0.9 * (s || 1), 1.2 * (s || 1)); deco(m, x, top, z, 0.3); for (let i = 0; i < 3; i++) { const h = M(G.sphereLo, 0xe0a820, 0.12 * (s || 1)); h.position.set(x + (i - 1) * 0.35, top + 0.25, z + 0.5 * (s || 1)); W.deco.add(h); } }
function dConsole(x, top, z, ry) {
  const g = new THREE.Group();
  const desk = M(G.box, 0x3a3f58, 2.4, 1.0, 1.0); desk.position.y = 0.5; g.add(desk);
  const scr = new THREE.Mesh(G.box, basic(0x3ff0ff)); scr.scale.set(1.8, 0.9, 0.06); scr.position.set(0, 1.55, -0.3); scr.rotation.x = -0.2; g.add(scr);
  for (let i = 0; i < 5; i++) { const b = new THREE.Mesh(G.box, basic([0xff4d4d, 0xffe14d, 0x59d65a][i % 3])); b.scale.set(0.16, 0.06, 0.16); b.position.set(-0.8 + i * 0.4, 1.02, 0.2); g.add(b); }
  deco(g, x, top, z, ry); addSolid(x, top + 0.5, z, 1.2, 0.5, 0.6, 'static', null).noCam = true;
}
function dTank(x, top, z, col) {
  const g = new THREE.Group();
  const t = new THREE.Mesh(G.cyl, mat(col || 0x56f0ff, { emissive: 0x0a3a40, transparent: true, opacity: 0.75 })); t.scale.set(0.9, 2.6, 0.9); t.position.y = 1.5; g.add(t);
  for (const y of [0.15, 2.85]) { const c = M(G.cyl, 0x5d6673, 1.0, 0.3, 1.0); c.position.y = y; g.add(c); }
  const bub = M(G.sphereLo, 0xffffff, 0.15); bub.position.set(0.2, 1.4, 0.2); g.add(bub);
  g.position.set(x, top, z); W.root.add(g);
  addSolid(x, top + 1.5, z, 0.9, 1.5, 0.9, 'static', null).noCam = true;
}
function buildRatita1() {
  labEnv();
  gnd(0, 0, 0, 16, 16, 6, 'lab');
  dRatSign(-4.5, 0, -6.5, 0.3);
  addPet('luna', 3.5, 0, 2.5, -2.4, 'Squeak! Welcome to <b>Ratita Works</b>! Some bad bots are loose in the cheese factory. Ride the conveyors and push the <b>cheese crates</b> onto the switches!');
  dConsole(-5, 0, 4, Math.PI / 2); dCheese(5.5, 0, -5); dTank(-6, 0, -5);
  coinLine(0, 0.9, 3, 0, 0.9, -6, 4);
  // conveyor gauntlet
  addConveyor(0, 0, -13, 4, 10, 2.5, 0); addConveyor(0, 0, -23, 4, 10, -2.5, 0);
  for (const z of [-12, -22]) { gnd(-3.4, 1.2, z, 0.6, 9, 1.2, 'metal'); gnd(3.4, 1.2, z, 0.6, 9, 1.2, 'metal'); }
  addHint(2, 0, -7, '<b>Sideways conveyors</b> try to push you off. Walk against them!', null, 2.2);
  coinLine(0, 1.3, -10, 0, 1.3, -26, 6);
  // floor A: crate puzzle
  gnd(0, 0, -40, 24, 20, 6, 'lab');
  addCheckpoint(-2, 0, -31.5, 0);
  addPet('pirat', -8.5, 0, -32, 0.8, 'Arr! Push both <b>cheese crates</b> onto the yellow switches and the vault door opens. The blue pad puts the crates back if you get stuck!');
  const cA = addPushBlock(-5, 0, -37), cB = addPushBlock(5, 0, -37);
  for (const c of [cA, cB]) if (c.mesh) c.mesh.traverse((o) => { if (o.isMesh) o.material = mat(0xffd23f, { emissive: 0x2a1a00, map: crateTex }); });
  const sA = addPressureSwitch(-5, 0, -45), sB = addPressureSwitch(5, 0, -45);
  addResetPad(0, 0, -33, [cA, cB]);
  gnd(-7.5, 6, -50.5, 9, 1, 6, 'metal'); gnd(7.5, 6, -50.5, 9, 1, 6, 'metal');
  const vault = addGate(0, 6, -50.5, 6, 1, 6);
  W.things.push({ update() { if (!vault.opening && sA.pressed && sB.pressed) { vault.open(); showToast('<b>VAULT OPEN!</b>', 3); Snd.S.solve(); } } });
  addRobot(-9, 0, -42, -9, -48); addRobot(9, 0, -48, 9, -42, 1);
  dConsole(-10, 0, -36, Math.PI / 2); dTank(10, 0, -34, 0xff6bd6); dCheese(9.5, 0, -38, 0.8); dBarrel(-10.5, 0, -46, 0x3a7a5a);
  addQBlock(0, 3.4, -40, 'coins');
  // star 1 on top of the tanks (laser-lit catwalk)
  gnd(10, 3, -45.5, 3, 3, 3, 'metal'); gnd(10, 4.6, -48.5, 3, 3, 4.6, 'metal'); addItem('star', 10, 5.9, -48.5, { idx: 0 });
  // floor B: pistons + lasers to the lab
  gnd(0, 0, -64, 20, 26, 6, 'lab');
  addCheckpoint(2, 0, -53.5, 0);
  addLaser(0, 0, -58, 9, 'x', 1.6, 1.6, 0);
  addLaser(0, 0, -66, 9, 'x', 1.6, 1.6, 1.6);
  addHint(-3, 0, -55, '<b>Laser fences</b> blink on and off. They flicker right before they switch on!', null, 2.2);
  addPiston(-8.4, 0, -62, 2, 3, 2, 'x', 3, 3, 0);
  addPet('snowie', 7.5, 0, -70, -1, 'Squeak! I saw a <b>secret star</b> up on the cheese silo. Teleport pads are behind me!');
  addTeleporter(4, 0, -74, 13, 8, -74);
  gnd(13, 8, -74, 4, 4, 2, 'cheese'); dCheese(13, 8, -75.4, 0.9); addItem('star', 13, 9.6, -73, { idx: 1 });
  const silo = M(G.cyl, 0xffd23f, 2.4, 14, 2.4); silo.position.set(16, 1, -76); W.deco.add(silo);
  dConsole(-7, 0, -72, 0.5); dTank(-8.5, 0, -68); dCrate(8.5, 0, -57, 1); dCrate(8.5, 1, -57, 0.8);
  // floor C: gear lift + secret star, goal
  addGear(0, 0, -82, 3.2, 0.9);
  gnd(0, 0, -96, 18, 18, 6, 'lab');
  addCheckpoint(-3, 0, -88, 0);
  addRobot(-5, 0, -94, 5, -94); addBee(0, 2.5, -98);
  addSecretBlock(-10.6, 1.2, -96, 2.2, 2.2, 'cheese'); addSecretBlock(-13.4, 2.6, -98, 2.2, 2.2, 'cheese');
  gnd(-16.4, 3.6, -100, 3, 3, 6, 'lab'); addItem('star', -16.4, 4.9, -100, { idx: 2 });
  addBox(0, 0.8, -101, 4, 4, 0.8, 'cheese');
  addGoal(0, 0.8, -101, 'star');
  dConsole(7, 0, -90, -Math.PI / 2); dTank(7.5, 0, -98, 0xffd23f); dCheese(-6.5, 0, -103, 0.8); dRatSign(5, 0, -104, -0.4);
  W.titleFocus = new V3(0, 1, -30);
}

// =====================================================================
// WORLD 3-1 — SHELL-TOUGH TEST TRACK (Tortuga Tech, with Torty)
// =====================================================================
function techEnv(long) {
  setupEnv({ top: 0x3a9aff, horizon: 0xd8fff0, bottom: 0x8ad8c0, fog: 0xd8fff0, fogNear: 90, fogFar: 300, hemiSky: 0xffffff, hemiGround: 0x5a9a7a, hemiI: 0.8, sunColor: 0xfff6e0, sunI: 1.0, amb: 0.22, sunSprite: 0xfff3b0 });
  W.killY = -6;
  const water = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400), mat(0x2fc0b0, { transparent: true, opacity: 0.88, roughness: 0.2 })); water.rotation.x = -Math.PI / 2; water.position.y = -3.2; W.root.add(water); W.water = water;
  const r = mulberry(71);
  for (let i = 0; i < 16; i++) { const a = (i / 16) * TAU, d = 170 + r() * 60, s = 30 + r() * 30; const h = M(G.sphereLo, [0x59d65a, 0x3fbf4a][i % 2], s, s * 0.5, s); if (long) h.position.set(Math.cos(a) * (d + 40), -10, Math.sin(a) * (d + 40) * 1.9 - 290); else h.position.set(Math.cos(a) * d, -10, Math.sin(a) * d - 50); (W.deco || W.root).add(h); }
  skyClouds(16, 35, 70, 70, 220, 9);
}
function dTestDummy(x, top, z) {
  const g = new THREE.Group();
  const b = M(G.box, 0xffd23f, 0.8, 1.2, 0.5); b.position.y = 1.2; g.add(b);
  const h = M(G.sphereLo, 0xffd23f, 0.32); h.position.y = 2.1; g.add(h);
  for (const s of [-1, 1]) { const l = M(G.box, 0x2b2f38, 0.25, 0.7, 0.25); l.position.set(s * 0.2, 0.35, 0); g.add(l); const t = new THREE.Mesh(G.cyl, basic(0x1b1440)); t.scale.set(0.12, 0.02, 0.12); t.rotation.x = Math.PI / 2; t.position.set(s * 0.18, 1.4, 0.26); g.add(t); }
  deco(g, x, top, z);
}
function dShellSign(x, top, z, ry, txt) { dSign(x, top, z, ry, txt || 'TORTUGA TECH', '#2f7a52'); }
function buildTortuga1() {
  techEnv();
  gnd(0, 0, 0, 18, 16, 8, 'tech');
  dShellSign(-5, 0, -6, 0.3);
  addPet('torty', 4, 0, 1.5, -2.3, 'Hello! I\'m <b>Torty</b>, boss of <b>Tortuga Tech</b>. We test things to make them <b>shell-tough</b>. Survive the crash-test track and you\'re hired!');
  dTestDummy(-6, 0, 3); dTestDummy(-7, 0, 1.5); dConsole(6, 0, -4, -Math.PI / 2);
  coinLine(0, 0.9, 3, 0, 0.9, -6, 4);
  // the crusher alley (thwomps) on a narrow bridge
  gnd(0, 0, -16, 4, 14, 1.2, 'metal');
  addThwomp(0, 0, -13.5, 4.2); addThwomp(0, 0, -19.5, 4.2);
  addHint(2.4, 0, -8, '<b>CRASH TEST!</b> Crushers slam down. Run under when they rise!', null, 2.2);
  coinLine(0, 1, -10, 0, 1, -22, 5);
  // floor A: spinning logs and the dummy range
  gnd(0, 0, -34, 22, 18, 8, 'tech');
  addCheckpoint(-2, 0, -26, 0);
  addLog(0, 0, -32, 10, 1.2); addLog(0, 0, -38, 10, -1.0);
  addWalker(-6, 0, -36); addWalker(6, 0, -30); addSpiky(-7, 0, -41, 7, -41);
  for (let i = 0; i < 4; i++) dTestDummy(-9.5, 0, -27 - i * 3.5);
  dShellSign(9.7, 0, -27, -Math.PI / 2, 'SHELL-TOUGH');
  gnd(9, 2.5, -40, 3, 3, 2.5, 'shell'); gnd(9, 5, -36.5, 3, 3, 5, 'shell'); addItem('star', 9, 6.3, -36.5, { idx: 0 });
  // firebar furnace bridge
  gnd(0, 0, -50, 4, 10, 1.2, 'metal'); addFirebar(0, 1.2, -50, 5, 1.6, 0);
  coinLine(0, 1.2, -46, 0, 1.2, -54, 4);
  // floor B: color-switch test with Torty's robots
  gnd(0, 0, -66, 22, 22, 8, 'tech');
  addCheckpoint(2, 0, -57, 0);
  addRobot(-6, 0, -62, -6, -72); addRobot(6, 0, -72, 6, -62, 1.2);
  addToggleSwitch(-4, 0, -60);
  addColorBlock(-8, 1.6, -66, 2.4, 2.4, 'red', 1.6); addColorBlock(-8, 3.2, -69.5, 2.4, 2.4, 'blue', 1.6); addColorBlock(-8, 4.8, -73, 2.4, 2.4, 'red', 1.6);
  gnd(-8, 6, -76.5, 3, 3, 6, 'shell'); addItem('star', -8, 7.3, -76.5, { idx: 1 });
  addHint(-1.5, 0, -59, 'Stomp the <b>switch</b> to swap the <b>red</b> and <b>blue</b> blocks. Swap at the right moment to climb!', null, 2.4);
  dConsole(8.5, 0, -58, -Math.PI / 2); dTestDummy(9.5, 0, -64); dTestDummy(9.5, 0, -67); dCrate(9, 0, -75, 1.2);
  // the shell-drop tower: springs + falling platforms, star 3
  addSpring(4, 0, -72);
  addFalling(4, 6, -77, 2.6, 2.6); addFalling(1, 7, -80, 2.6, 2.6);
  gnd(-2.5, 8, -83, 3, 3, 1.2, 'shell'); addItem('star', -2.5, 9.3, -83, { idx: 2 });
  // goal: Torty's hiring stage
  gnd(0, 0, -86, 10, 18, 8, 'tech');
  addBox(0, 0.8, -90, 4, 4, 0.8, 'shell');
  addGoal(0, 0.8, -90, 'flag');
  dShellSign(-3.5, 0, -82, 0.4, 'YOU\'RE HIRED!'); dTestDummy(3.5, 0, -92);
  W.titleFocus = new V3(0, 1, -30);
}
function newLevelDefs() {
  return [
    { name: 'RED ROCK TRAIL', sub: 'WORLD 1-1', world: 1, worldName: "CANDY'S CANYON", song: 8, build: buildCanyon1, start: [0, 0, 5], blurb: "Dig up Candy's 3 bones · mine cart · hot springs", isNew: true, tz: { e: -9, s: 'mesa', w: 'redrock' } },
    { name: 'MESA MINES', sub: 'WORLD 1-2', world: 1, worldName: "CANDY'S CANYON", song: 8, build: buildCanyon2, start: [0, 0, 5], blurb: 'Lever lamps · runaway carts · the crane', isNew: true, tz: { e: -9, s: 'desert', w: 'mine' } },
    { name: 'CHEESE CONVEYOR', sub: 'WORLD 2-1', world: 2, worldName: 'RATITA WORKS', song: 9, build: buildRatita1, start: [0, 0, 5], blurb: 'Cheese-crate vault · lasers · teleporters', isNew: true, tz: { e: -9, s: 'lab', w: 'metal' } },
    { name: 'SHELL-TOUGH TEST TRACK', sub: 'WORLD 3-1', world: 3, worldName: 'TORTUGA TECH', song: 11, build: buildTortuga1, start: [0, 0, 5], blurb: 'Crushers · firebars · color-swap tower', isNew: true, tz: { e: -10, s: 'tech', w: 'shell' } },
  ];
}
