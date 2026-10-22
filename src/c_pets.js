// =====================================================================
// FAMILY PET CAMEOS: Luna, Pi-rat (one eye), Snowie, Candy and Torty
// =====================================================================
const RAT_COL = {
  luna: { fur: 0xa9afbd, dark: 0x7d8394, belly: 0xeceef3, eye: 0x1b1b24, name: 'Luna' },
  pirat: { fur: 0xc99a6b, dark: 0x9c7148, belly: 0xf6e7d4, eye: 0x1b1b24, name: 'Pi-rat' },
  snowie: { fur: 0xfbfbff, dark: 0xe3e1ee, belly: 0xffffff, eye: 0xd0315a, name: 'Snowie' },
};
const S16 = new THREE.SphereGeometry(1, 16, 12);
function buildRat(id) {
  const C = RAT_COL[id] || RAT_COL.luna;
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const torso = M(S16, C.fur, 0.42, 0.36, 0.62); torso.position.set(0, 0.38, 0); body.add(torso);
  const belly = M(S16, C.belly, 0.34, 0.26, 0.5); belly.position.set(0, 0.3, 0.06); body.add(belly);
  if (id === 'luna') { const saddle = M(S16, C.dark, 0.3, 0.14, 0.42); saddle.position.set(0, 0.66, -0.1); body.add(saddle); }
  const head = new THREE.Group(); head.position.set(0, 0.52, 0.55); body.add(head);
  const skull = M(S16, C.fur, 0.3, 0.27, 0.32); head.add(skull);
  const snout = M(S16, C.belly, 0.17, 0.15, 0.22); snout.position.set(0, -0.06, 0.26); head.add(snout);
  const nose = M(G.sphere, 0xff8fb1, 0.06); nose.position.set(0, -0.02, 0.47); head.add(nose);
  for (const s of [-1, 1]) {
    const ear = M(S16, 0xffb6c8, 0.15, 0.17, 0.04); ear.position.set(s * 0.22, 0.24, -0.02); ear.rotation.z = s * -0.3; head.add(ear);
    const earB = M(S16, C.fur, 0.17, 0.19, 0.03); earB.position.set(s * 0.22, 0.24, -0.045); earB.rotation.z = s * -0.3; head.add(earB);
    const closed = id === 'pirat' && s > 0;
    if (closed) { // Pi-rat's one-eye wink: a closed lid line
      const lid = M(G.box, 0x3a2414, 0.11, 0.025, 0.03); lid.position.set(s * 0.14, 0.06, 0.27); lid.rotation.z = 0.2; head.add(lid);
    } else {
      const eye = M(G.sphere, C.eye, 0.065); eye.position.set(s * 0.14, 0.06, 0.25); head.add(eye);
      const glint = M(G.sphere, 0xffffff, 0.02); glint.position.set(s * 0.14 + 0.02, 0.09, 0.31); head.add(glint);
    }
    for (let k = 0; k < 2; k++) { const wh = M(G.box, 0xe5e5e5, 0.24, 0.008, 0.008); wh.position.set(s * 0.2, -0.05 - k * 0.04, 0.36); wh.rotation.z = s * (0.15 - k * 0.2); head.add(wh); }
  }
  if (id === 'pirat') { // pirate bandana + patch, from the Pi-rat the Pirate pack
    const band = M(S16, 0xdc2626, 0.31, 0.12, 0.33); band.position.set(0, 0.16, -0.02); head.add(band);
    const knot = M(G.cone6, 0xdc2626, 0.07, 0.2, 0.07); knot.position.set(0.05, 0.16, -0.32); knot.rotation.x = -1.2; head.add(knot);
  }
  const tail = new THREE.Group(); tail.position.set(0, 0.32, -0.58); body.add(tail);
  for (let i = 0; i < 6; i++) { const seg = M(G.cyl8, 0xffb6c8, 0.05 - i * 0.006, 0.22, 0.05 - i * 0.006); seg.rotation.x = Math.PI / 2 + 0.2; seg.position.set(0, -i * 0.035, -i * 0.2); tail.add(seg); }
  const legs = [];
  for (const [x, z] of [[-0.24, 0.32], [0.24, 0.32], [-0.26, -0.3], [0.26, -0.3]]) { const l = M(S16, 0xffc4d2, 0.08, 0.1, 0.12); l.position.set(x, 0.06, z); body.add(l); legs.push(l); }
  shadowy(root, true, false);
  return { root, body, head, tail, legs };
}
function buildCandy() {
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const gray = 0x7b8088, light = 0xa3a8b0, dark = 0x5d6168, white = 0xeceef2;
  const torso = M(S16, gray, 0.5, 0.45, 0.82); torso.position.set(0, 0.95, 0); body.add(torso);
  const under = M(S16, light, 0.4, 0.3, 0.66); under.position.set(0, 0.76, 0.1); body.add(under);
  const collar = M(new THREE.TorusGeometry(0.33, 0.07, 8, 20), 0xff6fb5); collar.position.set(0, 1.18, 0.62); collar.rotation.x = Math.PI / 2 + 0.5; body.add(collar);
  const tag = M(G.cyl, 0xffd23f, 0.09, 0.02, 0.09); tag.rotation.x = Math.PI / 2; tag.position.set(0, 0.98, 0.86); body.add(tag);
  const head = new THREE.Group(); head.position.set(0, 1.48, 0.85); body.add(head);
  const skull = M(S16, gray, 0.38, 0.37, 0.37); head.add(skull);
  const muzzle = M(G.box, light, 0.36, 0.28, 0.44); muzzle.position.set(0, -0.12, 0.34); head.add(muzzle);
  const beard = M(S16, white, 0.24, 0.26, 0.26); beard.position.set(0, -0.32, 0.4); head.add(beard);
  const nose = M(S16, 0x111111, 0.1, 0.08, 0.08); nose.position.set(0, -0.03, 0.58); head.add(nose);
  for (const s of [-1, 1]) {
    const brow = M(S16, white, 0.12, 0.08, 0.14); brow.position.set(s * 0.14, 0.17, 0.3); head.add(brow);
    const eye = M(G.sphere, 0x2b1d14, 0.065); eye.position.set(s * 0.14, 0.08, 0.32); head.add(eye);
    const ear = M(S16, dark, 0.2, 0.08, 0.17); ear.position.set(s * 0.3, 0.24, -0.02); ear.rotation.z = s * 0.9; head.add(ear);
    const stache = M(S16, white, 0.15, 0.08, 0.11); stache.position.set(s * 0.13, -0.12, 0.54); stache.rotation.z = s * 0.4; head.add(stache);
  }
  const tongue = M(S16, 0xff6f91, 0.08, 0.03, 0.12); tongue.position.set(0.04, -0.3, 0.55); head.add(tongue);
  const legs = [];
  for (const [x, z] of [[-0.27, 0.52], [0.27, 0.52], [-0.27, -0.52], [0.27, -0.52]]) {
    const l = new THREE.Group(); l.position.set(x, 0.7, z);
    const lg = M(G.cyl8, dark, 0.13, 0.6, 0.13); lg.position.y = -0.3; l.add(lg);
    const paw = M(S16, white, 0.15, 0.1, 0.18); paw.position.set(0, -0.62, 0.04); l.add(paw);
    body.add(l); legs.push(l);
  }
  const tail = new THREE.Group(); tail.position.set(0, 1.2, -0.78); body.add(tail);
  const tl = M(G.cyl8, dark, 0.08, 0.36, 0.08); tl.position.y = 0.16; tail.add(tl);
  shadowy(root, true, false);
  root.scale.setScalar(0.85);
  return { root, body, head, tail, legs };
}
function buildTorty() {
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const shellC = 0x8a6a3a, plate = 0xb08a4e, skin = 0x9c8b6a;
  const shell = M(new THREE.SphereGeometry(1, 16, 10, 0, TAU, 0, Math.PI / 2), shellC, 0.95, 0.62, 1.1); shell.position.y = 0.38; body.add(shell);
  const rim = M(G.cyl, 0x6e5230, 0.98, 0.12, 1.12); rim.position.y = 0.38; body.add(rim);
  const plates = [[0, 0.95, 0.05, 0.3], [0, 0.82, 0.55, 0.24], [0, 0.82, -0.5, 0.24], [0.5, 0.7, 0.2, 0.22], [-0.5, 0.7, 0.2, 0.22], [0.5, 0.7, -0.3, 0.22], [-0.5, 0.7, -0.3, 0.22]];
  for (const p of plates) { const h = M(new THREE.CylinderGeometry(1, 1, 1, 6), plate, p[3], 0.06, p[3]); h.position.set(p[0], p[1], p[2]); h.lookAt(p[0] * 2, p[1] * 2 + 0.2, p[2] * 2); h.rotateX(Math.PI / 2); body.add(h); }
  const head = new THREE.Group(); head.position.set(0, 0.45, 1.15); body.add(head);
  const neck = M(G.cyl8, skin, 0.16, 0.4, 0.16); neck.rotation.x = Math.PI / 2 - 0.4; neck.position.set(0, -0.05, -0.12); head.add(neck);
  const skull = M(S16, skin, 0.24, 0.2, 0.3); skull.position.set(0, 0.08, 0.08); head.add(skull);
  for (const s of [-1, 1]) { const eye = M(G.sphere, 0x1a1a1a, 0.045); eye.position.set(s * 0.15, 0.14, 0.24); head.add(eye); }
  const smile = M(G.box, 0x4a3a28, 0.14, 0.015, 0.02); smile.position.set(0, 0.0, 0.36); head.add(smile);
  const legs = [];
  for (const [x, z] of [[-0.62, 0.55], [0.62, 0.55], [-0.62, -0.55], [0.62, -0.55]]) { const l = M(S16, skin, 0.2, 0.22, 0.22); l.position.set(x, 0.2, z); body.add(l); legs.push(l); }
  const badge = M(G.cyl, 0x4ade80, 0.16, 0.02, 0.16); badge.position.set(0, 0.62, 0.9); badge.rotation.x = 1.1; body.add(badge); // Tortuga Tech badge
  shadowy(root, true, false);
  return { root, body, head, tail: null, legs };
}
const PET_NAMES = { luna: 'Luna', pirat: 'Pi-rat', snowie: 'Snowie', candy: 'Candy', torty: 'Torty' };
// A pet standing in the level. Walk up to it and it says its line. It turns to face you.
function addPet(kind, x, top, z, ry, line, touchLine) {
  const m = kind === 'candy' ? buildCandy() : kind === 'torty' ? buildTorty() : buildRat(kind);
  m.root.position.set(x, top, z); m.root.rotation.y = ry || 0; W.root.add(m.root);
  const tag = makePetTag(PET_NAMES[kind] || kind); tag.position.set(0, kind === 'candy' ? 2.5 : kind === 'torty' ? 1.6 : 1.25, 0); tag.scale.multiplyScalar(kind === 'candy' ? 1.2 : 1); m.root.add(tag);
  if (kind !== 'torty') addSolid(x, top + 0.5, z, kind === 'candy' ? 0.45 : 0.3, 0.5, kind === 'candy' ? 0.45 : 0.3, 'static', null).noCam = true;
  else addSolid(x, top + 0.45, z, 0.85, 0.45, 0.95, 'static', null).noCam = true;
  const pet = { kind, m, near: false, t: Math.random() * 5, yaw: ry || 0 };
  W.pets = W.pets || []; W.pets.push(pet);
  W.things.push({ update(dt) {
    pet.t += dt;
    const dx = P.pos.x - x, dz = P.pos.z - z, d2 = dx * dx + dz * dz;
    const near = d2 < 14 && Math.abs(P.pos.y - top) < 3;
    if (d2 < 120) pet.yaw = angleLerp(pet.yaw, Math.atan2(dx, dz), damp(4, dt));
    m.root.rotation.y = pet.yaw;
    const hop = kind === 'torty' ? 0 : Math.max(0, Math.sin(pet.t * (near ? 9 : 3))) * (near ? 0.12 : 0.03);
    m.body.position.y = hop;
    if (m.tail) m.tail.rotation.y = Math.sin(pet.t * (kind === 'candy' ? (near ? 18 : 6) : 3)) * (kind === 'candy' ? 0.7 : 0.35);
    if (m.head) m.head.rotation.z = Math.sin(pet.t * 1.3) * 0.12;
    if (near && !pet.near && line) { showToast('<b>' + PET_NAMES[kind] + ':</b> ' + (IS_TOUCH && touchLine ? touchLine : line), 5); if (Snd.S.pet) Snd.S.pet(kind); }
    pet.near = near;
  } });
  return pet;
}
function makePetTag(name) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = 'rgba(20,10,50,.82)'; const r = 26; g.beginPath(); g.moveTo(r, 4); g.arcTo(252, 4, 252, 60, r); g.arcTo(252, 60, 4, 60, r); g.arcTo(4, 60, 4, 4, r); g.arcTo(4, 4, 252, 4, r); g.fill();
  g.font = 'bold 36px "Trebuchet MS",Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#ffe14d'; g.fillText(name, 128, 34);
  const t = new THREE.CanvasTexture(c);
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false }));
  s.scale.set(1.6, 0.4, 1); // 256x64 canvas = 4:1, sprite kept at 4:1 so the name tag is never stretched
  return s;
}
