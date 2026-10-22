// GROK LAND 2 level list: new worlds first, then Boost Zones, then the classic worlds remastered
const TEAM_ZONES_OLD = [
  { e: -10, s: 'grass', w: 'stone' }, { e: -7, s: 'grass', w: 'stone' }, { e: -7, s: 'castle', w: 'castle' },
  { e: -8, s: 'snow', w: 'ice' }, { e: -8, s: 'grave', w: 'manor' }, { e: -7, s: 'metal', w: 'brass' },
  { e: -7, s: 'sand', w: 'coral' }, { e: -7, s: 'sand', w: 'coral' }, { e: -7, s: 'reef', w: 'coral' },
  { e: -7, s: 'moon', w: 'hull' }, { e: -7, s: 'hull', w: 'neon' }, { e: -7, s: 'hull', w: 'neon' },
];
const NEW_LEVELS = (typeof newLevelDefs === 'function') ? newLevelDefs() : [];
const CLASSIC_DEFS = [
  { name: 'GROK MEADOWS', build: buildMeadows, start: [0, 0, 8], blurb: 'Crate puzzle · key & cage' },
  { name: 'SKY ISLANDS', build: buildSky, start: [0, 0, 4], blurb: 'Color switches · memory pads' },
  { name: 'LAVA CASTLE', build: buildLava, start: [0, 0, 5], blurb: 'Lava bridge · locked castle' },
  { name: 'FROSTBITE PEAKS', build: buildFrost, start: [0, 0, 5], blurb: 'Sliding ice-crate puzzle · icicles · snowmen' },
  { name: 'GHOST MANOR', build: buildManor, start: [0, 0, 5], blurb: 'Candle puzzle · phantom floors · shy ghosts' },
  { name: 'CLOCKWORK FACTORY', build: buildFactory, start: [0, 0, 5], blurb: 'Lever-light puzzle · gears · conveyors · robots' },
  { name: 'SUNNY SHORE', cw: 7, build: buildShore, start: [0, 0, 5], blurb: 'Jellyfish bounces · tide sandbars · water spout' },
  { name: 'TIDE POOLS', cw: 7, build: buildTidePools, start: [0, 0, 5], blurb: 'Timed spouts · shell-crate puzzle · seagulls' },
  { name: 'SUNKEN REEF', cw: 7, build: buildReef, start: [0, 0, 5], blurb: 'Bobbing jellies · coral lamps · turtle ferries' },
  { name: 'MOON BASE', cw: 8, build: buildMoon, start: [0, 0, 5], blurb: 'Low gravity · boost pads · UFOs' },
  { name: 'LASER LABS', cw: 8, build: buildLabs, start: [0, 0, 5], blurb: 'Laser fences · teleporters · power-cell puzzle' },
  { name: 'STAR CORE', cw: 8, build: buildCore, start: [0, 0, 5], blurb: 'Everything at once · the grand finale' },
];
const LEVELS = [];
NEW_LEVELS.forEach((L) => LEVELS.push(L));
const BOOST_W = (LEVELS.length ? LEVELS[LEVELS.length - 1].world : 0) + 1;
LEVELS.push({ name: 'MEADOW RUSH', sub: 'BOOST 1', world: BOOST_W, worldName: 'BOOST ZONES', song: 10, build: buildRush, start: [0, 0, 13], blurb: 'Open zone · grind rails · homing pods · a rail loop', isNew: true, boost: true });
if (typeof buildCanyonRush === 'function') LEVELS.push({ name: 'CANYON RUSH', sub: 'BOOST 2', world: BOOST_W, worldName: 'BOOST ZONES', song: 10, build: buildCanyonRush, start: [0, 0, 13], blurb: 'Desert open zone · canyon rails · mine-cart jumps', isNew: true, boost: true });
const CLASSIC_W0 = BOOST_W;
CLASSIC_DEFS.forEach((L, k) => {
  const cw = L.cw || (k + 1), sub = cw >= 7 ? 'CLASSIC ' + cw + '-' + (k - (cw === 7 ? 6 : 9) + 1) : 'CLASSIC ' + cw;
  LEVELS.push(Object.assign({}, L, { sub, world: CLASSIC_W0 + cw, worldName: cw === 7 ? 'CORAL COAST' : cw === 8 ? 'STARLIGHT STATION' : undefined, song: cw - 1, classic: true, tz: TEAM_ZONES_OLD[k] }));
});
