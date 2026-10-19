// ===== Аватар-герой: тело, лицо, причёска, одежда =====
const AV = {
  skins: ['#F7D9C4', '#EEC3A1', '#D9A077', '#A9724E', '#6F4731'],
  hairColors: [
    { n: 'Чёрный', c: '#1E1A1A' }, { n: 'Шатен', c: '#3D2618' }, { n: 'Каштан', c: '#6E3F22' }, { n: 'Рыжий', c: '#B5521F' },
    { n: 'Блонд', c: '#E3C27A' }, { n: 'Платина', c: '#F1E8D0' }, { n: 'Розовый', c: '#FF7EB6' }, { n: 'Синий', c: '#4CC9F0' }, { n: 'Лайм', c: '#C8F542' }
  ],
  hair: {
    f: ['Длинные', 'Хвост', 'Каре', 'Пучок'],
    m: ['Классика', 'Андеркат', 'Кудри', 'Ёжик']
  },
  colors: ['#C8F542', '#FF7A45', '#4CC9F0', '#9B8CFF', '#F2F3EE', '#25272B', '#FF7EB6', '#E5484D'],
  // Гардероб: lvl — с какого уровня доступно, price — цена в коинах
  items: {
    top: [
      { id: 'tee', n: 'Футболка', lvl: 0, price: 0 },
      { id: 'tank', n: 'Майка', lvl: 1, price: 150 },
      { id: 'hoodie', n: 'Худи', lvl: 2, price: 350 },
      { id: 'crop', n: 'Спорт-топ', lvl: 4, price: 600, g: 'f' },
      { id: 'rash', n: 'Компрессионная', lvl: 4, price: 600, g: 'm' },
      { id: 'jersey', n: 'Форма FORM', lvl: 6, price: 1200 }
    ],
    bottom: [
      { id: 'joggers', n: 'Джоггеры', lvl: 0, price: 0 },
      { id: 'shorts', n: 'Шорты', lvl: 1, price: 120 },
      { id: 'leggings', n: 'Леггинсы', lvl: 2, price: 250, g: 'f' },
      { id: 'tights', n: 'Тайтсы', lvl: 2, price: 250, g: 'm' },
      { id: 'pro', n: 'Про-шорты', lvl: 5, price: 900 }
    ],
    shoes: [
      { id: 'basic', n: 'Кеды', lvl: 0, price: 0 },
      { id: 'run', n: 'Беговые', lvl: 1, price: 200 },
      { id: 'high', n: 'Баскетбольные', lvl: 3, price: 450 },
      { id: 'gold', n: 'Золотые', lvl: 8, price: 2500 }
    ],
    acc: [
      { id: 'none', n: 'Без аксессуара', lvl: 0, price: 0 },
      { id: 'band', n: 'Повязка', lvl: 2, price: 150 },
      { id: 'watch', n: 'Фитнес-браслет', lvl: 3, price: 300 },
      { id: 'bottle', n: 'Шейкер', lvl: 4, price: 400 },
      { id: 'medal', n: 'Медаль', lvl: 7, price: 1500 }
    ]
  }
};

const LEVELS = [
  { n: 'Старт', xp: 0 }, { n: 'Разогрев', xp: 100 }, { n: 'В ритме', xp: 250 }, { n: 'Уверенный шаг', xp: 500 },
  { n: 'Тонус', xp: 850 }, { n: 'Сила', xp: 1300 }, { n: 'Атлет', xp: 1900 }, { n: 'Огонь', xp: 2700 },
  { n: 'Элита', xp: 3700 }, { n: 'Легенда', xp: 5000 }
];
function levelOf(xp) {
  let l = 0;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].xp) l = i;
  const cur = LEVELS[l].xp, next = LEVELS[l + 1] ? LEVELS[l + 1].xp : null;
  return { lvl: l, name: LEVELS[l].n, cur, next, pct: next ? Math.round((xp - cur) / (next - cur) * 100) : 100 };
}

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
function bodyOf(st, lvl) {
  const h = num(st.h, 170), w = curWeight(st);
  const bmi = w / Math.pow(h / 100, 2);
  const g = (st.av && st.av.g) || 'f';
  const th = g === 'f' ? [19, 22, 25, 29, 33] : [20, 23, 26, 30, 34];
  let si = 0; while (si < th.length && bmi >= th[si]) si++;
  const fatRaw = clamp((bmi - 20) / 14, 0, 1);
  const fat = fatRaw * (1 - 0.35 * clamp(lvl / 9, 0, 1));
  const goalBoost = st.goal === 1 || st.goal === 2 ? 1 : 0.8;
  const mus = clamp(0.08 + lvl / 9 * 0.92 * goalBoost, 0, 1);
  const glow = clamp(lvl / 9, 0, 1);
  return { bmi, fat, mus, glow, size: SIZES[si], si };
}

function Avatar({ a, body, w = 240, cls = '', bare = false }) {
  const g = a.g || 'f';
  const cx = 120;
  const { fat, mus, glow } = body;
  const skin = AV.skins[a.skin || 0];
  const hc = (AV.hairColors[a.hc] || AV.hairColors[1]).c;
  const top = a.top || 'tee', bottom = a.bottom || 'joggers', shoes = a.shoes || 'basic', acc = a.acc || 'none';
  const ct = AV.colors[a.ctop ?? 0], cb = AV.colors[a.cbot ?? 5], cs = AV.colors[a.cshoe ?? 4];
  const dk = (c, k = 0.82) => shade(c, k);

  const sh = g === 'm' ? 44 + mus * 14 + fat * 6 : 36 + mus * 9 + fat * 6;
  const wa = g === 'm' ? 30 + fat * 26 - mus * 3 : 25 + fat * 24 - mus * 3;
  const hi = g === 'm' ? 34 + fat * 16 + mus * 2 : 40 + fat * 16;
  const aw = g === 'm' ? 15 + mus * 8 + fat * 6 : 12 + mus * 4 + fat * 6;
  const lw = g === 'm' ? 24 + mus * 6 + fat * 12 : 22 + mus * 4 + fat * 12;
  const frx = 33 + fat * 5, fry = 38 + fat * 2;

  const torso = (s, wst, hp, yTop = 140, yBot = 242) =>
    `M${cx - s + 9},${yTop} Q${cx - s},${yTop + 2} ${cx - s},${yTop + 16} C${cx - s},${yTop + 38} ${cx - wst},${yTop + 46} ${cx - wst},${yTop + 60} C${cx - wst},${yTop + 78} ${cx - hp},${yTop + 84} ${cx - hp},${yBot} L${cx + hp},${yBot} C${cx + hp},${yTop + 84} ${cx + wst},${yTop + 78} ${cx + wst},${yTop + 60} C${cx + wst},${yTop + 46} ${cx + s},${yTop + 38} ${cx + s},${yTop + 16} Q${cx + s},${yTop + 2} ${cx + s - 9},${yTop} Z`;

  // руки
  const armL = [cx - sh + 5, 152, cx - sh - 7, 198, cx - sh - 3, 240];
  const armR = [cx + sh - 5, 152, cx + sh + 7, 198, cx + sh + 3, 240];
  const armPath = (p) => `M${p[0]},${p[1]} Q${p[2]},${(p[1] + p[3]) / 2} ${p[2]},${p[3]} L${p[4]},${p[5]}`;
  const upper = (p) => `M${p[0]},${p[1]} Q${p[2]},${(p[1] + p[3]) / 2} ${p[2]},${p[3] - 18}`;
  // ноги
  const lx = cx - hi * 0.47, rx = cx + hi * 0.47;
  const legPath = (x, s) => `M${x},234 L${x + s * 1},292 L${x + s * 2},340`;
  const longBottom = bottom === 'joggers' || bottom === 'leggings' || bottom === 'tights';
  const shortsEnd = bottom === 'pro' ? 268 : 280;
  const legUpper = (x, s) => `M${x},234 L${x + s * (shortsEnd - 234) / 58},${shortsEnd}`;

  const sleeves = top === 'tee' || top === 'jersey' ? 'short' : top === 'hoodie' || top === 'rash' ? 'long' : 'none';
  const crop = top === 'crop';
  const absOp = clamp((mus - 0.45) * 2, 0, 1) * clamp(1 - fat * 1.6, 0, 1);

  const eyeY = 96, mouthY = 115;
  const smile = 6 + glow * 7;
  const openSmile = glow > 0.55;
  const sparkle = Math.floor(glow * 7);
  const lid = glow < 0.15 ? 2.2 : 0;

  const back = hairBack(g, a.hair || 0, cx, hc, fat);
  const front = hairFront(g, a.hair || 0, cx, hc, glow);

  const sparkles = [];
  const sp = [[38, 70], [204, 96], [30, 190], [212, 210], [56, 300], [190, 300], [120, 22]];
  for (let i = 0; i < sparkle; i++) sparkles.push(sp[i]);

  return html`<svg class=${'avatar ' + cls} width=${w} viewBox="0 0 240 380" role="img" aria-label=${'Аватар ' + (a.name || '')}>
    <defs>
      <radialGradient id="aura" cx="50%" cy="55%" r="50%">
        <stop offset="0%" stop-color="#C8F542" stop-opacity=${0.10 + glow * 0.45} />
        <stop offset="60%" stop-color="#C8F542" stop-opacity=${0.04 + glow * 0.12} />
        <stop offset="100%" stop-color="#C8F542" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity="0.55" /><stop offset="1" stop-color="#fff" stop-opacity="0" />
      </linearGradient>
    </defs>
    ${bare ? null : html`<ellipse cx="120" cy="200" rx="118" ry="176" fill="url(#aura)" />
    <ellipse cx="120" cy="352" rx=${60 + fat * 14} ry="10" fill="#000" opacity="0.35" />`}
    ${sparkles.map(([x, y], i) => html`<path class="spark" style=${'animation-delay:' + i * 0.35 + 's'} d=${`M${x},${y - 7} L${x + 2},${y - 2} L${x + 7},${y} L${x + 2},${y + 2} L${x},${y + 7} L${x - 2},${y + 2} L${x - 7},${y} L${x - 2},${y - 2} Z`} fill="#FFE27A" />`)}

    <g transform="translate(120,124) scale(1.2) translate(-120,-124)">${back}</g>
    ${top === 'hoodie' ? html`<path d=${`M${cx - 30},140 Q${cx},118 ${cx + 30},140 Z`} fill=${dk(ct)} />` : null}

    <rect x=${cx - (g === 'm' ? 11 + mus * 4 : 9)} y="118" width=${g === 'm' ? 22 + mus * 8 : 18} height="30" rx="8" fill=${shade(skin, 0.92)} />

    <path d=${legPath(lx, -1)} stroke=${skin} stroke-width=${lw} stroke-linecap="round" fill="none" />
    <path d=${legPath(rx, 1)} stroke=${skin} stroke-width=${lw} stroke-linecap="round" fill="none" />
    ${longBottom ? html`
      <path d=${legPath(lx, -1)} stroke=${cb} stroke-width=${bottom === 'joggers' ? lw + 6 : lw + 1} stroke-linecap="round" fill="none" />
      <path d=${legPath(rx, 1)} stroke=${cb} stroke-width=${bottom === 'joggers' ? lw + 6 : lw + 1} stroke-linecap="round" fill="none" />
      ${bottom === 'joggers' ? html`<rect x=${lx - 2 - lw / 2 - 3} y="326" width=${lw + 6} height="7" rx="3" fill=${dk(cb)} /><rect x=${rx + 2 - lw / 2 - 3} y="326" width=${lw + 6} height="7" rx="3" fill=${dk(cb)} />` : null}
      ${bottom === 'leggings' || bottom === 'tights' ? html`<path d=${legPath(lx + lw * 0.3, -1)} stroke=${dk(cb, 0.7)} stroke-width="2" fill="none" opacity="0.6" /><path d=${legPath(rx - lw * 0.3, 1)} stroke=${dk(cb, 0.7)} stroke-width="2" fill="none" opacity="0.6" />` : null}
    ` : html`
      <path d=${legUpper(lx, -1)} stroke=${cb} stroke-width=${lw + 7} stroke-linecap="butt" fill="none" />
      <path d=${legUpper(rx, 1)} stroke=${cb} stroke-width=${lw + 7} stroke-linecap="butt" fill="none" />
      ${bottom === 'pro' ? html`<path d=${legUpper(lx - lw / 2, -1)} stroke="#C8F542" stroke-width="3" fill="none" /><path d=${legUpper(rx + lw / 2, 1)} stroke="#C8F542" stroke-width="3" fill="none" />` : null}
    `}
    <path d=${`M${cx - hi - 2},226 L${cx + hi + 2},226 L${cx + hi + 2},${longBottom ? 252 : 250} Q${cx},${longBottom ? 262 : 258} ${cx - hi - 2},${longBottom ? 252 : 250} Z`} fill=${cb} />
    <rect x=${cx - hi - 2} y="224" width=${hi * 2 + 4} height="7" rx="3" fill=${dk(cb)} />

    ${shoe(lx - 2, shoes, cs, -1)}
    ${shoe(rx + 2, shoes, cs, 1)}

    <path d=${torso(sh, wa, hi)} fill=${skin} />
    ${crop || top === 'tank' ? html`
      <g opacity=${absOp}>
        <path d=${`M${cx},186 L${cx},230`} stroke=${shade(skin, 0.78)} stroke-width="2" stroke-linecap="round" />
        <path d=${`M${cx - 13},198 Q${cx - 6},201 ${cx - 1},198 M${cx + 1},198 Q${cx + 6},201 ${cx + 13},198 M${cx - 12},212 Q${cx - 6},215 ${cx - 1},212 M${cx + 1},212 Q${cx + 6},215 ${cx + 12},212`} stroke=${shade(skin, 0.8)} stroke-width="2" fill="none" stroke-linecap="round" />
      </g>` : null}

    ${topShape(top, g, cx, sh, wa, hi, ct, skin, fat, mus, torso)}

    ${sleeves === 'long' ? null : html`
      <path d=${armPath(armL)} stroke=${skin} stroke-width=${aw} stroke-linecap="round" fill="none" />
      <path d=${armPath(armR)} stroke=${skin} stroke-width=${aw} stroke-linecap="round" fill="none" />
      <ellipse cx=${cx - sh - 4} cy="172" rx=${aw / 2 + mus * 5} ry=${15 + mus * 3} fill=${skin} transform=${`rotate(8 ${cx - sh - 4} 172)`} />
      <ellipse cx=${cx + sh + 4} cy="172" rx=${aw / 2 + mus * 5} ry=${15 + mus * 3} fill=${skin} transform=${`rotate(-8 ${cx + sh + 4} 172)`} />
      ${mus > 0.4 ? html`<path d=${`M${cx - sh - 1},164 q-4,8 -1,16 M${cx + sh + 1},164 q4,8 1,16`} stroke=${shade(skin, 0.82)} stroke-width="2" fill="none" stroke-linecap="round" opacity=${mus} />` : null}
    `}
    ${sleeves === 'short' ? html`
      <path d=${upper(armL)} stroke=${ct} stroke-width=${aw + 5} stroke-linecap="round" fill="none" />
      <path d=${upper(armR)} stroke=${ct} stroke-width=${aw + 5} stroke-linecap="round" fill="none" />` : null}
    ${sleeves === 'long' ? html`
      <path d=${armPath(armL)} stroke=${ct} stroke-width=${aw + 6} stroke-linecap="round" fill="none" />
      <path d=${armPath(armR)} stroke=${ct} stroke-width=${aw + 6} stroke-linecap="round" fill="none" />
      <ellipse cx=${cx - sh - 4} cy="172" rx=${aw / 2 + 3 + mus * 5} ry=${16 + mus * 3} fill=${ct} transform=${`rotate(8 ${cx - sh - 4} 172)`} />
      <ellipse cx=${cx + sh + 4} cy="172" rx=${aw / 2 + 3 + mus * 5} ry=${16 + mus * 3} fill=${ct} transform=${`rotate(-8 ${cx + sh + 4} 172)`} />` : null}
    <circle cx=${armL[4]} cy=${armL[5] + 2} r=${aw / 2 + 2} fill=${skin} />
    <circle cx=${armR[4]} cy=${armR[5] + 2} r=${aw / 2 + 2} fill=${skin} />

    ${acc === 'watch' ? html`<rect x=${armL[4] - aw / 2 - 2} y=${armL[5] - 12} width=${aw + 4} height="8" rx="3" fill="#25272B" /><rect x=${armL[4] - 4} y=${armL[5] - 12} width="8" height="8" rx="2" fill="#C8F542" />` : null}
    ${acc === 'bottle' ? html`<g><rect x=${armR[4] - 8} y=${armR[5] - 26} width="16" height="30" rx="5" fill="#4CC9F0" /><rect x=${armR[4] - 8} y=${armR[5] - 31} width="16" height="8" rx="3" fill="#25272B" /><rect x=${armR[4] - 5} y=${armR[5] - 18} width="10" height="8" rx="2" fill="#F2F3EE" opacity="0.7" /></g>` : null}

    <g transform="translate(120,124) scale(1.2) translate(-120,-124)">
    <ellipse cx=${cx - frx + 1} cy="99" rx="6" ry="8" fill=${shade(skin, 0.94)} />
    <ellipse cx=${cx + frx - 1} cy="99" rx="6" ry="8" fill=${shade(skin, 0.94)} />
    <ellipse cx=${cx} cy="92" rx=${frx} ry=${fry} fill=${skin} />
    <ellipse cx=${cx - 14} cy="76" rx="10" ry="6" fill="url(#shine)" opacity=${0.2 + glow * 0.5} />

    <ellipse cx=${cx - 20} cy="109" rx="7" ry="5" fill="#FF7E8F" opacity=${0.12 + glow * 0.38} />
    <ellipse cx=${cx + 20} cy="109" rx="7" ry="5" fill="#FF7E8F" opacity=${0.12 + glow * 0.38} />

    ${[-1, 1].map((s) => html`<g>
      <ellipse cx=${cx + s * 13} cy=${eyeY} rx=${g === 'f' ? 6.5 : 5.6} ry=${g === 'f' ? 7.5 : 6.4} fill="#fff" />
      <circle cx=${cx + s * 13 + 0.5} cy=${eyeY + 1} r=${g === 'f' ? 4.6 : 4} fill=${a.eye || '#4A2F22'} />
      <circle cx=${cx + s * 13 + 0.5} cy=${eyeY + 1} r="2" fill="#141414" />
      <circle cx=${cx + s * 13 + 2} cy=${eyeY - 1.5} r=${1.3 + glow * 0.6} fill="#fff" />
      ${glow > 0.4 ? html`<circle cx=${cx + s * 13 - 1.5} cy=${eyeY + 3} r="0.9" fill="#fff" />` : null}
      ${lid ? html`<path d=${`M${cx + s * 13 - 7},${eyeY - 5} Q${cx + s * 13},${eyeY - 9} ${cx + s * 13 + 7},${eyeY - 5} L${cx + s * 13 + 7},${eyeY - 3} Q${cx + s * 13},${eyeY - 5} ${cx + s * 13 - 7},${eyeY - 3} Z`} fill=${skin} />` : null}
      ${g === 'f' ? html`<path d=${s < 0 ? `M${cx - 20},${eyeY - 4} l-3,-3 M${cx - 18},${eyeY - 6} l-2,-3.5` : `M${cx + 20},${eyeY - 4} l3,-3 M${cx + 18},${eyeY - 6} l2,-3.5`} stroke="#1E1A1A" stroke-width=${1.3 + glow} stroke-linecap="round" />
        <path d=${`M${cx + s * 13 - 7},${eyeY - 3} Q${cx + s * 13},${eyeY - 10} ${cx + s * 13 + 7},${eyeY - 3}`} stroke="#1E1A1A" stroke-width=${1.4 + glow * 0.8} fill="none" stroke-linecap="round" />` : null}
      <path d=${`M${cx + s * 6},${eyeY - 12 - glow * 1.5} Q${cx + s * 13},${eyeY - 16 - glow * 2} ${cx + s * 20},${eyeY - 12}`} stroke=${shade(hc, 0.85)} stroke-width=${g === 'm' ? 3.2 : 2.2} fill="none" stroke-linecap="round" />
    </g>`)}
    <path d=${`M${cx - 2},103 Q${cx},108 ${cx + 2.5},106`} stroke=${shade(skin, 0.75)} stroke-width="1.8" fill="none" stroke-linecap="round" />
    ${g === 'f' ? html`
      <path d=${`M${cx - smile},${mouthY} Q${cx},${mouthY - 3} ${cx + smile},${mouthY} Q${cx},${mouthY + 6 + glow * 3} ${cx - smile},${mouthY} Z`} fill=${mix('#C9707A', '#E0475F', glow)} />
      ${openSmile ? html`<path d=${`M${cx - smile + 2},${mouthY + 0.5} Q${cx},${mouthY + 3 + glow * 2} ${cx + smile - 2},${mouthY + 0.5} Z`} fill="#fff" />` : null}
      <path d=${`M${cx - 3},${mouthY + 3 + glow * 2} q3,1 6,0`} stroke="#fff" stroke-width="1" opacity=${0.3 + glow * 0.4} fill="none" />
    ` : html`
      ${openSmile
        ? html`<path d=${`M${cx - smile},${mouthY - 1} Q${cx},${mouthY + 10} ${cx + smile},${mouthY - 1} Z`} fill="#7A2E2E" /><path d=${`M${cx - smile + 1.5},${mouthY - 0.5} Q${cx},${mouthY + 3} ${cx + smile - 1.5},${mouthY - 0.5} Z`} fill="#fff" />`
        : html`<path d=${`M${cx - smile},${mouthY} Q${cx},${mouthY + 3 + glow * 6} ${cx + smile},${mouthY}`} stroke="#7A3B33" stroke-width="2.6" fill="none" stroke-linecap="round" />`}
    `}

    ${front}
    ${acc === 'band' ? html`<path d=${`M${cx - frx - 1},80 Q${cx},64 ${cx + frx + 1},80`} stroke=${AV.colors[a.ctop === 1 ? 2 : 1]} stroke-width="8" fill="none" stroke-linecap="round" />` : null}
    </g>
    ${acc === 'medal' ? html`<g><path d=${`M${cx - 12},138 L${cx},176 L${cx + 12},138`} stroke="#E5484D" stroke-width="5" fill="none" /><circle cx=${cx} cy="182" r="10" fill="#FFC93C" stroke="#E0A400" stroke-width="2" /><path d=${`M${cx},176 l2,4 4,0.5 -3,3 1,4 -4,-2 -4,2 1,-4 -3,-3 4,-0.5z`} fill="#fff" opacity="0.8" /></g>` : null}
  </svg>`;
}

function shoe(x, kind, c, s) {
  const y = 342;
  const col = kind === 'gold' ? '#FFC93C' : c;
  return html`<g>
    ${kind === 'high' ? html`<rect x=${x - 15} y=${y - 18} width="26" height="20" rx="6" fill=${col} />` : null}
    <path d=${`M${x - 16 + (s > 0 ? 0 : -6)},${y + 4} Q${x - 16 + (s > 0 ? 0 : -6)},${y - 10} ${x - 2},${y - 10} Q${x + 18 + (s > 0 ? 6 : 0)},${y - 8} ${x + 18 + (s > 0 ? 6 : 0)},${y + 4} Z`} fill=${col} />
    <rect x=${x - 18 + (s > 0 ? 0 : -6)} y=${y + 2} width="42" height="6" rx="3" fill=${kind === 'gold' ? '#E0A400' : '#F2F3EE'} />
    ${kind === 'run' ? html`<path d=${`M${x - 6},${y - 4} l10,0 M${x - 4},${y - 1} l10,0`} stroke="#C8F542" stroke-width="2" stroke-linecap="round" />` : null}
    ${kind === 'gold' ? html`<circle cx=${x + 2} cy=${y - 4} r="2" fill="#fff" opacity="0.8" />` : null}
  </g>`;
}

function topShape(top, g, cx, sh, wa, hi, ct, skin, fat, mus, torso) {
  const neck = html`<ellipse cx=${cx} cy="141" rx=${g === 'm' ? 12 : 10} ry="6" fill=${skin} />`;
  const belly = fat > 0.35 ? html`<path d=${`M${cx - wa + 4},206 Q${cx},${222 + fat * 12} ${cx + wa - 4},206`} stroke=${shade(ct, 0.8)} stroke-width="2" fill="none" opacity="0.6" />` : null;
  const pecs = g === 'm' && mus > 0.3 ? html`<path d=${`M${cx - sh + 14},172 Q${cx - 10},${180 + mus * 4} ${cx - 2},170 M${cx + 2},170 Q${cx + 10},${180 + mus * 4} ${cx + sh - 14},172`} stroke=${shade(ct, 0.78)} stroke-width="2" fill="none" opacity=${mus} />` : null;
  const chest = g === 'f' ? html`<path d=${`M${cx - 22},170 Q${cx - 12},180 ${cx - 2},172 M${cx + 2},172 Q${cx + 12},180 ${cx + 22},170`} stroke=${shade(ct, 0.8)} stroke-width="1.8" fill="none" opacity="0.7" />` : null;
  if (top === 'tank') return html`<g>
    <path d=${torso(sh - 10, wa + 1, hi + 1, 146, 236)} fill=${ct} />
    <path d=${`M${cx - 15},146 Q${cx},166 ${cx + 15},146`} fill=${skin} />${belly}${pecs}${chest}</g>`;
  if (top === 'crop') return html`<g>
    <path d=${`M${cx - sh + 10},148 Q${cx - sh + 4},170 ${cx - wa - 2},190 L${cx + wa + 2},190 Q${cx + sh - 4},170 ${cx + sh - 10},148 Q${cx},172 ${cx - sh + 10},148 Z`} fill=${ct} />
    <rect x=${cx - wa - 2} y="186" width=${wa * 2 + 4} height="6" rx="3" fill=${shade(ct, 0.8)} />${chest}</g>`;
  if (top === 'rash') return html`<g>
    <path d=${torso(sh + 1, wa + 1, hi + 1, 140, 236)} fill=${ct} />${neck}${pecs}
    <path d=${`M${cx - sh + 6},150 L${cx - wa},214 M${cx + sh - 6},150 L${cx + wa},214`} stroke=${shade(ct, 0.75)} stroke-width="3" opacity="0.6" />${belly}</g>`;
  if (top === 'hoodie') return html`<g>
    <path d=${torso(sh + 4, wa + 5, hi + 5, 138, 244)} fill=${ct} />
    <path d=${`M${cx - 14},140 Q${cx},154 ${cx + 14},140`} fill=${shade(ct, 0.8)} />
    <path d=${`M${cx - 4},146 l-2,22 M${cx + 4},146 l2,22`} stroke="#F2F3EE" stroke-width="2" stroke-linecap="round" />
    <path d=${`M${cx - wa + 2},214 L${cx + wa - 2},214 L${cx + wa - 8},232 L${cx - wa + 8},232 Z`} fill=${shade(ct, 0.86)} />${belly}</g>`;
  if (top === 'jersey') return html`<g>
    <path d=${torso(sh + 2, wa + 2, hi + 2, 140, 238)} fill=${ct} />${neck}
    <rect x=${cx - sh} y="148" width=${sh * 2} height="5" fill="#25272B" opacity="0.9" />
    <text x=${cx} y="206" text-anchor="middle" font-family="Dela Gothic One, sans-serif" font-size="30" fill="#25272B">F</text>${belly}</g>`;
  return html`<g><path d=${torso(sh + 2, wa + 2, hi + 2, 140, 238)} fill=${ct} />${neck}${belly}${pecs}${chest}</g>`;
}

function hairBack(g, s, cx, c, fat) {
  if (g === 'f') {
    if (s === 0) return html`<path d=${`M${cx - 41},96 C${cx - 46},40 ${cx + 46},40 ${cx + 41},96 L${cx + 46},176 Q${cx},190 ${cx - 46},176 Z`} fill=${c} />`;
    if (s === 1) return html`<path d=${`M${cx + 18},58 C${cx + 64},56 ${cx + 66},126 ${cx + 46},170 C${cx + 42},136 ${cx + 34},104 ${cx + 16},82 Z`} fill=${c} />`;
    if (s === 2) return html`<path d=${`M${cx - 43},94 C${cx - 47},42 ${cx + 47},42 ${cx + 43},94 L${cx + 43},130 Q${cx + 32},136 ${cx + 24},128 L${cx - 24},128 Q${cx - 32},136 ${cx - 43},130 Z`} fill=${c} />`;
    if (s === 3) return html`<circle cx=${cx} cy="44" r="19" fill=${c} />`;
  }
  return null;
}

function hairFront(g, s, cx, c, glow) {
  const shine = html`<path d=${`M${cx - 22},64 Q${cx - 6},54 ${cx + 12},58`} stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=${0.15 + glow * 0.35} />`;
  if (g === 'f') {
    if (s === 0) return html`<g><path d=${`M${cx - 37},96 C${cx - 40},50 ${cx + 40},50 ${cx + 37},96 C${cx + 32},72 ${cx + 12},64 ${cx - 2},70 C${cx - 14},74 ${cx - 28},82 ${cx - 37},96 Z`} fill=${c} />${shine}</g>`;
    if (s === 1 || s === 3) return html`<g><path d=${`M${cx - 37},94 C${cx - 40},48 ${cx + 40},48 ${cx + 37},94 C${cx + 30},70 ${cx - 30},70 ${cx - 37},94 Z`} fill=${c} />
      ${s === 1 ? html`<circle cx=${cx + 22} cy="58" r="5" fill="#FF7A45" />` : html`<circle cx=${cx} cy="44" r="19" fill=${c} /><path d=${`M${cx - 12},38 Q${cx},30 ${cx + 12},38`} stroke=${shade(c, 0.8)} stroke-width="2" fill="none" />`}${shine}</g>`;
    if (s === 2) return html`<g><path d=${`M${cx - 37},94 C${cx - 40},52 ${cx + 40},52 ${cx + 37},94 L${cx + 32},80 L${cx - 32},80 Z`} fill=${c} />${shine}</g>`;
  }
  if (s === 0) return html`<g><path d=${`M${cx - 36},96 C${cx - 40},44 ${cx + 40},44 ${cx + 36},96 C${cx + 34},76 ${cx + 22},68 ${cx + 2},70 C${cx - 18},68 ${cx - 32},76 ${cx - 36},96 Z`} fill=${c} />${shine}</g>`;
  if (s === 1) return html`<g><path d=${`M${cx - 35},92 C${cx - 36},70 ${cx - 34},62 ${cx - 30},76 C${cx - 34},40 ${cx + 40},32 ${cx + 36},78 C${cx + 36},64 ${cx + 36},70 ${cx + 35},92 C${cx + 26},64 ${cx - 14},58 ${cx - 35},92 Z`} fill=${c} />${shine}</g>`;
  if (s === 2) return html`<g>${[[-30, 74], [-22, 60], [-8, 54], [8, 54], [22, 60], [30, 74], [-35, 88], [35, 88], [0, 60]].map(([x, y]) => html`<circle cx=${cx + x} cy=${y} r="11" fill=${c} />`)}</g>`;
  return html`<g><path d=${`M${cx - 35},90 C${cx - 38},54 ${cx + 38},54 ${cx + 35},90 C${cx + 30},72 ${cx - 30},72 ${cx - 35},90 Z`} fill=${c} opacity="0.92" /></g>`;
}

function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * k), g = Math.round(((n >> 8) & 255) * k), b = Math.round((n & 255) * k);
  return '#' + ((1 << 24) + (Math.min(255, r) << 16) + (Math.min(255, g) << 8) + Math.min(255, b)).toString(16).slice(1);
}
function mix(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = (s) => Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t);
  return '#' + ((1 << 24) + (ch(16) << 16) + (ch(8) << 8) + ch(0)).toString(16).slice(1);
}
