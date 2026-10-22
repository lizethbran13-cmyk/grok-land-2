// =====================================================================
// BOOST ZONE helpers shared by Canyon Rush + Shell Speedway
// =====================================================================
// a rail loop: enters at (x, z) heading -z, exits at (x + 3, z - 34)
function loopRail(x, top, z, glow) {
  const y = top;
  return addRail([[x, y + 0.3, z], [x, y + 0.3, z - 8], [x, y + 0.6, z - 15], [x + 0.4, y + 3.2, z - 21], [x + 0.9, y + 7.2, z - 22.5], [x + 1.4, y + 9.2, z - 18], [x + 1.9, y + 7.2, z - 13.5], [x + 2.4, y + 3.2, z - 15], [x + 2.8, y + 0.8, z - 21], [x + 3, y + 0.3, z - 28], [x + 3, y + 0.3, z - 34]], { glow: glow || 0xff4fd8 });
}
// a tiled lane along -z with curbs (the texture repeats, it never stretches)
function rushLane(x, top, z0, z1, w, col, curb) {
  const L = Math.abs(z1 - z0), zc = (z0 + z1) / 2;
  const lane = new THREE.Mesh(boxGeoUV(w, 0.06, L, 3, 1), texMat(col, 'speck')); lane.position.set(x, top + 0.03, zc); W.deco.add(lane);
  for (const s of [-1, 1]) {
    if (curb === 'race') { for (let z = Math.max(z0, z1); z > Math.min(z0, z1); z -= 2) { const c = M(G.box, ((z / 2) | 0) % 2 ? 0xff3b3b : 0xf4efe6, 0.6, 0.14, 2); c.position.set(x + s * (w / 2 + 0.3), top + 0.07, z - 1); W.deco.add(c); } }
    else { const c = M(G.box, curb || 0xf4efe6, 0.3, 0.12, L); c.position.set(x + s * (w / 2 + 0.15), top + 0.06, zc); W.deco.add(c); }
  }
}
function dCone(x, top, z) { const c = M(G.cone, 0xff7a1a, 0.32, 0.8, 0.32); c.position.set(x, top + 0.4, z); W.deco.add(c); const b = M(G.box, 0xf4efe6, 0.5, 0.06, 0.5); b.position.set(x, top + 0.03, z); W.deco.add(b); const s = M(G.cyl8, 0xffffff, 0.2, 0.12, 0.2); s.position.set(x, top + 0.45, z); W.deco.add(s); }
function dTire(x, top, z, n) { for (let i = 0; i < (n || 3); i++) { const t = M(G.torus, 0x23262e, 0.55, 0.55, 0.9); t.rotation.x = Math.PI / 2; t.position.set(x, top + 0.2 + i * 0.36, z); W.deco.add(t); } addSolid(x, top + 0.6, z, 0.6, 0.6, 0.6, 'static', null).noCam = true; }
function dHut(x, top, z, w, d, h, style, roofCol, ry, sign, signBg) {
  gnd(x, top + h, z, w, d, h, style);
  const roof = new THREE.Mesh(PRISM, mat(roofCol || 0x7a2a22)); roof.scale.set(w + 0.6, h * 0.45, d + 0.6); roof.rotation.y = (ry || 0) + Math.PI / 2; roof.position.set(x, top + h, z); W.deco.add(roof);
  const door = M(G.box, 0x3a2414, 1.2, 1.9, 0.08); const s = Math.sign(-x) || 1; door.position.set(x + s * (w / 2 + 0.03), top + 0.95, z); door.rotation.y = Math.PI / 2; W.deco.add(door);
  if (sign) dSign(x + s * (w / 2 + 1.2), top, z + d / 2 - 0.6, s > 0 ? Math.PI / 2 : -Math.PI / 2, sign, signBg);
}
function dSunflower(x, top, z, s) { s = s || 1; const g = new THREE.Group(); const st = M(G.cyl8, 0x3a9a40, 0.06 * s, 1.8 * s, 0.06 * s); st.position.y = 0.9 * s; g.add(st); const h = M(G.cyl, 0xffc21a, 0.42 * s, 0.08, 0.42 * s); h.rotation.x = Math.PI / 2.4; h.position.set(0, 1.85 * s, 0.05); g.add(h); const c = M(G.cyl, 0x6b3b1f, 0.2 * s, 0.1, 0.2 * s); c.rotation.x = Math.PI / 2.4; c.position.set(0, 1.86 * s, 0.1); g.add(c); deco(g, x, top, z, 0.3); }
function dBeehive(x, top, z) { const g = new THREE.Group(); const st = M(G.box, 0x7a4a24, 0.9, 0.5, 0.9); st.position.y = 0.25; g.add(st); for (let i = 0; i < 3; i++) { const b = M(G.box, i % 2 ? 0xffd23f : 0xf5c542, 1.0, 0.4, 1.0); b.position.y = 0.7 + i * 0.42; g.add(b); } const r = M(G.box, 0xf4efe6, 1.2, 0.12, 1.2); r.position.y = 1.95; g.add(r); deco(g, x, top, z); addSolid(x, top + 1, z, 0.5, 1, 0.5, 'static', null).noCam = true; }
function dScarecrow(x, top, z) { const g = new THREE.Group(); const p = M(G.cyl8, 0x7a4a24, 0.08, 2.4, 0.08); p.position.y = 1.2; g.add(p); const arm = M(G.cyl8, 0x7a4a24, 0.06, 1.8, 0.06); arm.rotation.z = Math.PI / 2; arm.position.y = 1.7; g.add(arm); const sh = M(G.box, 0x3b8bff, 0.7, 0.8, 0.35); sh.position.y = 1.6; g.add(sh); const hd = M(G.sphereLo, 0xf4d978, 0.3); hd.position.y = 2.3; g.add(hd); const hat = M(G.cone, 0xc98a4b, 0.45, 0.4, 0.45); hat.position.y = 2.65; g.add(hat); deco(g, x, top, z); }
function dRockArch(x, top, z) { // decorative canyon arch over the lane (pillars stand well outside it)
  gnd(x - 9, top + 7, z, 2.4, 2.4, 7, 'redrock'); gnd(x + 9, top + 7, z, 2.4, 2.4, 7, 'redrock');
  const b = styledMesh(20.4, 2, 3, 'redrock'); b.position.set(x, top + 8, z); W.deco.add(b);
}
function dMineMouth(x, top, z, ry) { // a tunnel entrance set in a cliff
  const g = new THREE.Group();
  const cliff = styledMesh(10, 9, 4, 'redrock'); cliff.position.y = 4.5; g.add(cliff);
  const hole = M(G.box, 0x120c08, 3.2, 3.6, 0.1); hole.position.set(0, 1.8, 2.02); g.add(hole);
  for (const s of [-1, 1]) { const p = M(G.box, 0x7a4a24, 0.35, 3.9, 0.35); p.position.set(s * 1.8, 1.95, 2.15); g.add(p); }
  const beam = M(G.box, 0x7a4a24, 4.2, 0.4, 0.4); beam.position.set(0, 3.95, 2.15); g.add(beam);
  deco(g, x, top, z, ry);
  const c = Math.abs(Math.sin(ry || 0)) > 0.5; addSolid(x, top + 4.5, z, c ? 2 : 5, 4.5, c ? 5 : 2, 'static', null);
}
function dGarage(x, top, z, ry, label) { // Tortuga Tech pit garage
  const g = new THREE.Group();
  const body = styledMesh(6, 4, 6, 'tech'); body.position.y = 2; g.add(body);
  const door = M(G.box, 0x2b2f38, 4.2, 3, 0.08); door.position.set(0, 1.5, 3.03); g.add(door);
  for (let i = 0; i < 6; i++) { const l = M(G.box, 0x4a505c, 4.2, 0.06, 0.1); l.position.set(0, 0.3 + i * 0.5, 3.06); g.add(l); }
  const stripe = M(G.box, 0xffd23f, 6.05, 0.3, 6.05); stripe.position.y = 3.6; g.add(stripe);
  deco(g, x, top, z, ry);
  addSolid(x, top + 2, z, 3, 2, 3, 'static', null);
  if (label) { const s = Math.sin(ry || 0), c = Math.cos(ry || 0); dShellSign(x + s * 3.6, top + 2.6, z + c * 3.6, ry, label); }
}

// =====================================================================
// BOOST ZONE 2 — CANYON RUSH (Candy's Canyon at full speed)
// =====================================================================

// fill the open water between mesas / decks so the gaps never look empty
function rushGap(z0, z1, kind, seed) {
  const r = mulberry(seed || 7);
  for (let z = z0 - 6; z > z1 + 4; z -= 9 + r() * 5) {
    for (const sx of [-1, 1]) {
      const x = sx * (14 + r() * 10);
      if (kind === 'canyon') {
        const h = 6 + r() * 9, w = 2.6 + r() * 2.4;
        gnd(x, -3.4 + h, z, w, w * (0.8 + r() * 0.4), h + 2, 'redrock');
        dRocks(x + sx * 3, -3.4, z + 2, 3, (seed || 7) + z | 0);
      } else {
        const p = M(G.cyl8, 0x5d6673, 0.5, 9, 0.5); p.position.set(x, 0.6, z); W.deco.add(p);
        const b = M(G.sphereLo, r() < 0.5 ? 0xff7a1a : 0xffd23f, 1.1, 1.1, 1.1); b.position.set(x + sx * 2.5, -3.1, z + 3); W.deco.add(b);
      }
    }
  }
}
function buildCanyonRush() {
  canyonEnv();
  boostSetup({ rank: CANYON_RANK });
  // ---------- START MESA (top 0, z 20 .. -130) ----------
  gnd(0, 0, -55, 44, 150, 10, 'mesa');
  rushLane(0, 0, 18, -128, 12, 0xf0cf8e, 0xc8643a);
  dArch(0, 0, 6, 12, 'CANYON RUSH', 0xc8643a);
  addHint(-3.6, 0, 12.5, '<b>CANYON RUSH!</b> Hold <b>C</b> to BOOST down the canyon. Grind the mine rails and chain the blue pods with <b>SHIFT</b>!',
    '<b>CANYON RUSH!</b> Hold <b>BOOST</b> down the canyon. Grind the mine rails and chain the blue pods with <b>ACTION</b>!', 3);
  addPet('candy', 4.5, 0, 9, -2.4, 'Woof! This is MY canyon! Tumbleweeds are prickly: <b>jump</b> them, don\'t boost into them!');
  dTent(-10, 0, 12, Math.PI / 2, 0xff9d2e); dTent(10, 0, 12, -Math.PI / 2, 0x3b8bff); dBarrel(-8, 0, 15); dBarrel(8.5, 0, 15.5, 0x6b3b1f); dCrate(-8.5, 0, 9, 1);
  coinLine(0, 1, 2, 0, 1, -12, 8);
  addDashPanel(0, 0, -16, 0, 34);
  coinLine(0, 1, -22, 0, 1, -58, 14);
  addWalker(0, 0, -34); addWalker(-2.5, 0, -42); addWalker(2.5, 0, -50);
  addTumbleweed(-3.5, 0, -64, 3.5, -64);
  coinRing(0, 2.4, -64, 1.6, 8);
  addDashPanel(0, 0, -76, 0, 36);
  coinLine(3, 1, -82, -3, 1, -112, 10);
  addBuzzard(-2, 3, -94); addBuzzard(2, 3.2, -104);
  addQBlock(0, 3.4, -88, 'coins'); addQBlock(0, 3.4, -108, 'coins');
  dRockArch(0, 0, -46); dRockArch(0, 0, -100);
  for (let z = 0; z >= -122; z -= 12) { dCactus(-9.5, 0, z - 3, 0.9); dCactus(9.5, 0, z - 9, 1.05); dTorchPost(-7.4, 0, z - 8); dTorchPost(7.4, 0, z - 2); }
  // west: the camp + medal 1 on a rock pillar (spring up)
  dWagon(-15, 0, -20, 0.3); dTent(-18, 0, -30, 0.2, 0xff4d4d); dTent(-15, 0, -60, -0.3, 0xffd23f);
  const fire = M(G.cyl, 0x5a3a22, 0.8, 0.15, 0.8); fire.position.set(-16, 0.08, -40); W.deco.add(fire); addTorchDecor(-16, 0, -40);
  for (let i = 0; i < 4; i++) { const a = i / 4 * TAU; const lg = M(G.cyl8, 0x7a4a24, 0.25, 1.6, 0.25); lg.rotation.z = Math.PI / 2; lg.rotation.y = a; lg.position.set(-16 + Math.cos(a) * 1.8, 0.25, -40 + Math.sin(a) * 1.8); W.deco.add(lg); }
  gnd(-19, 6, -52, 2.6, 2.6, 16, 'redrock'); addSpring(-19, 0, -47.5); addItem('star', -19, 7.3, -52, { idx: 0 });
  addHint(-14, 0, -46, 'A <b>BOOST MEDAL</b> on the rock pillar! Bounce up from the spring.', null, 2.4);
  for (let i = 0; i < 5; i++) dBarrel(-17 + (i % 2) * 1.1, 0, -76 - i * 1.3); dCrate(-14, 0, -86, 1.2); dCrate(-14, 1.2, -86, 0.9); dSkull(-17, 0, -96, 0.6); dCactus(-18, 0, -110, 1.2);
  // east: the gold mine (tracks, carts, ore, tunnel)
  trackLine(16, 0, -6, -118);
  for (const z of [-24, -58, -92]) { const c = dMinecart(null); deco(c, 16, 0, z); addSolid(16, 0.8, z, 1, 0.8, 1.3, 'static', null).noCam = true; }
  dMineMouth(16, 0, -124, 0); dSign(12, 0, -114, -0.3, 'GOLD MINE', '#7a3a1a');
  dRocks(19.5, 0, -40, 5, 51, 0xffd23f); dRocks(19.5, 0, -76, 5, 52, 0xffd23f); dCrate(12.5, 0, -40, 1); dBarrel(12.5, 0, -72, 0x6b3b1f); dWagon(19, 0, -10, -0.2);
  for (const s of [-1, 1]) gnd(s * 21.6, 1, -55, 0.8, 150, 11, 'redrock');
  gnd(0, 1, 19.6, 44, 0.8, 11, 'redrock');
  // ---------- MINE RAIL over the river ----------
  addCheckpoint(-5.5, 0, -118, 0);
  addRail([[0, 0.3, -122], [0, 0.4, -130], [0, 2.4, -144], [-5, 3.4, -158], [-7, 2.6, -172], [-3, 1.6, -188], [0, 0.8, -200], [0, 0.3, -212], [0, 0.3, -218]], { glow: 0xffb43a });
  addHint(-3, 0, -124, '<b>MINE RAIL!</b> Run onto it to grind over the river. Or try the blue pods on the right...', null, 2.6);
  coinLine(-5, 4.2, -158, -7, 3.4, -172, 4);
  addPod(7, 5, -140); addPod(9, 6, -151); addPod(10, 6.5, -162); addPod(8, 6, -174); addPod(5, 5, -186); addPod(3, 4, -197);
  addItem('star', 10, 9.7, -162, { idx: 1 });
  for (let z = -140; z >= -196; z -= 14) { const t = M(G.box, 0x7a4a24, 0.5, 6, 0.5); t.position.set(-12, -1, z); W.deco.add(t); } // old trestle posts in the river
  // ---------- MESA B: the camp + loop (top 0, z -207 .. -283) ----------
  gnd(0, 0, -245, 44, 76, 10, 'mesa');
  rushLane(0, 0, -208, -282, 10, 0xf0cf8e, 0xc8643a);
  addCheckpoint(-6, 0, -212, 0);
  addPet('luna', -9, 0, -218, 0.6, 'Squeak! I\'m on a canyon road trip! Ride the <b>loop</b> ahead, it\'s the <b>Gold Rush Loop</b>!');
  addDashPanel(0, 0, -222, 0, 34);
  loopRail(0, 0, -236, 0xffb43a);
  addItem('star', 1.4, 10.1, -254, { idx: 2 });
  addPet('snowie', 10, 0, -232, -0.6, 'Squeak squeak! Something shiny sits at the very top of the loop...');
  coinRing(-10, 1.4, -250, 2.2, 8); coinRing(11, 1.4, -264, 2.2, 8);
  addBuzzard(-6, 3, -244); addWalker(7, 0, -270); addWalker(-7, 0, -276);
  dTent(-16, 0, -222, 0.4, 0x59d65a); dWagon(-15, 0, -240, 0.1); dBarrel(-17, 0, -256); dBarrel(-16, 0, -257.4, 0x6b3b1f); dCactus(-18, 0, -268, 1.1); dSkull(-14, 0, -278, 1.2);
  dCactus(17, 0, -214, 1); dCrate(15, 0, -246, 1.2); dRocks(18, 0, -258, 5, 61); dCactus(16, 0, -276, 0.9); dTorchPost(-6, 0, -228); dTorchPost(6, 0, -228);
  for (const s of [-1, 1]) gnd(s * 21.6, 1, -245, 0.8, 76, 11, 'redrock');
  addHoop(3, 1.6, -279, [0, 0.5, -1], 31);
  addHint(6.5, 0, -272, 'Jump through the pink <b>DASH HOOP</b> to fly over the river!', null, 2.4);
  // ---------- MESA C: buzzard flats (top 0, z -293 .. -397) ----------
  gnd(0, 0, -345, 44, 104, 10, 'mesa');
  rushLane(0, 0, -294, -396, 12, 0xf0cf8e, 0xc8643a);
  addCheckpoint(-7, 0, -298, 0);
  addDashPanel(0, 0, -306, 0, 36);
  coinLine(0, 1, -310, 0, 1, -340, 12);
  addTumbleweed(-3.5, 0, -322, 3.5, -322); addWalker(-2, 0, -332); addWalker(2, 0, -338);
  addBuzzard(0, 3, -350); addBuzzard(-3, 3.4, -356);
  addPet('pirat', -9, 0, -346, 0.5, 'Arr! Bop the buzzards with a <b>homing attack</b>: jump and press <b>SHIFT</b> when they\'re close!', 'Arr! Bop the buzzards with a <b>homing attack</b>: jump and tap <b>ACTION</b>!');
  addDashPanel(0, 0, -362, 0, 36);
  coinLine(-3, 1, -366, 3, 1, -384, 8); addTumbleweed(-3.5, 0, -374, 3.5, -374);
  dRockArch(0, 0, -330); dRockArch(0, 0, -380);
  for (let z = -300; z >= -392; z -= 12) { dCactus(-9.5, 0, z - 2, 1); dCactus(9.5, 0, z - 8, 0.9); }
  dWagon(-16, 0, -310, -0.4); dTent(-17, 0, -325, 0.1, 0xff9d2e); dRocks(-17, 0, -362, 5, 71); dSkull(-15, 0, -372, 2); dBarrel(-14, 0, -388);
  trackLine(16, 0, -300, -390); { const c = dMinecart(null); deco(c, 16, 0, -330); addSolid(16, 0.8, -330, 1, 0.8, 1.3, 'static', null).noCam = true; }
  dRocks(19.5, 0, -350, 5, 72, 0xffd23f); dMineMouth(16, 0, -396, 0); dCrate(13, 0, -370, 1);
  for (const s of [-1, 1]) gnd(s * 21.6, 1, -345, 0.8, 104, 11, 'redrock');
  // ---------- CANYON RIM RAIL (the long one) ----------
  addCheckpoint(-5.5, 0, -386, 0);
  addRail([[0, 0.3, -388], [0, 0.5, -398], [4, 3, -412], [8, 4.5, -428], [6, 5, -444], [0, 4.6, -458], [-4, 3.6, -472], [0, 2.6, -484], [0, 2.3, -494], [0, 2.3, -500]], { glow: 0xffb43a });
  coinLine(4, 3.9, -412, 8, 5.4, -428, 4); coinLine(0, 5.4, -458, -4, 4.4, -472, 4);
  addPod(-6, 6, -420); addPod(-8, 7, -434); addPod(-6, 7, -448);
  for (let z = -410; z >= -480; z -= 14) { const t = M(G.box, 0x7a4a24, 0.5, 8, 0.5); t.position.set(12, 0, z); W.deco.add(t); }
  // ---------- TRADING POST + GOAL (top 2, z -490 .. -570) ----------
  gnd(0, 2, -530, 44, 80, 12, 'mesa');
  rushLane(0, 2, -491, -569, 12, 0xf0cf8e, 0xc8643a);
  addCheckpoint(-7, 2, -496, 0);
  addDashPanel(0, 2, -506, 0, 34);
  coinLine(0, 3, -510, 0, 3, -540, 10);
  addWalker(-2, 2, -522); addWalker(2, 2, -530);
  addGoalRing(0, 2, -556);
  addPet('torty', 9, 2, -552, -0.8, 'Shell-tough canyon run! Tortuga Tech clocked you. Get under <b>' + CANYON_RANK[0] + ' seconds</b> for an <b>S RANK</b>!');
  dHut(-15, 2, -512, 7, 8, 4, 'wood', 0x7a2a22, 0, 'TRADING POST', '#7a3a1a'); dHut(-15, 2, -540, 7, 8, 4, 'wood', 0x3a5a7a, 0, 'CANDY\'S BONES', '#5a3a1a');
  dHut(15, 2, -526, 7, 10, 4, 'wood', 0x5a3a22, 0, 'WATER TOWER', '#3a5a7a');
  dBleachers(14, 2, -548, 8, -Math.PI / 2); dFlagLine(-12, -566, 12, -566, 6);
  for (const s of [-1, 1]) { const pole = M(G.cyl8, 0x7a4a24, 0.12, 6, 0.12); pole.position.set(s * 12, 5, -566); W.deco.add(pole); }
  dBarrel(-9, 2, -500); dBarrel(9, 2, -500, 0x6b3b1f); dCactus(-18, 2, -560, 1.2); dCactus(18, 2, -500, 1); dCrate(-9, 2, -552, 1); dTorchPost(-6, 2, -546); dTorchPost(6, 2, -546);
  for (const s of [-1, 1]) gnd(s * 21.6, 3, -530, 0.8, 80, 13, 'redrock');
  gnd(0, 3, -569.6, 44, 0.8, 13, 'redrock');
  // far walls so the long canyon keeps layered rock past the first stretch
  const wr = mulberry(77);
  for (const s of [-1, 1]) for (let i = 0; i < 10; i++) { const h = 18 + wr() * 16, w = 14 + wr() * 10, z = -230 - i * 36; const m = styledMesh(w, h + 6, 30, i % 2 ? 'mesa' : 'redrock'); m.position.set(s * (36 + wr() * 10), h / 2 - 6, z); W.deco.add(m); }
  rushGap(-130, -207, 'canyon', 11); rushGap(-397, -490, 'canyon', 23);
  W.titleFocus = new V3(0, 2, -40);
}
const CANYON_RANK = [23, 30, 42];

// =====================================================================
// BOOST ZONE 3 — SHELL SPEEDWAY (Tortuga Tech's test speedway)
// =====================================================================
function buildSpeedwayRush() {
  techEnv(true);
  boostSetup({ rank: SPEED_RANK });
  // ---------- PIT STRAIGHT (top 0, z 20 .. -130) ----------
  gnd(0, 0, -55, 44, 150, 10, 'tech');
  rushLane(0, 0, 18, -128, 14, 0x3a3f4a, 'race');
  for (let z = 14; z > -126; z -= 6) { const d = M(G.box, 0xf4efe6, 0.25, 0.07, 2.5); d.position.set(0, 0.04, z); W.deco.add(d); }
  dArch(0, 0, 6, 14, 'SHELL SPEEDWAY', 0x2f7a52);
  for (let i = 0; i < 8; i++) { const c = M(G.box, i % 2 ? 0x111111 : 0xffffff, 1.75, 0.07, 1); c.position.set(-6.125 + i * 1.75, 0.045, 3); W.deco.add(c); }
  addHint(-4, 0, 12.5, '<b>SHELL SPEEDWAY!</b> Tortuga Tech\'s fastest track. Hit every <b>dash panel</b>, grind the banked rails, and don\'t slam the walls!', null, 3);
  addPet('torty', 5, 0, 10, -2.4, 'Welcome to my <b>speedway</b>! Tortuga Tech builds things <b>shell-tough</b>, but crashing still costs you rings. Go go go!');
  dTestDummy(-9, 0, 12); dTestDummy(-10, 0, 10); dConsole(9, 0, 14, -Math.PI / 2);
  coinLine(0, 1, 0, 0, 1, -12, 7);
  addDashPanel(0, 0, -16, 0, 36); addDashPanel(-3, 0, -50, 0, 36); addDashPanel(3, 0, -84, 0, 36);
  coinLine(0, 1, -22, 0, 1, -46, 10); coinLine(-3, 1, -54, -3, 1, -80, 10); coinLine(3, 1, -88, 3, 1, -112, 9);
  addRobot(-3, 0, -36, 3, -36); addRobot(3, 0, -66, -3, -66, 1.2); addWalker(0, 0, -100); addWalker(-3, 0, -106);
  addQBlock(0, 3.4, -60, 'coins'); addQBlock(0, 3.4, -96, 'coins');
  for (let z = 4; z >= -122; z -= 8) { dCone(-8.4, 0, z); dCone(8.4, 0, z - 4); }
  // west: grandstands + scoreboard
  dBleachers(-15, 0, -24, 16, Math.PI / 2); dBleachers(-15, 0, -66, 16, Math.PI / 2); dBleachers(-15, 0, -104, 14, Math.PI / 2);
  for (const s of [-1, 1]) { const p = M(G.cyl8, 0x5d6673, 0.2, 9, 0.2); p.position.set(-19, 4.5, -45 + s * 3); W.deco.add(p); }
  dShellSign(-19, 6, -45, Math.PI / 2, 'LAP 1 / 1');
  // east: pit garages, tyres, the medal on a garage roof
  dGarage(16, 0, -14, -Math.PI / 2, 'PIT 1'); dGarage(16, 0, -34, -Math.PI / 2, 'PIT 2'); dGarage(16, 0, -54, -Math.PI / 2); dGarage(16, 0, -74, -Math.PI / 2, 'PIT 4');
  addSpring(11.5, 0, -54); addItem('star', 16, 5.3, -54, { idx: 0 });
  addHint(11, 0, -48, 'A <b>BOOST MEDAL</b> on the garage roof! Spring up!', null, 2.2);
  dTire(11, 0, -24); dTire(11, 0, -44, 2); dTire(11.5, 0, -88); dTire(12.5, 0, -90, 2); dCrate(17, 0, -96, 1.2); dTestDummy(17, 0, -104); dTestDummy(18, 0, -108); dConsole(16, 0, -116, -Math.PI / 2);
  addPet('snowie', 11.5, 0, -64, -1.2, 'Squeak! I\'m the <b>pit crew</b>! There\'s a medal up on the roof of Pit 3.');
  for (const s of [-1, 1]) gnd(s * 21.6, 1, -55, 0.8, 150, 11, 'shell');
  gnd(0, 1, 19.6, 44, 0.8, 11, 'shell');
  // ---------- BANKED SWEEPER RAIL over the bay ----------
  addCheckpoint(-6, 0, -118, 0);
  addRail([[0, 0.3, -122], [0, 0.5, -132], [6, 3, -146], [14, 5, -160], [16, 6, -176], [10, 6, -190], [0, 4.6, -200], [-8, 3, -210], [-6, 1.4, -222], [0, 0.3, -232], [0, 0.3, -238]], { glow: 0x3ff0ff });
  coinLine(14, 5.9, -160, 16, 6.9, -176, 4); coinLine(0, 5.4, -200, -8, 3.9, -210, 4);
  addPod(2, 6, -150); addPod(4, 7, -162); addPod(4, 7.5, -174); addPod(2, 7, -186);
  addItem('star', 4, 10.7, -174, { idx: 1 });
  addHint(-3, 0, -124, '<b>BANKED RAIL!</b> Grind the big sweeper over the bay. Pods in the middle hide a medal...', null, 2.4);
  for (let z = -140; z >= -224; z -= 14) { const b = M(G.box, 0xffd23f, 1.2, 0.8, 0.9); b.position.set(-14, -3, z); W.deco.add(b); } // buoys
  // ---------- CRASH-TEST LAB + LOOP (top 0, z -227 .. -303) ----------
  gnd(0, 0, -265, 44, 76, 10, 'tech');
  rushLane(0, 0, -228, -302, 12, 0x3a3f4a, 'race');
  addCheckpoint(-6, 0, -232, 0);
  addDashPanel(0, 0, -242, 0, 34);
  loopRail(0, 0, -254, 0x3ff0ff);
  addPet('luna', -10, 0, -246, 0.6, 'Squeak! Tortuga Tech tests everything here, even this <b>loop</b>! Grab the medal at the top!');
  addItem('star', 1.4, 10.1, -272, { idx: 2 });
  coinRing(-10, 1.4, -270, 2.2, 8); coinRing(11, 1.4, -282, 2.2, 8);
  addRobot(-7, 0, -292, 7, -292);
  for (let i = 0; i < 5; i++) dTestDummy(-16, 0, -236 - i * 3.5);
  dConsole(-15, 0, -258, Math.PI / 2); dConsole(-15, 0, -264, Math.PI / 2); dTank(-17, 0, -276, 0x59d65a); dTank(-17, 0, -284, 0x56f0ff);
  dShellSign(14, 0, -236, -Math.PI / 2, 'CRASH TEST'); dCrate(15, 0, -250, 1.2); dCrate(16.4, 0, -250, 1.2); dCrate(15.7, 1.2, -250, 1.2); dTire(15, 0, -266); dTire(16.4, 0, -268, 2); dTestDummy(15, 0, -282); dCone(12, 0, -290); dCone(13, 0, -293);
  for (const s of [-1, 1]) gnd(s * 21.6, 1, -265, 0.8, 76, 11, 'shell');
  addHoop(3, 1.6, -299, [0, 0.5, -1], 31);
  // ---------- CHICANE (top 0, z -313 .. -417) ----------
  gnd(0, 0, -365, 44, 104, 10, 'tech');
  rushLane(0, 0, -314, -416, 14, 0x3a3f4a, 'race');
  addCheckpoint(-7, 0, -318, 0);
  addDashPanel(0, 0, -326, 0, 36);
  coinLine(-4, 1, -330, 4, 1, -350, 8); coinLine(4, 1, -352, -4, 1, -372, 8);
  addRobot(-3, 0, -342, 3, -342); addRobot(3, 0, -360, -3, -360, 0.8); addWalker(0, 0, -380);
  addDashPanel(0, 0, -386, 0, 36); coinLine(0, 1, -390, 0, 1, -408, 7);
  for (let z = -320; z >= -410; z -= 10) { dCone(-6.2, 0, z - (z % 20 ? 0 : 5)); dCone(6.2, 0, z - 5); }
  addPet('pirat', 10, 0, -340, -0.6, 'Arr! I fixed the <b>chicane</b>. Dodge the cones, or hold BOOST and bop the robots!');
  dBleachers(-15, 0, -350, 16, Math.PI / 2); dBleachers(-15, 0, -390, 14, Math.PI / 2);
  dGarage(16, 0, -366, -Math.PI / 2, 'TORTUGA TECH'); dTire(12, 0, -390); dTire(13.4, 0, -394, 2); dConsole(15, 0, -404, -Math.PI / 2);
  for (const s of [-1, 1]) gnd(s * 21.6, 1, -365, 0.8, 104, 11, 'shell');
  // ---------- FINAL BANKED RAIL ----------
  addCheckpoint(-6, 0, -406, 0);
  addRail([[0, 0.3, -408], [0, 0.5, -418], [-6, 3, -432], [-12, 5, -446], [-10, 5.4, -462], [0, 5, -472], [8, 4, -484], [4, 2.8, -496], [0, 2.3, -506], [0, 2.3, -512]], { glow: 0x3ff0ff });
  coinLine(-6, 3.9, -432, -12, 5.9, -446, 4); coinLine(0, 5.9, -472, 8, 4.9, -484, 4);
  addPod(-2, 7, -440); addPod(-3, 8, -452);
  for (let z = -430; z >= -500; z -= 14) { const b = M(G.box, 0xffd23f, 1.2, 0.8, 0.9); b.position.set(14, -3, z); W.deco.add(b); }
  // ---------- WINNER'S CIRCLE + GOAL (top 2, z -502 .. -582) ----------
  gnd(0, 2, -542, 44, 80, 12, 'tech');
  rushLane(0, 2, -503, -581, 14, 0x3a3f4a, 'race');
  addCheckpoint(-7, 2, -508, 0);
  addDashPanel(0, 2, -518, 0, 34);
  coinLine(0, 3, -522, 0, 3, -552, 10);
  addRobot(-3, 2, -534, 3, -534);
  for (let i = 0; i < 8; i++) { const c = M(G.box, i % 2 ? 0x111111 : 0xffffff, 1.75, 0.07, 1); c.position.set(-6.125 + i * 1.75, 2.045, -560); W.deco.add(c); }
  addGoalRing(0, 2, -566);
  addPet('candy', 9, 2, -562, -0.8, 'Woof! You\'re a speedway champ! Torty says under <b>' + SPEED_RANK[0] + ' seconds</b> is an <b>S RANK</b>!');
  // podium
  gnd(-14, 3.6, -560, 3, 3, 1.6, 'shell'); gnd(-17, 3, -560, 3, 3, 1, 'shell'); gnd(-11, 2.6, -560, 3, 3, 0.6, 'shell');
  dShellSign(-14, 3.6, -563, 0, 'WINNERS');
  dBleachers(15, 2, -540, 14, -Math.PI / 2); dBleachers(15, 2, -566, 10, -Math.PI / 2);
  dFlagLine(-12, -576, 12, -576, 6); for (const s of [-1, 1]) { const pole = M(G.cyl8, 0xf4efe6, 0.1, 6, 0.1); pole.position.set(s * 12, 5, -576); W.deco.add(pole); }
  dTestDummy(-16, 2, -530); dConsole(-15, 2, -520, Math.PI / 2); dTire(-10, 2, -548); dCone(-8.6, 2, -540); dCone(8.6, 2, -526);
  for (const s of [-1, 1]) gnd(s * 21.6, 3, -542, 0.8, 80, 13, 'shell');
  gnd(0, 3, -581.6, 44, 0.8, 13, 'shell');
  // Tortuga Tech HQ on the horizon
  const hq = styledMesh(40, 30, 20, 'tech'); hq.position.set(-70, 10, -620); W.deco.add(hq);
  const dome = M(G.sphereLo, 0x3a9a6a, 16, 10, 12); dome.position.set(-70, 25, -620); W.deco.add(dome);
  rushGap(-130, -227, 'tech', 5); rushGap(-417, -502, 'tech', 9);
  W.titleFocus = new V3(0, 2, -40);
}
const SPEED_RANK = [24, 32, 45];
