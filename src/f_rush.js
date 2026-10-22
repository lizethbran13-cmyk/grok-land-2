// =====================================================================
// BOOST ZONE 1 — MEADOW RUSH (open zone: farm, orchard, lake rails, loop)
// =====================================================================
function rushEnv(c) {
  setupEnv(Object.assign({ top: 0x2a78ff, horizon: 0xcfeeff, bottom: 0x7cc6ff, fog: 0xcfeeff, fogNear: 110, fogFar: 360, hemiSky: 0xffffff, hemiGround: 0x6a9a50, hemiI: 0.75, sunColor: 0xfff2d8, sunI: 1.0, amb: 0.2, sunSprite: 0xfff3b0 }, c || {}));
  W.killY = -6;
  const water = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600), mat(0x3aa8f0, { transparent: true, opacity: 0.88, roughness: 0.2, metalness: 0.1 }));
  water.rotation.x = -Math.PI / 2; water.position.y = -3.2; W.root.add(water); W.water = water;
  if (SHADOWS) water.receiveShadow = true;
  const hr = mulberry(9);
  for (let i = 0; i < 22; i++) { // rolling hills ring the zone so the horizon is never empty
    const a = (i / 22) * TAU + hr() * 0.2, d = 230 + hr() * 60, s = 40 + hr() * 40;
    const hill = M(G.sphereLo, [0x59d65a, 0x3fbf4a, 0x86e05a][i % 3], s, s * (0.5 + hr() * 0.4), s);
    hill.position.set(Math.cos(a) * d, -14, Math.sin(a) * d * 1.75 - 300); (W.deco || W.root).add(hill); // ellipse around the longer course
  }
  skyClouds(24, 40, 80, 80, 260, 5);
  W.scenery = (dt, t) => { water.position.y = -3.2 + Math.sin(t * 0.8) * 0.08; };
}
const MEADOW_RANK = [24, 32, 45];
function buildRush() {
  rushEnv();
  boostSetup({ rank: MEADOW_RANK });
  // ---------- START PLAZA + BOOST STRAIGHT (top 0, z 20 .. -130) ----------
  gnd(0, 0, -55, 74, 150, 8, 'park');
  const path = new THREE.Mesh(boxGeoUV(12, 0.06, 146, 3, 1), texMat(0xe8d6a8, 'speck')); path.position.set(0, 0.03, -57); W.deco.add(path);
  for (const s of [-1, 1]) { const curb = M(G.box, 0xf4efe6, 0.3, 0.12, 146); curb.position.set(s * 6.1, 0.06, -57); W.deco.add(curb); }
  dArch(0, 0, 6, 12, 'BOOST ZONE');
  addHint(-3.6, 0, 12.5, '<b>BOOST MODE!</b> Hold <b>C</b> (or <b>B</b>) to <b>BOOST</b>. Rings refill the blue boost meter. In mid-air press <b>SHIFT</b> near an enemy or a blue pod for a <b>HOMING ATTACK</b>.',
    '<b>BOOST MODE!</b> Hold <b>BOOST</b> to blast off. Rings refill the meter. In mid-air tap <b>ACTION</b> near an enemy or blue pod for a <b>HOMING ATTACK</b>.', 3);
  addPet('candy', 4.5, 0, 9, -2.4, 'Woof! Hold <b>BOOST</b> and blast through those mushroom guys! Hitting a wall at full speed costs rings though, so steer!', 'Woof! Hold <b>BOOST</b> and blast through enemies! Hitting a wall at full speed costs rings, so steer!');
  dFlowerBed(-8, 0, 12, 4, 2); dFlowerBed(8, 0, 12, 4, 2); dBench(-9, 0, 4, Math.PI / 2); dBench(9, 0, 4, -Math.PI / 2);
  coinLine(0, 1, 2, 0, 1, -12, 8);
  addDashPanel(0, 0, -16, 0, 34);
  coinLine(0, 1, -22, 0, 1, -60, 14);
  addWalker(0, 0, -36); addWalker(-2.5, 0, -44); addWalker(2.5, 0, -52);
  addSpiky(-3, 0, -64, 3, -64);
  addHint(4, 0, -28, 'Spiky guys can\'t be boosted through: <b>jump</b> over them!', null, 2.5);
  coinRing(0, 2.4, -64, 1.6, 8);
  addDashPanel(0, 0, -76, 0, 36);
  coinLine(-3, 1, -82, 3, 1, -110, 10);
  addWalker(1.5, 0, -92); addWalker(-1.5, 0, -100);
  addQBlock(0, 3.4, -86, 'coins'); addQBlock(0, 3.4, -104, 'coins');
  // lining: trees, lamps and fences keep the straight tidy
  for (let z = 0; z >= -125; z -= 10) {
    dTree(-9.5, 0, z - 2, 0.95); dTree(9.5, 0, z - 7, 0.95);
    dLamp(-7.2, 0, z - 6); dLamp(7.2, 0, z - 1);
  }
  dFence(-12, 16, -12, -36, 0); dFence(-12, -44, -12, -126, 0);
  dFence(12, 16, 12, -86, 0); dFence(12, -94, 12, -126, 0);
  dSign(-12.6, 0, -40, Math.PI / 2, 'FARM', '#b83a2e'); dSign(12.6, 0, -90, -Math.PI / 2, 'ORCHARD', '#3a7a3a');
  // ---------- WEST: the farm (medal 1 on the barn roof) ----------
  dBarn(-27, 0, -24, 10, 12, 6);
  dHay(-19, 0, -36, 2, 2, 1.4); dHay(-21, 0, -34, 2, 2, 2.8); dHay(-23.5, 0, -32.5, 2, 2, 4.2); dHay(-17, 0, -38, 2, 2, 1.4);
  addItem('star', -27, 7.4, -24, { idx: 0 });
  coinLine(-19, 2.2, -36, -23.5, 5.2, -32.5, 3);
  addHint(-16, 0, -40, 'A <b>BOOST MEDAL</b> is shining on the barn roof. Climb the hay!', null, 2.4);
  addWindmill(-27, 0, -58, 10);
  dCrops(-24, 0, -78, 14, 12, 0x59d65a); dCrops(-24, 0, -96, 14, 10, 0xff9d2e);
  for (let i = 0; i < 6; i++) dHay(-33 + (i % 2) * 2.4, 0, -108 - (i >> 1) * 2.6, 2, 2, 1.4);
  dFence(-16, -70, -32, -70, 0, 0xc98a4b); dFence(-16, -103, -32, -103, 0, 0xc98a4b);
  addWalker(-22, 0, -50); addWalker(-28, 0, -88);
  dRocks(-34, 0, -14, 4, 11); dRocks(-34, 0, -122, 4, 12);
  // ---------- EAST: orchard + picnic + duck pond ----------
  for (let x = 17; x <= 33; x += 5.5) for (let z = 4; z >= -60; z -= 7) dTree(x, 0, z + ((x | 0) % 2) * 2, 0.85, [0x3fbf4a, 0x59d65a, 0x2fa84a][((x + z) & 3) % 3]);
  dPicnic(18, 0, -70, 0.2); dPicnic(26, 0, -72, -0.3, 0x3b8bff); dPicnic(22, 0, -80, 0.1, 0xffd23f);
  addPet('luna', 20, 0, -75, 0, 'Squeak! Did you know the boost meter fills up faster with every <b>ring</b>? Try the blue <b>dash panels</b> too!');
  const pond = new THREE.Mesh(new THREE.CircleGeometry(6, 28), mat(0x3aa8f0, { roughness: 0.2, metalness: 0.1 })); pond.rotation.x = -Math.PI / 2; pond.position.set(26, 0.04, -100); W.deco.add(pond);
  for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; const rk = M(G.dodeca, 0x9a9a9a, 0.6, 0.4, 0.6); rk.position.set(26 + Math.cos(a) * 6.2, 0.2, -100 + Math.sin(a) * 6.2); W.deco.add(rk); }
  for (let i = 0; i < 5; i++) { const lp = M(G.cyl, 0x3fbf4a, 0.5, 0.03, 0.5); lp.position.set(24 + i * 1.3, 0.08, -98 - (i % 2) * 2); W.deco.add(lp); }
  addSolid(26, -0.3, -100, 4.5, 0.3, 4.5, 'static', null); // the pond is shallow: you can splash right across
  dBench(18, 0, -110, Math.PI / 2); dFlowerBed(30, 0, -116, 4, 2); dRocks(34, 0, -122, 4, 13);
  // perimeter hedges so the zone has edges instead of empty space
  dHedgeWall(-36.5, 0, -55, 1.2, 150, 2.6); dHedgeWall(36.5, 0, -55, 1.2, 150, 2.6); dHedgeWall(0, 0, 19.4, 74, 1.2, 2.6);
  // ---------- CLIFF + STAIRS up to the rail plateau (top 6) ----------
  gnd(-22.5, 6, -140, 29, 20, 14, 'rock'); gnd(22.5, 6, -140, 29, 20, 14, 'rock');
  stairs(0, -130, -150, 0, 6, 16, 'stone', -8);
  addCheckpoint(-5.5, 0, -124, 0);
  coinLine(0, 1.3, -132, 0, 6.8, -148, 7);
  // ---------- RAIL PLATEAU ----------
  gnd(0, 6, -162, 44, 24, 14, 'park');
  addCheckpoint(-6, 6, -154, 0);
  addPet('pirat', 7, 6, -155, -0.6, 'Arr! Run onto the <b>rail</b> to grind. Hold <b>BOOST</b> to grind faster and <b>JUMP</b> to hop off! Or follow the blue <b>pods</b> with homing attacks...');
  dLamp(-10, 6, -158); dLamp(10, 6, -158); dRocks(-18, 6, -170, 5, 21); dRocks(18, 6, -170, 5, 22); dBench(-14, 6, -160, Math.PI / 2);
  dFlowerBed(-4, 6, -160, 3, 1.6); dFlowerBed(4, 6, -160, 3, 1.6);
  // lighthouse on the lake shore
  const lh = new THREE.Group();
  for (let i = 0; i < 4; i++) { const b = M(G.cyl, i % 2 ? 0xff4d4d : 0xf4efe6, 1.3 - i * 0.12, 2.2, 1.3 - i * 0.12); b.position.y = 1.1 + i * 2.2; lh.add(b); }
  const lamp = new THREE.Mesh(G.cyl8, basic(0xfff1b0)); lamp.scale.set(0.8, 1, 0.8); lamp.position.y = 9.4; lh.add(lamp);
  const roof = M(G.cone, 0x2b2f48, 1.1, 1.2, 1.1); roof.position.y = 10.5; lh.add(roof);
  deco(lh, 17, 6, -168); addSolid(17, 11, -168, 1.3, 5, 1.3, 'static', null);
  // the lake rail
  addRail([[0, 6.3, -166], [0, 6.2, -178], [-5, 5.0, -192], [-8, 4.4, -206], [-4, 5.6, -222], [0, 5.2, -238], [0, 4.4, -250]]);
  coinLine(-5, 6.2, -192, -8, 5.6, -206, 4);
  addHint(-3, 6, -170, '<b>GRIND RAIL!</b> Run onto it, hold <b>BOOST</b> to speed up, <b>JUMP</b> to hop off.', null, 2.6);
  // homing pod chain (alternate route + medal 2)
  addPod(8, 9, -181); addPod(10, 10, -191); addPod(10, 10.5, -201); addPod(8, 10, -211); addPod(6, 9.5, -222); addPod(4, 8.8, -233);
  addItem('star', 10, 13.2, -201, { idx: 1 });
  // ---------- LOOP ISLAND (top 4) ----------
  gnd(0, 4, -276, 46, 60, 12, 'park');
  addCheckpoint(-6, 4, -252, 0);
  addPet('snowie', -12, 4, -256, 0.5, 'Squeak squeak! Ride the <b>LOOP</b>! Something shiny sits right at the very top...');
  addRail([[0, 4.3, -258], [0, 4.3, -266], [0, 4.6, -273], [0.4, 7.2, -279], [0.9, 11.2, -280.5], [1.4, 13.2, -276], [1.9, 11.2, -271.5], [2.4, 7.2, -273], [2.8, 4.8, -279], [3, 4.3, -286], [3, 4.3, -292]], { glow: 0xff4fd8 });
  addItem('star', 1.4, 14.1, -276, { idx: 2 });
  addFlyer('gull', -8, 7, -268); addFlyer('gull', 9, 7, -284); addBee(-6, 6.5, -290); addBee(8, 6.5, -262);
  coinRing(-10, 5.2, -280, 2.2, 8); coinRing(11, 5.2, -270, 2.2, 8);
  for (let z = -250; z >= -304; z -= 9) { dTree(-20, 4, z, 0.9); dTree(20, 4, z - 4, 0.9); }
  dFlowerBed(-14, 4, -296, 4, 2); dFlowerBed(14, 4, -250, 4, 2); dRocks(-20, 4, -303, 4, 31); dRocks(20, 4, -248, 4, 32);
  // jump hoop over the water gap to the goal field
  addHoop(3, 5.6, -300, [0, 0.5, -1], 31);
  coinLine(3, 7.5, -306, 3, 6, -316, 4);
  addHint(6.5, 4, -296, 'Jump through the pink <b>DASH HOOP</b> to fly over the water!', null, 2.4);
  // ---------- WINDMILL FIELD (top 2, z -316 .. -368) ----------
  gnd(0, 2, -342, 44, 52, 10, 'park');
  rushLane(0, 2, -317, -367, 10, 0xe8d6a8);
  addCheckpoint(-7, 2, -322, 0);
  addDashPanel(0, 2, -330, 0, 34);
  coinLine(0, 3, -334, 0, 3, -358, 8);
  addWalker(-2, 2, -346); addWalker(2, 2, -352);
  dCrops(-14, 2, -332, 10, 12, 0xffc21a); dCrops(-14, 2, -350, 10, 10, 0x59d65a); addWindmill(15, 2, -334, 9);
  for (let i = 0; i < 4; i++) dHay(13 + (i % 2) * 2.4, 2, -350 - (i >> 1) * 2.6, 2, 2, 1.4);
  dScarecrow(-14, 2, -362); dLamp(-7, 2, -340); dLamp(7, 2, -350); dRocks(18, 2, -362, 4, 41);
  dHedgeWall(-21.4, 2, -342, 1.2, 52, 2.2); dHedgeWall(21.4, 2, -342, 1.2, 52, 2.2);
  // ---------- LAKE RAIL 2 ----------
  addRail([[0, 2.3, -360], [0, 2.4, -370], [3, 3.6, -384], [7, 4.4, -398], [4, 4.8, -412], [-3, 4.6, -426], [-5, 4.2, -440], [-1, 4.3, -452], [0, 4.3, -460], [0, 4.3, -466]]);
  coinLine(3, 4.5, -384, 7, 5.3, -398, 4); coinLine(-3, 5.5, -426, -5, 5.1, -440, 4);
  addPod(-6, 8, -390); addPod(-8, 9, -402); addPod(-6, 9, -414);
  addFlyer('gull', 10, 8, -420); addFlyer('gull', -12, 9, -400);
  for (let i = 0; i < 4; i++) { const lp = M(G.cyl, 0x3fbf4a, 0.9, 0.03, 0.9); lp.position.set(-12 + i * 7, -3.15, -380 - i * 18); W.deco.add(lp); }
  // ---------- SUNFLOWER HILLS (top 4, z -450 .. -530) ----------
  gnd(0, 4, -490, 46, 80, 12, 'park');
  rushLane(0, 4, -451, -529, 10, 0xe8d6a8);
  addCheckpoint(-6, 4, -456, 0);
  addDashPanel(0, 4, -462, 0, 32);
  loopRail(0, 4, -474, 0x3ff0ff);
  coinRing(-10, 5.4, -488, 2.2, 8); coinRing(11, 5.4, -500, 2.2, 8);
  addBee(-7, 6.5, -470); addBee(8, 6.5, -512); addWalker(-6, 4, -518); addWalker(7, 4, -478);
  for (let z = -454; z >= -526; z -= 4) { dSunflower(-15 - ((z / 4) & 1) * 1.2, 4, z, 1); dSunflower(-18, 4, z - 2, 1.1); dSunflower(15 + ((z / 4) & 1) * 1.2, 4, z - 1, 1); }
  dBeehive(-11, 4, -462); dBeehive(-11, 4, -466); dBeehive(11, 4, -506); dWagon(11, 4, -466, 0.2); dScarecrow(-11, 4, -500); dPicnic(-11, 4, -520, 0.3, 0xff4d4d);
  dHedgeWall(-22.4, 4, -490, 1.2, 80, 2.2); dHedgeWall(22.4, 4, -490, 1.2, 80, 2.2);
  addHoop(3, 5.6, -526, [0, 0.5, -1], 31);
  coinLine(3, 7.5, -532, 3, 6, -540, 3);
  // ---------- GOAL FIELD (top 2, z -540 .. -600) ----------
  gnd(0, 2, -570, 44, 60, 10, 'park');
  rushLane(0, 2, -541, -599, 10, 0xe8d6a8);
  addCheckpoint(-7, 2, -546, 0);
  addDashPanel(0, 2, -552, 0, 34);
  coinLine(0, 3, -556, 0, 3, -576, 6);
  addGoalRing(0, 2, -584);
  addPet('torty', 9, 2, -580, -0.8, 'Shell-tough run! Tortuga Tech clocked your time. Get under <b>' + MEADOW_RANK[0] + ' seconds</b> for an <b>S RANK</b>!');
  dBleachers(-14, 2, -578, 10, Math.PI / 2); dBleachers(16, 2, -568, 8, -Math.PI / 2);
  dFlagLine(-12, -592, 12, -592, 6);
  for (const s of [-1, 1]) { const pole = M(G.cyl8, 0xf4efe6, 0.1, 6, 0.1); pole.position.set(s * 12, 5, -592); W.deco.add(pole); }
  for (let x = -18; x <= 18; x += 6) dTree(x, 2, -596, 0.9);
  dLamp(-6, 2, -566); dLamp(6, 2, -572); dFlowerBed(-12, 2, -556, 4, 2); dFlowerBed(12, 2, -556, 4, 2);
  W.titleFocus = new V3(0, 2, -40);
}
