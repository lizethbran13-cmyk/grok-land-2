// =====================================================================
// BOOST MODE: high-speed open zones (boost meter, grind rails, homing
// attack, air dash, dash panels / dash rings, rings, Boost Medals)
// =====================================================================
const BOOST = { BASE: 15.5, MAX: 31, DRAIN: 15, HOMING_R: 15, HOMING_V: 44, RAIL_MIN: 14, RAIL_MAX: 36 };
const RING_GEO = new THREE.TorusGeometry(0.42, 0.1, 8, 22);
function buildRingMesh() {
  const g = new THREE.Group();
  const m = new THREE.Mesh(RING_GEO, mat(0xffd23f, { emissive: 0x7a5200, metalness: 0.4, roughness: 0.35 }));
  g.add(m); shadowy(g, true, false);
  return g;
}
function boostSetup(opts) {
  W.boost = Object.assign({ rails: [], pods: [], panels: [], hoops: [], rings: 0, ringsMax: 0, rank: [70, 95, 130] }, opts || {});
  P.meter = 60; P.boosting = false; P.grind = null; P.railCd = 0; P.speedHold = 0; P.airDashed = false; P.crashV = 0;
  $('boost-hud').classList.remove('hidden'); document.body.classList.add('boostzone');
}
function boostOff() { W.boost = null; P.boosting = false; P.grind = null; const h = $('boost-hud'); if (h) h.classList.add('hidden'); document.body.classList.remove('boostzone'); }
// ---- rails ----
const _q = new THREE.Quaternion(), _up = new V3(0, 1, 0), _t1 = new V3(), _t2 = new V3();
function addRail(ctrl, opts) {
  opts = opts || {};
  const curve = new THREE.CatmullRomCurve3(ctrl.map((p) => new V3(p[0], p[1], p[2])), !!opts.closed, 'catmullrom', 0.5);
  const len0 = curve.getLength();
  const n = Math.max(4, Math.round(len0 / 1.1));
  const pts = curve.getSpacedPoints(n);
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + pts[i].distanceTo(pts[i - 1]));
  const R = { pts, cum, len: cum[cum.length - 1], min: new V3(Infinity, Infinity, Infinity), max: new V3(-Infinity, -Infinity, -Infinity) };
  for (const p of pts) { R.min.min(p); R.max.max(p); }
  R.min.subScalar(2); R.max.addScalar(2);
  W.boost.rails.push(R);
  // visuals: a shiny rail tube, glowing guide strip, and supports down to the ground
  const railM = mat(0xd8dee9, { metalness: 0.75, roughness: 0.25 }), glowM = basic(opts.glow || 0x3ff0ff);
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    _t1.subVectors(b, a); const L = _t1.length(); _t1.normalize();
    _q.setFromUnitVectors(_up, _t1);
    const tube = new THREE.Mesh(G.cyl8, railM); tube.scale.set(0.13, L + 0.04, 0.13); tube.quaternion.copy(_q); tube.position.copy(a).add(b).multiplyScalar(0.5);
    (W.deco || W.root).add(tube);
    const strip = new THREE.Mesh(G.box, glowM); strip.scale.set(0.06, L + 0.02, 0.06); strip.quaternion.copy(_q); strip.position.copy(tube.position); strip.position.y -= 0.16;
    (W.deco || W.root).add(strip);
  }
  const every = opts.posts === false ? 0 : 7;
  if (every) for (let i = 0; i < pts.length; i += every) {
    const p = pts[i];
    const gy = groundTopAt(p.x, p.z, p.y - 0.5);
    if (gy === -Infinity || p.y - gy > 26) continue;
    const h = p.y - gy - 0.15;
    if (h < 0.4) continue;
    const post = M(G.cyl8, 0x5d6673, 0.12, h, 0.12); post.position.set(p.x, gy + h / 2, p.z); (W.deco || W.root).add(post);
    const foot = M(G.cyl8, 0x3a3f4a, 0.35, 0.2, 0.35); foot.position.set(p.x, gy + 0.1, p.z); (W.deco || W.root).add(foot);
  }
  return R;
}
function railPoint(R, s, out) {
  s = clamp(s, 0, R.len);
  let lo = 0, hi = R.cum.length - 1;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (R.cum[mid] <= s) lo = mid; else hi = mid; }
  const a = R.pts[lo], b = R.pts[hi], seg = R.cum[hi] - R.cum[lo] || 1, k = (s - R.cum[lo]) / seg;
  out.set(lerp(a.x, b.x, k), lerp(a.y, b.y, k), lerp(a.z, b.z, k));
  return _t2.subVectors(b, a).normalize();
}
function nearestOnRail(R, p) {
  if (p.x < R.min.x || p.x > R.max.x || p.z < R.min.z || p.z > R.max.z || p.y < R.min.y - 1 || p.y > R.max.y + 2) return null;
  let best = null, bd = Infinity;
  for (let i = 1; i < R.pts.length; i++) {
    const a = R.pts[i - 1], b = R.pts[i];
    const abx = b.x - a.x, aby = b.y - a.y, abz = b.z - a.z;
    const l2 = abx * abx + aby * aby + abz * abz || 1;
    let k = ((p.x - a.x) * abx + (p.y + 0.2 - a.y) * aby + (p.z - a.z) * abz) / l2; k = clamp(k, 0, 1);
    const cx = a.x + abx * k, cy = a.y + aby * k, cz = a.z + abz * k;
    const dh = (p.x - cx) * (p.x - cx) + (p.z - cz) * (p.z - cz);
    const dy = p.y - (cy + 0.12);
    if (dh > 1.0 || dy < -0.7 || dy > 1.1) continue;
    const d = dh + dy * dy * 0.3;
    if (d < bd) { bd = d; best = { s: R.cum[i - 1] + Math.sqrt(l2) * k, y: cy }; }
  }
  return best;
}
// ---- homing pods (floating targets for chaining homing attacks) ----
function addPod(x, y, z) {
  const g = new THREE.Group();
  const core = new THREE.Mesh(G.sphere, mat(0x3fa0ff, { emissive: 0x0a3a88, metalness: 0.3, roughness: 0.3 })); core.scale.setScalar(0.55); g.add(core);
  const ring = new THREE.Mesh(G.torus, basic(0xffffff)); ring.scale.setScalar(0.85); g.add(ring);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: 0x56c8ff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); glow.scale.setScalar(2.6); g.add(glow);
  g.position.set(x, y, z); W.root.add(g);
  const pod = { pos: new V3(x, y, z), g, active: true, t: 0, isPod: true };
  W.boost.pods.push(pod);
  W.things.push({ update(dt) {
    ring.rotation.y += dt * 2; ring.rotation.x = 0.6; g.position.y = y + Math.sin(W.time * 2 + x) * 0.15;
    if (!pod.active) { pod.t -= dt; if (pod.t <= 0) { pod.active = true; g.visible = true; } }
  } });
  return pod;
}
// ---- dash panels (ground) and dash rings (air) ----
function addDashPanel(x, top, z, yaw, speed) {
  const g = new THREE.Group();
  const base = M(G.box, 0x2b2f48, 2.6, 0.12, 3.2); base.position.y = 0.06; g.add(base);
  const glow = new THREE.Mesh(G.box, basic(0x3ff0ff)); glow.scale.set(2.2, 0.13, 2.8); glow.position.y = 0.07; g.add(glow);
  const arrows = [];
  for (let i = 0; i < 3; i++) { const a = new THREE.Mesh(G.cone6, basic(0xffffff)); a.scale.set(0.5, 0.7, 0.18); a.rotation.x = -Math.PI / 2; a.position.set(0, 0.16, 0.9 - i * 0.9); g.add(a); arrows.push(a); }
  g.rotation.y = yaw; g.position.set(x, top, z); W.root.add(g);
  const pnl = { x, top, z, yaw, speed: speed || 34, cd: 0 };
  W.boost.panels.push(pnl);
  W.things.push({ update(dt) { pnl.cd -= dt; for (let i = 0; i < 3; i++) arrows[i].material = basic(((W.time * 6 - i) | 0) % 3 === 0 ? 0xffe14d : 0xffffff); } });
  return pnl;
}
function addHoop(x, y, z, dir, speed) {
  const d = new V3(dir[0], dir[1], dir[2]).normalize();
  const g = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.16, 8, 26), mat(0xff4fd8, { emissive: 0x5a0a48 })); g.add(ring);
  const inner = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.05, 6, 26), basic(0xffffff)); g.add(inner);
  g.position.set(x, y, z); g.lookAt(x + d.x, y + d.y, z + d.z); W.root.add(g);
  const h = { pos: new V3(x, y, z), dir: d, speed: speed || 30, cd: 0 };
  W.boost.hoops.push(h);
  W.things.push({ update(dt) { h.cd -= dt; inner.rotation.z += dt * 3; } });
  return h;
}
function addGoalRing(x, top, z) {
  const g = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.35, 10, 32), mat(0xffd23f, { emissive: 0x7a5200, metalness: 0.5, roughness: 0.3 }));
  ring.position.y = 3.4; g.add(ring);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: 0xfff1a0, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); glow.scale.setScalar(9); glow.position.y = 3.4; g.add(glow);
  for (const s of [-1, 1]) { const post = M(G.cyl8, 0x2b2f48, 0.25, 1.2, 0.25); post.position.set(s * 2.2, 0.6, 0); g.add(post); }
  g.position.set(x, top, z); W.root.add(g);
  W.things.push({ update() {
    ring.rotation.y = W.time * 1.5;
    if (W.goalDone || P.state === 'dead') return;
    const dx = P.pos.x - x, dz = P.pos.z - z, dy = P.pos.y + 0.75 - (top + 3.4);
    if (dx * dx + dz * dz < 7 && Math.abs(dy) < 3.5) { W.goalDone = true; P.grind = null; if (NET.on) netReachGoal(g); else winLevel(g); }
  } });
}
// ---- per-tick hooks called from playerTick ----
function boostTop() {
  const hs = Math.hypot(P.vel.x, P.vel.z);
  let top = P.boosting ? BOOST.MAX : BOOST.BASE;
  if (P.speedHold > 0) top = Math.max(top, hs);
  return top / RUN * RUN;
}
function boostInput(dt) {
  const want = input.boost && P.meter > 0 && P.state !== 'hurt' && P.state !== 'dead' && !P.frozen;
  if (want && !P.boosting) { Snd.S.boost(); ringFx(P.pos.x, P.pos.y + 0.6, P.pos.z, 0x3ff0ff, 2.2); }
  P.boosting = want;
  if (P.boosting) P.meter = Math.max(0, P.meter - BOOST.DRAIN * dt);
  P.speedHold = Math.max(0, P.speedHold - dt);
  P.railCd = Math.max(0, P.railCd - dt);
}
// returns true if it handled the whole tick (grinding / homing)
function boostPre(dt) {
  boostInput(dt);
  if (P.grind) { grindTick(dt); return true; }
  if (P.state === 'homing') { homingTick(dt); return true; }
  return false;
}
function grindTick(dt) {
  const g = P.grind, R = g.rail;
  const tan = railPoint(R, g.s, _t1).clone();
  if (P.boosting) g.v = Math.min(BOOST.RAIL_MAX, g.v + 34 * dt); else g.v = lerp(g.v, 22, damp(0.6, dt));
  g.v -= tan.y * g.dir * 22 * dt;
  g.v = clamp(g.v, BOOST.RAIL_MIN * 0.7, BOOST.RAIL_MAX);
  g.s += g.dir * g.v * dt;
  P.grounded = false; P.ground = null; P.canDouble = true; P.airDashed = false;
  if (input.jumpPressed) {
    P.vel.set(tan.x * g.dir * g.v * 0.85, JUMP_V * 0.95 + Math.max(0, tan.y * g.dir * g.v * 0.5), tan.z * g.dir * g.v * 0.85);
    P.grind = null; P.railCd = 0.35; P.state = 'normal'; P.stateT = 0; P.jumping = true; P.speedHold = 1.2;
    Snd.S.jump(); return;
  }
  if (g.s <= 0 || g.s >= R.len) {
    P.vel.set(tan.x * g.dir * g.v, Math.max(4, tan.y * g.dir * g.v + 4), tan.z * g.dir * g.v);
    P.grind = null; P.railCd = 0.35; P.state = 'normal'; P.stateT = 0; P.speedHold = 1.5;
    return;
  }
  railPoint(R, g.s, P.pos); P.pos.y += 0.12;
  P.vel.set(tan.x * g.dir * g.v, tan.y * g.dir * g.v, tan.z * g.dir * g.v);
  P.facing = Math.atan2(tan.x * g.dir, tan.z * g.dir);
  g.spark -= dt;
  if (g.spark <= 0) { g.spark = 0.045; burst(P.pos.x, P.pos.y, P.pos.z, P.boosting ? 0x7af6ff : 0xffb43a, 2, 3, 0.25, 6, 0.8); }
  g.snd -= dt; if (g.snd <= 0) { g.snd = 0.16; if (Snd.S.grind) Snd.S.grind(); }
  boostTouchEnemies();
}
function tryAttachRail() {
  if (P.grind || P.railCd > 0 || P.state === 'dead' || P.state === 'hurt' || P.state === 'homing' || P.frozen) return false;
  if (P.vel.y > 2.5 && !P.grounded) return false;
  for (const R of W.boost.rails) {
    const hit = nearestOnRail(R, P.pos);
    if (!hit) continue;
    const tan = railPoint(R, hit.s, _t2);
    const hx = P.vel.x, hz = P.vel.z;
    let along = hx * tan.x + hz * tan.z + P.vel.y * tan.y;
    let dir = along >= 0 ? 1 : -1;
    if (Math.abs(along) < 3) { dir = (Math.sin(P.facing) * tan.x + Math.cos(P.facing) * tan.z) >= 0 ? 1 : -1; }
    if (hit.s < 1.5) dir = 1; else if (hit.s > R.len - 1.5) dir = -1;
    P.grind = { rail: R, s: hit.s, dir, v: Math.max(BOOST.RAIL_MIN, Math.abs(along), Math.hypot(hx, hz)), spark: 0, snd: 0 };
    P.state = 'grind'; P.stateT = 0; P.jumping = false;
    Snd.S.land && Snd.S.land();
    ringFx(P.pos.x, P.pos.y, P.pos.z, 0x7af6ff, 1.6);
    return true;
  }
  return false;
}
function homingTarget() {
  let best = null, bd = Infinity;
  const fx = Math.sin(P.facing), fz = Math.cos(P.facing);
  const consider = (p, obj) => {
    const dx = p.x - P.pos.x, dy = p.y - (P.pos.y + 0.6), dz = p.z - P.pos.z;
    const d = Math.hypot(dx, dy, dz);
    if (d > BOOST.HOMING_R || d < 0.5 || dy > 7 || dy < -9) return;
    const dh = Math.hypot(dx, dz) || 1;
    const facing = (dx * fx + dz * fz) / dh;
    if (facing < 0.25 && d > 4) return;
    const score = d * (1.6 - facing);
    if (score < bd) { bd = score; best = obj; }
  };
  for (const e of W.enemies) if (e.alive && e.spinnable !== false) consider(_t1.set(e.pos.x, e.pos.y + e.h * 0.5, e.pos.z), e);
  for (const pd of W.boost.pods) if (pd.active) consider(pd.pos, pd);
  return best;
}
function boostAirAction() { // called on ACTION in mid-air in a boost zone
  const t = homingTarget();
  if (t) { P.state = 'homing'; P.stateT = 0; P.homing = t; P.jumping = false; Snd.S.spin(); ringFx(P.pos.x, P.pos.y + 0.6, P.pos.z, 0x3ff0ff, 2); return true; }
  if (!P.airDashed) {
    const hs = Math.max(Math.hypot(P.vel.x, P.vel.z), 24);
    P.vel.x = Math.sin(P.facing) * hs; P.vel.z = Math.cos(P.facing) * hs; P.vel.y = Math.max(P.vel.y, 2);
    P.airDashed = true; P.speedHold = 0.9; P.state = 'normal'; P.stateT = 0;
    Snd.S.longjump(); ringFx(P.pos.x, P.pos.y + 0.6, P.pos.z, 0xffffff, 1.6); dust(P.pos.x, P.pos.y + 0.5, P.pos.z, 6);
    return true;
  }
  return true; // already used the air dash: do nothing (no ground pound in boost zones)
}
function homingTick(dt) {
  const t = P.homing;
  const tp = t.isPod ? t.pos : _t1.set(t.pos.x, t.pos.y + t.h * 0.5, t.pos.z);
  const alive = t.isPod ? t.active : t.alive;
  const dx = tp.x - P.pos.x, dy = tp.y - (P.pos.y + 0.6), dz = tp.z - P.pos.z, d = Math.hypot(dx, dy, dz);
  if (!alive || P.stateT > 0.7) { P.state = 'normal'; P.stateT = 0; P.homing = null; return; }
  if (d < 1.1) {
    if (t.isPod) { t.active = false; t.t = 2.6; t.g.visible = false; burst(tp.x, tp.y, tp.z, 0x56c8ff, 14, 6, 0.5); Snd.S.stomp(); }
    else killEnemy(t, 'spin');
    P.meter = Math.min(100, P.meter + 8);
    P.vel.set(dx * 0.4, 14.5, dz * 0.4); P.state = 'normal'; P.stateT = 0; P.homing = null; P.canDouble = true; P.airDashed = false; P.flip = 1;
    shakeAmt = Math.max(shakeAmt, 0.12);
    return;
  }
  P.vel.set(dx / d * BOOST.HOMING_V, dy / d * BOOST.HOMING_V, dz / d * BOOST.HOMING_V);
  P.facing = Math.atan2(dx, dz);
  P.grounded = false; P.ground = null;
  pMove('x', P.vel.x * dt); pMove('z', P.vel.z * dt); pMove('y', P.vel.y * dt);
  if (P.grounded) { P.state = 'normal'; P.stateT = 0; P.homing = null; }
}
function boostTouchEnemies() {
  for (const e of W.enemies) {
    if (!e.alive) continue;
    const dx = e.pos.x - P.pos.x, dz = e.pos.z - P.pos.z, dy = e.pos.y - P.pos.y;
    if (dx * dx + dz * dz < 2.6 && dy > -1.2 && dy < 1.6) {
      if (e.spinnable !== false && (P.boosting || P.grind)) { killEnemy(e, 'spin'); P.meter = Math.min(100, P.meter + 5); }
    }
  }
}
// after normal movement: rails, panels, hoops, crashes, boost-kills
function boostPost(dt) {
  if (P.state === 'dead' || P.frozen) return;
  if (P.grounded) P.airDashed = false;
  // crash: slamming into a wall at boost speed has a real cost
  if (P.crashV > 21 && P.state !== 'hurt' && P.invuln <= 0) boostCrash(P.crashV);
  P.crashV = 0;
  if (tryAttachRail()) return;
  for (const pn of W.boost.panels) {
    if (pn.cd > 0 || !P.grounded) continue;
    const dx = P.pos.x - pn.x, dz = P.pos.z - pn.z;
    const c = Math.cos(pn.yaw), s = Math.sin(pn.yaw);
    const lx = dx * c - dz * s, lz = dx * s + dz * c;
    if (Math.abs(lx) < 1.4 && Math.abs(lz) < 1.7 && Math.abs(P.pos.y - pn.top) < 0.5) {
      const fx = -Math.sin(pn.yaw), fz = -Math.cos(pn.yaw);
      P.vel.x = fx * pn.speed; P.vel.z = fz * pn.speed; P.facing = Math.atan2(fx, fz); P.speedHold = 1.1; pn.cd = 0.5;
      cam.yaw = angleLerp(cam.yaw, P.facing + Math.PI, 0.5);
      Snd.S.boost(); ringFx(P.pos.x, P.pos.y, P.pos.z, 0x3ff0ff, 2);
    }
  }
  for (const h of W.boost.hoops) {
    if (h.cd > 0) continue;
    if (P.pos.distanceToSquared(_t1.set(h.pos.x, h.pos.y - 0.7, h.pos.z)) < 2.4 * 2.4) {
      P.vel.copy(h.dir).multiplyScalar(h.speed); P.state = 'launch'; P.stateT = 0; P.grounded = false; P.canDouble = true; P.airDashed = false; P.jumping = false; h.cd = 0.6;
      P.facing = Math.atan2(h.dir.x, h.dir.z); P.speedHold = 1.5;
      Snd.S.spring(); ringFx(h.pos.x, h.pos.y - 0.7, h.pos.z, 0xff4fd8, 2.5);
    }
  }
  if (P.boosting) boostTouchEnemies();
}
function boostCrash(v) {
  const lost = Math.min(W.boost.rings, 10);
  W.boost.rings -= lost;
  P.meter = Math.max(0, P.meter - 25);
  P.state = 'hurt'; P.stateT = 0; P.invuln = 1.0; P.boosting = false; P.speedHold = 0;
  const fx = Math.sin(P.facing), fz = Math.cos(P.facing);
  P.vel.set(-fx * 7, 7, -fz * 7);
  shakeAmt = Math.max(shakeAmt, 0.45); Snd.S.thud(); burst(P.pos.x + fx, P.pos.y + 1, P.pos.z + fz, 0xffffff, 14, 6, 0.5);
  if (lost > 0) { scatterRings(Math.min(lost, 6)); showToast('<b>CRASH!</b> Lost ' + lost + ' rings and boost. Grab them back fast!', 2.6); }
  else { P.health--; updateHUD(true); showToast('<b>CRASH!</b> No rings to protect you: -1 heart', 2.6); if (P.health <= 0) killPlayer(); }
  void v;
}
// rings spill out and blink away after a few seconds (like the real thing)
function scatterRings(n) {
  const seq = W.itemSeq; // spilled rings are local-only: don't shift co-op item ids
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU, it = addItem('coin', P.pos.x, P.pos.y + 1.2, P.pos.z);
    it.spill = { vx: Math.cos(a) * 5, vy: 7, vz: Math.sin(a) * 5, life: 4 }; it.id = 'spill' + Math.random();
  }
  if (seq !== undefined) W.itemSeq = seq;
}
function boostHurt(from) { // rings protect you in boost zones
  if (!W.boost || W.boost.rings <= 0) return false;
  const lost = W.boost.rings; W.boost.rings = 0;
  scatterRings(Math.min(lost, 8));
  P.invuln = HURT_INVULN; P.state = 'hurt'; P.stateT = 0; P.jumping = false; P.grind = null; P.boosting = false;
  let dx = P.pos.x - from.x, dz = P.pos.z - from.z; const d = Math.hypot(dx, dz) || 1;
  P.vel.set(dx / d * 8, 8, dz / d * 8);
  Snd.S.hurt(); shakeAmt = Math.max(shakeAmt, 0.25);
  showToast('<b>OUCH!</b> You dropped your ' + lost + ' rings!', 2.2);
  return true;
}
function boostRing() { if (!W.boost) return; W.boost.rings++; P.meter = Math.min(100, P.meter + 3.5); }
// ---- per-frame visuals: FOV, speed lines, HUD, trail ----
let speedFx = 0;
function boostFrame(dt) {
  const hs = W.boost ? Math.hypot(P.vel.x, P.vel.z, P.grind ? P.vel.y : 0) : 0;
  const k = clamp((hs - 14) / 18, 0, 1);
  speedFx = lerp(speedFx, mode === 'playing' ? k : 0, damp(5, dt));
  const baseFov = window.innerWidth < window.innerHeight ? 72 : 60;
  const f = baseFov + speedFx * 16;
  if (Math.abs(camera.fov - f) > 0.05) { camera.fov = f; camera.updateProjectionMatrix(); }
  const sl = $('speedlines'); if (sl) sl.style.opacity = (speedFx * 0.85).toFixed(2);
  const bh = $('boost-hud'); if (bh) bh.classList.toggle('hidden', !W.boost || (mode !== 'playing' && mode !== 'paused'));
  if (!W.boost) return;
  $('boost-fill').style.width = P.meter.toFixed(1) + '%';
  $('boost-hud').classList.toggle('on', !!P.boosting);
  $('boost-rings').textContent = W.boost.rings;
  $('boost-speed').textContent = Math.round(hs * 3.6) + ' km/h';
  if (P.boosting && mode === 'playing' && Math.random() < 0.6) burst(P.pos.x, P.pos.y + 0.7, P.pos.z, 0x7af6ff, 1, 1, 0.3, 0, 1.2);
}
// pose tweaks for grind / homing (after the normal hero animation)
function boostAnim(dt) {
  const m = P.model; if (!m) return;
  if (P.state === 'homing') { m.body.rotation.x = (W.time * 26) % TAU; m.body.position.y = 0.4; m.armL.rotation.set(-2.5, 0, 0); m.armR.rotation.set(-2.5, 0, 0); }
  else if (P.grind) { m.body.rotation.z = Math.sin(W.time * 3) * 0.08; m.armL.rotation.set(0, 0, -1.3); m.armR.rotation.set(0, 0, 1.3); m.legL.rotation.set(0.3, 0, 0); m.legR.rotation.set(-0.3, 0, 0); m.body.rotation.y = 0.5; }
  else if (P.boosting && P.grounded) { m.body.rotation.x = 0.35; }
  void dt;
}
