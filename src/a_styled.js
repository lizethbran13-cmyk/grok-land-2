function styledMesh(w, h, d, style) {
  const st = STYLE[style] || STYLE.stone;
  const sp = STYLE_PAT[style] || ['speck', 'speck', 3];
  const g = new THREE.Group();
  const o = st.emissive ? { emissive: st.emissive } : undefined;
  const body = new THREE.Mesh(boxGeoUV(w, h, d, sp[2], st.ao || 0.58), texMat(st.side, sp[1], o)); g.add(body);
  if (st.cap) {
    const ch = Math.min(st.cap, h * 0.6);
    const cap = new THREE.Mesh(boxGeoUV(w + 0.14, ch, d + 0.14, sp[2], 0.82), texMat(st.top, sp[0], o)); cap.position.y = h / 2 - ch / 2 + 0.002; g.add(cap);
  } else if (sp[0] !== sp[1]) {
    const top = new THREE.Mesh(boxGeoUV(w + 0.02, 0.04, d + 0.02, sp[2], 1), texMat(st.top, sp[0], o)); top.position.y = h / 2 - 0.018; g.add(top);
  }
  if (style === 'cloud') {
    const n = Math.max(2, Math.round((w + d) / 2.2));
    for (let i = 0; i < n; i++) {
      const b = new THREE.Mesh(G.ico, mat(0xffffff, o));
      const sz = Math.min(w, d) * (0.3 + Math.random() * 0.12);
      b.scale.set(sz, sz * 0.7, sz);
      b.position.set((Math.random() - 0.5) * (w - sz), -h * 0.2 - Math.random() * 0.2, (Math.random() - 0.5) * (d - sz));
      g.add(b);
    }
  }
  if (style === 'fall') {
    const stripe = M(G.box, 0x6b3b1f); stripe.scale.set(w + 0.02, 0.1, d + 0.02); stripe.position.y = -h * 0.15; g.add(stripe);
  }
  return g;
}
