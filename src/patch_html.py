import sys
P='/workspace/grok-land-2/index.html'
s=open('/workspace/gl2-orig/index.html').read()
def rep(a,b):
    global s
    if a not in s: print('MISSING',a[:80]); sys.exit(1)
    s=s.replace(a,b,1)
rep('<title>GROK LAND 2.0</title>','<title>GROK LAND 2</title>')
rep('<span class="v2" id="v2-badge">2.0</span>','<span class="v2 big2" id="v2-badge">2</span>')
rep('A 3D PLATFORM ADVENTURE &middot; 8 WORLDS &middot; 36 HIDDEN STARS &middot;','THE SEQUEL &middot; NEW WORLDS &middot; BOOST MODE &middot; ONLINE CO-OP &middot;')
rep('''        <button id="map-btn" type="button" class="btn">WORLD MAP</button>
      </div>''','''        <button id="map-btn" type="button" class="btn">WORLD MAP</button>
      </div>
      <div class="title-btns">
        <button id="boost-btn" type="button" class="btn boost">&#9889; BOOST ZONES</button>
        <button id="online-btn" type="button" class="btn online">&#127760; ONLINE CO-OP</button>
      </div>''')
rep('<div><kbd>Q</kbd>/<kbd>E</kbd> or mouse drag: camera &nbsp; <kbd>Esc</kbd> pause &nbsp; <kbd>M</kbd> sound</div>',
    '<div><kbd>Q</kbd>/<kbd>E</kbd> or mouse drag: camera &nbsp; <kbd>Esc</kbd> pause &nbsp; <kbd>M</kbd> sound</div>\n        <div>Boost Zones: hold <kbd>C</kbd>/<kbd>B</kbd> to BOOST &middot; <kbd>Shift</kbd> in mid-air = HOMING ATTACK / air dash &middot; run onto rails to grind</div>')
rep('<div>Drag on the right side to turn the camera</div>','<div>Drag on the right side to turn the camera</div>\n        <div>Boost Zones: hold <b>BOOST</b> &middot; <b>ACTION</b> in mid-air = homing attack</div>')
rep('''      <button type="button" id="btn-jump">JUMP</button>''','''      <button type="button" id="btn-jump">JUMP</button>
      <button type="button" id="btn-boost">BOOST</button>''')
rep('''  <div id="mp-arrows"></div>''','''  <div id="speedlines"></div>
  <div id="boost-hud" class="hidden">
    <div class="bh-row"><span class="ring-ico"></span><b id="boost-rings">0</b><span id="boost-speed">0 km/h</span></div>
    <div class="bh-bar"><div id="boost-fill"></div><span>BOOST</span></div>
  </div>
  <div id="mp-arrows"></div>''')
rep('''    <div class="card hidden" id="gameover-card">''','''    <div class="card hidden" id="online-card">
      <p class="kicker">ONLINE CO-OP &middot; UP TO 3 PLAYERS</p>
      <h2>PLAY TOGETHER</h2>
      <label class="on-l">Your name <input id="on-name" maxlength="12" autocomplete="off" placeholder="Player" /></label>
      <div id="on-colors"></div>
      <button id="on-host" type="button" class="btn primary">HOST A ROOM</button>
      <div class="on-join"><input id="on-code" maxlength="5" autocomplete="off" autocapitalize="characters" placeholder="CODE" /><button id="on-join" type="button" class="btn">JOIN</button></div>
      <p class="small" id="on-err"></p>
      <p class="small">The host picks the worlds. Everyone runs their own hero, coins and enemies are shared, and every world has a co-op <b>Team Zone</b>.</p>
      <button id="on-back" type="button" class="btn ghost">BACK</button>
    </div>

    <div class="card hidden" id="gameover-card">''')
rep('<div id="loading">LOADING GROK LAND&hellip;</div>','<div id="loading">LOADING GROK LAND 2&hellip;</div>')
open(P,'w').write(s)
