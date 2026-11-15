// lancé par le test « local » de NeoDex : une partie (le serpent avance et tourne), l'étoile bonus, le mode Vergers, la fin de partie,
// le plein écran et la place prise par le jeu (avec NEO_SHOTS : garde des images du jeu)
module.exports = async ({ pj, sleep }) => {
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('snCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'snuke-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  const S = js => pj(`(() => { const T = document.getElementById('snCanvas').__sn; ${js} })()`);
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  await S(`T.start('classique'); return 0;`); await sleep(300); await shot('0-depart');
  await pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true})), 0`); await sleep(700);
  await pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowDown', bubbles: true})), 0`); await sleep(500);
  const p = await S(`const s = T.st(); return [s.mode, s.dir.join(), s.body[0].join()].join(' ');`);
  if (!/^play 0,1 /.test(p)) throw new Error('le serpent devait partir puis tourner vers le bas : ' + p);
  await S(`const s = T.st(); s.body.push(...[1, 2, 3, 4, 5].map(k => [s.body.at(-1)[0] - 1, s.body.at(-1)[1]])); T.star(); return 0;`); await sleep(200); await shot('1-partie-etoile');
  await S(`T.start('verger'); return 0;`); await sleep(200);
  await pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowUp', bubbles: true})), 0`); await sleep(600);
  const v = await S(`const s = T.st(); return s.fruits.length;`); if (v !== 3) throw new Error('trois fruits attendus en Vergers : ' + v);
  await shot('2-vergers');
  await S(`T.start('labyrinthe'); T.st().mode = 'play'; return 0;`); await sleep(200); await shot('3-labyrinthe');
  await S(`const s = T.st(); s.dir = [-1, 0]; s.queue = []; for (let i = 0; i < 30 && s.mode !== 'over'; i++) T.step(); return 0;`); await sleep(200);
  if (await S(`return T.st().mode;`) !== 'over') throw new Error('le serpent devait perdre contre le bord');
  await shot('4-perdu');
  const parts = await pj(`(() => { const st = [...document.querySelectorAll('#snStats span')], i = st.findIndex(e => e.textContent === 'Parties'); return +st[i].nextElementSibling.textContent; })()`);
  if (!(parts >= 1)) throw new Error('la partie perdue devait être comptée : ' + parts);
  await pj(`document.getElementById('snFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('snCanvas'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas l’écran');
  const L = await pj(`(() => { const r = document.getElementById('snCanvas').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('snCanvas').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 300) throw new Error('le jeu dépasse la fenêtre ou reste petit : ' + JSON.stringify(L));
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  return 'partie, étoile, Vergers, labyrinthe, fin, plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
