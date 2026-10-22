// ---- in-game ONLINE CO-OP (host a room or join with a 5-letter code; same GrokNet rooms as the Arcade lobby) ----
let onlineColor = '#3ff0ff';
function openOnline() {
  const GN = window.GrokNet;
  if (!GN) { showToast('Online play did not load. Check your internet.', 3); return; }
  const prof = GN.savedProfile();
  $('on-name').value = prof.hasName ? prof.name : '';
  onlineColor = prof.color || GN.COLORS[1];
  const sw = $('on-colors'); sw.innerHTML = '';
  GN.COLORS.forEach((c) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'swatch' + (c === onlineColor ? ' sel' : ''); b.style.background = c; b.setAttribute('aria-label', 'color ' + c);
    b.addEventListener('click', () => { onlineColor = c; Snd.S.click(); for (const x of sw.children) x.classList.toggle('sel', x === b); });
    sw.appendChild(b);
  });
  $('on-err').textContent = '';
  showCard('online-card');
}
function onlineGo(m) {
  const GN = window.GrokNet;
  const name = GN.cleanName($('on-name').value || 'Player');
  let code;
  if (m === 'host') code = GN.makeCode();
  else {
    code = GN.normalizeCode($('on-code').value || '');
    if (!GN.validCode(code)) { $('on-err').textContent = 'Type the 5-letter room code your friend sees at the top of their screen.'; return; }
  }
  GN.saveProfile(name, onlineColor);
  location.href = GN.buildUrl(GN.soloUrl(), { mode: m, code, name, color: onlineColor, pid: GN.pid(), n: 3 }, { local: 1 });
}
