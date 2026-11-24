// Snuke : le serpent qui grandit à chaque fruit. Six modes : Classique, Sans bords, Labyrinthe, Mue, Chrono et Vergers.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Snuke</span><span class="hint">Flèches, ZQSD ou glisser : tourner · P : pause · espace : rejouer</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="snCanvas" width="240" height="264"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="snStats"></div></div>
      <label class="row">Mode <select class="f gSel" id="snMode" title="Mode de jeu"></select></label>
      <div class="row"><button class="btn main" id="snNew">NOUVELLE PARTIE</button><button class="btn" id="snFs">PLEIN ÉCRAN</button></div>
      <div class="snLegend" id="snLegend" style="display:none"></div>
      <div class="sysCard"><b>APPARENCES</b><div class="snSkins" id="snSkins"></div></div>
      <div class="hint">Flèches, ZQSD ou glisser à la souris : tourner · P ou Échap : pause · espace : rejouer. Chaque fruit allonge le serpent et le fait aller plus vite ; une étoile apparaît tous les 7 fruits (50 points, elle ne reste pas longtemps). Classique : les bords tuent · Sans bords : on ressort de l'autre côté · Labyrinthe : 4 plateaux murés, le suivant tous les 10 fruits · Mue : tous les 5 fruits la queue se change en pierre et le serpent repart court · Chrono : 60 secondes, rien ne tue, se mordre coupe la queue · Vergers : trois fruits sur le plateau, dix espèces ; la vitesse du serpent est celle du dernier fruit mangé (piment fulgurant, myrtille tranquille), et les fruits lents rapportent moins. Records et statistiques sauvegardés et synchronisés.</div>
    </div></div>
</div>`;
const CSS = `.snSkins{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:8px}
.snSkins button{display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px 4px;font-size:12px;line-height:1.2;min-width:0}
.snSkins canvas{width:105px;max-width:100%;height:21px;image-rendering:pixelated}.snSkins em{font-style:normal;font-size:11px;opacity:.8}
.pxk.pxk .snSkins .btn .pxV{white-space:normal;text-align:center}
.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:0 1 auto;min-width:min(100%,280px);position:relative}
.gameBox:fullscreen{padding:0}
.gameBox:fullscreen canvas{height:100vh;width:auto;max-width:100vw}
.gameBox canvas{image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none;height:min(calc(100vh - 170px),900px);min-height:300px;width:auto;max-width:100%;aspect-ratio:240/264;object-fit:contain}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:460px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.snLegend{display:grid;grid-template-columns:1fr;gap:6px;font-size:14px;color:var(--lilac)}
.snLegend div{display:flex;align-items:center;gap:10px}
.snLegend canvas{width:20px;height:20px;image-rendering:pixelated;flex:none}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}

export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx, ask, newTab, pixIcon, PIX, WX } = host;
  const folder = ctx.folder, legacy = ctx.legacy || {};
  ctx.host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "SNUKE", T: {"k": "#0c0a12", "k2": "#16121e", "fill": "#221c2c", "fillOn": "#2e263a", "hl": "#3a3046", "line": "#62566e", "acc": "#7ee07a", "accL": "#d0ffd0", "accS": "#3a8a3e", "accD": "#0e2a12", "rivet": "#f0f0f8", "btn": "#3a3046", "btnHi": "#62566e", "btnLo": "#16121e", "btnHov": "#443852", "btnHovHi": "#82768e", "text": "#f4f0f8", "muted": "#c0b8cc", "acc2": "#7ee07a", "gold": "#ffd84a", "orange": "#ff8a3a", "red": "#ff4a3a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#100c16", "bgDot": "#221c2c", "bgDot2": "#16121e", "spark": "#0e2a12", "spark2": "#7ee07a", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["....kkkkk...", "...kgggggk..", "..kgwkggwgk.", "..kgkkggkkgk", "..kgggggggk.", "...kggrggk..", "....kgrgk...", ".kk..kgk....", "kggk.kgk....", "kgggkkgk....", ".kgggggk....", "..kkkkk....."],
  icons: [[/^NOUVELLE/, "play"], [/^RECORDS/, "crown"], [/^PLEIN/, "full"]] });
  const $ = id => id === "snakeApp" ? view : (view.querySelector('#' + id) || document.getElementById(id));  // les identifiants de ta vue d'abord, puis ceux de la page (fenêtres, menus)
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const __icon = () => ctx.icon;  // l'icône de ce plugin
  const LEGACY_GAMES = {"top":["snake"],"best":"^snake_"};
  let games = await doc('games');
  if (games == null) {  // première ouverture : tu retrouves tes records et tes parties d'avant
    const old = legacy.api ? await legacy.api('games').catch(() => null) : null; games = { best: {} };
    if (old) { const re = new RegExp(LEGACY_GAMES.best); for (const [k, v] of Object.entries(old.best || {})) if (re.test(k)) games.best[k] = v; for (const k of LEGACY_GAMES.top) if (old[k] !== undefined) games[k] = old[k]; await folder.write('games', games); }
  }
  games = { best: {}, ...games };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v, higher = true) => { const b = games.best[k]; if (b == null || (higher ? v > b : v < b)) { games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);  // la section d'un jeu
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel (taille 16 = double), sur une bande sombre
  const hs = lines.map(([, , size]) => PXK.H * PXK.scale(size) + 3), tot = hs.reduce((a, b) => a + b, 0);
  g.fillStyle = 'rgba(11,3,28,.78)'; g.fillRect(0, y0 - 6, w, tot + 10);
  let y = y0; lines.forEach(([text, color, size], i) => { const s = PXK.scale(size); PXK.fill(g, text, w / 2 + s, y + 9 * s + s, '#05010b', s, 'center'); PXK.fill(g, text, w / 2, y + 9 * s, color, s, 'center'); y += hs[i]; });
}
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
  // ---- ton code d'origine ----
/* ---------- jeu "Snuke": a snake on a 24 x 24 board (arrows or ZQSD). Modes: Classique (the edges kill), Sans bords (it comes back on the
   other side), Labyrinthe (4 walled boards, the next one every 10 fruits), Mue (every 5 fruits the tail turns to stone and the snake starts
   short again) and Chrono (60 s, nothing kills: biting yourself cuts your tail). Records and stats are kept in games.json (synced). ---------- */
const SN = {W: 240, H: 264, C: 10, N: 24, TOP: 24,
  kinds: {classique: 'Classique', tore: 'Sans bords', labyrinthe: 'Labyrinthe', mue: 'Mue', chrono: 'Chrono 60 s', verger: 'Vergers'},
  // the labyrinth boards: [name, is (x, y) a wall, start row]
  mazes: [
    ['Couloirs', (x, y) => (y === 6 || y === 17) && x > 3 && x < 20, 11],
    ['Cage', (x, y) => (x === 2 || y === 2 || x === 21 || y === 21) && Math.abs(x - 11.5) > 2 && Math.abs(y - 11.5) > 2, 11],
    ['Colonnes', (x, y) => x % 6 === 3 && y % 8 > 1 && y % 8 < 6, 8],
    ['Zigzag', (x, y) => y === 5 && x < 18 || y === 11 && x > 5 || y === 17 && x < 18, 8],
  ],
};
// le mode Vergers : trois fruits sur le plateau, dix espèces. step = images entre deux pas (petit = rapide) ; la vitesse reste celle du dernier fruit mangé
const SN_FRUITS = [
  {k: 'piment', name: 'Piment', color: '#ff3a2a', step: 3, pts: 50, grow: 1},
  {k: 'fraise', name: 'Fraise', color: '#ff4f6d', step: 4, pts: 35, grow: 1},
  {k: 'citron', name: 'Citron', color: '#ffe45a', step: 4, pts: 25, grow: 2},
  {k: 'orange', name: 'Orange', color: '#ff9a3c', step: 5, pts: 22, grow: 1},
  {k: 'cerise', name: 'Cerise', color: '#d4143c', step: 5, pts: 18, grow: 2},
  {k: 'pomme', name: 'Pomme', color: '#7fe05a', step: 6, pts: 12, grow: 1},
  {k: 'kiwi', name: 'Kiwi', color: '#9aa83a', step: 7, pts: 12, grow: 2},
  {k: 'raisin', name: 'Raisin', color: '#b46aee', step: 8, pts: 9, grow: 1},
  {k: 'pasteque', name: 'Pastèque', color: '#3ac060', step: 10, pts: 7, grow: 4},
  {k: 'myrtille', name: 'Myrtille', color: '#4a6aff', step: 12, pts: 5, grow: 1},
];
const snPace = s => s <= 3 ? 'très rapide' : s === 4 ? 'rapide' : s === 5 ? 'assez rapide' : s === 6 ? 'normal' : s <= 8 ? 'lent' : 'très lent';
function snFruitArt(g, X, Y, f) {  // chaque espèce a sa forme (10 x 10 pixels)
  const c = f.color;
  if (f.k === 'citron') { px(g, c, X + 1, Y + 3, 8, 5); px(g, c, X + 2, Y + 2, 6, 7); px(g, '#fff5a0', X + 3, Y + 3, 2, 2); px(g, '#8aa030', X + 8, Y + 4, 2, 1); }
  else if (f.k === 'fraise') { px(g, c, X + 1, Y + 2, 8, 3); px(g, c, X + 2, Y + 5, 6, 2); px(g, c, X + 3, Y + 7, 4, 1); px(g, c, X + 4, Y + 8, 2, 1); for (const [a, b] of [[3, 3], [6, 3], [4, 5], [6, 6]]) px(g, '#ffe45a', X + a, Y + b); px(g, '#5fd08a', X + 3, Y + 1, 4, 1); px(g, '#5fd08a', X + 4, Y, 2, 1); }
  else if (f.k === 'pasteque') { px(g, '#1f8a40', X, Y + 3, 10, 6); px(g, '#ff4f6d', X + 1, Y + 3, 8, 4); px(g, '#e8ffe0', X + 1, Y + 7, 8, 1); for (const a of [2, 5, 7]) px(g, '#130a20', X + a, Y + 4, 1, 2); }
  else if (f.k === 'raisin') { for (const [a, b] of [[1, 3], [4, 3], [7, 3], [2, 5], [5, 5], [3, 7]]) { px(g, c, X + a, Y + b, 3, 2); px(g, '#e0c0ff', X + a, Y + b, 1, 1); } px(g, '#5fd08a', X + 4, Y + 1, 2, 2); }
  else if (f.k === 'piment') { px(g, c, X + 2, Y + 2, 3, 3); px(g, c, X + 3, Y + 4, 3, 3); px(g, c, X + 5, Y + 6, 3, 2); px(g, '#ffb0a0', X + 2, Y + 2, 1, 2); px(g, '#5fd08a', X + 1, Y + 1, 3, 1); px(g, '#5fd08a', X + 1, Y + 2, 1, 1); }
  else if (f.k === 'kiwi') { px(g, '#7a5a2a', X + 1, Y + 2, 8, 7); px(g, '#7a5a2a', X + 2, Y + 1, 6, 9); px(g, c, X + 2, Y + 3, 6, 5); px(g, '#e8ffd0', X + 4, Y + 4, 2, 2); for (const [a, b] of [[3, 4], [6, 4], [3, 6], [6, 6]]) px(g, '#130a20', X + a, Y + b); }
  else if (f.k === 'myrtille') { px(g, c, X + 3, Y + 3, 5, 5); px(g, c, X + 2, Y + 4, 7, 3); px(g, '#c0c8ff', X + 3, Y + 4, 1, 1); px(g, '#130a20', X + 5, Y + 4, 1, 1); px(g, '#130a20', X + 4, Y + 5, 3, 1); }
  else if (f.k === 'cerise') { for (const a of [1, 5]) { px(g, c, X + a, Y + 5, 4, 4); px(g, c, X + a - 0, Y + 6, 4, 2); px(g, '#ffb0c0', X + a + 1, Y + 6, 1, 1); } px(g, '#5a8a2a', X + 3, Y + 2, 1, 3); px(g, '#5a8a2a', X + 6, Y + 2, 1, 3); px(g, '#5a8a2a', X + 4, Y + 1, 2, 1); px(g, '#5fd08a', X + 6, Y, 2, 1); }
  else if (f.k === 'orange') { px(g, c, X + 2, Y + 2, 6, 7); px(g, c, X + 1, Y + 3, 8, 5); px(g, '#ffc890', X + 3, Y + 3, 2, 1); px(g, '#c86a1a', X + 6, Y + 7, 1, 1); px(g, '#c86a1a', X + 3, Y + 8, 1, 1); px(g, '#5a8a2a', X + 4, Y + 1, 2, 1); px(g, '#5fd08a', X + 6, Y + 1, 2, 1); }
  else { px(g, c, X + 1, Y + 3, 8, 5); px(g, c, X + 2, Y + 2, 2, 7); px(g, c, X + 6, Y + 2, 2, 7); px(g, c, X + 2, Y + 8, 6, 1); px(g, 'rgba(255,255,255,.7)', X + 2, Y + 4, 1, 2); px(g, '#6a4a2a', X + 4, Y + 1, 1, 2); px(g, '#5fd08a', X + 5, Y, 3, 2); }  // pomme
}
const snSave = () => gstore('snake', {kind: 'classique', games: 0, fruits: 0, longest: 0});
let sn = null;
function snStart(kind = snSave().kind) {
  snSave().kind = kind;
  sn = {raf: sn?.raf || 0, g: $('snCanvas').getContext('2d'), mode: 'ready', kind, tick: 0, maze: 0, rocks: new Set(), score: 0, eaten: 0, wait: 0, queue: [], dir: [1, 0],
    fruit: null, star: null, time: kind === 'chrono' ? 3600 : 0, record: false, cut: 0, fruits: [], fspd: 6, grow: 0, last: null};
  snBody(); snFruit(); snInfo(); $('snMode').value = kind; $('snLegend').style.display = kind === 'verger' ? '' : 'none';
  gameLoop(sn, 'neodex:snake', snUpdate, snDraw);
}
function snBody() {
  const y = sn.kind === 'labyrinthe' ? SN.mazes[sn.maze][2] : 12;
  sn.body = [[6, y], [5, y], [4, y]]; sn.dir = [1, 0]; sn.queue = [];
}
const snWall = (x, y) => sn.kind === 'labyrinthe' && SN.mazes[sn.maze][1](x, y) || sn.rocks.has(y * SN.N + x);
const snOn = (x, y) => sn.body.some(([a, b]) => a === x && b === y);
function snFree() {
  const free = [];
  for (let y = 0; y < SN.N; y++) for (let x = 0; x < SN.N; x++) if (!snWall(x, y) && !snOn(x, y) && !(sn.fruit?.[0] === x && sn.fruit?.[1] === y) && !(sn.star?.[0] === x && sn.star?.[1] === y) && !sn.fruits?.some(f => f.x === x && f.y === y)) free.push([x, y]);
  return free[Math.floor(Math.random() * free.length)] || null;
}
function snFruit() {
  if (sn.kind !== 'verger') { sn.fruit = snFree(); if (!sn.fruit) snOver(); return; }
  while (sn.fruits.length < 3) {  // trois fruits d'espèces différentes sur le plateau
    const p = snFree(); if (!p) break;
    const rest = SN_FRUITS.filter(k => !sn.fruits.some(f => f.t === k)); sn.fruits.push({x: p[0], y: p[1], t: rest[Math.floor(Math.random() * rest.length)]});
  }
  if (!sn.fruits.length) snOver();
}
// one step of the snake
function snStep() {
  const q = sn.queue.shift(); if (q) sn.dir = q;
  const [hx, hy] = sn.body[0], wrap = sn.kind === 'tore' || sn.kind === 'chrono';
  let x = hx + sn.dir[0], y = hy + sn.dir[1];
  if (wrap) { x = (x + SN.N) % SN.N; y = (y + SN.N) % SN.N; }
  else if (x < 0 || y < 0 || x >= SN.N || y >= SN.N) return snOver();
  if (snWall(x, y)) return snOver();
  const vi = sn.kind === 'verger' ? sn.fruits.findIndex(f => f.x === x && f.y === y) : -1, eat = vi >= 0 || (sn.kind !== 'verger' && sn.fruit && sn.fruit[0] === x && sn.fruit[1] === y), gem = sn.star && sn.star[0] === x && sn.star[1] === y;
  if (!eat && !gem) { if (sn.grow > 0) sn.grow--; else sn.body.pop(); }  // the tail leaves its cell before the head comes in
  const hit = sn.body.findIndex(([a, b]) => a === x && b === y);
  if (hit >= 0) { if (sn.kind !== 'chrono') return snOver(); sn.body.length = Math.max(hit, 2); sn.cut = 20; sfx('error'); }  // keeps the part before the bite
  sn.body.unshift([x, y]);
  if (gem) { sn.star = null; sn.score += 50; sfx('notify'); }
  if (eat) {
    sn.eaten++; sfx('click');
    if (vi >= 0) { const f = sn.fruits.splice(vi, 1)[0]; sn.score += f.t.pts; sn.fspd = f.t.step; sn.grow += f.t.grow - 1; sn.last = f.t; } else sn.score += 10;
    if (sn.kind === 'mue' && sn.eaten % 5 === 0) {  // the tail turns to stone, the snake goes on short
      for (const [a, b] of sn.body.slice(3)) sn.rocks.add(b * SN.N + a);
      sn.body.length = 3; sn.score += 25;
    }
    if (sn.kind === 'labyrinthe' && sn.eaten % 10 === 0) { sn.maze = (sn.maze + 1) % SN.mazes.length; snBody(); sn.star = null; sn.wait = 40; sfx('launch'); }
    if (sn.eaten % 7 === 0 && !sn.star) { sn.star = snFree(); sn.starT = 300; }
    snFruit();
  }
}
const snSpeed = () => sn.kind === 'chrono' ? 5 : sn.kind === 'verger' ? sn.fspd : Math.max(3, 8 - Math.floor(sn.eaten / 6));
function snUpdate() {
  if (sn.cut) sn.cut--;
  if (sn.star && --sn.starT <= 0) sn.star = null;
  if (sn.kind === 'chrono' && --sn.time <= 0) return snOver();
  if (sn.wait > 0) { sn.wait--; return; }
  sn.wait = snSpeed() - 1; snStep();
}
function snOver() {
  if (sn.mode === 'over') return;
  sn.mode = 'over'; sfx('error');
  const s = snSave(); s.games++; s.fruits += sn.eaten; s.longest = Math.max(s.longest, sn.body.length);
  const before = SN_SKINS.filter(snSkinOk).length;
  sn.record = sn.score > 0 && best('snake_' + sn.kind, sn.score); saveGames(); snInfo();  // un score nul n'est jamais un record
  const now = SN_SKINS.filter(snSkinOk); if (now.length > before) { sn.unlock = now.at(-1).name; toast('Nouvelle apparence : ' + sn.unlock); }
}
/* ---------- le dessin : un pré en damier, des haies, le serpent avec sa tête, ses yeux et sa queue effilée ---------- */
const SN_STAR = ['....y....', '...yhy...', 'yyyhwhyyy', '.yhwwwhy.', '..yhwhy..', '.yhy.yhy.', 'yy.....yy'];
let SN_BODY = ['#9af05a', '#86e04c'], SN_DOT = '#3a8a2a', SN_HI = '#e0ffb0', SN_OUT = '#0a1e0c';
// les apparences : couleurs du corps, écailles, reflet, contour, tête, et un motif ; gagnées en jouant
const SN_SKINS = [
  {id: 'prairie', name: 'Prairie', body: ['#9af05a', '#86e04c'], dot: '#3a8a2a', hi: '#e0ffb0', out: '#0a1e0c', head: '#a8f86a'},
  {id: 'corail', name: 'Corail', need: ['fruits', 100], body: ['#ff5a4a', '#ff5a4a'], dot: '#a8201a', hi: '#ffd0c0', out: '#1a0606', head: '#ff6a5a', bands: ['#1a1a1a', '#ffe27a']},
  {id: 'python', name: 'Python doré', need: ['longest', 25], body: ['#e8c050', '#d8a838'], dot: '#6a4010', hi: '#fff0b0', out: '#2a1a06', head: '#f0d060', blot: '#8a5a1a'},
  {id: 'glace', name: 'Glace', need: ['games', 20], body: ['#bff4ff', '#9ae0f4'], dot: '#4a9ac8', hi: '#ffffff', out: '#0a2a3a', head: '#d8faff'},
  {id: 'lave', name: 'Lave', need: ['classique', 150], body: ['#2a1a1a', '#3a2020'], dot: '#ff6a1a', hi: '#ff9a3a', out: '#0a0404', head: '#3a2424', glow: true},
  {id: 'neon', name: 'Néon', need: ['fruits', 500], body: ['#ff4fd8', '#3ae0ff'], dot: '#ffffff', hi: '#ffffff', out: '#14041e', head: '#ff8ae8'},
  {id: 'galaxie', name: 'Galaxie', need: ['longest', 50], body: ['#3a1a6a', '#2a1258'], dot: '#a888ff', hi: '#ffffff', out: '#08041a', head: '#4a2a80', stars: true},
  {id: 'arc', name: 'Arc-en-ciel', need: ['modes', 6], body: ['#ff5a5a', '#ffd84a'], dot: '#ffffff', hi: '#ffffff', out: '#14041e', head: '#ffffff', rainbow: true}];
const SN_NEED_TXT = {fruits: 'fruits en tout', longest: 'cases de long', games: 'parties', classique: 'points en Classique', modes: 'modes joués'};
const snNeedVal = k => { const s = snSave(); return k.need[0] === 'fruits' ? s.fruits : k.need[0] === 'longest' ? s.longest : k.need[0] === 'games' ? s.games : k.need[0] === 'classique' ? games?.best.snake_classique ?? 0 : Object.keys(SN.kinds).filter(m => (games?.best['snake_' + m] ?? 0) > 0).length; };
const snSkinOk = k => !k.need || snNeedVal(k) >= k.need[1];
const snSkin = () => { const k = SN_SKINS.find(k => k.id === snSave().skin) || SN_SKINS[0]; return snSkinOk(k) ? k : SN_SKINS[0]; };
function snSegCol(k, i, t) {  // la couleur d'un anneau du corps selon le motif
  if (k.rainbow) return `hsl(${(i * 28 + t * 3) % 360},85%,62%)`;
  if (k.bands) return i % 4 === 1 ? k.bands[0] : i % 4 === 3 ? k.bands[1] : k.body[0];
  if (k.blot && i % 5 < 2) return k.blot;
  return k.body[i % 2];
}
function snDraw() {
  const g = sn.g, C = SN.C, T = SN.TOP, t = sn.tick, N = SN.N, wrap = sn.kind === 'tore' || sn.kind === 'chrono';
  px(g, '#0c0a12', 0, 0, SN.W, T);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {  // l'herbe, avec des touffes et des fleurs semées toujours aux mêmes cases
    const X = x * C, Y = T + y * C, h = (x * 7 + y * 13) % 17;
    px(g, (x + y) % 2 ? '#14281a' : '#182e1e', X, Y, C, C);
    if (h === 0) { px(g, '#24482a', X + 2, Y + 6, 1, 2); px(g, '#24482a', X + 4, Y + 4, 1, 4); px(g, '#24482a', X + 6, Y + 6, 1, 2); }
    else if (h === 9) { px(g, '#f0e8b0', X + 4, Y + 4, 1, 1); px(g, '#ffd84a', X + 4, Y + 5, 1, 1); }
  }
  if (wrap) for (let i = 0; i < SN.W; i += 4) { px(g, '#7fe0ee', i, T, 2, 1); px(g, '#7fe0ee', i, SN.H - 1, 2, 1); px(g, '#7fe0ee', 0, T + i, 1, 2); px(g, '#7fe0ee', SN.W - 1, T + i, 1, 2); }
  else { px(g, '#8a6a3a', 0, T, SN.W, 2); px(g, '#8a6a3a', 0, SN.H - 2, SN.W, 2); px(g, '#8a6a3a', 0, T, 2, N * C); px(g, '#8a6a3a', SN.W - 2, T, 2, N * C); }
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {  // les haies du labyrinthe et les pierres de la mue
    const X = x * C, Y = T + y * C;
    if (sn.kind === 'labyrinthe' && SN.mazes[sn.maze][1](x, y)) { px(g, '#6a5a6e', X, Y, C, C); px(g, '#9a8aa0', X, Y, C, 1); px(g, '#2e2434', X, Y + C - 1, C, 1); px(g, '#2e2434', X, Y + 4, C, 1); px(g, '#2e2434', X + (y % 2 ? 3 : 7), Y, 1, 4); px(g, '#2e2434', X + (y % 2 ? 7 : 3), Y + 5, 1, 4); px(g, '#8a7a90', X + 1, Y + 1, 2, 1); }
    else if (sn.rocks.has(y * N + x)) { px(g, '#5a5a70', X + 1, Y + 2, 8, 7); px(g, '#5a5a70', X + 2, Y + 1, 6, 9); px(g, '#9a9ab8', X + 2, Y + 2, 3, 2); px(g, '#34344a', X + 2, Y + 8, 6, 1); px(g, '#34344a', X + 7, Y + 4, 1, 4); }
  }
  const bob = (t >> 4) % 2;
  if (sn.fruit) { const [x, y] = sn.fruit; px(g, 'rgba(0,0,0,.35)', x * C + 2, T + y * C + 9, 6, 1); snFruitArt(g, x * C, T + y * C - bob, {k: 'pomme', color: '#ff4f6d'}); }
  for (const f of sn.fruits || []) { px(g, 'rgba(0,0,0,.35)', f.x * C + 2, T + f.y * C + 9, 6, 1); snFruitArt(g, f.x * C, T + f.y * C - bob, f.t); }
  if (sn.star && (sn.starT > 90 || (t >> 3) % 2)) sprite(g, SN_STAR, sn.star[0] * C, T + sn.star[1] * C + 1, {y: '#ffd07a', h: '#ffe9b0', w: '#ffffff'});
  // le serpent : un corps continu (chaque paire de cases voisines est reliée), plus fin vers la queue, des écailles, puis la tête
  const b = sn.body, n = b.length, flash = sn.cut && (t >> 2) % 2, K = snSkin(); SN_DOT = K.dot; SN_HI = K.hi; SN_OUT = K.out;
  { const X = b[0][0] * C, Y = T + b[0][1] * C; px(g, SN_OUT, X - 1, Y + 1, C + 2, C - 2); px(g, SN_OUT, X + 1, Y - 1, C - 2, C + 2); px(g, SN_OUT, X, Y, C, C); }  // le contour de la tête avant le corps, qui s'y raccorde
  for (const pass of [0, 1]) for (let i = n - 1; i >= 1; i--) {  // passe 0 : le contour sombre, un pixel plus large ; passe 1 : le corps
    const [x1, y1] = b[i], [x0, y0] = b[i - 1], m = (i === n - 1 ? 2 : 1) - (pass ? 0 : 1), col = pass ? (flash ? '#ffffff' : snSegCol(K, i, t)) : SN_OUT;
    px(g, col, x1 * C + m, T + y1 * C + m, C - 2 * m, C - 2 * m);
    if (Math.abs(x1 - x0) + Math.abs(y1 - y0) === 1) px(g, col, Math.min(x0, x1) * C + m, T + Math.min(y0, y1) * C + m, (x0 !== x1 ? 2 * C : C) - 2 * m, (y0 !== y1 ? 2 * C : C) - 2 * m);
  }
  for (let i = 1; i < n; i++) { const X = b[i][0] * C, Y = T + b[i][1] * C;
    if (i === n - 1) { px(g, SN_DOT, X + 4, Y + 4, 2, 2); continue; }
    if (!flash) { px(g, K.glow ? ((t >> 3) + i) % 3 ? '#ff6a1a' : '#ffd040' : K.stars ? ((t >> 4) + i * 7) % 9 ? SN_DOT : '#ffffff' : i % 2 || K.id !== 'prairie' ? SN_DOT : '#3aa040', X + 4, Y + 4, 2, 2); px(g, SN_HI, X + 2, Y + 2, 1, 1); if (K.stars && (i * 5 + (t >> 5)) % 7 === 0) px(g, '#ffffff', X + 6, Y + 6, 1, 1); } }
  const [hx, hy] = b[0], X = hx * C, Y = T + hy * C, [dx, dy] = sn.dir, hc = flash ? '#ffffff' : K.rainbow ? snSegCol(K, 0, t) : K.head;
  
  px(g, hc, X + 1, Y + 1, C - 2, C - 2); px(g, SN_HI, X + 2, Y + 1, 3, 1);
  const eyes = dx ? [[dx > 0 ? 5 : 2, 1], [dx > 0 ? 5 : 2, 6]] : [[1, dy > 0 ? 5 : 2], [6, dy > 0 ? 5 : 2]];
  for (const [a, c] of eyes) {
    if (sn.mode === 'over') { for (const k of [0, 1, 2]) { px(g, '#130a20', X + a + k, Y + c + k, 1, 1); px(g, '#130a20', X + a + 2 - k, Y + c + k, 1, 1); } continue; }  // des yeux en croix quand c'est perdu
    px(g, '#ffffff', X + a, Y + c, 3, 3); px(g, '#130a20', X + a + (dx > 0 ? 1 : dx < 0 ? 0 : 1), Y + c + (dy > 0 ? 1 : dy < 0 ? 0 : 1), 2, 2);
  }
  if (sn.mode !== 'over' && (t >> 3) % 8 === 0) { const tx = X + 4 + dx * 7, ty = Y + 4 + dy * 7; px(g, '#ff4f6d', tx, ty, dx ? 3 : 2, dy ? 3 : 2); px(g, '#ff4f6d', tx + (dx > 0 ? 3 : dx < 0 ? -1 : -1), ty + (dy > 0 ? 3 : dy < 0 ? -1 : -1), 1, 1); px(g, '#ff4f6d', tx + (dx > 0 ? 3 : dx < 0 ? -1 : 2), ty + (dy > 0 ? 3 : dy < 0 ? -1 : 2), 1, 1); }  // la langue fourchue
  // le bandeau du haut : score, record, taille (ou temps, ou nom du plateau), et la vitesse du dernier fruit en Vergers
  const lab = (txt, val, x) => { pxFont(g, txt, x, 15, '#9a90aa'); pxFont(g, String(val), x + PXK.layout(txt).w + 4, 15, '#ffd84a'); };
  lab('SCORE', sn.score, 4); lab('RECORD', games?.best['snake_' + sn.kind] ?? 0, 84);
  lab(sn.kind === 'chrono' ? 'TEMPS' : sn.kind === 'labyrinthe' ? SN.mazes[sn.maze][0].toUpperCase() : 'TAILLE', sn.kind === 'chrono' ? Math.ceil(sn.time / 60) + ' s' : n, 168);
  if (sn.kind === 'verger') { const k = (13 - sn.fspd) / 10; px(g, '#05010b', 4, 19, 232, 4); px(g, k > .7 ? '#ff4f6d' : k > .45 ? '#ffd07a' : '#7fe0ee', 5, 20, Math.round(230 * k), 2); }
  if (sn.mode === 'ready') gameText(g, SN.W, [['SNUKE', '#7ee07a', 16], [SN.kinds[sn.kind], '#ffd84a', 8], ['Une flèche pour partir', '#ffffff', 8]], 100);
  if (sn.mode === 'pause') gameText(g, SN.W, [['PAUSE', '#ffd84a', 16], ['Une flèche pour reprendre', '#d9c6ff', 8]], 110);
  if (sn.mode === 'over') gameText(g, SN.W, [[sn.kind === 'chrono' ? 'TEMPS ÉCOULÉ' : 'PERDU', '#ff4f6d', 16], [sn.score + ' points' + (sn.record ? ' · record !' : ''), '#ffd84a', 8], [sn.eaten + ' fruits · taille ' + n, '#d9c6ff', 8], ...(sn.unlock ? [['Apparence : ' + sn.unlock, '#ff8ae8', 8]] : []), ['Espace : rejouer', '#ffffff', 8]], 92);
}
/* ---------- input and page ---------- */
const SN_DIRS = {ArrowLeft: [-1, 0], q: [-1, 0], a: [-1, 0], ArrowRight: [1, 0], d: [1, 0], ArrowUp: [0, -1], z: [0, -1], w: [0, -1], ArrowDown: [0, 1], s: [0, 1]};
function snTurn(d) {
  if (sn.mode === 'over') return;
  if (sn.mode !== 'play') sn.mode = 'play';
  const last = sn.queue.at(-1) || sn.dir;
  if (sn.queue.length < 2 && !(last[0] === d[0] && last[1] === d[1]) && !(last[0] === -d[0] && last[1] === -d[1])) sn.queue.push(d);  // no U-turn into yourself
}
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !sn || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (SN_DIRS[k]) { e.preventDefault(); snTurn(SN_DIRS[k]); }
  else if ((k === ' ' || k === 'Enter') && sn.mode === 'over') { e.preventDefault(); snStart(sn.kind); }
  else if (k === 'p' || k === 'Escape') { if (sn.mode === 'play') sn.mode = 'pause'; }
});
// mouse / touch: a swipe on the board turns
$('snCanvas').onpointerdown = e => {
  const cv = $('snCanvas'), sx = e.clientX, sy = e.clientY; cv.setPointerCapture(e.pointerId);
  cv.onpointerup = u => { cv.onpointerup = null; const dx = u.clientX - sx, dy = u.clientY - sy;
    if (sn.mode === 'over') return snStart(sn.kind);
    if (Math.hypot(dx, dy) > 12) snTurn(Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)]); };
};
function snLegend() {  // les dix fruits, leur vitesse et leurs points
  $('snLegend').replaceChildren(...SN_FRUITS.map(f => {
    const row = el('div'), cv = el('canvas'); cv.width = cv.height = 10; snFruitArt(cv.getContext('2d'), 0, 0, f);
    row.append(cv, el('span', '', f.name + ' · ' + snPace(f.step) + ' · ' + f.pts + ' pts' + (f.grow > 1 ? ' · +' + (f.grow - 1) + ' de longueur' : ''))); return row;
  }));
}
function snInfo() {  // le panneau des records : chaque mode, puis les parties, les fruits et le plus long serpent
  const s = snSave(), rows = [...Object.entries(SN.kinds).map(([k, v]) => [v, games?.best['snake_' + k] ?? 0]), ['Parties', s.games], ['Fruits mangés', s.fruits], ['Plus long', s.longest]];
  $('snStats').replaceChildren(...rows.flatMap(([k, v]) => [el('span', '', k), el('b', '', String(v))]));
  $('snSkins').replaceChildren(...SN_SKINS.map(K => {  // un petit serpent pour chaque apparence ; fermée, elle dit ce qu'il reste à faire
    const ok = snSkinOk(K), cv = el('canvas'), g = cv.getContext('2d'); cv.width = 35; cv.height = 7;
    for (let i = 0; i < 5; i++) { px(g, ok ? K.out : '#1a1626', i * 7, 0, 7, 7); px(g, ok ? (i === 4 ? K.head : snSegCol(K, 4 - i, 0)) : '#3a3448', i * 7 + (i ? 0 : 1), 1, i ? 7 : 6, 5); if (ok && i < 4) px(g, K.dot, i * 7 + 3, 3, 1, 1); }
    if (ok) { px(g, '#ffffff', 31, 2, 2, 2); px(g, '#130a20', 32, 2, 1, 1); }
    const b = el('button', 'btn' + (snSkin().id === K.id ? ' main' : '')); b.disabled = !ok;
    b.append(cv, el('span', '', K.name), el('em', '', ok ? (snSkin().id === K.id ? 'portée' : 'à toi') : Math.min(snNeedVal(K), K.need[1]) + ' / ' + K.need[1] + ' ' + SN_NEED_TXT[K.need[0]]));
    b.onclick = () => { snSave().skin = K.id; saveGames(); snInfo(); b.blur(); }; return b;
  }));
}
function snOpen() {
  if (!$('snMode').options.length) $('snMode').replaceChildren(...Object.entries(SN.kinds).map(([k, v]) => Object.assign(el('option', '', v), {value: k})));
  if (sn) { gameLoop(sn, 'neodex:snake', snUpdate, snDraw); snInfo(); return; }
  snStart();
}
snLegend();
$('snMode').onchange = () => { snStart($('snMode').value); saveGames(); $('snMode').blur(); };
$('snNew').onclick = () => { snStart(sn?.kind); $('snNew').blur(); };
$('snFs').onclick = () => { $('snFs').blur(); try { document.fullscreenElement ? document.exitFullscreen() : $('snCanvas').parentElement.requestFullscreen?.().catch(() => {}); } catch {} };
$('snCanvas').__sn = {save: () => snSave(), info: () => snInfo(), st: () => sn, start: k => snStart(k), turn: d => snTurn(d), step: () => snStep(), star: () => { sn.star = snFree(); sn.starT = 300; }};  // pour le test « local »
{  // self-check: eating grows by one, a U-turn is refused, Chrono cuts the tail instead of killing, Mue turns the tail to stone
  const keep = sn, real = {snFruit, snOver}; let over = 0; snFruit = () => { sn.fruit = null; }; snOver = () => over++;
  try {
    sn = {kind: 'classique', mode: 'play', body: [[5, 5], [4, 5], [3, 5]], dir: [1, 0], queue: [], rocks: new Set(), maze: 0, eaten: 0, score: 0, fruit: [6, 5], star: null};
    snStep(); const grew = sn.body.length === 4 && sn.score === 10;
    snTurn([-1, 0]); const noU = sn.queue.length === 0;
    sn.body = [[5, 5], [5, 6], [4, 6], [4, 5], [3, 5]]; sn.dir = [0, 1]; sn.queue = [[-1, 0]]; snStep(); const died = over === 1;  // turns left into its own body
    sn.kind = 'chrono'; sn.body = [[5, 5], [5, 6], [4, 6], [4, 5], [3, 5], [2, 5]]; sn.dir = [0, 1]; sn.queue = [[-1, 0]]; snStep(); const cut = over === 1 && sn.body.length === 4 &&sn.body[0][0] === 4 && sn.body[0][1] === 5;
    sn.kind = 'mue'; sn.body = [[5, 5], [4, 5], [3, 5], [2, 5], [1, 5]]; sn.dir = [1, 0]; sn.eaten = 4; sn.fruit = [6, 5]; snStep(); const stone = sn.body.length === 3 && sn.rocks.size === 3;
    sn.kind = 'verger'; sn.body = [[5, 5], [4, 5], [3, 5]]; sn.dir = [1, 0]; sn.eaten = 0; sn.score = 0; sn.grow = 0; sn.fspd = 6; sn.fruit = null; sn.fruits = [{x: 6, y: 5, t: SN_FRUITS[0]}, {x: 9, y: 9, t: SN_FRUITS[8]}];
    snStep(); const pepper = sn.fspd === 3 && sn.score === 50 && sn.body.length === 4 && sn.fruits.length === 1;  // le piment : vitesse 3, 50 points
    sn.fruits.push({x: 7, y: 5, t: SN_FRUITS[8]}); snStep(); const melon = sn.fspd === 10 && sn.grow === 3 && sn.body.length === 5; snStep(); snStep(); const grows = sn.body.length === 7 && sn.grow === 1;  // la pastèque : lente, la queue grandit de 4
    const g0 = document.createElement('canvas').getContext('2d'); sn = {...sn, g: g0, tick: 8, mode: 'over', star: [3, 3], starT: 300, cut: 0}; snDraw(); sn.mode = 'play'; snDraw();
    const sv = snSave(), keepSkin = sv.skin, keepF = sv.fruits; sv.skin = 'neon'; sv.fruits = 0; const locked = snSkin().id === 'prairie'; sv.fruits = 999; const open = snSkin().id === 'neon';
    for (const K of SN_SKINS) { sv.skin = K.id; sv.fruits = 999; snDraw(); } sv.skin = keepSkin; sv.fruits = keepF; if (!locked || !open) throw new Error('apparences ' + locked + ' ' + open);  // le dessin, étoile comprise, ne plante pas
    console.assert(grew && noU && died && cut && stone && pepper && melon && grows && SN_FRUITS.length === 10 && new Set(SN_FRUITS.map(f => f.k)).size === 10, 'snake moves', {grew, noU, died, cut, stone, pepper, melon, grows});
  } finally { ({snFruit, snOver} = real); sn = keep; }
}  // (non indenté : les textes sur plusieurs lignes restent exactement les tiens)
  // ---- fin ----
  ctx.onOpen(() => { snOpen(); });
}
