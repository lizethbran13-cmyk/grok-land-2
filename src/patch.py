import re,sys
P='/workspace/grok-land-2/game.js'
s=open(P).read()
def rd(f): return open('/workspace/grok-land-2/src/'+f).read()
def rep(old,new,count=1):
    global s
    if old not in s: print('MISSING:',old[:90]); sys.exit(1)
    s=s.replace(old,new,count)
rep("/* GROK LAND — a 3D toy-box platformer.","/* GROK LAND 2 — the sequel: new worlds, Boost Mode, online co-op, remastered classics. Built on GROK LAND,")
rep("const SAVE_KEY = 'grokland_v1';","const SAVE_KEY = 'grokland2_v1';")
rep("const NUM_LEVELS = 12;","const NUM_LEVELS = 40;")
# songs + sound exports
rep("  ];\n  let musicTimer = null,", rd('h_songs.js')+"  ];\n  let musicTimer = null,")
rep("  return { init, S, playMusic,","  S.pet = (k) => { if (k === 'candy') { tone(520, 0.08, 'square', 0.08, 380); tone(560, 0.1, 'square', 0.08, 400, 0.14); } else if (k === 'torty') { tone(180, 0.3, 'triangle', 0.12, 260); } else { tone(1800, 0.06, 'sine', 0.06, 2400); tone(2000, 0.06, 'sine', 0.06, 2600, 0.09); } };\n  S.grind = () => noise(0.12, 0.04, 5200, 0, null, 'highpass');\n  S.land = () => tone(700, 0.08, 'triangle', 0.08, 1100);\n  return { init, S, playMusic,")
# renderer: shadows on phones too (smaller map), filmic look
rep("const SHADOWS = !IS_TOUCH;","const SHADOWS = true;")
rep("  sun.shadow.mapSize.set(2048, 2048);\n  const sc = sun.shadow.camera; sc.left = -28; sc.right = 28; sc.top = 28; sc.bottom = -28; sc.near = 1; sc.far = 120;",
    "  sun.shadow.mapSize.set(IS_TOUCH ? 1024 : 2048, IS_TOUCH ? 1024 : 2048);\n  const SR = IS_TOUCH ? 24 : 30;\n  const sc = sun.shadow.camera; sc.left = -SR; sc.right = SR; sc.top = SR; sc.bottom = -SR; sc.near = 1; sc.far = 120;")
rep("renderer.shadowMap.type = THREE.PCFSoftShadowMap;","renderer.shadowMap.type = IS_TOUCH ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;\nrenderer.toneMapping = THREE.ACESFilmicToneMapping;\nrenderer.toneMappingExposure = 1.32;")
# graphics module + styled meshes
rep("// =====================================================================\n// Character / object models", rd('a_gfx.js')+"\n// =====================================================================\n// Character / object models")
i=s.index("function styledMesh(w, h, d, style) {"); j=s.index("function addBox(", i)
s=s[:i]+rd('a_styled.js')+s[j:]
rep("function buildCoinMesh() {","function buildCoinMesh() { if (W.boost) return buildRingMesh();")
# trees + flowers go into the static batch
rep("  const t = buildTree(s, leaf); t.position.set(x, top, z); t.rotation.y = Math.random() * TAU; W.root.add(t);","  const t = buildTree(s, leaf); t.position.set(x, top, z); t.rotation.y = Math.random() * TAU; (W.deco || W.root).add(t);")
rep("    f.rotation.y = decoRand() * TAU;\n    W.root.add(f);","    f.rotation.y = decoRand() * TAU;\n    (W.deco || W.root).add(f);")
# clearWorld: dispose old GPU buffers (iOS memory), fresh static batch group
rep("function clearWorld() {\n  if (W.root) scene.remove(W.root);\n  W.root = new THREE.Group();\n  scene.add(W.root);",
"""function disposeTree(root) {
  const seen = new Set();
  root.traverse((o) => {
    if (o.geometry && !seen.has(o.geometry)) { seen.add(o.geometry); o.geometry.dispose(); }
    const ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
    for (const m of ms) if (m.map && !seen.has(m.map)) { seen.add(m.map); m.map.dispose(); }
  });
}
function clearWorld() {
  if (W.root) { scene.remove(W.root); disposeTree(W.root); }
  W.root = new THREE.Group();
  scene.add(W.root);
  W.deco = new THREE.Group(); W.root.add(W.deco); W.pets = []; W.mergedGeos = [];
  if (W.boost) boostOff();""")
# loadLevel: merge static props after building
rep("  LEVELS[i].build();\n  if (NET.on) buildTeamZone(i);",
"""  LEVELS[i].build();
  if (NET.on) buildTeamZone(i);
  if (W.deco) {
    const t0 = performance.now();
    W.root.remove(W.deco);
    const mg = mergeStatic(W.deco);
    W.root.add(mg.group);
    W.deco = null;
    W.batchStats = { verts: mg.verts, buckets: mg.buckets, ms: Math.round(performance.now() - t0) };
  }""")
# player hooks
rep("  P.wasGrounded = P.grounded;\n  P.pushing = false;\n","  P.wasGrounded = P.grounded;\n  P.pushing = false;\n  if (W.boost && boostPre(dt)) return;\n")
rep("    const topSpeed = RUN * (spinning ? 0.75 : 1);","    const topSpeed = (W.boost ? boostTop() : RUN) * (spinning ? 0.75 : 1);")
rep("      if (ice) accel = lerp(accel, mag > 0.05 ? 15 : 4.5, ice);","      if (ice) accel = lerp(accel, mag > 0.05 ? 15 : 4.5, ice);\n      if (W.boost) accel *= P.speedHold > 0 ? 0.45 : P.boosting ? 1.5 : 1.25;")
rep("    } else if (P.state !== 'pound') {\n      P.state = 'poundStart';","    } else if (W.boost && boostAirAction()) {\n      // homing attack / air dash\n    } else if (P.state !== 'pound') {\n      P.state = 'poundStart';")
rep("  // hazards: water / lava / void\n","  if (W.boost) boostPost(dt);\n  // hazards: water / lava / void\n")
rep("      if (pushed) P.vel[axis] = Math.sign(amt) * Math.min(Math.abs(P.vel[axis]), PUSH_SPEED);\n      else P.vel[axis] = 0;",
    "      if (W.boost && !pushed) P.crashV = Math.max(P.crashV || 0, Math.abs(P.vel[axis]));\n      if (pushed) P.vel[axis] = Math.sign(amt) * Math.min(Math.abs(P.vel[axis]), PUSH_SPEED);\n      else P.vel[axis] = 0;")
rep("  if (P.invuln > 0 || P.state === 'dead' || P.state === 'win' || P.frozen || mode !== 'playing') return;\n  P.health--;",
    "  if (P.invuln > 0 || P.state === 'dead' || P.state === 'win' || P.frozen || mode !== 'playing') return;\n  if (W.boost && boostHurt(from)) return;\n  P.health--;")
# items: spilled rings + rings feed the boost meter
rep("    const it = W.items[i];\n    const mm = it.mesh;\n",
"""    const it = W.items[i];
    const mm = it.mesh;
    if (it.spill) {
      const sp = it.spill; sp.life -= dt; sp.vy -= 26 * dt;
      it.x += sp.vx * dt; it.z += sp.vz * dt; let ny = mm.position.y + sp.vy * dt;
      const gtop = groundTopAt(it.x, it.z, mm.position.y + 0.5);
      if (ny < gtop + 0.6) { ny = gtop + 0.6; sp.vy = Math.abs(sp.vy) * 0.5; sp.vx *= 0.8; sp.vz *= 0.8; }
      mm.position.set(it.x, ny, it.z); mm.visible = sp.life > 1.2 || Math.floor(sp.life * 10) % 2 === 0;
      if (sp.life <= 0) { W.root.remove(mm); W.items.splice(i, 1); continue; }
      if (sp.life > 3.4 || P.state === 'dead' || P.frozen) continue;
      const ddx = it.x - P.pos.x, ddy = ny - (P.pos.y + 0.75), ddz = it.z - P.pos.z;
      if (ddx * ddx + ddy * ddy + ddz * ddz < 1.9) { W.root.remove(mm); W.items.splice(i, 1); boostRing(); Snd.S.coin(); burst(it.x, ny, it.z, 0xffe14a, 4, 3, 0.3, 4); }
      continue;
    }
""")
rep("    if (NET.on) { netTouchItem(it, i); continue; }\n    W.root.remove(mm);",
    "    if (W.boost && it.type === 'coin' && !(it.netPending !== undefined && W.time - it.netPending < 1.5)) boostRing();\n    if (NET.on) { netTouchItem(it, i); continue; }\n    W.root.remove(mm);")
# camera: faster follow + pull back at speed
rep("  if (mode === 'playing' && cam.manualT > 1.4 && hs > 3 && P.state !== 'dead' && P.state !== 'lava' && Math.hypot(input.mx, input.my) > 0.2) {",
    "  if (mode === 'playing' && cam.manualT > (W.boost ? 0.8 : 1.4) && hs > 3 && P.state !== 'dead' && P.state !== 'lava' && (Math.hypot(input.mx, input.my) > 0.2 || P.grind || P.state === 'homing' || P.speedHold > 0)) {")
rep("    if (Math.abs(d) < 1.9) cam.yaw += d * Math.min(1, dt * 0.9) * Math.min(1, hs / RUN);","    if (Math.abs(d) < (W.boost ? 2.6 : 1.9)) cam.yaw += d * Math.min(1, dt * (W.boost ? 2.6 : 0.9)) * Math.min(1, hs / RUN);")
rep("  const hit = rayDist(cam.target, _dir, cam.dist);\n  const want = hit < cam.dist ? Math.max(1.6, hit - 0.35) : cam.dist;",
    "  const cdist = cam.dist + speedFx * 3.5;\n  const hit = rayDist(cam.target, _dir, cdist);\n  const want = hit < cdist ? Math.max(1.6, hit - 0.35) : cdist;")
# frame hooks
rep("  animatePlayer(dt);\n","  animatePlayer(dt);\n  if (W.boost) boostAnim(dt);\n  boostFrame(dt);\n")
# input: boost key + touch button
rep("    if (key === 'jump') input.jumpPressed = true; else input.actionPressed = true;","    if (key === 'jump') input.jumpPressed = true; else if (key === 'action') input.actionPressed = true;")
rep("bindTouchBtn('btn-action', 'action');","bindTouchBtn('btn-action', 'action');\nbindTouchBtn('btn-boost', 'boost');")
rep("  input.action = !!(keys.ShiftLeft || keys.ShiftRight || keys.KeyX || keys.KeyF || keys.KeyK || touchState.action);",
    "  input.action = !!(keys.ShiftLeft || keys.ShiftRight || keys.KeyX || keys.KeyF || keys.KeyK || touchState.action);\n  input.boost = !!(keys.KeyC || keys.KeyB || keys.KeyL || touchState.boost);")
rep("const touchState = { jx: 0, jy: 0, jump: false, action: false, joyId: null };","const touchState = { jx: 0, jy: 0, jump: false, action: false, boost: false, joyId: null };")
rep("    touchState.jump = !!(press && press.holdJump); touchState.action = false;","    touchState.jump = !!(press && press.holdJump); touchState.action = false; touchState.boost = !!(press && press.boost);")
# levels
i=s.index("const LEVELS = [\n"); j=s.index("];\n",i)+3
s=s[:i]+rd('f_rush.js')+"\n"+rd('g_levels.js')+s[j:]
rep("  const Z = TEAM_ZONES[i];","  const Z = LEVELS[i].tz;")
# map: snake layout for any number of worlds
rep("const MAP_POS = [[6, 74], [19, 32], [32, 70], [45, 30], [58, 70], [71, 30], [83, 72], [94, 32]];",
"""const MAP_POS = (() => { const n = WORLDS.length, per = Math.ceil(n / 2), out = [];
  for (let w = 0; w < n; w++) { const row = w < per ? 0 : 1, k = row ? n - 1 - w : w, cnt = row ? n - per : per; const x = 7 + (cnt > 1 ? (k - (row ? per : 0)) / (cnt - 1) : 0.5) * 86; out.push([row ? 7 + ((n - 1 - w) / Math.max(1, cnt - 1)) * 86 : x, (row ? 72 : 22) + ((w % 2) ? 8 : -6)]); }
  return out; })();""")
rep("const MAP_COLORS = ['#3fbf46', '#9b6bff', '#e0502c', '#38b6ff', '#7a4ad8', '#d08a2a', '#14b8a6', '#3a3f9a'];",
    "const MAP_COLORS = ['#e07a3a', '#f5c542', '#3a9a6a', '#3ff0ff', '#3fbf46', '#9b6bff', '#e0502c', '#38b6ff', '#7a4ad8', '#d08a2a', '#14b8a6', '#3a3f9a', '#ff4fd8', '#4ade80'];")
rep("  $('complete-title').textContent = last ? 'YOU BEAT GROK LAND 2.0!' : 'COURSE CLEAR!';","  $('complete-title').textContent = last ? 'YOU BEAT GROK LAND 2!' : (LEVELS[curLevel].boost ? 'ZONE CLEAR!' : 'COURSE CLEAR!');")
rep("  rows.push(['All-time stars', allStars + ' / ' + (LEVELS.length * 3)]);",
"""  if (W.boost) { const rk = W.boost.rank, t = run.time, R = t <= rk[0] ? 'S' : t <= rk[1] ? 'A' : t <= rk[2] ? 'B' : 'C'; rows.splice(0, 1, ['Rank', '<b class="rank">' + R + '</b>'], ['Rings', W.boost.rings]); save.rank = save.rank || {}; const order = 'CBAS'; if (!save.rank[curLevel] || order.indexOf(R) > order.indexOf(save.rank[curLevel])) { save.rank[curLevel] = R; persist(); } }
  rows.push(['All-time stars', allStars + ' / ' + (LEVELS.length * 3)]);""")
# online: in-game rooms go back to the title instead of the Arcade lobby
rep("function netGoLobby() {\n  const GN = window.GrokNet, me = room.me() || {};\n  room.markNavigating();",
    "function netGoLobby() {\n  const GN = window.GrokNet, me = room.me() || {};\n  room.markNavigating();\n  if (NET.prm && NET.prm.q && NET.prm.q.get('local')) { location.href = GN.soloUrl(); return; }")
s=s.replace("room.setMeta({ game: 'land',","room.setMeta({ game: 'land2',")
rep("        if (!NET.inLevel) { mode = 'title'; openMap(); showToast('<b>You are the host.</b> Pick a world for your team!', 4); }",
    "        if (!NET.inLevel) { mode = 'title'; openMap(); showToast('<b>You are the host.</b> Room code <b>' + netEsc(room.code) + '</b> (top of the screen): friends type it in ONLINE CO-OP. Then pick a world!', 8); }")
# buttons for online + boost
rep("onBtn('map-btn', () => openMap());",
"""onBtn('map-btn', () => openMap());
onBtn('boost-btn', () => { run.lives = 5; run.coins = 0; startLevel(LEVELS.findIndex((L) => L.boost)); });
onBtn('online-btn', openOnline);
onBtn('on-host', () => onlineGo('host'));
onBtn('on-join', () => onlineGo('join'));
onBtn('on-back', () => showCard('title-card'));""")
rep("const CARDS = ['title-card', 'map-card', 'pause-card', 'complete-card', 'gameover-card', 'mp-card'];","const CARDS = ['title-card', 'map-card', 'pause-card', 'complete-card', 'gameover-card', 'mp-card', 'online-card'];")
rep("function netDebug() {", rd('i_online.js')+"function netDebug() {")
# extra modules before the level builders
rep("function rushEnv(c) {", rd('c_pets.js')+"\n"+rd('d_boost.js')+"\n"+rd('e_decor.js')+"\n"+rd('j_worlds.js')+"\n"+rd('k_rush2.js')+"\nfunction rushEnv(c) {")
rep("  W, P, run, cam, startLevel, LEVELS,", "  W, P, run, cam, startLevel, LEVELS, renderer, updateCamera,")
rep("  shadowy(g, true, false);\n  g.position.set(x, top, z); W.root.add(g);\n  W.things.push({ update() {\n    if (g.userData.star)", "  shadowy(g, true, false);\n  g.position.set(x, top, z); W.root.add(g); W.goalPos = center || new V3(x, top, z); W.goalType = type;\n  W.things.push({ update() {\n    if (g.userData.star)")
open(P,'w').write(s)
print('patched', len(s))
